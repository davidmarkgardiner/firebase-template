'use client'

import { Button } from '@/components/ui/button'
import { ShoppingBag, Coffee } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface EmptyCartProps {
  onClose?: () => void
}

export function EmptyCart({ onClose }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
      {/* Empty Cart Illustration */}
      <div className="relative">
        <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        </div>
        <Coffee className="absolute -bottom-2 -right-2 h-8 w-8 text-amber-600 rotate-12" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Your cart is empty</h3>
        <p className="text-muted-foreground max-w-xs">
          Looks like you haven't added any coffee to your cart yet.
        </p>
      </div>

      <div className="space-y-3 w-full max-w-xs">
        <Button className="w-full" asChild onClick={onClose}>
          <Link href="/products">
            Start Shopping
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild onClick={onClose}>
          <Link href="/subscription">
            Browse Subscriptions
          </Link>
        </Button>
      </div>

      {/* Featured Suggestion */}
      <div className="text-center space-y-2 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Try our customer favorite:
        </p>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="relative h-12 w-12 overflow-hidden rounded">
            <Image
              src="/images/products/montana-roja.jpg"
              alt="Montaña Roja"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">Montaña Roja</p>
            <p className="text-xs text-muted-foreground">Single Origin</p>
          </div>
        </div>
      </div>
    </div>
  )
}