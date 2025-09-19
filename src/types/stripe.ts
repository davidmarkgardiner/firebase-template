import type Stripe from 'stripe'

// Re-export main Stripe type
export type { Stripe }

// Define commonly used Stripe types
export type PaymentIntent = Stripe.PaymentIntent
export type PaymentMethod = Stripe.PaymentMethod
export type Customer = Stripe.Customer
export type Subscription = Stripe.Subscription
export type Price = Stripe.Price
export type StripeProduct = Stripe.Product
export type StripeEvent = Stripe.Event

// Custom Stripe-related types
export interface PaymentIntentData {
  amount: number
  currency: string
  customerId?: string
  metadata?: Record<string, string>
}

export interface CreateCustomerData {
  email: string
  name?: string
  metadata?: Record<string, string>
}

export interface WebhookEventData {
  id: string
  object: string
  type: string
  data: {
    object: any
  }
}