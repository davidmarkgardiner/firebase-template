import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { 
  ShoppingCartIcon, 
  Plus, 
  Minus, 
  X, 
  Trash2,
  ShoppingBag
} from 'lucide-react'

interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  image?: string
  size?: string
  grind?: string
}

interface ShoppingCartProps {
  items?: CartItem[]
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemoveItem?: (id: string) => void
  onCheckout?: () => void
  className?: string
}

// Mock cart data
const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Honduras Single Origin',
    description: 'Premium Arabica beans from the mountains of Honduras',
    price: 24.99,
    quantity: 2,
    size: '12oz',
    grind: 'Whole Bean'
  },
  {
    id: '2',
    name: 'Medium Roast Blend',
    description: 'Smooth and balanced coffee blend',
    price: 19.99,
    quantity: 1,
    size: '1lb',
    grind: 'Ground'
  }
]

export default function ShoppingCart({
  items = mockCartItems,
  isOpen,
  onOpenChange,
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onCheckout = () => {},
  className
}: ShoppingCartProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = isOpen !== undefined ? isOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingThreshold = 50
  const remainingForFreeShipping = Math.max(0, shippingThreshold - totalPrice)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id)
    } else {
      onUpdateQuantity(id, newQuantity)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative clay-button ${className}`}
          aria-label={`Shopping cart with ${totalItems} items`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </DrawerTitle>
          {remainingForFreeShipping > 0 && (
            <DrawerDescription>
              Add ${remainingForFreeShipping.toFixed(2)} more for free shipping!
            </DrawerDescription>
          )}
          {remainingForFreeShipping === 0 && totalPrice >= shippingThreshold && (
            <DrawerDescription className="text-green-600">
              🎉 You qualify for free shipping!
            </DrawerDescription>
          )}
        </DrawerHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCartIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">
              Discover our premium Honduras coffee
            </p>
            <DrawerClose asChild>
              <Button className="clay-button">
                Continue Shopping
              </Button>
            </DrawerClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 clay-card p-4">
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-none mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      
                      {/* Product Options */}
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        {item.size && <span>{item.size}</span>}
                        {item.grind && <span>• {item.grind}</span>}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Cart Summary */}
            <div className="border-t bg-muted/20 p-4 space-y-4">
              {/* Shipping Progress Bar */}
              {remainingForFreeShipping > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress to free shipping</span>
                    <span>${totalPrice.toFixed(2)} / ${shippingThreshold}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((totalPrice / shippingThreshold) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {totalPrice >= shippingThreshold ? 'Free' : '$5.99'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    ${(totalPrice + (totalPrice >= shippingThreshold ? 0 : 5.99)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <DrawerFooter className="pt-2">
              <Button 
                className="clay-button w-full"
                onClick={onCheckout}
              >
                Checkout • ${(totalPrice + (totalPrice >= shippingThreshold ? 0 : 5.99)).toFixed(2)}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}