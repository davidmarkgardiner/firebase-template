-- Row Level Security Policies for Honduras Coffee
-- Secure access to data based on user roles and ownership

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PUBLIC ACCESS POLICIES (No authentication required)
-- ============================================================================

-- Categories - Public can view active categories
CREATE POLICY "Public can view active categories" ON categories
    FOR SELECT
    USING (active = true);

-- Products - Public can view active, published products
CREATE POLICY "Public can view active products" ON products
    FOR SELECT
    USING (
        status = 'active'
        AND published_at IS NOT NULL
        AND published_at <= NOW()
    );

-- Product Variants - Public can view variants of active products
CREATE POLICY "Public can view product variants" ON product_variants
    FOR SELECT
    USING (
        active = true
        AND EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_variants.product_id
            AND products.status = 'active'
            AND products.published_at IS NOT NULL
        )
    );

-- Product Images - Public can view images of active products
CREATE POLICY "Public can view product images" ON product_images
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_images.product_id
            AND products.status = 'active'
            AND products.published_at IS NOT NULL
        )
    );

-- Product Categories - Public can view categories of active products
CREATE POLICY "Public can view product categories" ON product_categories
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_categories.product_id
            AND products.status = 'active'
            AND products.published_at IS NOT NULL
        )
        AND EXISTS (
            SELECT 1 FROM categories
            WHERE categories.id = product_categories.category_id
            AND categories.active = true
        )
    );

-- ============================================================================
-- AUTHENTICATED USER POLICIES
-- ============================================================================

-- Profiles - Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Addresses - Users can manage their own addresses
CREATE POLICY "Users can manage own addresses" ON addresses
    FOR ALL
    USING (auth.uid() = user_id);

-- Orders - Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders" ON orders
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        OR user_id IS NULL -- Allow guest orders
    );

-- Order Items - Users can view items for their own orders
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
        )
    );

-- Users can create order items for their own orders
CREATE POLICY "Users can create order items" ON order_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
        )
    );

-- Subscriptions - Users can manage their own subscriptions
CREATE POLICY "Users can manage own subscriptions" ON subscriptions
    FOR ALL
    USING (auth.uid() = user_id);

-- Subscription Items - Users can manage items for their own subscriptions
CREATE POLICY "Users can manage own subscription items" ON subscription_items
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM subscriptions
            WHERE subscriptions.id = subscription_items.subscription_id
            AND subscriptions.user_id = auth.uid()
        )
    );

-- Payment Transactions - Users can view their own transactions
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
    FOR SELECT
    USING (
        (order_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = payment_transactions.order_id
            AND orders.user_id = auth.uid()
        ))
        OR
        (subscription_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM subscriptions
            WHERE subscriptions.id = payment_transactions.subscription_id
            AND subscriptions.user_id = auth.uid()
        ))
    );

-- Analytics Events - Users can create analytics events
CREATE POLICY "Users can create analytics events" ON analytics_events
    FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        OR user_id IS NULL -- Allow anonymous events
    );

-- Users can view their own analytics events
CREATE POLICY "Users can view own analytics events" ON analytics_events
    FOR SELECT
    USING (
        user_id = auth.uid()
        OR user_id IS NULL -- Allow viewing anonymous events for debugging
    );

-- ============================================================================
-- ADMIN POLICIES
-- ============================================================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories - Admins have full access
CREATE POLICY "Admins have full access to categories" ON categories
    FOR ALL
    USING (is_admin());

-- Products - Admins have full access
CREATE POLICY "Admins have full access to products" ON products
    FOR ALL
    USING (is_admin());

-- Product Variants - Admins have full access
CREATE POLICY "Admins have full access to product variants" ON product_variants
    FOR ALL
    USING (is_admin());

-- Product Images - Admins have full access
CREATE POLICY "Admins have full access to product images" ON product_images
    FOR ALL
    USING (is_admin());

-- Product Categories - Admins have full access
CREATE POLICY "Admins have full access to product categories" ON product_categories
    FOR ALL
    USING (is_admin());

-- Profiles - Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT
    USING (is_admin());

-- Admins can update any profile (except making themselves non-admin)
CREATE POLICY "Admins can update profiles" ON profiles
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (
        is_admin()
        AND (
            id != auth.uid() -- Can't edit own profile through admin
            OR is_admin = OLD.is_admin -- Can't remove own admin status
        )
    );

-- Addresses - Admins can view all addresses
CREATE POLICY "Admins can view all addresses" ON addresses
    FOR SELECT
    USING (is_admin());

-- Orders - Admins have full access
CREATE POLICY "Admins have full access to orders" ON orders
    FOR ALL
    USING (is_admin());

-- Order Items - Admins have full access
CREATE POLICY "Admins have full access to order items" ON order_items
    FOR ALL
    USING (is_admin());

-- Subscriptions - Admins have full access
CREATE POLICY "Admins have full access to subscriptions" ON subscriptions
    FOR ALL
    USING (is_admin());

-- Subscription Items - Admins have full access
CREATE POLICY "Admins have full access to subscription items" ON subscription_items
    FOR ALL
    USING (is_admin());

-- Payment Transactions - Admins have full access
CREATE POLICY "Admins have full access to payment transactions" ON payment_transactions
    FOR ALL
    USING (is_admin());

-- Inventory Logs - Admins have full access
CREATE POLICY "Admins have full access to inventory logs" ON inventory_logs
    FOR ALL
    USING (is_admin());

-- Stock Alerts - Admins have full access
CREATE POLICY "Admins have full access to stock alerts" ON stock_alerts
    FOR ALL
    USING (is_admin());

-- Discounts - Admins have full access
CREATE POLICY "Admins have full access to discounts" ON discounts
    FOR ALL
    USING (is_admin());

-- Public can view active discounts (for validation)
CREATE POLICY "Public can view active discounts" ON discounts
    FOR SELECT
    USING (
        active = true
        AND valid_from <= NOW()
        AND (valid_until IS NULL OR valid_until >= NOW())
    );

-- Analytics Events - Admins have full access
CREATE POLICY "Admins have full access to analytics events" ON analytics_events
    FOR ALL
    USING (is_admin());

-- ============================================================================
-- SERVICE ROLE POLICIES (for Stripe webhooks and background jobs)
-- ============================================================================

-- Allow service role to bypass RLS for essential operations
-- Note: These should be used carefully and only for automated processes

-- Orders - Service role can update order status (for Stripe webhooks)
CREATE POLICY "Service role can update orders" ON orders
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Payment Transactions - Service role can insert/update (for Stripe webhooks)
CREATE POLICY "Service role can manage payment transactions" ON payment_transactions
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Subscriptions - Service role can update (for Stripe webhooks)
CREATE POLICY "Service role can update subscriptions" ON subscriptions
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Inventory - Service role can update stock levels
CREATE POLICY "Service role can manage inventory" ON product_variants
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- GUEST ORDER POLICIES
-- ============================================================================

-- Allow guest orders by email verification
-- Orders with no user_id can be viewed if email matches
CREATE POLICY "Guest can view orders by email" ON orders
    FOR SELECT
    USING (
        user_id IS NULL
        AND email = current_setting('app.current_email', true)
    );

-- Guest can view order items for their orders
CREATE POLICY "Guest can view order items by email" ON order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id IS NULL
            AND orders.email = current_setting('app.current_email', true)
        )
    );