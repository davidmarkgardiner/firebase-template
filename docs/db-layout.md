# Honduras Coffee - Database Schema Layout

## 🗄️ Complete Supabase Database Structure

### Database Overview
```sql
-- Honduras Coffee Database
-- Specialty coffee from Honduran mountains
-- Family-sourced, rare high-altitude beans
-- EU shipping, subscription support
```

## 📊 Core Tables

### 1. Products Table
```sql
CREATE TABLE products (
  -- Primary Fields
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Honduras Origin Specific Fields
  origin_farm VARCHAR(255) NOT NULL, -- e.g., "Finca La Esperanza"
  origin_region VARCHAR(255) DEFAULT 'Honduras',
  origin_municipality VARCHAR(255), -- e.g., "Marcala, La Paz"
  altitude_min INTEGER, -- meters, e.g., 1400
  altitude_max INTEGER, -- meters, e.g., 1700
  
  -- Coffee Characteristics
  variety VARCHAR(100), -- e.g., "Bourbon", "Catuai", "Pacas"
  processing_method VARCHAR(50), -- "washed", "natural", "honey"
  roast_level VARCHAR(20), -- "light", "medium", "medium-dark", "dark"
  roast_date DATE,
  harvest_year INTEGER,
  harvest_month VARCHAR(20), -- e.g., "December-February"
  
  -- Tasting Profile (JSONB for flexibility)
  tasting_notes JSONB, -- {"primary": ["chocolate", "caramel"], "secondary": ["nuts", "vanilla"]}
  cupping_score DECIMAL(3,1), -- SCA score, e.g., 86.5
  acidity INTEGER CHECK (acidity >= 1 AND acidity <= 10),
  body INTEGER CHECK (body >= 1 AND body <= 10),
  sweetness INTEGER CHECK (sweetness >= 1 AND sweetness <= 10),
  
  -- Story & Marketing
  story TEXT, -- Family story, farm history
  brewing_methods TEXT[], -- ['espresso', 'filter', 'french-press']
  
  -- Product Management
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'out_of_stock', 'discontinued', 'coming_soon'
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

-- Indexes for performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_origin_farm ON products(origin_farm);
```

### 2. Product Variants Table
```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Variant Specifics
  sku VARCHAR(100) UNIQUE NOT NULL,
  format VARCHAR(20) NOT NULL CHECK (format IN ('whole_bean', 'ground')),
  grind_type VARCHAR(30), -- NULL for whole_bean, or 'espresso', 'filter', 'french_press', 'moka_pot'
  weight INTEGER NOT NULL, -- in grams: 250, 500, 1000
  
  -- Pricing (in cents to avoid decimal issues)
  price_cents INTEGER NOT NULL,
  compare_at_price_cents INTEGER, -- for showing discounts
  
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

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_active ON product_variants(active);
```

### 3. Product Images Table
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT one_primary_per_product UNIQUE (product_id, is_primary) WHERE is_primary = true
);

CREATE INDEX idx_images_product ON product_images(product_id);
```

### 4. Categories Table
```sql
CREATE TABLE categories (
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

-- Junction table for products-categories (many-to-many)
CREATE TABLE product_categories (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  
  PRIMARY KEY (product_id, category_id)
);

-- Seed categories
INSERT INTO categories (slug, name, description) VALUES
  ('single-origin', 'Single Origin', 'Pure coffee from a single farm or region'),
  ('limited-edition', 'Limited Edition', 'Rare and seasonal offerings'),
  ('subscription-eligible', 'Subscription Eligible', 'Available for subscription'),
  ('new-harvest', 'New Harvest', 'Fresh from the latest harvest');
```

## 👤 User & Authentication Tables

### 5. User Profiles Table
```sql
CREATE TABLE profiles (
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
  notes TEXT -- Internal notes
);

CREATE INDEX idx_profiles_email ON profiles(email);
```

### 6. Addresses Table
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Address Type
  type VARCHAR(20) DEFAULT 'shipping', -- 'shipping', 'billing'
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
  country_code VARCHAR(2) NOT NULL, -- ISO country codes
  
  -- Contact
  phone VARCHAR(50),
  
  -- VAT for EU
  vat_number VARCHAR(50),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT one_default_per_type UNIQUE (user_id, type, is_default) WHERE is_default = true
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
```

## 🛒 Order Management Tables

### 7. Orders Table
```sql
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
  subscription_id UUID REFERENCES subscriptions(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### 8. Order Items Table
```sql
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
```

## 🔄 Subscription Tables

### 9. Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Subscription Details
  status VARCHAR(30) DEFAULT 'active',
  -- Values: 'active', 'paused', 'cancelled', 'expired', 'trialing'
  
  frequency VARCHAR(20) NOT NULL, -- 'weekly', 'biweekly', 'monthly'
  
  -- Product Selection
  subscription_type VARCHAR(30) DEFAULT 'single', -- 'single', 'variety', 'curated'
  
  -- Stripe
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  
  -- Scheduling
  next_delivery_date DATE,
  last_delivery_date DATE,
  
  -- Delivery Address (can be different from profile)
  delivery_address JSONB,
  
  -- Pricing
  discount_percentage INTEGER DEFAULT 0, -- e.g., 10 for 10%
  
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

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);
```

### 10. Subscription Items Table
```sql
CREATE TABLE subscription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),
  
  quantity INTEGER DEFAULT 1,
  
  -- For variety subscriptions
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sub_items_subscription ON subscription_items(subscription_id);
```

## 📦 Inventory Tables

### 11. Inventory Logs Table
```sql
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),
  
  -- Change Details
  adjustment_type VARCHAR(30) NOT NULL,
  -- Values: 'restock', 'sale', 'return', 'damage', 'loss', 'correction'
  
  quantity_change INTEGER NOT NULL, -- positive or negative
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  
  -- Reference
  reference_type VARCHAR(30), -- 'order', 'return', 'manual'
  reference_id UUID, -- order_id or return_id
  
  -- Who & Why
  adjusted_by UUID REFERENCES profiles(id),
  reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_logs_variant ON inventory_logs(product_variant_id);
CREATE INDEX idx_inventory_logs_created ON inventory_logs(created_at DESC);
```

### 12. Stock Alerts Table
```sql
CREATE TABLE stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),
  
  alert_type VARCHAR(30) NOT NULL, -- 'low_stock', 'out_of_stock', 'back_in_stock'
  threshold INTEGER,
  current_stock INTEGER,
  
  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_alerts_variant ON stock_alerts(product_variant_id);
CREATE INDEX idx_stock_alerts_notified ON stock_alerts(notified);
```

## 💰 Payment & Financial Tables

### 13. Payment Transactions Table
```sql
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  subscription_id UUID REFERENCES subscriptions(id),
  
  -- Transaction Details
  type VARCHAR(30) NOT NULL, -- 'payment', 'refund', 'partial_refund'
  status VARCHAR(30) NOT NULL, -- 'pending', 'succeeded', 'failed'
  
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Payment Method
  payment_method VARCHAR(30),
  last_four_digits VARCHAR(4),
  
  -- Stripe References
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  stripe_refund_id VARCHAR(255),
  
  -- Fees
  processing_fee_cents INTEGER,
  
  -- Metadata
  metadata JSONB,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_order ON payment_transactions(order_id);
CREATE INDEX idx_transactions_subscription ON payment_transactions(subscription_id);
```

### 14. Discounts Table
```sql
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  
  -- Discount Type
  discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value INTEGER NOT NULL, -- percentage (10 = 10%) or cents
  
  -- Conditions
  minimum_order_cents INTEGER,
  applicable_products UUID[], -- array of product_ids
  applicable_categories UUID[], -- array of category_ids
  
  -- Usage Limits
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  usage_limit_per_customer INTEGER DEFAULT 1,
  
  -- Valid Period
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_active ON discounts(active);
```

## 📊 Analytics Tables

### 15. Analytics Events Table
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event Info
  event_type VARCHAR(50) NOT NULL,
  -- Values: 'page_view', 'product_view', 'add_to_cart', 'checkout_started', 
  -- 'purchase', 'subscription_started', etc.
  
  -- User Info
  user_id UUID REFERENCES profiles(id),
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  
  -- Context
  page_url TEXT,
  referrer_url TEXT,
  
  -- Event Data
  product_id UUID REFERENCES products(id),
  order_id UUID REFERENCES orders(id),
  subscription_id UUID REFERENCES subscriptions(id),
  
  -- Additional Data
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
```

## 🔒 Row Level Security Policies

### Public Access (No Auth Required)
```sql
-- Anyone can view active products
CREATE POLICY "Public can view active products" ON products
  FOR SELECT
  USING (status = 'active' AND published_at IS NOT NULL);

-- Anyone can view product variants of active products
CREATE POLICY "Public can view product variants" ON product_variants
  FOR SELECT
  USING (
    active = true AND 
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_variants.product_id 
      AND products.status = 'active'
    )
  );

-- Anyone can view categories
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT
  USING (active = true);
```

### Authenticated Users
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses" ON addresses
  FOR ALL
  USING (auth.uid() = user_id);

-- Users can manage their own subscriptions
CREATE POLICY "Users can manage own subscriptions" ON subscriptions
  FOR ALL
  USING (auth.uid() = user_id);
```

### Admin Access
```sql
-- Admins can do everything
CREATE POLICY "Admins have full access" ON products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Apply similar admin policies to all tables
```

## 🎯 Database Functions & Triggers

### Auto-update Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Generate Order Number
```sql
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

CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();
```

### Update Stock on Order
```sql
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- When order is confirmed, reduce stock
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    UPDATE product_variants pv
    SET stock_quantity = stock_quantity - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
    AND pv.id = oi.product_variant_id
    AND pv.track_inventory = true;
    
    -- Log inventory change
    INSERT INTO inventory_logs (
      product_variant_id, 
      adjustment_type, 
      quantity_change,
      quantity_before,
      quantity_after,
      reference_type,
      reference_id
    )
    SELECT 
      oi.product_variant_id,
      'sale',
      -oi.quantity,
      pv.stock_quantity + oi.quantity,
      pv.stock_quantity,
      'order',
      NEW.id
    FROM order_items oi
    JOIN product_variants pv ON pv.id = oi.product_variant_id
    WHERE oi.order_id = NEW.id;
  END IF;
  
  -- When order is cancelled, restore stock
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE product_variants pv
    SET stock_quantity = stock_quantity + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
    AND pv.id = oi.product_variant_id
    AND pv.track_inventory = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_trigger
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_order();
```

### Check Low Stock
```sql
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
      CASE 
        WHEN NEW.stock_quantity = 0 THEN 'out_of_stock'
        ELSE 'low_stock'
      END,
      NEW.low_stock_threshold,
      NEW.stock_quantity
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_low_stock_trigger
  AFTER UPDATE OF stock_quantity ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION check_low_stock();
```

## 📈 Analytics Views

### Revenue Dashboard View
```sql
CREATE VIEW revenue_dashboard AS
SELECT 
  DATE(created_at) as order_date,
  COUNT(*) as order_count,
  SUM(total_cents) / 100.0 as revenue,
  AVG(total_cents) / 100.0 as average_order_value,
  COUNT(DISTINCT user_id) as unique_customers
FROM orders
WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY DATE(created_at);
```

### Best Selling Products View
```sql
CREATE VIEW best_selling_products AS
SELECT 
  p.id,
  p.name,
  p.origin_farm,
  COUNT(DISTINCT oi.order_id) as order_count,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.total_price_cents) / 100.0 as total_revenue
FROM products p
JOIN product_variants pv ON pv.product_id = p.id
JOIN order_items oi ON oi.product_variant_id = pv.id
JOIN orders o ON o.id = oi.order_id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY p.id, p.name, p.origin_farm
ORDER BY total_quantity_sold DESC;
```

### Subscription Metrics View
```sql
CREATE VIEW subscription_metrics AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'active') as active_subscriptions,
  COUNT(*) FILTER (WHERE status = 'paused') as paused_subscriptions,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_subscriptions,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_subscriptions_30d,
  COUNT(*) FILTER (WHERE cancelled_at >= NOW() - INTERVAL '30 days') as cancellations_30d
FROM subscriptions;
```

## 🚀 Initial Seed Data

```sql
-- Insert Honduras-specific sample products
INSERT INTO products (
  slug, name, description, origin_farm, origin_municipality, 
  altitude_min, altitude_max, variety, processing_method, 
  roast_level, tasting_notes, cupping_score
) VALUES 
(
  'honduras-marcala-bourbon',
  'Honduras Marcala Bourbon',
  'A exceptional bourbon variety from the high mountains of Marcala, featuring notes of chocolate and caramel with a bright acidity.',
  'Finca La Esperanza',
  'Marcala, La Paz',
  1400, 1600,
  'Bourbon',
  'washed',
  'medium',
  '{"primary": ["chocolate", "caramel"], "secondary": ["orange", "brown sugar"], "finish": ["clean", "sweet"]}',
  86.5
),
(
  'honduras-copan-catuai',
  'Honduras Copán Catuai',
  'From the renowned Copán region, this catuai offers a complex cup with fruit-forward notes and wine-like characteristics.',
  'Finca San Rafael',
  'Copán Ruinas',
  1200, 1500,
  'Catuai',
  'honey',
  'light-medium',
  '{"primary": ["red fruit", "honey"], "secondary": ["wine", "floral"], "finish": ["juicy", "bright"]}',
  87.0
);

-- Insert variants for each product
INSERT INTO product_variants (product_id, sku, format, grind_type, weight, price_cents)
SELECT 
  p.id,
  p.slug || '-' || format || '-' || COALESCE(grind, 'whole') || '-' || weight,
  format,
  grind,
  weight,
  CASE 
    WHEN weight = 250 THEN 1200
    WHEN weight = 500 THEN 2200
    WHEN weight = 1000 THEN 4000
  END
FROM products p
CROSS JOIN (
  VALUES 
    ('whole_bean', NULL),
    ('ground', 'espresso'),
    ('ground', 'filter'),
    ('ground', 'french_press')
) AS formats(format, grind)
CROSS JOIN (VALUES (250), (500), (1000)) AS weights(weight);
```

## 📝 Migration Order

1. **001_initial_schema.sql** - Auth setup, profiles
2. **002_products.sql** - Products, variants, images, categories
3. **003_orders.sql** - Orders, order items
4. **004_subscriptions.sql** - Subscriptions, subscription items
5. **005_inventory.sql** - Inventory logs, stock alerts
6. **006_payments.sql** - Transactions, discounts
7. **007_analytics.sql** - Events, views
8. **008_functions.sql** - Triggers, functions
9. **009_rls_policies.sql** - Security policies
10. **010_seed_data.sql** - Initial products and categories

## 🔐 Environment Variables for Supabase

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
SUPABASE_JWT_SECRET=[JWT_SECRET]
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
```

## 🎯 Key Features for Honduras Coffee

1. **Origin Tracking** - Detailed farm, altitude, municipality data
2. **Coffee-Specific Fields** - Variety, processing, cupping scores
3. **Flexible Tasting Notes** - JSONB for complex flavor profiles
4. **Honduras Story** - Farm family narrative support
5. **EU Compliance** - VAT handling, EU country support
6. **Subscription Ready** - Full subscription lifecycle
7. **Inventory Management** - Stock tracking with alerts
8. **Analytics Built-in** - Views for business metrics