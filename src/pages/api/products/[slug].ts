import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase'

export const GET: APIRoute = async ({ params, request }) => {
  console.log('📦 Fetching product by slug:', params.slug)

  const { supabase } = createSupabaseServerClient(request)

  try {
    const { slug } = params

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Product slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fetch product with all related data
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants (
          id,
          sku,
          format,
          grind_type,
          weight,
          price_cents,
          compare_at_price_cents,
          stock_quantity,
          low_stock_threshold,
          allow_backorder,
          track_inventory,
          active
        ),
        product_images (
          id,
          url,
          alt_text,
          position,
          is_primary
        ),
        product_categories (
          categories (
            id,
            name,
            slug,
            description
          )
        )
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .not('published_at', 'is', null)
      .single()

    if (error || !product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Process variants to include availability and pricing info
    const processedVariants = product.product_variants
      ?.filter(v => v.active)
      .map(variant => {
        const isAvailable = !variant.track_inventory ||
          variant.stock_quantity > 0 ||
          variant.allow_backorder

        const stockStatus = variant.track_inventory
          ? variant.stock_quantity <= 0
            ? variant.allow_backorder ? 'backorder' : 'out_of_stock'
            : variant.stock_quantity <= variant.low_stock_threshold
              ? 'low_stock'
              : 'in_stock'
          : 'unlimited'

        return {
          ...variant,
          availability: {
            is_available: isAvailable,
            stock_status: stockStatus,
            can_backorder: variant.allow_backorder
          },
          pricing: {
            price_eur: variant.price_cents / 100,
            compare_at_price_eur: variant.compare_at_price_cents ? variant.compare_at_price_cents / 100 : null,
            on_sale: variant.compare_at_price_cents ? variant.compare_at_price_cents > variant.price_cents : false
          },
          display_name: `${variant.weight}g ${variant.format === 'ground' ? `(${variant.grind_type})` : '(whole bean)'}`
        }
      })
      .sort((a, b) => {
        // Sort by format (whole bean first), then by weight
        if (a.format !== b.format) {
          return a.format === 'whole_bean' ? -1 : 1
        }
        return a.weight - b.weight
      }) || []

    // Sort images by position
    const sortedImages = product.product_images
      ?.sort((a, b) => a.position - b.position) || []

    // Process tasting notes
    let tastingNotes = null
    if (product.tasting_notes) {
      try {
        tastingNotes = typeof product.tasting_notes === 'string'
          ? JSON.parse(product.tasting_notes)
          : product.tasting_notes
      } catch (e) {
        console.warn('Failed to parse tasting notes:', e)
      }
    }

    // Build enhanced product object
    const enhancedProduct = {
      ...product,
      variants: processedVariants,
      images: sortedImages,
      categories: product.product_categories?.map(pc => pc.categories) || [],
      tasting_notes: tastingNotes,
      origin: {
        farm: product.origin_farm,
        region: product.origin_region,
        municipality: product.origin_municipality,
        altitude: {
          min: product.altitude_min,
          max: product.altitude_max,
          display: product.altitude_min && product.altitude_max
            ? `${product.altitude_min}-${product.altitude_max}m`
            : product.altitude_min
              ? `${product.altitude_min}m+`
              : null
        }
      },
      coffee_details: {
        variety: product.variety,
        processing_method: product.processing_method,
        roast_level: product.roast_level,
        roast_date: product.roast_date,
        harvest_year: product.harvest_year,
        harvest_month: product.harvest_month,
        cupping_score: product.cupping_score
      },
      tasting_profile: {
        acidity: product.acidity,
        body: product.body,
        sweetness: product.sweetness,
        notes: tastingNotes
      },
      pricing: {
        min_price_cents: Math.min(...processedVariants.map(v => v.price_cents)),
        max_price_cents: Math.max(...processedVariants.map(v => v.price_cents)),
        price_range_eur: (() => {
          const prices = processedVariants.map(v => v.price_cents / 100)
          const min = Math.min(...prices)
          const max = Math.max(...prices)
          return min === max ? `€${min.toFixed(2)}` : `€${min.toFixed(2)} - €${max.toFixed(2)}`
        })()
      },
      availability: {
        in_stock: processedVariants.some(v => v.availability.is_available),
        total_variants: processedVariants.length,
        available_variants: processedVariants.filter(v => v.availability.is_available).length
      }
    }

    // Track product view analytics
    try {
      await supabase
        .rpc('track_analytics_event', {
          p_event_type: 'product_view',
          p_product_id: product.id,
          p_page_url: `/products/${slug}`,
          p_metadata: {
            product_name: product.name,
            origin_farm: product.origin_farm,
            user_agent: request.headers.get('user-agent')
          }
        })
    } catch (analyticsError) {
      console.warn('Failed to track analytics:', analyticsError)
    }

    return new Response(JSON.stringify(enhancedProduct), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Failed to fetch product:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to fetch product'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}