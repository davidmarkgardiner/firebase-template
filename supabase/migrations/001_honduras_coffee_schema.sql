-- Honduras Coffee E-commerce Database Schema
-- Complete schema for specialty coffee business with subscriptions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at function for triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PRODUCTS & CATALOG
-- ============================================================================

-- Categories for product organization
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

-- Products table with Honduras-specific fields
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

-- Product variants for different sizes and grinds
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    sku VARCHAR(100) UNIQUE NOT NULL,
    format VARCHAR(20) NOT NULL CHECK (format IN ('whole_bean', 'ground')),
    grind_type VARCHAR(30),
    weight INTEGER NOT NULL, -- in grams

    -- Pricing (in cents to avoid decimal issues)
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

-- Product categories junction table
CREATE TABLE product_categories (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- ============================================================================
-- USERS & PROFILES
-- ============================================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic Info
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),

    -- Coffee Preferences
    preferred_grind VARCHAR(30),
    preferred_weight INTEGER,
    brewing_methods TEXT[],

    -- Marketing
    newsletter_subscribed BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,

    -- Customer Data
    total_spent_cents INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    last_order_at TIMESTAMPTZ,

    -- Stripe Integration
    stripe_customer_id VARCHAR(255) UNIQUE,

    -- Admin
    is_admin BOOLEAN DEFAULT false,
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer addresses
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

    -- EU VAT
    vat_number VARCHAR(50),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT one_default_per_type UNIQUE (user_id, type, is_default) WHERE is_default = true,
    CONSTRAINT valid_type CHECK (type IN ('shipping', 'billing'))
);

-- ============================================================================
-- ORDERS & PAYMENTS
-- ============================================================================

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL,

    -- Customer Info
    user_id UUID REFERENCES profiles(id),
    email VARCHAR(255) NOT NULL,

    -- Order Status
    status VARCHAR(30) DEFAULT 'pending',

    -- Addresses (stored as JSONB to preserve history)
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
    subscription_id UUID, -- Will reference subscriptions table

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

-- ============================================================================
-- SUBSCRIPTIONS
-- ============================================================================

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),

    status VARCHAR(30) DEFAULT 'active',
    frequency VARCHAR(20) NOT NULL,
    subscription_type VARCHAR(30) DEFAULT 'single',

    -- Stripe Integration
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

-- Add foreign key for orders.subscription_id
ALTER TABLE orders ADD CONSTRAINT fk_orders_subscription
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);

-- ============================================================================
-- PAYMENT TRANSACTIONS
-- ============================================================================

-- Payment transactions
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

    -- Stripe References
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

-- Inventory logs
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

-- Stock alerts
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
-- DISCOUNTS & PROMOTIONS
-- ============================================================================

-- Discounts table
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

-- Analytics events
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

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_origin_farm ON products(origin_farm);
CREATE INDEX idx_products_stripe_product_id ON products(stripe_product_id);

-- Product Variants
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_active ON product_variants(active);
CREATE INDEX idx_variants_stripe_price_id ON product_variants(stripe_price_id);

-- Product Images
CREATE INDEX idx_images_product ON product_images(product_id);

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Addresses
CREATE INDEX idx_addresses_user ON addresses(user_id);

-- Orders
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);

-- Order Items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(product_variant_id);

-- Subscriptions
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- Subscription Items
CREATE INDEX idx_sub_items_subscription ON subscription_items(subscription_id);

-- Payment Transactions
CREATE INDEX idx_transactions_order ON payment_transactions(order_id);
CREATE INDEX idx_transactions_subscription ON payment_transactions(subscription_id);
CREATE INDEX idx_transactions_stripe_payment_intent ON payment_transactions(stripe_payment_intent_id);

-- Inventory Logs
CREATE INDEX idx_inventory_logs_variant ON inventory_logs(product_variant_id);
CREATE INDEX idx_inventory_logs_created ON inventory_logs(created_at DESC);

-- Stock Alerts
CREATE INDEX idx_stock_alerts_variant ON stock_alerts(product_variant_id);
CREATE INDEX idx_stock_alerts_notified ON stock_alerts(notified);

-- Discounts
CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_active ON discounts(active);

-- Analytics Events
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Updated at triggers
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_items_updated_at
    BEFORE UPDATE ON subscription_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at
    BEFORE UPDATE ON discounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();