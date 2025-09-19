-- Honduras Coffee - Orders and Order Items
-- Order management with EU shipping and VAT support

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., "HC-2024-0001"

  -- Customer Info (can be guest)
  user_id UUID REFERENCES profiles(id),
  email VARCHAR(255) NOT NULL,

  -- Order Status
  status VARCHAR(30) DEFAULT 'pending',
  -- Values: 'pending', 'payment_processing', 'payment_failed', 'confirmed',
  -- 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'

  -- Addresses (stored as JSONB to preserve history)
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,

  -- Financials (all in cents)
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  discount_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,

  -- Shipping
  shipping_method VARCHAR(50),
  shipping_tracking_number VARCHAR(255),
  shipping_tracking_url TEXT,
  shipping_carrier VARCHAR(50),
  estimated_delivery_date DATE,

  -- Payment
  payment_method VARCHAR(30), -- 'card', 'sepa', 'ideal', 'klarna'
  payment_status VARCHAR(30) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'refunded', 'partial_refund'

  -- Stripe
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),

  -- Currency
  currency VARCHAR(3) DEFAULT 'EUR',

  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,

  -- Subscription Related
  is_subscription_order BOOLEAN DEFAULT false,
  subscription_id UUID, -- Will add foreign key after subscriptions table

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),

  -- Product snapshot (in case product changes)
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  variant_details JSONB, -- Store grind, weight, etc.

  -- Quantities & Pricing
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,

  -- Discounts
  discount_cents INTEGER DEFAULT 0,
  discount_reason VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(product_variant_id);

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  current_year INTEGER;
  order_count INTEGER;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW());

  SELECT COUNT(*) + 1 INTO order_count
  FROM orders
  WHERE EXTRACT(YEAR FROM created_at) = current_year;

  NEW.order_number := 'HC-' || current_year || '-' || LPAD(order_count::TEXT, 4, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate order number
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();