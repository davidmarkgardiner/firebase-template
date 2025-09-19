import type { CoffeeProduct, ProductVariant, Review, ReviewStats, FarmInfo, BrewingGuide } from '../../types/coffee'

// Mock API functions for product data
// In production, these would fetch from your database/API

export async function getProductBySlug(slug: string): Promise<CoffeeProduct | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Mock product data based on slug
  const products: Record<string, CoffeeProduct> = {
    'honduran-estate-reserve-250g': {
      id: '1',
      slug: 'honduran-estate-reserve-250g',
      name: 'Honduran Estate Reserve',
      description: 'A remarkable single-origin coffee from the highlands of Honduras, offering a complex flavor profile with notes of chocolate, caramel, and citrus. This estate reserve is carefully cultivated at high altitudes, resulting in a coffee that perfectly balances sweetness and acidity.',
      shortDescription: 'Premium single-origin coffee with chocolate and citrus notes',
      price: 2499, // $24.99 for 250g
      categoryId: 'estate',
      category: 'estate',
      origin: {
        country: 'Honduras',
        region: 'Copán',
        farm: 'Finca El Paraíso',
        altitude: 1450,
        process: 'washed',
        varietal: ['Bourbon', 'Catuai']
      },
      roastLevel: 'medium',
      roastDate: new Date().toISOString(),
      tastingNotes: {
        aroma: 8,
        acidity: 7,
        body: 8,
        sweetness: 9,
        aftertaste: 8,
        balance: 9,
        primaryNotes: ['Chocolate', 'Caramel', 'Orange'],
        secondaryNotes: ['Honey', 'Vanilla', 'Almond'],
        cupNotes: 'Smooth and well-balanced with a silky mouthfeel',
        aromaDescription: 'Rich chocolate and caramel with hints of citrus'
      },
      images: [
        { id: '1', url: '/images/coffee-bag-1.jpg', alt: 'Honduran Estate Reserve coffee bag', isPrimary: true, order: 1 },
        { id: '2', url: '/images/coffee-beans-1.jpg', alt: 'Honduran coffee beans', isPrimary: false, order: 2 },
        { id: '3', url: '/images/coffee-farm-1.jpg', alt: 'Coffee farm in Honduras', isPrimary: false, order: 3 },
        { id: '4', url: '/images/coffee-cup-1.jpg', alt: 'Brewed Honduran coffee', isPrimary: false, order: 4 }
      ],
      featuredImage: '/images/coffee-bag-1.jpg',
      inventory: {
        'variant-1': 50,
        'variant-2': 30,
        'variant-3': 20,
        'variant-4': 45,
        'variant-5': 25,
        'variant-6': 15
      },
      isAvailable: true,
      isFeatured: true,
      isLimited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'mountain-peak-blend-500g': {
      id: '2',
      slug: 'mountain-peak-blend-500g',
      name: 'Mountain Peak Blend',
      description: 'A bold and vibrant blend sourced from the highest peaks of Honduras, featuring a perfect balance of bright acidity and rich body.',
      shortDescription: 'Bold mountain blend with bright acidity',
      price: 3499, // $34.99 for 500g
      categoryId: 'mountain',
      category: 'mountain',
      origin: {
        country: 'Honduras',
        region: 'Santa Barbara',
        farm: 'Multiple Farms',
        altitude: 1600,
        process: 'washed',
        varietal: ['Typica', 'Bourbon']
      },
      roastLevel: 'light',
      roastDate: new Date().toISOString(),
      tastingNotes: {
        aroma: 9,
        acidity: 9,
        body: 6,
        sweetness: 7,
        aftertaste: 7,
        balance: 8,
        primaryNotes: ['Lemon', 'Peach', 'Floral'],
        secondaryNotes: ['Tea', 'Bergamot'],
        cupNotes: 'Bright and tea-like with delicate floral notes',
        aromaDescription: 'Citrus and stone fruit aromatics'
      },
      images: [
        { id: '21', url: '/images/coffee-bag-2.jpg', alt: 'Mountain Peak Blend coffee bag', isPrimary: true, order: 1 },
        { id: '22', url: '/images/coffee-beans-2.jpg', alt: 'Mountain coffee beans', isPrimary: false, order: 2 }
      ],
      featuredImage: '/images/coffee-bag-2.jpg',
      inventory: { 'variant-21': 40 },
      isAvailable: true,
      isFeatured: false,
      isLimited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
  
  return products[slug] || null
}

export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // Mock variants based on product ID
  const variants: Record<string, ProductVariant[]> = {
    '1': [
      { id: 'variant-1', productId: '1', sku: 'HER-WB-250', format: 'whole_bean', weight: 250, price: 2499, inventory: 50, isDefault: true },
      { id: 'variant-2', productId: '1', sku: 'HER-WB-500', format: 'whole_bean', weight: 500, price: 4499, inventory: 30, isDefault: false },
      { id: 'variant-3', productId: '1', sku: 'HER-WB-1000', format: 'whole_bean', weight: 1000, price: 8499, inventory: 20, isDefault: false },
      { id: 'variant-4', productId: '1', sku: 'HER-GR-250-F', format: 'ground', grindType: 'filter', weight: 250, price: 2499, inventory: 45, isDefault: false },
      { id: 'variant-5', productId: '1', sku: 'HER-GR-500-F', format: 'ground', grindType: 'filter', weight: 500, price: 4499, inventory: 25, isDefault: false },
      { id: 'variant-6', productId: '1', sku: 'HER-GR-1000-F', format: 'ground', grindType: 'filter', weight: 1000, price: 8499, inventory: 15, isDefault: false },
    ],
    '2': [
      { id: 'variant-21', productId: '2', sku: 'MPB-WB-500', format: 'whole_bean', weight: 500, price: 3499, inventory: 40, isDefault: true },
      { id: 'variant-22', productId: '2', sku: 'MPB-GR-500-F', format: 'ground', grindType: 'filter', weight: 500, price: 3499, inventory: 35, isDefault: false },
    ]
  }
  
  return variants[productId] || []
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  const reviews: Record<string, Review[]> = {
    '1': [
      {
        id: 'review-1',
        productId: '1',
        userId: 'user-1',
        userName: 'Sarah M.',
        rating: 5,
        title: 'Exceptional coffee!',
        comment: 'This is hands down the best Honduran coffee I\'ve ever had. The chocolate and citrus notes are perfectly balanced, and the quality is consistently excellent.',
        verifiedPurchase: true,
        helpful: 23,
        notHelpful: 2,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'review-2',
        productId: '1',
        userId: 'user-2',
        userName: 'Michael R.',
        rating: 4,
        title: 'Great morning coffee',
        comment: 'Really smooth and flavorful. I brew it in my V60 and it\'s perfect every time. Only wish the shipping was a bit faster.',
        verifiedPurchase: true,
        helpful: 15,
        notHelpful: 1,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'review-3',
        productId: '1',
        userId: 'user-3',
        userName: 'Emma T.',
        rating: 5,
        title: 'Perfect for espresso',
        comment: 'I use this for my morning espresso and it\'s fantastic. Creamy, sweet, with just the right amount of acidity. The subscription option is great too!',
        verifiedPurchase: true,
        helpful: 18,
        notHelpful: 0,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
  
  return reviews[productId] || []
}

export async function getReviewStats(productId: string): Promise<ReviewStats> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  const stats: Record<string, ReviewStats> = {
    '1': {
      averageRating: 4.7,
      totalReviews: 42,
      distribution: {
        5: 28,
        4: 10,
        3: 3,
        2: 1,
        1: 0
      }
    }
  }
  
  return stats[productId] || {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  }
}

export async function getFarmInfo(productId: string): Promise<FarmInfo> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  const farmInfos: Record<string, FarmInfo> = {
    '1': {
      name: 'Finca El Paraíso',
      farmer: 'Carlos Rodriguez',
      location: {
        latitude: 14.8333,
        longitude: -88.8667,
        address: 'Copán Department, Western Honduras'
      },
      elevation: 1450,
      size: 45,
      established: 1985,
      certifications: ['Rainforest Alliance', 'Fair Trade', 'Organic'],
      story: `Finca El Paraíso has been in the Rodriguez family for three generations. What started as a small family farm has grown into a renowned coffee estate known for its commitment to quality and sustainability.

Carlos Rodriguez, the current owner, learned the art of coffee cultivation from his grandfather. He has modernized the farm's practices while maintaining traditional values of quality and environmental stewardship.

The farm's unique microclimate, created by the surrounding mountains and consistent rainfall patterns, provides ideal conditions for growing exceptional coffee. The volcanic soil, rich in minerals, contributes to the coffee's distinctive flavor profile.

Every step of the process, from planting to processing, is carefully managed to ensure the highest quality. The cherries are hand-picked at peak ripeness, and the wet mill processes the coffee within hours of harvest to preserve its delicate flavors.`,
      images: [
        '/images/farm-aerial.jpg',
        '/images/farm-workers.jpg',
        '/images/farm-processing.jpg'
      ],
      harvestMonths: [12, 1, 2, 3],
      processingMethods: ['Washed', 'Honey', 'Natural']
    }
  }
  
  return farmInfos[productId] || {
    name: 'Unknown Farm',
    farmer: 'Unknown',
    location: { latitude: 0, longitude: 0 },
    elevation: 0,
    size: 0,
    established: 2000,
    certifications: [],
    story: 'Farm information not available.',
    images: [],
    harvestMonths: [],
    processingMethods: []
  }
}

export async function getBrewingGuides(productId: string): Promise<BrewingGuide[]> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  const guides: Record<string, BrewingGuide[]> = {
    '1': [
      {
        method: 'pour_over',
        grindSize: 'medium',
        ratio: '1:15',
        waterTemp: 93,
        brewTime: '3:30',
        notes: 'This coffee shines in a pour over, highlighting its bright acidity and complex flavor notes.',
        equipmentRecommendations: ['V60', 'Chemex', 'Kalita Wave']
      },
      {
        method: 'espresso',
        grindSize: 'fine',
        ratio: '1:2',
        waterTemp: 92,
        brewTime: '0:28',
        notes: 'Produces a balanced espresso with chocolate sweetness and citrus brightness.',
        equipmentRecommendations: ['Espresso Machine', 'Precision Grinder', 'Scale']
      },
      {
        method: 'french_press',
        grindSize: 'coarse',
        ratio: '1:12',
        waterTemp: 95,
        brewTime: '4:00',
        notes: 'Full-bodied brew that emphasizes the chocolate and caramel notes.',
        equipmentRecommendations: ['French Press', 'Burr Grinder', 'Timer']
      }
    ]
  }
  
  return guides[productId] || []
}

export async function getRelatedProducts(productId: string): Promise<CoffeeProduct[]> {
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // Get all products except the current one
  const allProducts = await Promise.all([
    getProductBySlug('mountain-peak-blend-500g'),
    getProductBySlug('honduran-estate-reserve-250g')
  ])
  
  return allProducts.filter(product => product && product.id !== productId) as CoffeeProduct[]
}