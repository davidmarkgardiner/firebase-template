import type { APIRoute } from 'astro'
import { getServerStripe } from '../../../lib/stripe'
import { createSupabaseServerClient } from '../../../lib/supabase'
import { z } from 'zod'

// Validation schemas
const CheckoutItemSchema = z.object({
  product_variant_id: z.string().uuid(),
  quantity: z.number().min(1).max(10)
})

const AddressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  company: z.string().optional(),
  address_line_1: z.string().min(1),
  address_line_2: z.string().optional(),
  city: z.string().min(1),
  state_province: z.string().optional(),
  postal_code: z.string().min(1),
  country_code: z.string().length(2),
  phone: z.string().optional()
})

const CreateCheckoutSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1),
  shipping_address: AddressSchema,
  billing_address: AddressSchema.optional(),
  customer_email: z.string().email(),
  customer_notes: z.string().optional(),
  discount_code: z.string().optional(),
  is_subscription: z.boolean().default(false),
  subscription_frequency: z.enum(['weekly', 'biweekly', 'monthly']).optional()
})

export const POST: APIRoute = async ({ request }) => {
  console.log('🛒 Creating Stripe checkout session')

  const stripe = getServerStripe()
  if (!stripe) {
    return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { supabase } = createSupabaseServerClient(request)

  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = CreateCheckoutSchema.parse(body)

    const {
      items,
      shipping_address,
      billing_address,
      customer_email,
      customer_notes,
      discount_code,
      is_subscription,
      subscription_frequency
    } = validatedData

    // Get product variants with pricing
    const variantIds = items.map(item => item.product_variant_id)
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select(`
        *,
        products:product_id (
          id,
          name,
          description,
          stripe_product_id
        )
      `)
      .in('id', variantIds)

    if (variantsError || !variants || variants.length === 0) {
      throw new Error('Product variants not found')
    }

    // Check stock availability
    for (const item of items) {
      const variant = variants.find(v => v.id === item.product_variant_id)
      if (!variant) {
        throw new Error(`Product variant ${item.product_variant_id} not found`)
      }

      if (variant.track_inventory && variant.stock_quantity < item.quantity && !variant.allow_backorder) {
        throw new Error(`Insufficient stock for ${variant.products.name}`)
      }
    }

    // Calculate totals
    let subtotal_cents = 0
    const line_items = []

    for (const item of items) {
      const variant = variants.find(v => v.id === item.product_variant_id)
      if (!variant) continue

      const line_total = variant.price_cents * item.quantity
      subtotal_cents += line_total

      // For subscriptions, we need Stripe Price objects
      if (is_subscription) {
        // Create or get Stripe price for this variant
        let stripePriceId = variant.stripe_price_id

        if (!stripePriceId) {
          const stripePrice = await stripe.prices.create({
            product: variant.products.stripe_product_id || await createStripeProduct(stripe, variant.products),
            unit_amount: variant.price_cents,
            currency: 'eur',
            recurring: subscription_frequency ? {
              interval: subscription_frequency === 'weekly' ? 'week' :
                       subscription_frequency === 'biweekly' ? 'week' :
                       'month',
              interval_count: subscription_frequency === 'biweekly' ? 2 : 1
            } : undefined
          })

          stripePriceId = stripePrice.id

          // Update variant with Stripe price ID
          await supabase
            .from('product_variants')
            .update({ stripe_price_id: stripePriceId })
            .eq('id', variant.id)
        }

        line_items.push({
          price: stripePriceId,
          quantity: item.quantity
        })
      } else {
        // One-time purchase
        line_items.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${variant.products.name} - ${variant.weight}g ${variant.format === 'ground' ? `(${variant.grind_type})` : '(whole bean)'}`,
              description: variant.products.description || undefined,
              metadata: {
                product_id: variant.products.id,
                variant_id: variant.id
              }
            },
            unit_amount: variant.price_cents
          },
          quantity: item.quantity
        })
      }
    }

    // Calculate shipping and tax
    const shipping_cents = subtotal_cents >= 5000 ? 0 : 495 // Free shipping over €50
    const tax_rate = 0.21 // EU VAT rate
    const tax_cents = Math.round((subtotal_cents + shipping_cents) * tax_rate)
    const total_cents = subtotal_cents + shipping_cents + tax_cents

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        email: customer_email,
        status: 'pending',
        shipping_address: shipping_address,
        billing_address: billing_address || shipping_address,
        subtotal_cents,
        shipping_cents,
        tax_cents,
        total_cents,
        customer_notes,
        is_subscription_order: is_subscription
      })
      .select()
      .single()

    if (orderError || !order) {
      throw new Error('Failed to create order')
    }

    // Create order items
    const orderItems = items.map(item => {
      const variant = variants.find(v => v.id === item.product_variant_id)!
      return {
        order_id: order.id,
        product_variant_id: item.product_variant_id,
        product_name: variant.products.name,
        product_sku: variant.sku,
        variant_details: {
          format: variant.format,
          grind_type: variant.grind_type,
          weight: variant.weight
        },
        quantity: item.quantity,
        unit_price_cents: variant.price_cents,
        total_price_cents: variant.price_cents * item.quantity
      }
    })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      throw new Error('Failed to create order items')
    }

    // Prepare Stripe checkout session
    const checkoutSessionParams: any = {
      payment_method_types: ['card', 'sepa_debit'],
      line_items,
      mode: is_subscription ? 'subscription' : 'payment',
      success_url: `${import.meta.env.PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.PUBLIC_APP_URL}/cart`,
      customer_email,
      metadata: {
        order_id: order.id,
        order_number: order.order_number
      },
      shipping_address_collection: {
        allowed_countries: ['NL', 'DE', 'FR', 'BE', 'LU', 'AT', 'ES', 'IT']
      },
      tax_id_collection: {
        enabled: true
      }
    }

    // Add shipping options for one-time purchases
    if (!is_subscription) {
      checkoutSessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shipping_cents,
              currency: 'eur'
            },
            display_name: shipping_cents === 0 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2
              },
              maximum: {
                unit: 'business_day',
                value: 5
              }
            }
          }
        }
      ]
    }

    // For subscriptions, create customer first
    if (is_subscription) {
      const customer = await stripe.customers.create({
        email: customer_email,
        name: `${shipping_address.first_name} ${shipping_address.last_name}`,
        address: {
          line1: shipping_address.address_line_1,
          line2: shipping_address.address_line_2 || undefined,
          city: shipping_address.city,
          state: shipping_address.state_province || undefined,
          postal_code: shipping_address.postal_code,
          country: shipping_address.country_code
        },
        phone: shipping_address.phone || undefined,
        metadata: {
          order_id: order.id
        }
      })

      checkoutSessionParams.customer = customer.id

      // Create subscription record
      await supabase
        .from('subscriptions')
        .insert({
          user_id: null, // Will be updated when user registers
          frequency: subscription_frequency || 'monthly',
          stripe_customer_id: customer.id,
          delivery_address: shipping_address,
          status: 'trialing'
        })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(checkoutSessionParams)

    // Update order with Stripe payment intent ID
    await supabase
      .from('orders')
      .update({
        stripe_payment_intent_id: session.payment_intent as string
      })
      .eq('id', order.id)

    console.log('✅ Checkout session created:', session.id)

    return new Response(JSON.stringify({
      session_id: session.id,
      url: session.url,
      order_id: order.id,
      order_number: order.order_number
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Checkout creation failed:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Checkout creation failed'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Helper function to create Stripe product
async function createStripeProduct(stripe: any, product: any): Promise<string> {
  const stripeProduct = await stripe.products.create({
    name: product.name,
    description: product.description || undefined,
    metadata: {
      product_id: product.id
    }
  })

  return stripeProduct.id
}