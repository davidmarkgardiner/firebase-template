import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase'
import { z } from 'zod'

// Query parameters schema
const ProductQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  sort: z.enum(['name', 'price_asc', 'price_desc', 'newest', 'featured']).default('featured'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).default('12'),
  offset: z.string().transform(Number).pipe(z.number().min(0)).default('0')
})

export const GET: APIRoute = async ({ request, url }) => {
  console.log('📦 Fetching products')

  const { supabase } = createSupabaseServerClient(request)

  try {
    // Parse query parameters
    const queryParams = Object.fromEntries(url.searchParams.entries())
    const { category, featured, search, sort, limit, offset } = ProductQuerySchema.parse(queryParams)

    // Build base query
    let query = supabase
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
          stock_quantity,
          active
        ),
        product_images (
          id,
          url,
          alt_text,
          is_primary
        ),
        product_categories (
          categories (
            id,
            name,
            slug
          )
        )
      `)
      .eq('status', 'active')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())

    // Apply filters
    if (category) {
      query = query.filter('product_categories.categories.slug', 'eq', category)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%, origin_farm.ilike.%${search}%`)
    }

    // Apply sorting
    switch (sort) {
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'price_asc':
        // Sort by minimum variant price
        query = query.order('created_at', { ascending: false }) // Fallback
        break
      case 'price_desc':
        // Sort by maximum variant price
        query = query.order('created_at', { ascending: false }) // Fallback
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'featured':
      default:
        query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: products, error } = await query

    if (error) {
      throw error
    }

    // Process products to include price ranges and availability
    const processedProducts = products?.map(product => {
      const activeVariants = product.product_variants?.filter(v => v.active) || []
      const prices = activeVariants.map(v => v.price_cents)
      const stocks = activeVariants.map(v => v.stock_quantity)

      const minPrice = prices.length > 0 ? Math.min(...prices) : 0
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
      const totalStock = stocks.reduce((sum, stock) => sum + stock, 0)
      const inStock = totalStock > 0

      const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0]

      return {
        ...product,
        price_range: {
          min_cents: minPrice,
          max_cents: maxPrice,
          formatted_min: `€${(minPrice / 100).toFixed(2)}`,
          formatted_max: `€${(maxPrice / 100).toFixed(2)}`
        },
        availability: {
          in_stock: inStock,
          total_stock: totalStock,
          variant_count: activeVariants.length
        },
        primary_image: primaryImage,
        categories: product.product_categories?.map(pc => pc.categories) || []
      }
    }) || []

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .not('published_at', 'is', null)

    if (countError) {
      console.warn('Failed to get total count:', countError)
    }

    return new Response(JSON.stringify({
      products: processedProducts,
      pagination: {
        total: count || 0,
        limit,
        offset,
        has_more: (count || 0) > offset + limit
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Failed to fetch products:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to fetch products'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}