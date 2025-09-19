import { z } from 'zod'

// Honduras Coffee E-commerce Validation Schemas

// User authentication schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  newsletter_subscribed: z.boolean().default(false),
  marketing_consent: z.boolean().default(false)
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Address validation
export const addressSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address_line_1: z.string().min(1, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state_province: z.string().optional(),
  postal_code: z.string().min(1, 'Postal code is required'),
  country_code: z.string().length(2, 'Invalid country code'),
  phone: z.string().optional(),
  vat_number: z.string().optional()
})

// Cart item validation
export const cartItemSchema = z.object({
  product_variant_id: z.string().uuid(),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per product')
})

// Checkout validation
export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
  shipping_address: addressSchema,
  billing_address: addressSchema.optional(),
  customer_email: z.string().email('Valid email is required'),
  customer_notes: z.string().max(500, 'Notes too long').optional(),
  discount_code: z.string().optional(),
  newsletter_signup: z.boolean().default(false),
  marketing_consent: z.boolean().default(false),
  is_subscription: z.boolean().default(false),
  subscription_frequency: z.enum(['weekly', 'biweekly', 'monthly']).optional()
})

// Subscription validation
export const subscriptionSchema = z.object({
  frequency: z.enum(['weekly', 'biweekly', 'monthly']),
  items: z.array(cartItemSchema).min(1, 'Subscription must have at least one product'),
  delivery_address: addressSchema,
  start_date: z.string().optional()
})

// Product review validation
export const productReviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  title: z.string().min(1, 'Review title is required').max(100, 'Title too long'),
  content: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review too long'),
  recommend: z.boolean().default(true),
  brewing_method: z.enum(['espresso', 'filter', 'french_press', 'moka_pot', 'other']).optional()
})

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.enum([
    'general_inquiry',
    'order_support',
    'product_question',
    'subscription_help',
    'wholesale_inquiry',
    'other'
  ]),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
  order_number: z.string().optional()
})

// Newsletter subscription
export const newsletterSchema = z.object({
  email: z.string().email('Valid email is required'),
  preferences: z.object({
    new_products: z.boolean().default(true),
    promotions: z.boolean().default(true),
    coffee_tips: z.boolean().default(true),
    harvest_updates: z.boolean().default(true)
  }).optional()
})

// Admin product creation/update
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().optional(),
  origin_farm: z.string().min(1, 'Origin farm is required'),
  origin_municipality: z.string().optional(),
  altitude_min: z.number().positive().optional(),
  altitude_max: z.number().positive().optional(),
  variety: z.string().optional(),
  processing_method: z.enum(['washed', 'honey', 'natural']).optional(),
  roast_level: z.enum(['light', 'light-medium', 'medium', 'medium-dark', 'dark']).optional(),
  story: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'out_of_stock', 'discontinued', 'coming_soon']).default('active')
})

// Product variant validation
export const productVariantSchema = z.object({
  product_id: z.string().uuid(),
  sku: z.string().min(1, 'SKU is required'),
  format: z.enum(['whole_bean', 'ground']),
  grind_type: z.enum(['espresso', 'filter', 'french_press', 'moka_pot']).optional(),
  weight: z.number().positive('Weight must be positive'),
  price_cents: z.number().positive('Price must be positive'),
  stock_quantity: z.number().min(0, 'Stock cannot be negative').default(0),
  track_inventory: z.boolean().default(true),
  allow_backorder: z.boolean().default(false)
}).refine((data) => {
  // If format is ground, grind_type is required
  if (data.format === 'ground' && !data.grind_type) {
    return false
  }
  // If format is whole_bean, grind_type should not be set
  if (data.format === 'whole_bean' && data.grind_type) {
    return false
  }
  return true
}, {
  message: 'Grind type is required for ground coffee and should not be set for whole bean',
  path: ['grind_type']
})

// Search and filter validation
export const productSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  processing_method: z.enum(['washed', 'honey', 'natural']).optional(),
  roast_level: z.enum(['light', 'light-medium', 'medium', 'medium-dark', 'dark']).optional(),
  price_min: z.number().min(0).optional(),
  price_max: z.number().min(0).optional(),
  in_stock: z.boolean().optional(),
  featured: z.boolean().optional(),
  sort: z.enum(['name', 'price_asc', 'price_desc', 'newest', 'featured']).default('featured'),
  limit: z.number().min(1).max(50).default(12),
  offset: z.number().min(0).default(0)
})

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type Address = z.infer<typeof addressSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type Checkout = z.infer<typeof checkoutSchema>
export type Subscription = z.infer<typeof subscriptionSchema>
export type ProductReview = z.infer<typeof productReviewSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type Newsletter = z.infer<typeof newsletterSchema>
export type ProductInput = z.infer<typeof productSchema>
export type ProductVariant = z.infer<typeof productVariantSchema>
export type ProductSearch = z.infer<typeof productSearchSchema>