import React, { useState } from 'react'
import { ShoppingCart, Check, Package, Calendar, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ProductVariant, VariantSelection, SubscriptionOption } from '@/types/coffee'

interface AddToCartProps {
  variant: ProductVariant | undefined
  selection: VariantSelection
  onAddToCart: (subscription?: SubscriptionOption) => void
  className?: string
}

export default function AddToCart({ 
  variant, 
  selection, 
  onAddToCart,
  className = '' 
}: AddToCartProps) {
  const [isSubscription, setIsSubscription] = useState(false)
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<SubscriptionOption['frequency']>('monthly')
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const subscriptionDiscounts: Record<SubscriptionOption['frequency'], number> = {
    'weekly': 15,
    'biweekly': 12,
    'monthly': 10,
    'quarterly': 8
  }

  const getNextDeliveryDate = (frequency: SubscriptionOption['frequency']) => {
    const date = new Date()
    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + 7)
        break
      case 'biweekly':
        date.setDate(date.getDate() + 14)
        break
      case 'monthly':
        date.setMonth(date.getMonth() + 1)
        break
      case 'quarterly':
        date.setMonth(date.getMonth() + 3)
        break
    }
    return date
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  const calculatePrices = () => {
    if (!variant) return { regular: 0, subscription: 0, savings: 0 }
    
    const regularPrice = variant.price * selection.quantity
    const discount = isSubscription ? subscriptionDiscounts[subscriptionFrequency] : 0
    const subscriptionPrice = regularPrice * (1 - discount / 100)
    const savings = regularPrice - subscriptionPrice
    
    return {
      regular: regularPrice,
      subscription: subscriptionPrice,
      savings: savings
    }
  }

  const handleAddToCart = async () => {
    if (!variant) return

    setIsAdding(true)
    
    const subscription: SubscriptionOption | undefined = isSubscription ? {
      enabled: true,
      frequency: subscriptionFrequency,
      discount: subscriptionDiscounts[subscriptionFrequency],
      nextDelivery: getNextDeliveryDate(subscriptionFrequency)
    } : undefined

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    onAddToCart(subscription)
    setIsAdding(false)
    setIsAdded(true)
    
    // Reset added state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000)
  }

  const prices = calculatePrices()
  const isOutOfStock = !variant || variant.inventory === 0
  const insufficientStock = variant && selection.quantity > variant.inventory

  return (
    <div className={cn("space-y-6", className)}>
      {/* Subscription Option */}
      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="subscription" className="text-base font-medium cursor-pointer">
              Subscribe & Save
            </Label>
            <p className="text-sm text-muted-foreground">
              Get {subscriptionDiscounts[subscriptionFrequency]}% off and never run out
            </p>
          </div>
          <Switch
            id="subscription"
            checked={isSubscription}
            onCheckedChange={setIsSubscription}
          />
        </div>

        {isSubscription && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-sm">
                Delivery Frequency
              </Label>
              <Select 
                value={subscriptionFrequency} 
                onValueChange={(value) => setSubscriptionFrequency(value as SubscriptionOption['frequency'])}
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">
                    <div className="flex items-center justify-between w-full">
                      <span>Every Week</span>
                      <Badge variant="secondary" className="ml-2">15% off</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="biweekly">
                    <div className="flex items-center justify-between w-full">
                      <span>Every 2 Weeks</span>
                      <Badge variant="secondary" className="ml-2">12% off</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="monthly">
                    <div className="flex items-center justify-between w-full">
                      <span>Every Month</span>
                      <Badge variant="secondary" className="ml-2">10% off</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="quarterly">
                    <div className="flex items-center justify-between w-full">
                      <span>Every 3 Months</span>
                      <Badge variant="secondary" className="ml-2">8% off</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                First delivery: {getNextDeliveryDate(subscriptionFrequency).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Cancel or modify anytime from your account</span>
            </div>
          </div>
        )}
      </div>

      {/* Price Summary */}
      {variant && (
        <div className="space-y-2">
          {isSubscription && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground line-through">
                  Regular Price
                </span>
                <span className="text-muted-foreground line-through">
                  {formatPrice(prices.regular)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Subscription Price</span>
                <div className="text-right">
                  <span className="text-xl font-bold">
                    {formatPrice(prices.subscription)}
                  </span>
                  <Badge variant="default" className="ml-2">
                    Save {formatPrice(prices.savings)}
                  </Badge>
                </div>
              </div>
            </>
          )}
          {!isSubscription && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold">
                {formatPrice(prices.regular)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full relative"
        disabled={isOutOfStock || insufficientStock || isAdding}
        onClick={handleAddToCart}
      >
        {isAdded ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Added to Cart
          </>
        ) : isAdding ? (
          <>
            <Package className="mr-2 h-5 w-5 animate-pulse" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isOutOfStock ? 'Out of Stock' : 
             insufficientStock ? 'Insufficient Stock' : 
             'Add to Cart'}
          </>
        )}
      </Button>

      {/* Stock Warning */}
      {insufficientStock && variant && (
        <Alert variant="destructive">
          <AlertDescription>
            Only {variant.inventory} items available. Please reduce quantity.
          </AlertDescription>
        </Alert>
      )}

      {/* Shipping Info */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <Package className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Free shipping over $50
          </p>
        </div>
        <div className="text-center">
          <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Ships in 1-2 business days
          </p>
        </div>
      </div>
    </div>
  )
}