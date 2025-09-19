// Coffee-specific type definitions for Honduras Mountain Coffee

// Extended Product interface for coffee products
export interface CoffeeProduct {
  id: string
  slug: string
  name: string
  description: string
  shortDescription: string
  price: number // Base price for smallest size
  categoryId: string
  category: 'estate' | 'mountain' | 'seasonal'
  
  // Coffee-specific attributes
  origin: {
    country: string
    region: string
    farm: string
    altitude: number // meters above sea level
    process: 'washed' | 'natural' | 'honey' | 'anaerobic'
    varietal: string[]
  }
  
  roastLevel: 'light' | 'medium' | 'medium-dark' | 'dark'
  roastDate?: string
  
  // Tasting profile
  tastingNotes: TastingProfile
  
  // Visual assets
  images: ProductImage[]
  featuredImage: string
  
  // Inventory & Availability
  inventory: {
    [key: string]: number // variant_id: quantity
  }
  isAvailable: boolean
  isFeatured: boolean
  isLimited: boolean
  
  // Metadata
  createdAt: string
  updatedAt: string
}

// Product variant for different sizes and formats
export interface ProductVariant {
  id: string
  productId: string
  sku: string
  format: 'whole_bean' | 'ground'
  grindType?: 'espresso' | 'filter' | 'french_press' | 'moka_pot' | 'cold_brew'
  weight: 250 | 500 | 1000 // grams
  price: number
  inventory: number
  isDefault: boolean
}

// Tasting profile for coffee
export interface TastingProfile {
  aroma: number // 1-10
  acidity: number // 1-10
  body: number // 1-10
  sweetness: number // 1-10
  aftertaste: number // 1-10
  balance: number // 1-10
  
  // Flavor notes
  primaryNotes: string[]
  secondaryNotes: string[]
  
  // Descriptive text
  cupNotes: string
  aromaDescription: string
}

// Farm information
export interface FarmInfo {
  name: string
  farmer: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  elevation: number // meters
  size: number // hectares
  established: number // year
  certifications: string[]
  story: string
  images: string[]
  harvestMonths: number[] // 1-12
  processingMethods: string[]
}

// Brewing recommendations
export interface BrewingGuide {
  method: 'espresso' | 'pour_over' | 'french_press' | 'aeropress' | 'moka_pot' | 'cold_brew'
  grindSize: 'extra_fine' | 'fine' | 'medium_fine' | 'medium' | 'medium_coarse' | 'coarse'
  ratio: string // e.g., "1:15"
  waterTemp: number // celsius
  brewTime: string // e.g., "2:30"
  notes: string
  equipmentRecommendations: string[]
}

// Customer review
export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number // 1-5
  title: string
  comment: string
  verifiedPurchase: boolean
  helpful: number
  notHelpful: number
  images?: string[]
  createdAt: string
  updatedAt: string
}

// Review statistics
export interface ReviewStats {
  averageRating: number
  totalReviews: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

// Subscription options
export interface SubscriptionOption {
  enabled: boolean
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
  discount: number // percentage off
  nextDelivery?: Date
  minimumCommitment?: number // number of deliveries
}

// Product images
export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
}

// Cart item with coffee-specific options
export interface CartItem {
  productId: string
  variantId: string
  product: CoffeeProduct
  variant: ProductVariant
  quantity: number
  subscription?: SubscriptionOption
}

// Product page props
export interface ProductPageProps {
  product: CoffeeProduct
  variants: ProductVariant[]
  reviews: Review[]
  reviewStats: ReviewStats
  relatedProducts: CoffeeProduct[]
  farmInfo: FarmInfo
  brewingGuides: BrewingGuide[]
}

// Variant selection state
export interface VariantSelection {
  format: 'whole_bean' | 'ground'
  grindType?: 'espresso' | 'filter' | 'french_press' | 'moka_pot' | 'cold_brew'
  weight: 250 | 500 | 1000
  quantity: number
}

// Price calculation
export function calculatePrice(
  variant: ProductVariant,
  quantity: number,
  subscription?: SubscriptionOption
): {
  unitPrice: number
  subtotal: number
  discount: number
  total: number
} {
  const unitPrice = variant.price
  const subtotal = unitPrice * quantity
  const discount = subscription?.enabled ? subtotal * (subscription.discount / 100) : 0
  const total = subtotal - discount
  
  return {
    unitPrice,
    subtotal,
    discount,
    total
  }
}

// Get variant by selection
export function getVariantBySelection(
  variants: ProductVariant[],
  selection: VariantSelection
): ProductVariant | undefined {
  return variants.find(v => 
    v.format === selection.format &&
    v.weight === selection.weight &&
    (selection.format === 'whole_bean' || v.grindType === selection.grindType)
  )
}

// Format price for display
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100)
}

// Get roast level display name
export function getRoastLevelDisplay(level: string): string {
  const displays: Record<string, string> = {
    'light': 'Light Roast',
    'medium': 'Medium Roast',
    'medium-dark': 'Medium-Dark Roast',
    'dark': 'Dark Roast'
  }
  return displays[level] || level
}