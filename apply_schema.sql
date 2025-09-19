-- Honduras Coffee Complete Database Schema
-- This script can be run directly in Supabase SQL Editor

BEGIN;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables in correct order (if they exist)
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS stock_alerts CASCADE;
DROP TABLE IF EXISTS inventory_logs CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS subscription_items CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Only drop profiles if it doesn't have the fields we need
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'stripe_customer_id'
    ) THEN
        DROP TABLE IF EXISTS profiles CASCADE;
    END IF;
END $$;

-- Create updated_at function for triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CATEGORIES
-- ============================================================================

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

-- ============================================================================
-- PRODUCTS
-- ============================================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Honduras Origin Specifics
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

    -- Stripe Integration
    stripe_product_id VARCHAR(255) UNIQUE,

    CONSTRAINT valid_altitude CHECK (altitude_max >= altitude_min),
    CONSTRAINT valid_status CHECK (status IN ('active', 'out_of_stock', 'discontinued', 'coming_soon'))
);

-- Product variants
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

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

    -- Stripe Integration
    stripe_price_id VARCHAR(255) UNIQUE,

    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_grind CHECK (
        (format = 'whole_bean' AND grind_type IS NULL) OR
        (format = 'ground' AND grind_type IS NOT NULL)
    )
);

-- Product images
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

-- Product categories junction
CREATE TABLE product_categories (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- ============================================================================
-- USER PROFILES (Enhanced)
-- ============================================================================

-- Create or enhance profiles table
CREATE TABLE IF NOT EXISTS profiles (
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
    total_spent_cents INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    last_order_at TIMESTAMPTZ,
    stripe_customer_id VARCHAR(255) UNIQUE,
    is_admin BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to existing profiles table
DO $$
BEGIN
    -- Add stripe_customer_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE profiles ADD COLUMN stripe_customer_id VARCHAR(255) UNIQUE;
    END IF;

    -- Add total_spent_cents if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_spent_cents') THEN
        ALTER TABLE profiles ADD COLUMN total_spent_cents INTEGER DEFAULT 0;
    END IF;

    -- Add order_count if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'order_count') THEN
        ALTER TABLE profiles ADD COLUMN order_count INTEGER DEFAULT 0;
    END IF;

    -- Add coffee preferences if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferred_grind') THEN
        ALTER TABLE profiles ADD COLUMN preferred_grind VARCHAR(30);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferred_weight') THEN
        ALTER TABLE profiles ADD COLUMN preferred_weight INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'brewing_methods') THEN
        ALTER TABLE profiles ADD COLUMN brewing_methods TEXT[];
    END IF;

    -- Add marketing fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'newsletter_subscribed') THEN
        ALTER TABLE profiles ADD COLUMN newsletter_subscribed BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'marketing_consent') THEN
        ALTER TABLE profiles ADD COLUMN marketing_consent BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_order_at') THEN
        ALTER TABLE profiles ADD COLUMN last_order_at TIMESTAMPTZ;
    END IF;
END $$;

-- Addresses
CREATE TABLE addresses (
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
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT one_default_per_type UNIQUE (user_id, type, is_default) WHERE is_default = true,
    CONSTRAINT valid_type CHECK (type IN ('shipping', 'billing'))
);

-- ============================================================================
-- ORDERS
-- ============================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL,

    user_id UUID REFERENCES profiles(id),
    email VARCHAR(255) NOT NULL,

    status VARCHAR(30) DEFAULT 'pending',

    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,

    -- Financials (in cents)
    subtotal_cents INTEGER NOT NULL,
    shipping_cents INTEGER DEFAULT 0,
    tax_cents INTEGER DEFAULT 0,
    discount_cents INTEGER DEFAULT 0,
    total_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',

    -- Shipping
    shipping_method VARCHAR(50),
    shipping_tracking_number VARCHAR(255),
    shipping_tracking_url TEXT,
    shipping_carrier VARCHAR(50),
    estimated_delivery_date DATE,

    -- Payment
    payment_method VARCHAR(30),
    payment_status VARCHAR(30) DEFAULT 'unpaid',

    -- Stripe Integration
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),

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
    refunded_at TIMESTAMPTZ,

    CONSTRAINT valid_order_status CHECK (status IN (
        'pending', 'payment_processing', 'payment_failed', 'confirmed',
        'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    )),
    CONSTRAINT valid_payment_status CHECK (payment_status IN (
        'unpaid', 'paid', 'refunded', 'partial_refund'
    ))
);

-- Order items
CREATE TABLE order_items (
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

-- ============================================================================
-- SUBSCRIPTIONS
-- ============================================================================

CREATE TABLE subscriptions (
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
    expires_at TIMESTAMPTZ,

    CONSTRAINT valid_subscription_status CHECK (status IN (
        'active', 'paused', 'cancelled', 'expired', 'trialing'
    )),
    CONSTRAINT valid_frequency CHECK (frequency IN (
        'weekly', 'biweekly', 'monthly'
    )),
    CONSTRAINT valid_subscription_type CHECK (subscription_type IN (
        'single', 'variety', 'curated'
    ))
);

-- Subscription items
CREATE TABLE subscription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    product_variant_id UUID NOT NULL REFERENCES product_variants(id),

    quantity INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    position INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add subscription foreign key to orders
ALTER TABLE orders ADD CONSTRAINT fk_orders_subscription
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);

-- ============================================================================
-- PAYMENTS & TRANSACTIONS
-- ============================================================================

CREATE TABLE payment_transactions (
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

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_transaction_type CHECK (type IN (
        'payment', 'refund', 'partial_refund'
    )),
    CONSTRAINT valid_transaction_status CHECK (status IN (
        'pending', 'succeeded', 'failed'
    ))
);

-- ============================================================================
-- INVENTORY MANAGEMENT
-- ============================================================================

CREATE TABLE inventory_logs (
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

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_adjustment_type CHECK (adjustment_type IN (
        'restock', 'sale', 'return', 'damage', 'loss', 'correction'
    ))
);

CREATE TABLE stock_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_variant_id UUID NOT NULL REFERENCES product_variants(id),

    alert_type VARCHAR(30) NOT NULL,
    threshold INTEGER,
    current_stock INTEGER,

    notified BOOLEAN DEFAULT false,
    notified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_alert_type CHECK (alert_type IN (
        'low_stock', 'out_of_stock', 'back_in_stock'
    ))
);

-- ============================================================================
-- DISCOUNTS
-- ============================================================================

CREATE TABLE discounts (
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
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_discount_type CHECK (discount_type IN (
        'percentage', 'fixed_amount'
    ))
);

-- ============================================================================
-- ANALYTICS
-- ============================================================================

CREATE TABLE analytics_events (
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

COMMIT;

-- Now insert the seed data in a separate transaction
BEGIN;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Categories
INSERT INTO categories (slug, name, description, active, position) VALUES
    ('single-origin', 'Single Origin', 'Pure coffee from a single farm or region in Honduras', true, 1),
    ('estate-reserve', 'Estate Reserve', 'Premium single-estate coffees from our partner farms', true, 2),
    ('mountain-select', 'Mountain Select', 'High-altitude beans from 1400m+ elevations', true, 3),
    ('seasonal-harvest', 'Seasonal Harvest', 'Limited edition beans from the latest harvest', true, 4),
    ('subscription-eligible', 'Subscription Eligible', 'Available for monthly coffee subscriptions', true, 5),
    ('washed-process', 'Washed Process', 'Clean, bright coffees with washed processing', true, 6),
    ('honey-process', 'Honey Process', 'Sweet, complex coffees with honey processing', true, 7),
    ('natural-process', 'Natural Process', 'Fruity, wine-like coffees with natural processing', true, 8);

-- Products
INSERT INTO products (
    sku, slug, name, description, origin_farm, origin_municipality,
    altitude_min, altitude_max, variety, processing_method, roast_level,
    tasting_notes, cupping_score, acidity, body, sweetness,
    story, brewing_methods, featured, status, published_at
) VALUES
(
    'HND-MAR-BOU-001',
    'honduras-marcala-bourbon',
    'Honduras Marcala Bourbon',
    'An exceptional bourbon variety from the high mountains of Marcala, featuring notes of chocolate and caramel with a bright, crisp acidity.',
    'Finca La Esperanza',
    'Marcala, La Paz',
    1400, 1600,
    'Bourbon',
    'washed',
    'medium',
    '{"primary": ["chocolate", "caramel"], "secondary": ["orange", "brown sugar"], "finish": ["clean", "sweet"]}',
    86.5,
    7, 8, 9,
    'Finca La Esperanza has been in the Morales family for three generations.',
    ARRAY['espresso', 'filter', 'french-press', 'chemex'],
    true,
    'active',
    NOW()
),
(
    'HND-COP-CAT-001',
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
    87.0,
    8, 7, 8,
    'The San Rafael farm sits in the shadow of ancient Mayan ruins in Copán.',
    ARRAY['filter', 'pour-over', 'aeropress', 'chemex'],
    true,
    'active',
    NOW()
);

-- Create variants for all products
DO $$
DECLARE
    product_record RECORD;
    format_record RECORD;
    weight_record RECORD;
    price_base INTEGER;
BEGIN
    FOR product_record IN SELECT id, slug FROM products LOOP
        FOR format_record IN
            VALUES
                ('whole_bean', NULL::TEXT),
                ('ground', 'espresso'),
                ('ground', 'filter'),
                ('ground', 'french_press')
        LOOP
            FOR weight_record IN VALUES (250), (500), (1000) LOOP
                price_base := CASE
                    WHEN weight_record.column1 = 250 THEN 1200
                    WHEN weight_record.column1 = 500 THEN 2200
                    WHEN weight_record.column1 = 1000 THEN 4000
                END;

                INSERT INTO product_variants (
                    product_id,
                    sku,
                    format,
                    grind_type,
                    weight,
                    price_cents,
                    stock_quantity,
                    active
                ) VALUES (
                    product_record.id,
                    product_record.slug || '-' ||
                    format_record.column1 || '-' ||
                    COALESCE(format_record.column2, 'whole') || '-' ||
                    weight_record.column1 || 'g',
                    format_record.column1,
                    format_record.column2,
                    weight_record.column1,
                    price_base,
                    50,
                    true
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- Assign product categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id
FROM products p, categories c
WHERE
    c.slug IN ('single-origin', 'subscription-eligible')
    OR
    (p.processing_method = 'washed' AND c.slug = 'washed-process')
    OR
    (p.processing_method = 'honey' AND c.slug = 'honey-process')
    OR
    (p.altitude_min >= 1400 AND c.slug = 'mountain-select')
    OR
    (p.featured = true AND c.slug = 'estate-reserve');

-- Add placeholder images
INSERT INTO product_images (product_id, url, alt_text, position, is_primary)
SELECT
    p.id,
    'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=800&h=600&fit=crop',
    p.name || ' - Premium Honduran Coffee',
    0,
    true
FROM products p;

-- Sample discounts
INSERT INTO discounts (
    code, description, discount_type, discount_value,
    minimum_order_cents, usage_limit_per_customer,
    valid_from, valid_until, active
) VALUES
(
    'WELCOME10',
    'Welcome discount - 10% off first order',
    'percentage',
    10,
    2000,
    1,
    NOW(),
    NOW() + INTERVAL '6 months',
    true
),
(
    'FREESHIP',
    'Free shipping on orders over €35',
    'fixed_amount',
    495,
    3500,
    NULL,
    NOW(),
    NOW() + INTERVAL '1 year',
    true
);

COMMIT;