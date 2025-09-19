import { loadStripe, type Stripe } from '@stripe/stripe-js'
import StripeNode from 'stripe'

let stripePromise: Promise<Stripe | null>

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      console.warn('Stripe publishable key not found')
      return Promise.resolve(null)
    }
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

// Server-side Stripe client - only create if secret key exists
export const getServerStripe = (): StripeNode | null => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    console.warn('Stripe secret key not found')
    return null
  }
  return new StripeNode(secretKey, {
    apiVersion: '2025-08-27.basil'
  })
}