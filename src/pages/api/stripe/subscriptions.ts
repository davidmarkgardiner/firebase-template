import type { APIRoute } from 'astro'
import { getServerStripe } from '../../../lib/stripe'
import { createSupabaseServerClient } from '../../../lib/supabase'
import { z } from 'zod'

// Validation schemas
const SubscriptionActionSchema = z.object({
  action: z.enum(['pause', 'resume', 'cancel', 'update_items', 'update_frequency']),
  subscription_id: z.string().uuid(),
  pause_until: z.string().optional(), // ISO date string
  new_frequency: z.enum(['weekly', 'biweekly', 'monthly']).optional(),
  items: z.array(z.object({
    product_variant_id: z.string().uuid(),
    quantity: z.number().min(0).max(5)
  })).optional()
})

export const POST: APIRoute = async ({ request }) => {
  console.log('🔄 Managing subscription')

  const stripe = getServerStripe()
  if (!stripe) {
    return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { supabase } = createSupabaseServerClient(request)

  try {
    // Get current user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse and validate request
    const body = await request.json()
    const { action, subscription_id, pause_until, new_frequency, items } = SubscriptionActionSchema.parse(body)

    // Get subscription from database
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscription_id)
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription) {
      return new Response(JSON.stringify({ error: 'Subscription not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let result: any = {}

    switch (action) {
      case 'pause':
        result = await pauseSubscription(stripe, supabase, subscription, pause_until)
        break

      case 'resume':
        result = await resumeSubscription(stripe, supabase, subscription)
        break

      case 'cancel':
        result = await cancelSubscription(stripe, supabase, subscription)
        break

      case 'update_items':
        if (!items) {
          throw new Error('Items are required for update_items action')
        }
        result = await updateSubscriptionItems(supabase, subscription, items)
        break

      case 'update_frequency':
        if (!new_frequency) {
          throw new Error('New frequency is required for update_frequency action')
        }
        result = await updateSubscriptionFrequency(stripe, supabase, subscription, new_frequency)
        break

      default:
        throw new Error('Invalid action')
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Subscription management failed:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Subscription management failed'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Get subscription details
export const GET: APIRoute = async ({ request, url }) => {
  const { supabase } = createSupabaseServerClient(request)

  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const subscriptionId = url.searchParams.get('id')

    if (subscriptionId) {
      // Get specific subscription
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_items (
            *,
            product_variants (
              *,
              products (*)
            )
          )
        `)
        .eq('id', subscriptionId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        throw error
      }

      return new Response(JSON.stringify(subscription), {
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      // Get all user subscriptions
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_items (
            *,
            product_variants (
              *,
              products (*)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return new Response(JSON.stringify(subscriptions), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('❌ Failed to fetch subscriptions:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to fetch subscriptions'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Pause subscription
async function pauseSubscription(stripe: any, supabase: any, subscription: any, pauseUntil?: string) {
  if (!subscription.stripe_subscription_id) {
    throw new Error('Stripe subscription ID not found')
  }

  // Pause in Stripe
  const pauseParams: any = {
    behavior: 'void'
  }

  if (pauseUntil) {
    pauseParams.resumes_at = Math.floor(new Date(pauseUntil).getTime() / 1000)
  }

  const stripeSubscription = await stripe.subscriptions.update(
    subscription.stripe_subscription_id,
    {
      pause_collection: pauseParams
    }
  )

  // Update in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'paused',
      paused_at: new Date().toISOString(),
      pause_start_date: new Date().toISOString().split('T')[0],
      pause_end_date: pauseUntil ? pauseUntil.split('T')[0] : null
    })
    .eq('id', subscription.id)

  if (error) {
    throw error
  }

  return { success: true, message: 'Subscription paused successfully' }
}

// Resume subscription
async function resumeSubscription(stripe: any, supabase: any, subscription: any) {
  if (!subscription.stripe_subscription_id) {
    throw new Error('Stripe subscription ID not found')
  }

  // Resume in Stripe
  await stripe.subscriptions.update(
    subscription.stripe_subscription_id,
    {
      pause_collection: null
    }
  )

  // Update in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      paused_at: null,
      pause_start_date: null,
      pause_end_date: null
    })
    .eq('id', subscription.id)

  if (error) {
    throw error
  }

  return { success: true, message: 'Subscription resumed successfully' }
}

// Cancel subscription
async function cancelSubscription(stripe: any, supabase: any, subscription: any) {
  if (!subscription.stripe_subscription_id) {
    throw new Error('Stripe subscription ID not found')
  }

  // Cancel in Stripe (at period end to honor current billing)
  await stripe.subscriptions.update(
    subscription.stripe_subscription_id,
    {
      cancel_at_period_end: true
    }
  )

  // Update in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString()
    })
    .eq('id', subscription.id)

  if (error) {
    throw error
  }

  return { success: true, message: 'Subscription will be cancelled at the end of the current billing period' }
}

// Update subscription items
async function updateSubscriptionItems(supabase: any, subscription: any, items: any[]) {
  // Remove existing active items
  await supabase
    .from('subscription_items')
    .update({ is_active: false })
    .eq('subscription_id', subscription.id)

  // Add new items
  const newItems = items
    .filter(item => item.quantity > 0)
    .map((item, index) => ({
      subscription_id: subscription.id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      position: index,
      is_active: true
    }))

  if (newItems.length > 0) {
    const { error } = await supabase
      .from('subscription_items')
      .insert(newItems)

    if (error) {
      throw error
    }
  }

  return { success: true, message: 'Subscription items updated successfully' }
}

// Update subscription frequency
async function updateSubscriptionFrequency(stripe: any, supabase: any, subscription: any, newFrequency: string) {
  // Update in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      frequency: newFrequency,
      next_delivery_date: calculateNextDeliveryDate(newFrequency)
    })
    .eq('id', subscription.id)

  if (error) {
    throw error
  }

  // Note: Stripe subscription frequency changes require recreating the subscription
  // This is a simplified approach - in production you might want to:
  // 1. Cancel current subscription at period end
  // 2. Create new subscription with new frequency
  // 3. Handle prorations appropriately

  return { success: true, message: 'Subscription frequency updated successfully' }
}

// Helper function to calculate next delivery date
function calculateNextDeliveryDate(frequency: string): string {
  const now = new Date()
  switch (frequency) {
    case 'weekly':
      now.setDate(now.getDate() + 7)
      break
    case 'biweekly':
      now.setDate(now.getDate() + 14)
      break
    case 'monthly':
    default:
      now.setMonth(now.getMonth() + 1)
      break
  }
  return now.toISOString().split('T')[0]
}