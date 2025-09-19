'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { CartItemProps } from '@/types/shop'
import { formatPrice } from '@/lib/utils/formatters'

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { product, variant, quantity, subscription_interval } = item

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  return (
    <Card className="overflow-hidden border-0 shadow-none" data-testid="cart-item">
      <CardContent className="p-0">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={product.image_url || '/images/products/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, 96px"
            />
            {variant.stock_count < 10 && variant.stock_count > 0 && (
              <Badge variant="secondary" className="absolute bottom-1 right-1">
                Only {variant.stock_count} left
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <div className="space-y-1">
              <h3 className="font-medium leading-tight">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                {variant.weight}g • {variant.grind_type}
              </p>
              {subscription_interval && (
                <Badge variant="outline" className="text-xs">
                  Every {subscription_interval}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Quantity Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1
                      handleQuantityChange(value)
                    }}
                    min="1"
                    max="10"
                    className="w-16 h-8 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(variant.price_cents * quantity)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(variant.price_cents)} each
                </p>
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            data-testid="remove-item"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}