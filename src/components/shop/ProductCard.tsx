import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/hooks/useCart'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Star,
  Heart,
  ShoppingCart,
  Info,
  Coffee,
  Leaf,
  Award,
  Truck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product, ProductVariant } from '@/types/database'

interface ProductCardProps {
  product: Product
  variants: ProductVariant[]
  onToggleWishlist?: (productId: string) => void
  isWishlisted?: boolean
  className?: string
}

export default function ProductCard({
  product,
  variants,
  onToggleWishlist = () => {},
  isWishlisted = false,
  className
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants[0])
  const [subscriptionInterval, setSubscriptionInterval] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  const isInStock = selectedVariant.stock_count > 0
  const stockPercentage = selectedVariant.max_stock ?
    (selectedVariant.stock_count / selectedVariant.max_stock) * 100 : 0

  const handleAddToCart = () => {
    addItem({
      product,
      variant: selectedVariant,
      quantity: 1,
      subscription_interval: subscriptionInterval
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : i < rating
            ? "fill-amber-200 text-amber-400"
            : "text-muted-foreground"
        )}
      />
    ))
  }

  const getStockStatusColor = () => {
    if (selectedVariant.stock_count <= 3) return 'text-red-500'
    if (selectedVariant.stock_count <= 8) return 'text-amber-500'
    return 'text-green-600'
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-300",
          product.featured ? "clay-card hover:clay-shadow-medium" : "clay-card",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <AspectRatio ratio={4/3}>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <Coffee className="h-16 w-16 text-amber-600" />
              </div>
            )}
          </AspectRatio>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <Badge variant="featured" className="text-xs">
                Featured
              </Badge>
            )}
            {product.is_new && (
              <Badge variant="coffee" className="text-xs">
                New
              </Badge>
            )}
            {product.is_limited && (
              <Badge variant="warning" className="text-xs">
                Limited
              </Badge>
            )}
            {!isInStock && (
              <Badge variant="out-of-stock" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 clay-button opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onToggleWishlist(product.id)}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Quick Actions Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="secondary" className="clay-button">
                    <Info className="h-4 w-4 mr-2" />
                    Quick View
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 clay-card">
                  <div className="space-y-3">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.description}</p>

                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Leaf className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Single Origin • Fair Trade</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Product Title & Rating */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {renderStars(4.8)}
                <span className="text-xs text-muted-foreground ml-1">
                  (127)
                </span>
              </div>

              {isInStock && selectedVariant.stock_count <= 10 && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant={selectedVariant.stock_count <= 3 ? "low-stock" : "in-stock"}
                      className="text-xs"
                    >
                      {selectedVariant.stock_count} left
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-2">
                      <p>Stock Level</p>
                      <Progress value={stockPercentage} className="w-20" />
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Leaf className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Product Options */}
          {isInStock && (
            <div className="space-y-3">
              {/* Variant Selection */}
              {variants.length > 1 && (
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Size & Grind
                  </Label>
                  <RadioGroup
                    value={selectedVariant.id}
                    onValueChange={(value) => {
                      const variant = variants.find(v => v.id === value)
                      if (variant) setSelectedVariant(variant)
                    }}
                    className="flex gap-2"
                  >
                    {variants.map((variant) => (
                      <div key={variant.id} className="flex items-center space-x-1">
                        <RadioGroupItem
                          value={variant.id}
                          id={`${product.id}-variant-${variant.id}`}
                          className="w-3 h-3"
                        />
                        <Label
                          htmlFor={`${product.id}-variant-${variant.id}`}
                          className="text-xs cursor-pointer"
                        >
                          {variant.weight}g • {variant.grind_type}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Subscription Option */}
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Subscribe & Save 10%
                </Label>
                <RadioGroup
                  value={subscriptionInterval || 'onetime'}
                  onValueChange={(value) =>
                    setSubscriptionInterval(value === 'onetime' ? null : value)
                  }
                  className="flex gap-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem
                      value="onetime"
                      id={`${product.id}-sub-onetime`}
                      className="w-3 h-3"
                    />
                    <Label
                      htmlFor={`${product.id}-sub-onetime`}
                      className="text-xs cursor-pointer"
                    >
                      One-time
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem
                      value="monthly"
                      id={`${product.id}-sub-monthly`}
                      className="w-3 h-3"
                    />
                    <Label
                      htmlFor={`${product.id}-sub-monthly`}
                      className="text-xs cursor-pointer"
                    >
                      Monthly
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                ${((selectedVariant.price_cents * (subscriptionInterval ? 0.9 : 1)) / 100).toFixed(2)}
              </span>
              {subscriptionInterval && (
                <span className="text-sm text-muted-foreground line-through">
                  ${(selectedVariant.price_cents / 100).toFixed(2)}
                </span>
              )}
            </div>

            {selectedVariant.price_cents >= 2500 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Truck className="h-3 w-3" />
                <span>Free shipping</span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full clay-button"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            {isInStock ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            ) : (
              'Out of Stock'
            )}
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}