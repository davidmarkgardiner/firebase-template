import type { APIRoute } from 'astro'
import Stripe from 'stripe'
import { getServerStripe } from '../../../lib/stripe'
import { createSupabaseServerClient } from '../../../lib/supabase'

// Stripe webhook endpoint secret
const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET

export const POST: APIRoute = async ({ request }) => {
  console.log('🔥 Stripe webhook received')

  if (!endpointSecret) {
    console.error('❌ Missing STRIPE_WEBHOOK_SECRET')
    return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const stripe = getServerStripe()
  if (!stripe) {
    return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { supabase } = createSupabaseServerClient(request)

  let event: Stripe.Event

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('Missing stripe-signature header')
    }

    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  console.log(`🎯 Webhook event type: ${event.type}`)

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(supabase, event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(supabase, event.data.object as Stripe.PaymentIntent)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(supabase, event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(supabase, event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(supabase, event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(supabase, event.data.object as Stripe.Invoice)
        break

      case 'customer.created':
        await handleCustomerCreated(supabase, event.data.object as Stripe.Customer)
        break

      default:
        console.log(`🤷 Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle successful payment intent
async function handlePaymentIntentSucceeded(supabase: any, paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('💰 Payment succeeded:', paymentIntent.id)

  // Find the order by payment intent ID
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single()

  if (orderError || !order) {
    console.error('❌ Order not found for payment intent:', paymentIntent.id)
    return
  }

  // Update order status to confirmed and paid
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'confirmed',
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
      payment_method: paymentIntent.payment_method_types[0] || 'card'
    })
    .eq('id', order.id)

  if (updateError) {
    console.error('❌ Failed to update order:', updateError)
    return
  }

  // Create payment transaction record
  await supabase
    .from('payment_transactions')
    .insert({
      order_id: order.id,
      type: 'payment',
      status: 'succeeded',
      amount_cents: paymentIntent.amount,
      currency: paymentIntent.currency,
      payment_method: paymentIntent.payment_method_types[0],
      stripe_payment_intent_id: paymentIntent.id,
      stripe_charge_id: paymentIntent.latest_charge,
      metadata: {
        webhook_event: 'payment_intent.succeeded',
        stripe_customer_id: paymentIntent.customer
      }
    })

  console.log('✅ Order confirmed:', order.order_number)
}

// Handle failed payment intent
async function handlePaymentIntentFailed(supabase: any, paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('💸 Payment failed:', paymentIntent.id)

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'payment_failed',
      payment_status: 'unpaid'
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('❌ Failed to update order for failed payment:', error)
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(supabase: any, subscription: Stripe.Subscription): Promise<void> {
  console.log('🔄 Subscription created:', subscription.id)

  // Find customer in our database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', subscription.customer)
    .single()

  if (!profile) {
    console.error('❌ Customer not found for subscription:', subscription.customer)
    return
  }

  // Update subscription record if it exists
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      stripe_subscription_id: subscription.id,
      activated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', subscription.customer)
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('❌ Failed to update subscription:', error)
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(supabase: any, subscription: Stripe.Subscription): Promise<void> {
  console.log('🔄 Subscription updated:', subscription.id)

  const status = subscription.status
  const updateData: any = { status }

  // Handle different status changes
  if (status === 'active') {
    updateData.activated_at = new Date().toISOString()
    updateData.paused_at = null
    updateData.cancelled_at = null
  } else if (status === 'paused') {
    updateData.paused_at = new Date().toISOString()
  } else if (status === 'canceled') {
    updateData.cancelled_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('❌ Failed to update subscription:', error)
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(supabase: any, subscription: Stripe.Subscription): Promise<void> {
  console.log('❌ Subscription deleted:', subscription.id)

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('❌ Failed to update cancelled subscription:', error)
  }
}

// Handle successful invoice payment (for subscriptions)
async function handleInvoicePaymentSucceeded(supabase: any, invoice: Stripe.Invoice): Promise<void> {
  console.log('📄 Invoice payment succeeded:', invoice.id)

  if (!invoice.subscription) {
    return // Not a subscription invoice
  }

  // Create subscription order if this is a recurring payment
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', invoice.subscription)
    .single()

  if (subscription && subscription.status === 'active') {
    try {
      // Call our database function to create subscription order
      const { data: orderId } = await supabase
        .rpc('create_subscription_order', {
          p_subscription_id: subscription.id
        })

      if (orderId) {
        console.log('✅ Created subscription order:', orderId)
      }
    } catch (error) {
      console.error('❌ Failed to create subscription order:', error)
    }
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(supabase: any, invoice: Stripe.Invoice): Promise<void> {
  console.log('📄 Invoice payment failed:', invoice.id)

  if (invoice.subscription) {
    // Could implement retry logic or pause subscription
    console.log('⚠️ Subscription payment failed:', invoice.subscription)
  }
}

// Handle customer creation
async function handleCustomerCreated(supabase: any, customer: Stripe.Customer): Promise<void> {
  console.log('👤 Customer created:', customer.id)

  // Update profile with Stripe customer ID if we find matching email
  if (customer.email) {
    const { error } = await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('email', customer.email)

    if (error) {
      console.error('❌ Failed to update profile with customer ID:', error)
    }
  }
}