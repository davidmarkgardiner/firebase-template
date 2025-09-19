// Expose store for testing in development
if (process.env.NODE_ENV === 'development') {
  (window as any).useCartStore = require('@/hooks/useCart').useCartStore
}