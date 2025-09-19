// Application-specific type definitions

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'customer' | 'instructor' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  inventory: number
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface YogaClass {
  id: string
  name: string
  description: string
  instructorId: string
  duration: number // in minutes
  maxParticipants: number
  price: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  userId: string
  classId: string
  date: string
  participants: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  total: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}