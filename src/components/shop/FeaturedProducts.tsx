import * as React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  description: string
  origin_farm: string
  origin_region: string
  variety: string
  processing_method: string
  roast_level: string
  tasting_notes: {
    primary: string[]
    secondary: string[]
    finish: string[]
  }
  cupping_score: number
  featured: boolean
  slug: string
  variants: {
    id: string
    price_cents: number
    weight: number
    format: string
    grind_type: string | null
    stock_quantity: number
  }[]
  images: {
    url: string
    alt_text: string
    is_primary: boolean
  }[]
}

interface FeaturedProductsProps {
  title?: string
  subtitle?: string
  limit?: number
  className?: string
}

export default function FeaturedProducts({
  title = "Featured Coffee Selection",
  subtitle = "Discover our most popular Honduras coffee varieties",
  limit = 6,
  className = ""
}: FeaturedProductsProps) {
  const [products, setProducts] = React.useState<Product[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const supabase = createSupabaseBrowserClient()

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            origin_farm,
            origin_region,
            variety,
            processing_method,
            roast_level,
            tasting_notes,
            cupping_score,
            featured,
            slug,
            product_variants!inner (
              id,
              price_cents,
              weight,
              format,
              grind_type,
              stock_quantity
            ),
            product_images (
              url,
              alt_text,
              is_primary
            )
          `)
          .eq('featured', true)
          .eq('status', 'active')
          .eq('product_variants.active', true)
          .order('cupping_score', { ascending: false })
          .limit(limit)

        if (productsError) {
          throw productsError
        }

        if (productsData) {
          // Transform the data to match our interface
          const transformedProducts: Product[] = productsData.map(product => ({
            ...product,
            variants: product.product_variants || [],
            images: product.product_images || []
          }))

          setProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load featured products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [limit])

  if (error) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Unable to load featured products at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <section className={`py-16 bg-muted/30 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Carousel */}
        {!isLoading && products.length > 0 && (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <FeaturedProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured products available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        {!isLoading && products.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <a href="/products">
                View All Coffee Products
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function FeaturedProductCard({ product }: { product: Product }) {
  // Get the primary image or use placeholder
  const primaryImage = product.images.find(img => img.is_primary) || product.images[0]

  // Get the lowest priced variant for display
  const baseVariant = product.variants.reduce((min, variant) =>
    variant.price_cents < min.price_cents ? variant : min
  )

  // Format price
  const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`

  // Format tasting notes
  const primaryNotes = product.tasting_notes?.primary || []
  const displayNotes = primaryNotes.slice(0, 3).join(", ")

  return (
    <Card className="clay-card group hover:scale-[1.02] transition-all duration-300 h-full">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted rounded-t-xl relative overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt_text || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-medium text-center px-4">
                {product.name}
              </span>
            </div>
          )}

          <Badge className="absolute top-3 left-3" variant="secondary">
            Featured
          </Badge>

          {product.cupping_score && (
            <Badge className="absolute top-3 right-3 bg-coffee text-white" variant="secondary">
              {product.cupping_score} pts
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </CardTitle>
          <Badge variant="outline" className="text-xs ml-2 shrink-0">
            {product.roast_level}
          </Badge>
        </div>

        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </CardDescription>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Origin:</span>
            <span className="font-medium">{product.origin_farm}</span>
          </div>

          <div className="flex justify-between">
            <span>Variety:</span>
            <span className="font-medium">{product.variety}</span>
          </div>

          <div className="flex justify-between">
            <span>Process:</span>
            <span className="font-medium capitalize">{product.processing_method}</span>
          </div>

          {displayNotes && (
            <div className="flex justify-between">
              <span>Notes:</span>
              <span className="font-medium text-right ml-2">{displayNotes}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">from</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(baseVariant.price_cents)}
          </span>
        </div>
        <Button asChild className="clay-button">
          <a href={`/products/${product.slug}`}>
            View Details
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProductCardSkeleton() {
  return (
    <Card className="clay-card h-full">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted rounded-t-xl animate-pulse" />
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 bg-muted rounded w-32 animate-pulse" />
          <div className="h-5 bg-muted rounded w-16 animate-pulse" />
        </div>
        <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse" />
        <div className="h-4 bg-muted rounded w-3/4 mb-4 animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-muted rounded w-16 animate-pulse" />
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div className="h-8 bg-muted rounded w-16 animate-pulse" />
        <div className="h-10 bg-muted rounded w-24 animate-pulse" />
      </CardFooter>
    </Card>
  )
}