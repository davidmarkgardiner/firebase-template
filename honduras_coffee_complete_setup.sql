-- Honduras Coffee - Complete Database Setup
-- Run this script in Supabase SQL Editor to set up the complete database schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================
-- 1. CORE TABLES (Profiles, Addresses)
-- ===========================

-- User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),

  -- Preferences
  preferred_grind VARCHAR(30),
  preferred_weight INTEGER,
  brewing_methods TEXT[],

  -- Marketing
  newsletter_subscribed BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_order_at TIMESTAMPTZ,
  total_spent_cents INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,

  -- Admin
  is_admin BOOLEAN DEFAULT false,
  notes TEXT
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Address Type
  type VARCHAR(20) DEFAULT 'shipping',
  is_default BOOLEAN DEFAULT false,

  -- Address Fields
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country_code VARCHAR(2) NOT NULL,

  -- Contact
  phone VARCHAR(50),

  -- VAT for EU
  vat_number VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT one_default_per_type UNIQUE (user_id, type, is_default) WHERE is_default = true
);

-- ===========================
-- 2. PRODUCT CATALOG
-- ===========================

-- Categories Table
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

-- Products Table (Honduras Coffee Specific)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Honduras Origin Fields
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

  CONSTRAINT valid_altitude CHECK (altitude_max >= altitude_min)
);

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  -- Variant Specifics
  sku VARCHAR(100) UNIQUE NOT NULL,
  format VARCHAR(20) NOT NULL CHECK (format IN ('whole_bean', 'ground')),
  grind_type VARCHAR(30),
  weight INTEGER NOT NULL,

  -- Pricing (in cents)
  price_cents INTEGER NOT NULL,
  compare_at_price_cents INTEGER,

  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  allow_backorder BOOLEAN DEFAULT false,
  track_inventory BOOLEAN DEFAULT true,

  -- Status
  active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_grind CHECK (
    (format = 'whole_bean' AND grind_type IS NULL) OR
    (format = 'ground' AND grind_type IS NOT NULL)
  )
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Categories Junction Table
CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,

  PRIMARY KEY (product_id, category_id)
);

-- ===========================
-- 3. ORDERS AND SUBSCRIPTIONS
-- ===========================

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE,

  -- Customer Info
  user_id UUID REFERENCES profiles(id),
  email VARCHAR(255) NOT NULL,

  -- Order Status
  status VARCHAR(30) DEFAULT 'pending',

  -- Addresses (JSONB to preserve history)
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,

  -- Financials (in cents)
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
  payment_method VARCHAR(30),
  payment_status VARCHAR(30) DEFAULT 'unpaid',

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
  subscription_id UUID,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),

  -- Product snapshot
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  variant_details JSONB,

  -- Quantities & Pricing
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,

  -- Discounts
  discount_cents INTEGER DEFAULT 0,
  discount_reason VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),

  -- Subscription Details
  status VARCHAR(30) DEFAULT 'active',
  frequency VARCHAR(20) NOT NULL,
  subscription_type VARCHAR(30) DEFAULT 'single',

  -- Stripe
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),

  -- Scheduling
  next_delivery_date DATE,
  last_delivery_date DATE,

  -- Delivery Address
  delivery_address JSONB,

  -- Pricing
  discount_percentage INTEGER DEFAULT 0,

  -- Management
  pause_start_date DATE,
  pause_end_date DATE,
  cancellation_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Subscription Items Table
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

-- ===========================
-- 4. INVENTORY & PAYMENTS
-- ===========================

-- Inventory Logs Table
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

-- Stock Alerts Table
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

-- Payment Transactions Table
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

-- Discounts Table
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

-- Analytics Events Table
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

-- ===========================
-- 5. ADD FOREIGN KEY CONSTRAINTS
-- ===========================

-- Add subscription foreign key to orders
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_subscription;
ALTER TABLE orders ADD CONSTRAINT fk_orders_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);

-- ===========================
-- 6. CREATE INDEXES
-- ===========================

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_origin_farm ON products(origin_farm);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_active ON product_variants(active);

CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant ON order_items(product_variant_id);

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);

CREATE INDEX IF NOT EXISTS idx_sub_items_subscription ON subscription_items(subscription_id);

-- Inventory indexes
CREATE INDEX IF NOT EXISTS idx_inventory_logs_variant ON inventory_logs(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created ON inventory_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_stock_alerts_variant ON stock_alerts(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_notified ON stock_alerts(notified);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_transactions_order ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_subscription ON payment_transactions(subscription_id);

CREATE INDEX IF NOT EXISTS idx_discounts_code ON discounts(code);
CREATE INDEX IF NOT EXISTS idx_discounts_active ON discounts(active);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);

-- ===========================
-- 7. CREATE TRIGGERS
-- ===========================

-- Updated at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_variants_updated_at ON product_variants;
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_items_updated_at ON subscription_items;
CREATE TRIGGER update_subscription_items_updated_at BEFORE UPDATE ON subscription_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_discounts_updated_at ON discounts;
CREATE TRIGGER update_discounts_updated_at BEFORE UPDATE ON discounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================
-- 8. BUSINESS LOGIC FUNCTIONS
-- ===========================

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  current_year INTEGER;
  order_count INTEGER;
BEGIN
  IF NEW.order_number IS NULL THEN
    current_year := EXTRACT(YEAR FROM NOW());

    SELECT COUNT(*) + 1 INTO order_count
    FROM orders
    WHERE EXTRACT(YEAR FROM created_at) = current_year;

    NEW.order_number := 'HC-' || current_year || '-' || LPAD(order_count::TEXT, 4, '0');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS generate_order_number_trigger ON orders;
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Function to check low stock
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_quantity <= NEW.low_stock_threshold THEN
    INSERT INTO stock_alerts (
      product_variant_id,
      alert_type,
      threshold,
      current_stock
    ) VALUES (
      NEW.id,
      CASE WHEN NEW.stock_quantity = 0 THEN 'out_of_stock' ELSE 'low_stock' END,
      NEW.low_stock_threshold,
      NEW.stock_quantity
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_low_stock_trigger ON product_variants;
CREATE TRIGGER check_low_stock_trigger AFTER UPDATE OF stock_quantity ON product_variants FOR EACH ROW EXECUTE FUNCTION check_low_stock();

-- ===========================
-- 9. SEED DATA
-- ===========================

-- Insert seed categories
INSERT INTO categories (slug, name, description) VALUES
  ('single-origin', 'Single Origin', 'Pure coffee from a single farm or region'),
  ('limited-edition', 'Limited Edition', 'Rare and seasonal offerings'),
  ('subscription-eligible', 'Subscription Eligible', 'Available for subscription'),
  ('new-harvest', 'New Harvest', 'Fresh from the latest harvest')
ON CONFLICT (slug) DO NOTHING;

-- Insert Honduras coffee products
INSERT INTO products (
  sku, slug, name, description, origin_farm, origin_municipality,
  altitude_min, altitude_max, variety, processing_method, roast_level,
  harvest_year, harvest_month, tasting_notes, cupping_score, acidity, body, sweetness,
  story, brewing_methods, status, featured, published_at,
  meta_title, meta_description
) VALUES
(
  'HON-MAR-BOU-001',
  'honduras-marcala-bourbon',
  'Honduras Marcala Bourbon',
  'An exceptional bourbon variety from the high mountains of Marcala, featuring notes of chocolate and caramel with a bright acidity.',
  'Finca La Esperanza',
  'Marcala, La Paz',
  1400, 1600,
  'Bourbon',
  'washed',
  'medium',
  2024,
  'December-February',
  '{"primary": ["chocolate", "caramel"], "secondary": ["orange", "brown sugar"], "finish": ["clean", "sweet"]}',
  86.5, 7, 8, 8,
  'Finca La Esperanza has been in the Hernández family for three generations. Located in the mountains of Marcala, this farm produces some of Honduras''s finest bourbon variety coffee.',
  ARRAY['espresso', 'filter', 'french-press'],
  'active',
  true,
  NOW(),
  'Honduras Marcala Bourbon - Premium Single Origin Coffee',
  'Exceptional bourbon variety coffee from Finca La Esperanza in Marcala, Honduras. Notes of chocolate and caramel with bright acidity.'
),
(
  'HON-COP-CAT-001',
  'honduras-copan-catuai',
  'Honduras Copán Catuai',
  'From the renowned Copán region, this catuai offers a complex cup with fruit-forward notes and wine-like characteristics.',
  'Finca San Rafael',
  'Copán Ruinas',
  1200, 1500,
  'Catuai',
  'honey',
  'light-medium',
  2024,
  'January-March',
  '{"primary": ["red fruit", "honey"], "secondary": ["wine", "floral"], "finish": ["juicy", "bright"]}',
  87.0, 8, 6, 9,
  'The García family has been cultivating coffee at Finca San Rafael for over 40 years. Their honey processing method brings out the natural sweetness of the catuai variety.',
  ARRAY['filter', 'pour-over', 'aeropress'],
  'active',
  true,
  NOW(),
  'Honduras Copán Catuai - Honey Process Single Origin',
  'Complex honey-processed catuai from Copán region with fruit-forward notes and wine-like characteristics.'
)
ON CONFLICT (sku) DO NOTHING;

-- Insert product variants
INSERT INTO product_variants (product_id, sku, format, grind_type, weight, price_cents, stock_quantity, low_stock_threshold)
SELECT
  p.id,
  p.sku || '-' || format || '-' || COALESCE(grind, 'whole') || '-' || weight,
  format,
  grind,
  weight,
  CASE
    WHEN weight = 250 THEN CASE WHEN p.sku = 'HON-MAR-BOU-001' THEN 1400 ELSE 1600 END
    WHEN weight = 500 THEN CASE WHEN p.sku = 'HON-MAR-BOU-001' THEN 2600 ELSE 3000 END
    WHEN weight = 1000 THEN CASE WHEN p.sku = 'HON-MAR-BOU-001' THEN 4800 ELSE 5500 END
  END,
  CASE
    WHEN weight = 250 THEN 50
    WHEN weight = 500 THEN 30
    WHEN weight = 1000 THEN 20
  END,
  5
FROM products p
CROSS JOIN (
  VALUES
    ('whole_bean', NULL),
    ('ground', 'espresso'),
    ('ground', 'filter'),
    ('ground', 'french_press')
) AS formats(format, grind)
CROSS JOIN (VALUES (250), (500), (1000)) AS weights(weight)
WHERE p.slug IN ('honduras-marcala-bourbon', 'honduras-copan-catuai')
ON CONFLICT (sku) DO NOTHING;

-- Associate products with categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id
FROM products p
CROSS JOIN categories c
WHERE
  (p.slug IN ('honduras-marcala-bourbon', 'honduras-copan-catuai') AND c.slug = 'single-origin') OR
  (p.slug IN ('honduras-marcala-bourbon', 'honduras-copan-catuai') AND c.slug = 'subscription-eligible') OR
  (p.harvest_year = 2024 AND c.slug = 'new-harvest')
ON CONFLICT (product_id, category_id) DO NOTHING;

-- Insert sample discount codes
INSERT INTO discounts (code, description, discount_type, discount_value, minimum_order_cents, usage_limit, usage_limit_per_customer, valid_until)
VALUES
  ('WELCOME10', 'Welcome 10% discount for new customers', 'percentage', 10, 2000, 100, 1, NOW() + INTERVAL '30 days'),
  ('HONDURAS20', '20% off Honduras single origins', 'percentage', 20, 3000, 50, 2, NOW() + INTERVAL '14 days'),
  ('FREESHIP', 'Free shipping on orders over €50', 'fixed_amount', 500, 5000, NULL, 1, NOW() + INTERVAL '60 days')
ON CONFLICT (code) DO NOTHING;

-- Success message
SELECT 'Honduras Coffee Database Setup Complete! 🇭🇳 ☕' as result;