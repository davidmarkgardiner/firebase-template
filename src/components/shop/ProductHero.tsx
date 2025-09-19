import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { CoffeeProduct, ProductImage } from '@/types/coffee'

interface ProductHeroProps {
  product: CoffeeProduct
  reviewCount: number
  averageRating: number
}

export default function ProductHero({ 
  product, 
  reviewCount, 
  averageRating 
}: ProductHeroProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const selectedImage = product.images[selectedImageIndex]

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <img
            src={selectedImage.url}
            alt={selectedImage.alt}
            className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
            loading="eager"
          />
          
          {/* Image Navigation */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          
          {/* Zoom Button */}
          <button
            onClick={() => setIsZoomOpen(true)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            aria-label="Zoom image"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isFeatured && (
              <Badge variant="default" className="w-fit">Featured</Badge>
            )}
            {product.isLimited && (
              <Badge variant="destructive" className="w-fit">Limited Edition</Badge>
            )}
          </div>
        </div>
        
        {/* Thumbnail Gallery */}
        {product.images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg transition-all",
                  selectedImageIndex === index 
                    ? "ring-2 ring-primary" 
                    : "opacity-70 hover:opacity-100"
                )}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col">
        {/* Category & Origin */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="capitalize">{product.category}</span>
          <span>•</span>
          <span>{product.origin.region}, {product.origin.country}</span>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
        
        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : i < averageRating
                      ? "fill-yellow-400/50 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        )}
        
        {/* Short Description */}
        <p className="text-lg text-muted-foreground mb-6">
          {product.shortDescription}
        </p>
        
        {/* Quick Specs */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50 mb-6">
          <div>
            <span className="text-sm text-muted-foreground">Roast Level</span>
            <p className="font-medium capitalize">{product.roastLevel.replace('-', ' ')}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Process</span>
            <p className="font-medium capitalize">{product.origin.process}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Altitude</span>
            <p className="font-medium">{product.origin.altitude}m</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Farm</span>
            <p className="font-medium">{product.origin.farm}</p>
          </div>
        </div>
        
        {/* Primary Tasting Notes */}
        <div className="mb-6">
          <span className="text-sm text-muted-foreground mb-2 block">Tasting Notes</span>
          <div className="flex flex-wrap gap-2">
            {product.tastingNotes.primaryNotes.map((note) => (
              <Badge key={note} variant="outline" className="text-base">
                {note}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Image Zoom Dialog */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative w-full h-full min-h-[50vh]">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="absolute inset-0 w-full h-full object-contain"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}