'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartStore, CartItem } from '@/types/shop'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      subtotal: 0,
      shippingThreshold: 5000, // $50.00
      freeShippingReached: false,

      addItem: (itemData) => {
        const items = get().items
        const existingItem = items.find(
          (item) =>
            item.product.id === itemData.product.id &&
            item.variant.id === itemData.variant.id &&
            item.subscription_interval === itemData.subscription_interval
        )

        let newItems: CartItem[]
        if (existingItem) {
          newItems = items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + itemData.quantity }
              : item
          )
        } else {
          const newItem: CartItem = {
            ...itemData,
            id: `${itemData.product.id}-${itemData.variant.id}-${itemData.subscription_interval || 'onetime'}-${Date.now()}`
          }
          newItems = [...items, newItem]
        }

        const totals = calculateTotals(newItems)
        set({
          items: newItems,
          ...totals,
          freeShippingReached: totals.subtotal >= get().shippingThreshold
        })
      },

      removeItem: (id) => {
        const newItems = get().items.filter((item) => item.id !== id)
        const totals = calculateTotals(newItems)
        set({
          items: newItems,
          ...totals,
          freeShippingReached: totals.subtotal >= get().shippingThreshold
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return

        const newItems = get().items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
        const totals = calculateTotals(newItems)
        set({
          items: newItems,
          ...totals,
          freeShippingReached: totals.subtotal >= get().shippingThreshold
        })
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          subtotal: 0,
          freeShippingReached: false
        })
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },

      setIsOpen: (open) => {
        set({ isOpen: open })
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        totalItems: state.totalItems,
        freeShippingReached: state.freeShippingReached
      })
    }
  )
)

function calculateTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price_cents * item.quantity,
    0
  )

  return { totalItems, subtotal }
}