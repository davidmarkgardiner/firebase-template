'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/hooks/useCart'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CartButtonProps {
  className?: string
}

export function CartButton({ className }: CartButtonProps) {
  const { totalItems, setIsOpen } = useCartStore()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('relative', className)}
      onClick={() => setIsOpen(true)}
      data-testid="cart-button"
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="sr-only">Shopping cart</span>

      {/* Item count badge */}
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-5 rounded-full"
          data-testid="cart-badge"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </Button>
  )
}