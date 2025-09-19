import React, { useState } from 'react'
import { Share2, Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import ProductHero from './ProductHero'
import VariantSelector from './VariantSelector'
import AddToCart from './AddToCart'
import TastingNotes from './TastingNotes'
import OriginStory from './OriginStory'
import BrewingGuide from './BrewingGuide'
import ReviewsSection from './ReviewsSection'
import RelatedProducts, { RelatedProductsGrid } from './RelatedProducts'
import type { CoffeeProduct, ProductVariant, Review, ReviewStats, FarmInfo, BrewingGuide as BrewingGuideType, VariantSelection, SubscriptionOption } from '@/types/coffee'

interface ProductPageClientProps {
  product: CoffeeProduct
  variants: ProductVariant[]
  reviews: Review[]
  reviewStats: ReviewStats
  relatedProducts: CoffeeProduct[]
  farmInfo: FarmInfo
  brewingGuides: BrewingGuideType[]
}

export default function ProductPageClient({
  product,
  variants,
  reviews,
  reviewStats,
  relatedProducts,
  farmInfo,
  brewingGuides
}: ProductPageClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    variants.find(v => v.isDefault) || variants[0]
  )
  const [currentSelection, setCurrentSelection] = useState<VariantSelection>({
    format: selectedVariant?.format || 'whole_bean',
    grindType: selectedVariant?.grindType,
    weight: selectedVariant?.weight || 250,
    quantity: 1
  })
  const [isFavorite, setIsFavorite] = useState(false)

  const handleSelectionChange = (selection: VariantSelection, variant: ProductVariant | undefined) => {
    setCurrentSelection(selection)
    setSelectedVariant(variant)
  }

  const handleAddToCart = (subscription?: SubscriptionOption) => {
    if (!selectedVariant) return
    
    // In a real app, this would add to cart via API/context
    console.log('Adding to cart:', {
      product,
      variant: selectedVariant,
      selection: currentSelection,
      subscription
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const getCategoryDisplay = (category: string) => {
    const displays: Record<string, string> = {
      'estate': 'Estate Coffee',
      'mountain': 'Mountain Coffee',
      'seasonal': 'Seasonal Coffee'
    }
    return displays[category] || category
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products/${product.category}`}>
                {getCategoryDisplay(product.category)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Product Images and Info - Left Side */}
          <div className="lg:col-span-7">
            <ProductHero 
              product={product} 
              reviewCount={reviewStats.totalReviews}
              averageRating={reviewStats.averageRating}
            />
          </div>

          {/* Product Options and Purchase - Right Side */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              {/* Variant Selection */}
              <VariantSelector
                variants={variants}
                onSelectionChange={handleSelectionChange}
              />

              {/* Add to Cart */}
              <AddToCart
                variant={selectedVariant}
                selection={currentSelection}
                onAddToCart={handleAddToCart}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs - Desktop */}
        <div className="hidden md:block mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="tasting">Tasting Notes</TabsTrigger>
              <TabsTrigger value="origin">Origin</TabsTrigger>
              <TabsTrigger value="brewing">Brewing Guide</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviewStats.totalReviews})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose prose-gray max-w-none">
                <h3 className="text-xl font-semibold mb-4">About This Coffee</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="tasting" className="mt-6">
              <TastingNotes tastingProfile={product.tastingNotes} />
            </TabsContent>

            <TabsContent value="origin" className="mt-6">
              <OriginStory product={product} farmInfo={farmInfo} />
            </TabsContent>

            <TabsContent value="brewing" className="mt-6">
              <BrewingGuide guides={brewingGuides} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewsSection
                reviews={reviews}
                stats={reviewStats}
                productId={product.id}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Product Details - Mobile (Stacked) */}
        <div className="md:hidden mt-8 space-y-6">
          <div className="prose prose-gray max-w-none">
            <h3 className="text-xl font-semibold mb-4">About This Coffee</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <TastingNotes tastingProfile={product.tastingNotes} />
          <OriginStory product={product} farmInfo={farmInfo} />
          <BrewingGuide guides={brewingGuides} />
          <ReviewsSection
            reviews={reviews}
            stats={reviewStats}
            productId={product.id}
          />
        </div>

        {/* Related Products */}
        <div className="mt-12 space-y-8">
          <RelatedProducts 
            products={relatedProducts} 
            title="You May Also Like"
          />
          <RelatedProductsGrid
            products={relatedProducts}
            title="Frequently Bought Together"
          />
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
        <div className="container mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {selectedVariant && `$${(selectedVariant.price / 100).toFixed(2)}`}
            </p>
          </div>
          <Button 
            size="lg"
            onClick={() => handleAddToCart()}
            disabled={!selectedVariant || selectedVariant.inventory === 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}