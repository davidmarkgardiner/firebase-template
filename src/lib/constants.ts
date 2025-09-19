// Honduras Coffee E-commerce Platform Constants
export const APP_NAME = 'Honduras Coffee'
export const APP_DESCRIPTION = 'Premium specialty coffee from the mountains of Honduras'

// Business information
export const BUSINESS_INFO = {
  name: 'Honduras Coffee',
  tagline: 'From Mountain to Cup',
  description: 'Family-sourced, high-altitude specialty coffee from the mountains of Honduras',
  contact: {
    email: 'hello@hondurascoffee.com',
    phone: '+31 20 123 4567',
    address: 'Amsterdam, Netherlands'
  },
  social: {
    instagram: 'https://instagram.com/hondurascoffee',
    facebook: 'https://facebook.com/hondurascoffee'
  }
} as const

// Default values
export const DEFAULT_CURRENCY = 'EUR'
export const DEFAULT_LOCALE = 'en-EU'
export const TAX_RATE = 0.21 // EU VAT rate
export const FREE_SHIPPING_THRESHOLD = 5000 // €50 in cents
export const STANDARD_SHIPPING_COST = 495 // €4.95 in cents

// Coffee-specific constants
export const GRIND_TYPES = [
  { value: 'espresso', label: 'Espresso (Fine)' },
  { value: 'filter', label: 'Filter/Pour Over (Medium)' },
  { value: 'french_press', label: 'French Press (Coarse)' },
  { value: 'moka_pot', label: 'Moka Pot (Medium-Fine)' }
] as const

export const ROAST_LEVELS = [
  { value: 'light', label: 'Light Roast' },
  { value: 'light-medium', label: 'Light-Medium Roast' },
  { value: 'medium', label: 'Medium Roast' },
  { value: 'medium-dark', label: 'Medium-Dark Roast' },
  { value: 'dark', label: 'Dark Roast' }
] as const

export const PROCESSING_METHODS = [
  { value: 'washed', label: 'Washed' },
  { value: 'honey', label: 'Honey' },
  { value: 'natural', label: 'Natural' }
] as const

export const SUBSCRIPTION_FREQUENCIES = [
  { value: 'weekly', label: 'Weekly', description: 'Every week' },
  { value: 'biweekly', label: 'Bi-weekly', description: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Every month' }
] as const

// API endpoints
export const API_ENDPOINTS = {
  auth: '/api/auth',
  products: '/api/products',
  cart: '/api/cart',
  checkout: '/api/stripe/checkout',
  webhooks: '/api/stripe/webhooks',
  subscriptions: '/api/stripe/subscriptions',
  orders: '/api/orders'
} as const

// Navigation items
export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Coffee', href: '/products' },
  { name: 'Subscriptions', href: '/subscription' },
  { name: 'Our Story', href: '/about' },
  { name: 'Contact', href: '/contact' }
] as const

// Product categories for navigation
export const PRODUCT_CATEGORIES = [
  { slug: 'single-origin', name: 'Single Origin', href: '/products?category=single-origin' },
  { slug: 'estate-reserve', name: 'Estate Reserve', href: '/products?category=estate-reserve' },
  { slug: 'mountain-select', name: 'Mountain Select', href: '/products?category=mountain-select' },
  { slug: 'seasonal-harvest', name: 'Seasonal', href: '/products?category=seasonal-harvest' }
] as const

// Order statuses
export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  payment_processing: { label: 'Processing Payment', color: 'blue' },
  payment_failed: { label: 'Payment Failed', color: 'red' },
  confirmed: { label: 'Confirmed', color: 'green' },
  processing: { label: 'Processing', color: 'blue' },
  shipped: { label: 'Shipped', color: 'purple' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'gray' },
  refunded: { label: 'Refunded', color: 'orange' }
} as const

// Payment statuses
export const PAYMENT_STATUSES = {
  unpaid: { label: 'Unpaid', color: 'yellow' },
  paid: { label: 'Paid', color: 'green' },
  refunded: { label: 'Refunded', color: 'orange' },
  partial_refund: { label: 'Partially Refunded', color: 'orange' }
} as const

// Subscription statuses
export const SUBSCRIPTION_STATUSES = {
  active: { label: 'Active', color: 'green' },
  paused: { label: 'Paused', color: 'yellow' },
  cancelled: { label: 'Cancelled', color: 'gray' },
  expired: { label: 'Expired', color: 'red' },
  trialing: { label: 'Trial', color: 'blue' }
} as const