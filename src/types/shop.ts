// Shop types for Honduras Coffee E-commerce Platform

import { Product, ProductVariant } from './database'

export interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
  subscription_interval?: 'weekly' | 'biweekly' | 'monthly' | null
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  subtotal: number
  shippingThreshold: number
  freeShippingReached: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setIsOpen: (open: boolean) => void
}

export interface CartDrawerProps {
  children?: React.ReactNode
}

export interface CartItemProps {
  item: CartItem
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

export interface CartSummaryProps {
  subtotal: number
  shippingThreshold: number
  freeShippingReached: boolean
}