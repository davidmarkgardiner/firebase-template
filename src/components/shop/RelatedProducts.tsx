import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import type { CoffeeProduct } from '@/types/coffee'

interface RelatedProductsProps {
  products: CoffeeProduct[]
  title?: string
  className?: string
}

export default function RelatedProducts({ 
  products, 
  title = "You May Also Like",
  className = '' 
}: RelatedProductsProps) {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100)
  }

  if (products.length === 0) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <a
                  href={`/products/${product.slug}`}
                  className="block group"
                >
                  <div className="space-y-3">
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted relative">
                      <img
                        src={product.featuredImage}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isFeatured && (
                        <Badge className="absolute top-2 left-2">Featured</Badge>
                      )}
                      {product.isLimited && (
                        <Badge variant="destructive" className="absolute top-2 right-2">
                          Limited
                        </Badge>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm group-hover:underline line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {product.origin.region}, {product.origin.country}
                      </p>
                      
                      {/* Tasting Notes Preview */}
                      <div className="flex flex-wrap gap-1">
                        {product.tastingNotes.primaryNotes.slice(0, 2).map((note) => (
                          <Badge key={note} variant="outline" className="text-xs">
                            {note}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Price */}
                      <p className="font-medium text-sm">
                        From {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-12" />
          <CarouselNext className="hidden sm:flex -right-12" />
        </Carousel>

        {/* Mobile Navigation Hint */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground sm:hidden">
          <ChevronLeft className="h-3 w-3" />
          <span>Swipe to browse</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  )
}

// Alternative grid layout for "Customers Also Bought" section
export function RelatedProductsGrid({ 
  products, 
  title = "Frequently Bought Together",
  className = '' 
}: RelatedProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100)
  }

  if (products.length === 0) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => (
            <a
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="space-y-2">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden rounded-lg bg-muted relative">
                  <img
                    src={product.featuredImage}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Badge variant="secondary">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="space-y-1">
                  <h3 className="font-medium text-sm group-hover:underline line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {product.roastLevel.replace('-', ' ')}
                  </p>
                  <p className="font-medium text-sm">
                    From {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        {/* Bundle Offer */}
        {products.length >= 3 && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Bundle & Save</p>
              <p className="text-xs text-muted-foreground">
                Buy all {Math.min(4, products.length)} items together and save 10%
              </p>
            </div>
            <Button size="sm">
              Add Bundle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}