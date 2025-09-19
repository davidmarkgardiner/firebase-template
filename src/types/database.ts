// Database types for Honduras Coffee E-commerce Platform
// Auto-generated from Supabase schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          preferred_grind: string | null
          preferred_weight: number | null
          brewing_methods: string[] | null
          newsletter_subscribed: boolean
          marketing_consent: boolean
          total_spent_cents: number
          order_count: number
          last_order_at: string | null
          stripe_customer_id: string | null
          is_admin: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          preferred_grind?: string | null
          preferred_weight?: number | null
          brewing_methods?: string[] | null
          newsletter_subscribed?: boolean
          marketing_consent?: boolean
          total_spent_cents?: number
          order_count?: number
          last_order_at?: string | null
          stripe_customer_id?: string | null
          is_admin?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          preferred_grind?: string | null
          preferred_weight?: number | null
          brewing_methods?: string[] | null
          newsletter_subscribed?: boolean
          marketing_consent?: boolean
          total_spent_cents?: number
          order_count?: number
          last_order_at?: string | null
          stripe_customer_id?: string | null
          is_admin?: boolean
          notes?: string | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          sku: string
          slug: string
          name: string
          description: string | null
          origin_farm: string
          origin_region: string | null
          origin_municipality: string | null
          altitude_min: number | null
          altitude_max: number | null
          variety: string | null
          processing_method: string | null
          roast_level: string | null
          roast_date: string | null
          harvest_year: number | null
          harvest_month: string | null
          tasting_notes: Json | null
          cupping_score: number | null
          acidity: number | null
          body: number | null
          sweetness: number | null
          story: string | null
          brewing_methods: string[] | null
          featured: boolean
          status: string
          limited_edition: boolean
          created_at: string
          updated_at: string
          published_at: string | null
          meta_title: string | null
          meta_description: string | null
          stripe_product_id: string | null
        }
        Insert: {
          id?: string
          sku: string
          slug: string
          name: string
          description?: string | null
          origin_farm: string
          origin_region?: string | null
          origin_municipality?: string | null
          altitude_min?: number | null
          altitude_max?: number | null
          variety?: string | null
          processing_method?: string | null
          roast_level?: string | null
          roast_date?: string | null
          harvest_year?: number | null
          harvest_month?: string | null
          tasting_notes?: Json | null
          cupping_score?: number | null
          acidity?: number | null
          body?: number | null
          sweetness?: number | null
          story?: string | null
          brewing_methods?: string[] | null
          featured?: boolean
          status?: string
          limited_edition?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
          meta_title?: string | null
          meta_description?: string | null
          stripe_product_id?: string | null
        }
        Update: {
          id?: string
          sku?: string
          slug?: string
          name?: string
          description?: string | null
          origin_farm?: string
          origin_region?: string | null
          origin_municipality?: string | null
          altitude_min?: number | null
          altitude_max?: number | null
          variety?: string | null
          processing_method?: string | null
          roast_level?: string | null
          roast_date?: string | null
          harvest_year?: number | null
          harvest_month?: string | null
          tasting_notes?: Json | null
          cupping_score?: number | null
          acidity?: number | null
          body?: number | null
          sweetness?: number | null
          story?: string | null
          brewing_methods?: string[] | null
          featured?: boolean
          status?: string
          limited_edition?: boolean
          updated_at?: string
          published_at?: string | null
          meta_title?: string | null
          meta_description?: string | null
          stripe_product_id?: string | null
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          format: string
          grind_type: string | null
          weight: number
          price_cents: number
          compare_at_price_cents: number | null
          stock_quantity: number
          low_stock_threshold: number
          allow_backorder: boolean
          track_inventory: boolean
          stripe_price_id: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku: string
          format: string
          grind_type?: string | null
          weight: number
          price_cents: number
          compare_at_price_cents?: number | null
          stock_quantity?: number
          low_stock_threshold?: number
          allow_backorder?: boolean
          track_inventory?: boolean
          stripe_price_id?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string
          format?: string
          grind_type?: string | null
          weight?: number
          price_cents?: number
          compare_at_price_cents?: number | null
          stock_quantity?: number
          low_stock_threshold?: number
          allow_backorder?: boolean
          track_inventory?: boolean
          stripe_price_id?: string | null
          active?: boolean
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          email: string
          status: string
          shipping_address: Json
          billing_address: Json
          subtotal_cents: number
          shipping_cents: number
          tax_cents: number
          discount_cents: number
          total_cents: number
          currency: string
          shipping_method: string | null
          shipping_tracking_number: string | null
          shipping_tracking_url: string | null
          shipping_carrier: string | null
          estimated_delivery_date: string | null
          payment_method: string | null
          payment_status: string
          stripe_payment_intent_id: string | null
          stripe_customer_id: string | null
          customer_notes: string | null
          admin_notes: string | null
          is_subscription_order: boolean
          subscription_id: string | null
          created_at: string
          updated_at: string
          paid_at: string | null
          shipped_at: string | null
          delivered_at: string | null
          cancelled_at: string | null
          refunded_at: string | null
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          email: string
          status?: string
          shipping_address: Json
          billing_address: Json
          subtotal_cents: number
          shipping_cents?: number
          tax_cents?: number
          discount_cents?: number
          total_cents: number
          currency?: string
          shipping_method?: string | null
          shipping_tracking_number?: string | null
          shipping_tracking_url?: string | null
          shipping_carrier?: string | null
          estimated_delivery_date?: string | null
          payment_method?: string | null
          payment_status?: string
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          customer_notes?: string | null
          admin_notes?: string | null
          is_subscription_order?: boolean
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          refunded_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          email?: string
          status?: string
          shipping_address?: Json
          billing_address?: Json
          subtotal_cents?: number
          shipping_cents?: number
          tax_cents?: number
          discount_cents?: number
          total_cents?: number
          currency?: string
          shipping_method?: string | null
          shipping_tracking_number?: string | null
          shipping_tracking_url?: string | null
          shipping_carrier?: string | null
          estimated_delivery_date?: string | null
          payment_method?: string | null
          payment_status?: string
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          customer_notes?: string | null
          admin_notes?: string | null
          is_subscription_order?: boolean
          subscription_id?: string | null
          updated_at?: string
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          cancelled_at?: string | null
          refunded_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_variant_id: string
          product_name: string
          product_sku: string
          variant_details: Json | null
          quantity: number
          unit_price_cents: number
          total_price_cents: number
          discount_cents: number
          discount_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_variant_id: string
          product_name: string
          product_sku: string
          variant_details?: Json | null
          quantity: number
          unit_price_cents: number
          total_price_cents: number
          discount_cents?: number
          discount_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_variant_id?: string
          product_name?: string
          product_sku?: string
          variant_details?: Json | null
          quantity?: number
          unit_price_cents?: number
          total_price_cents?: number
          discount_cents?: number
          discount_reason?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          frequency: string
          subscription_type: string
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          next_delivery_date: string | null
          last_delivery_date: string | null
          delivery_address: Json | null
          discount_percentage: number
          pause_start_date: string | null
          pause_end_date: string | null
          cancellation_reason: string | null
          created_at: string
          updated_at: string
          activated_at: string | null
          paused_at: string | null
          cancelled_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          frequency: string
          subscription_type?: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          next_delivery_date?: string | null
          last_delivery_date?: string | null
          delivery_address?: Json | null
          discount_percentage?: number
          pause_start_date?: string | null
          pause_end_date?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
          activated_at?: string | null
          paused_at?: string | null
          cancelled_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          frequency?: string
          subscription_type?: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          next_delivery_date?: string | null
          last_delivery_date?: string | null
          delivery_address?: Json | null
          discount_percentage?: number
          pause_start_date?: string | null
          pause_end_date?: string | null
          cancellation_reason?: string | null
          updated_at?: string
          activated_at?: string | null
          paused_at?: string | null
          cancelled_at?: string | null
          expires_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          position: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          position?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          position?: number
          active?: boolean
          updated_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          order_id: string | null
          subscription_id: string | null
          type: string
          status: string
          amount_cents: number
          currency: string
          payment_method: string | null
          last_four_digits: string | null
          stripe_payment_intent_id: string | null
          stripe_charge_id: string | null
          stripe_refund_id: string | null
          processing_fee_cents: number | null
          metadata: Json | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          subscription_id?: string | null
          type: string
          status: string
          amount_cents: number
          currency?: string
          payment_method?: string | null
          last_four_digits?: string | null
          stripe_payment_intent_id?: string | null
          stripe_charge_id?: string | null
          stripe_refund_id?: string | null
          processing_fee_cents?: number | null
          metadata?: Json | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          subscription_id?: string | null
          type?: string
          status?: string
          amount_cents?: number
          currency?: string
          payment_method?: string | null
          last_four_digits?: string | null
          stripe_payment_intent_id?: string | null
          stripe_charge_id?: string | null
          stripe_refund_id?: string | null
          processing_fee_cents?: number | null
          metadata?: Json | null
          error_message?: string | null
        }
      }
    }
    Views: {
      // Add analytics views here
    }
    Functions: {
      // Database functions
      get_product_availability: {
        Args: {
          p_product_variant_id: string
        }
        Returns: Json
      }
      calculate_order_totals: {
        Args: {
          p_order_id: string
          p_shipping_country?: string
        }
        Returns: Json
      }
      create_subscription_order: {
        Args: {
          p_subscription_id: string
          p_delivery_date?: string
        }
        Returns: string
      }
    }
    Enums: {
      order_status: 'pending' | 'payment_processing' | 'payment_failed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
      payment_status: 'unpaid' | 'paid' | 'refunded' | 'partial_refund'
      subscription_status: 'active' | 'paused' | 'cancelled' | 'expired' | 'trialing'
      product_status: 'active' | 'out_of_stock' | 'discontinued' | 'coming_soon'
    }
  }
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// Convenience types
export type Product = Database['public']['Tables']['products']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type PaymentTransaction = Database['public']['Tables']['payment_transactions']['Row']