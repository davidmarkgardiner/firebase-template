import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase'
import { z } from 'zod'

// Validation schemas
const CartItemSchema = z.object({
  product_variant_id: z.string().uuid(),
  quantity: z.number().min(1).max(10)
})

const AddToCartSchema = z.object({
  product_variant_id: z.string().uuid(),
  quantity: z.number().min(1).max(10)
})

const UpdateCartSchema = z.object({
  items: z.array(CartItemSchema)
})

// Add item to cart
export const POST: APIRoute = async ({ request }) => {
  console.log('🛒 Adding item to cart')

  const { supabase } = createSupabaseServerClient(request)

  try {
    const body = await request.json()
    const { product_variant_id, quantity } = AddToCartSchema.parse(body)

    // Get product variant details
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          status
        )
      `)
      .eq('id', product_variant_id)
      .eq('active', true)
      .single()

    if (variantError || !variant) {
      return new Response(JSON.stringify({ error: 'Product variant not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check product status
    if (variant.products.status !== 'active') {
      return new Response(JSON.stringify({ error: 'Product is not available' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check availability
    const { data: availability } = await supabase
      .rpc('get_product_availability', {
        p_product_variant_id: product_variant_id
      })

    if (!availability?.available) {
      return new Response(JSON.stringify({
        error: 'Product is not available',
        reason: availability?.reason || 'Unknown'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check stock if tracked
    if (variant.track_inventory && !variant.allow_backorder) {
      if (variant.stock_quantity < quantity) {
        return new Response(JSON.stringify({
          error: 'Insufficient stock',
          available_quantity: variant.stock_quantity
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    // Build cart item response
    const cartItem = {
      id: crypto.randomUUID(), // Client-side cart ID
      product_variant_id,
      quantity,
      product: {
        id: variant.products.id,
        name: variant.products.name,
        slug: variant.products.slug
      },
      variant: {
        id: variant.id,
        sku: variant.sku,
        format: variant.format,
        grind_type: variant.grind_type,
        weight: variant.weight,
        price_cents: variant.price_cents,
        display_name: `${variant.weight}g ${variant.format === 'ground' ? `(${variant.grind_type})` : '(whole bean)'}`
      },
      pricing: {
        unit_price_cents: variant.price_cents,
        total_price_cents: variant.price_cents * quantity,
        unit_price_eur: variant.price_cents / 100,
        total_price_eur: (variant.price_cents * quantity) / 100
      },
      availability: availability
    }

    // Track add to cart analytics
    try {
      await supabase
        .rpc('track_analytics_event', {
          p_event_type: 'add_to_cart',
          p_product_id: variant.products.id,
          p_metadata: {
            product_variant_id,
            quantity,
            product_name: variant.products.name,
            variant_sku: variant.sku
          }
        })
    } catch (analyticsError) {
      console.warn('Failed to track analytics:', analyticsError)
    }

    return new Response(JSON.stringify({
      success: true,
      item: cartItem
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Failed to add to cart:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to add to cart'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Validate and calculate cart
export const PUT: APIRoute = async ({ request }) => {
  console.log('🛒 Validating cart')

  const { supabase } = createSupabaseServerClient(request)

  try {
    const body = await request.json()
    const { items } = UpdateCartSchema.parse(body)

    if (items.length === 0) {
      return new Response(JSON.stringify({
        valid: true,
        items: [],
        totals: {
          subtotal_cents: 0,
          subtotal_eur: 0,
          item_count: 0,
          unique_items: 0
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get all variants in cart
    const variantIds = items.map(item => item.product_variant_id)
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          status,
          product_images (
            url,
            alt_text,
            is_primary
          )
        )
      `)
      .in('id', variantIds)
      .eq('active', true)

    if (variantsError) {
      throw variantsError
    }

    // Validate each item and build response
    const validatedItems = []
    const issues = []
    let subtotalCents = 0

    for (const item of items) {
      const variant = variants?.find(v => v.id === item.product_variant_id)

      if (!variant) {
        issues.push({
          product_variant_id: item.product_variant_id,
          issue: 'product_not_found',
          message: 'Product variant not found'
        })
        continue
      }

      if (variant.products.status !== 'active') {
        issues.push({
          product_variant_id: item.product_variant_id,
          issue: 'product_inactive',
          message: 'Product is no longer available'
        })
        continue
      }

      // Check availability
      let availability
      try {
        const { data } = await supabase
          .rpc('get_product_availability', {
            p_product_variant_id: item.product_variant_id
          })
        availability = data
      } catch (e) {
        availability = { available: false, reason: 'Unknown error' }
      }

      if (!availability?.available) {
        issues.push({
          product_variant_id: item.product_variant_id,
          issue: 'not_available',
          message: availability?.reason || 'Product is not available'
        })
        continue
      }

      // Check stock
      let adjustedQuantity = item.quantity
      if (variant.track_inventory && !variant.allow_backorder) {
        if (variant.stock_quantity < item.quantity) {
          adjustedQuantity = variant.stock_quantity
          if (adjustedQuantity === 0) {
            issues.push({
              product_variant_id: item.product_variant_id,
              issue: 'out_of_stock',
              message: 'Product is out of stock'
            })
            continue
          } else {
            issues.push({
              product_variant_id: item.product_variant_id,
              issue: 'quantity_adjusted',
              message: `Quantity reduced to ${adjustedQuantity} due to limited stock`,
              adjusted_quantity: adjustedQuantity
            })
          }
        }
      }

      const primaryImage = variant.products.product_images?.find(img => img.is_primary) ||
        variant.products.product_images?.[0]

      const itemTotal = variant.price_cents * adjustedQuantity
      subtotalCents += itemTotal

      validatedItems.push({
        id: crypto.randomUUID(),
        product_variant_id: item.product_variant_id,
        quantity: adjustedQuantity,
        original_quantity: item.quantity,
        product: {
          id: variant.products.id,
          name: variant.products.name,
          slug: variant.products.slug,
          image: primaryImage
        },
        variant: {
          id: variant.id,
          sku: variant.sku,
          format: variant.format,
          grind_type: variant.grind_type,
          weight: variant.weight,
          price_cents: variant.price_cents,
          display_name: `${variant.weight}g ${variant.format === 'ground' ? `(${variant.grind_type})` : '(whole bean)'}`
        },
        pricing: {
          unit_price_cents: variant.price_cents,
          total_price_cents: itemTotal,
          unit_price_eur: variant.price_cents / 100,
          total_price_eur: itemTotal / 100
        },
        availability
      })
    }

    // Calculate shipping
    const shippingCents = subtotalCents >= 5000 ? 0 : 495 // Free shipping over €50

    // Calculate tax (simplified EU VAT)
    const taxCents = Math.round((subtotalCents + shippingCents) * 0.21)

    const totalCents = subtotalCents + shippingCents + taxCents

    return new Response(JSON.stringify({
      valid: issues.length === 0,
      items: validatedItems,
      issues,
      totals: {
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        tax_cents: taxCents,
        total_cents: totalCents,
        subtotal_eur: subtotalCents / 100,
        shipping_eur: shippingCents / 100,
        tax_eur: taxCents / 100,
        total_eur: totalCents / 100,
        item_count: validatedItems.reduce((sum, item) => sum + item.quantity, 0),
        unique_items: validatedItems.length,
        free_shipping_threshold: 5000,
        free_shipping_remaining: Math.max(0, 5000 - subtotalCents)
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Failed to validate cart:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to validate cart'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}