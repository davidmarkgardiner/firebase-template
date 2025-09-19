-- Honduras Coffee Database Setup
-- Complete schema application with conflict resolution

-- First, let's check what exists and create our schema safely

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create our tables only if they don't exist
-- This ensures we don't conflict with existing data

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  position INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Honduras Origin Specific Fields
  origin_farm VARCHAR(255) NOT NULL,
  origin_region VARCHAR(255) DEFAULT 'Honduras',
  origin_municipality VARCHAR(255),
  altitude_min INTEGER,
  altitude_max INTEGER,

  -- Coffee Characteristics
  variety VARCHAR(100),
  processing_method VARCHAR(50),
  roast_level VARCHAR(20),
  roast_date DATE,
  harvest_year INTEGER,
  harvest_month VARCHAR(20),

  -- Tasting Profile
  tasting_notes JSONB,
  cupping_score DECIMAL(3,1),
  acidity INTEGER CHECK (acidity >= 1 AND acidity <= 10),
  body INTEGER CHECK (body >= 1 AND body <= 10),
  sweetness INTEGER CHECK (sweetness >= 1 AND sweetness <= 10),

  -- Story & Marketing
  story TEXT,
  brewing_methods TEXT[],

  -- Product Management
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active',
  limited_edition BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  CONSTRAINT valid_altitude CHECK (altitude_max >= altitude_min OR altitude_max IS NULL OR altitude_min IS NULL)
);

-- 3. Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  sku VARCHAR(100) UNIQUE NOT NULL,
  format VARCHAR(20) NOT NULL CHECK (format IN ('whole_bean', 'ground')),
  grind_type VARCHAR(30),
  weight INTEGER NOT NULL,

  price_cents INTEGER NOT NULL,
  compare_at_price_cents INTEGER,

  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  allow_backorder BOOLEAN DEFAULT false,
  track_inventory BOOLEAN DEFAULT true,

  active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_grind CHECK (
    (format = 'whole_bean' AND grind_type IS NULL) OR
    (format = 'ground' AND grind_type IS NOT NULL)
  )
);

-- 4. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Check if profiles table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables
                   WHERE table_schema = 'public'
                   AND table_name = 'profiles') THEN
        CREATE TABLE profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          phone VARCHAR(50),

          preferred_grind VARCHAR(30),
          preferred_weight INTEGER,
          brewing_methods TEXT[],

          newsletter_subscribed BOOLEAN DEFAULT false,
          marketing_consent BOOLEAN DEFAULT false,

          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          last_order_at TIMESTAMPTZ,
          total_spent_cents INTEGER DEFAULT 0,
          order_count INTEGER DEFAULT 0,

          is_admin BOOLEAN DEFAULT false,
          notes TEXT
        );
    END IF;
END
$$;

-- 6. Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  type VARCHAR(20) DEFAULT 'shipping',
  is_default BOOLEAN DEFAULT false,

  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country_code VARCHAR(2) NOT NULL,

  phone VARCHAR(50),
  vat_number VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,

  user_id UUID REFERENCES profiles(id),
  email VARCHAR(255) NOT NULL,

  status VARCHAR(30) DEFAULT 'pending',

  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,

  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  discount_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,

  shipping_method VARCHAR(50),
  shipping_tracking_number VARCHAR(255),
  shipping_tracking_url TEXT,
  shipping_carrier VARCHAR(50),
  estimated_delivery_date DATE,

  payment_method VARCHAR(30),
  payment_status VARCHAR(30) DEFAULT 'unpaid',

  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),

  currency VARCHAR(3) DEFAULT 'EUR',

  customer_notes TEXT,
  admin_notes TEXT,

  is_subscription_order BOOLEAN DEFAULT false,
  subscription_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),

  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  variant_details JSONB,

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,

  discount_cents INTEGER DEFAULT 0,
  discount_reason VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),

  status VARCHAR(30) DEFAULT 'active',
  frequency VARCHAR(20) NOT NULL,
  subscription_type VARCHAR(30) DEFAULT 'single',

  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),

  next_delivery_date DATE,
  last_delivery_date DATE,

  delivery_address JSONB,

  discount_percentage INTEGER DEFAULT 0,

  pause_start_date DATE,
  pause_end_date DATE,
  cancellation_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Add foreign key for subscription_id in orders if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'orders_subscription_id_fkey'
    ) THEN
        ALTER TABLE orders
        ADD CONSTRAINT orders_subscription_id_fkey
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);
    END IF;
END
$$;

-- 10. Subscription Items Table
CREATE TABLE IF NOT EXISTS subscription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),

  quantity INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Continue with remaining tables...
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),

  adjustment_type VARCHAR(30) NOT NULL,
  quantity_change INTEGER NOT NULL,
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,

  reference_type VARCHAR(30),
  reference_id UUID,

  adjusted_by UUID REFERENCES profiles(id),
  reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Stock Alerts Table
CREATE TABLE IF NOT EXISTS stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),

  alert_type VARCHAR(30) NOT NULL,
  threshold INTEGER,
  current_stock INTEGER,

  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  subscription_id UUID REFERENCES subscriptions(id),

  type VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL,

  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',

  payment_method VARCHAR(30),
  last_four_digits VARCHAR(4),

  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  stripe_refund_id VARCHAR(255),

  processing_fee_cents INTEGER,

  metadata JSONB,
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Discounts Table
CREATE TABLE IF NOT EXISTS discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,

  discount_type VARCHAR(20) NOT NULL,
  discount_value INTEGER NOT NULL,

  minimum_order_cents INTEGER,
  applicable_products UUID[],
  applicable_categories UUID[],

  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  usage_limit_per_customer INTEGER DEFAULT 1,

  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,

  active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  event_type VARCHAR(50) NOT NULL,

  user_id UUID REFERENCES profiles(id),
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,

  page_url TEXT,
  referrer_url TEXT,

  product_id UUID REFERENCES products(id),
  order_id UUID REFERENCES orders(id),
  subscription_id UUID REFERENCES subscriptions(id),

  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Junction Table for Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,

  PRIMARY KEY (product_id, category_id)
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_origin_farm ON products(origin_farm);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_active ON product_variants(active);

CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant ON order_items(product_variant_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);

CREATE INDEX IF NOT EXISTS idx_sub_items_subscription ON subscription_items(subscription_id);

CREATE INDEX IF NOT EXISTS idx_inventory_logs_variant ON inventory_logs(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created ON inventory_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_stock_alerts_variant ON stock_alerts(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_notified ON stock_alerts(notified);

CREATE INDEX IF NOT EXISTS idx_transactions_order ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_subscription ON payment_transactions(subscription_id);

CREATE INDEX IF NOT EXISTS idx_discounts_code ON discounts(code);
CREATE INDEX IF NOT EXISTS idx_discounts_active ON discounts(active);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);

-- Insert seed categories if they don't exist
INSERT INTO categories (slug, name, description)
SELECT * FROM (VALUES
  ('single-origin', 'Single Origin', 'Pure coffee from a single farm or region'),
  ('limited-edition', 'Limited Edition', 'Rare and seasonal offerings'),
  ('subscription-eligible', 'Subscription Eligible', 'Available for subscription'),
  ('new-harvest', 'New Harvest', 'Fresh from the latest harvest')
) AS v(slug, name, description)
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE categories.slug = v.slug
);

-- Insert sample Honduras products if they don't exist
INSERT INTO products (
  sku, slug, name, description, origin_farm, origin_municipality,
  altitude_min, altitude_max, variety, processing_method,
  roast_level, tasting_notes, cupping_score, status, published_at
)
SELECT * FROM (VALUES
  (
    'HN-MARCALA-001',
    'honduras-marcala-bourbon',
    'Honduras Marcala Bourbon',
    'An exceptional bourbon variety from the high mountains of Marcala, featuring notes of chocolate and caramel with a bright acidity.',
    'Finca La Esperanza',
    'Marcala, La Paz',
    1400, 1600,
    'Bourbon',
    'washed',
    'medium',
    '{"primary": ["chocolate", "caramel"], "secondary": ["orange", "brown sugar"], "finish": ["clean", "sweet"]}'::jsonb,
    86.5,
    'active',
    NOW()
  ),
  (
    'HN-COPAN-001',
    'honduras-copan-catuai',
    'Honduras Copán Catuai',
    'From the renowned Copán region, this catuai offers a complex cup with fruit-forward notes and wine-like characteristics.',
    'Finca San Rafael',
    'Copán Ruinas',
    1200, 1500,
    'Catuai',
    'honey',
    'light-medium',
    '{"primary": ["red fruit", "honey"], "secondary": ["wine", "floral"], "finish": ["juicy", "bright"]}'::jsonb,
    87.0,
    'active',
    NOW()
  )
) AS v(sku, slug, name, description, origin_farm, origin_municipality, altitude_min, altitude_max, variety, processing_method, roast_level, tasting_notes, cupping_score, status, published_at)
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE products.sku = v.sku
);

-- Insert variants for the products if they don't exist
INSERT INTO product_variants (product_id, sku, format, grind_type, weight, price_cents, stock_quantity)
SELECT
  p.id,
  p.slug || '-' || v.format || '-' || COALESCE(v.grind, 'whole') || '-' || v.weight,
  v.format,
  v.grind,
  v.weight,
  CASE
    WHEN v.weight = 250 THEN 1200
    WHEN v.weight = 500 THEN 2200
    WHEN v.weight = 1000 THEN 4000
  END,
  100 -- Initial stock
FROM products p
CROSS JOIN (
  VALUES
    ('whole_bean', NULL),
    ('ground', 'espresso'),
    ('ground', 'filter'),
    ('ground', 'french_press')
) AS v(format, grind)
CROSS JOIN (VALUES (250), (500), (1000)) AS weights(weight)
WHERE p.sku IN ('HN-MARCALA-001', 'HN-COPAN-001')
AND NOT EXISTS (
  SELECT 1 FROM product_variants pv
  WHERE pv.product_id = p.id
  AND pv.format = v.format
  AND pv.weight = weights.weight
  AND (pv.grind_type = v.grind OR (pv.grind_type IS NULL AND v.grind IS NULL))
);

-- Success message
SELECT 'Honduras Coffee database schema successfully applied!' as result;