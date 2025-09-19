'use client'

import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CartSummaryProps } from '@/types/shop'
import { formatPrice } from '@/lib/utils/formatters'
import { Truck } from 'lucide-react'

export function CartSummary({
  subtotal,
  shippingThreshold,
  freeShippingReached
}: CartSummaryProps) {
  const shippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100)
  const amountUntilFreeShipping = Math.max(shippingThreshold - subtotal, 0)

  return (
    <div className="space-y-4">
      {/* Free Shipping Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            {freeShippingReached ? (
              <span className="font-medium text-green-600">
                Free shipping unlocked!
              </span>
            ) : (
              <span>
                {formatPrice(amountUntilFreeShipping)} away from free shipping
              </span>
            )}
          </span>
          <span className="text-muted-foreground">
            {formatPrice(subtotal)} / {formatPrice(shippingThreshold)}
          </span>
        </div>
        <Progress
          value={shippingProgress}
          className={`h-2 ${freeShippingReached ? '[&>div]:bg-green-500' : ''}`}
        />
      </div>

      <Separator />

      {/* Price Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{freeShippingReached ? 'FREE' : formatPrice(599)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>{formatPrice(Math.round(subtotal * 0.08))}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>
            {formatPrice(
              subtotal +
                (freeShippingReached ? 0 : 599) +
                Math.round(subtotal * 0.08)
            )}
          </span>
        </div>
      </div>
    </div>
  )
}