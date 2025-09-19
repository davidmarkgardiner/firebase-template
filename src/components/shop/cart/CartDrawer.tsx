'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/hooks/useCart'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { EmptyCart } from './EmptyCart'
import { Button } from '@/components/ui/button'
import { ShoppingBag, X } from 'lucide-react'

export function CartDrawer() {
  const { items, isOpen, setIsOpen, totalItems, subtotal } = useCartStore()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} data-testid="cart-drawer">
      <SheetContent className="w-full sm:max-w-lg flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close cart</span>
          </Button>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          {items.length === 0 ? (
            <EmptyCart onClose={() => setIsOpen(false)} />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id}>
                  <CartItem
                    item={item}
                    onRemove={(id) => useCartStore.getState().removeItem(id)}
                    onUpdateQuantity={(id, quantity) =>
                      useCartStore.getState().updateQuantity(id, quantity)
                    }
                  />
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-4">
            <CartSummary
              subtotal={subtotal}
              shippingThreshold={50}
              freeShippingReached={subtotal >= 50}
            />
            <Button className="w-full" size="lg" asChild>
              <a href="/checkout">Proceed to Checkout</a>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}