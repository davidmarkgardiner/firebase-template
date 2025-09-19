-- Honduras Coffee - Row Level Security Policies
-- Comprehensive security policies for all tables

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public Access (No Auth Required)
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
      AND products.published_at IS NOT NULL
    )
  );

-- Anyone can view product images
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

-- Anyone can view active categories
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT
  USING (active = true);

-- Anyone can view product-category relationships
CREATE POLICY "Public can view product categories" ON product_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_categories.product_id
      AND products.status = 'active'
      AND products.published_at IS NOT NULL
    )
  );

-- Authenticated Users
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can manage their own addresses
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL
  USING (auth.uid() = user_id);

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view order items for their orders
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can manage their own subscriptions
CREATE POLICY "Users can manage own subscriptions" ON subscriptions
  FOR ALL
  USING (auth.uid() = user_id);

-- Users can view subscription items for their subscriptions
CREATE POLICY "Users can view own subscription items" ON subscription_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = subscription_items.subscription_id
      AND subscriptions.user_id = auth.uid()
    )
  );

-- Users can view their own payment transactions
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
  FOR SELECT
  USING (
    (order_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payment_transactions.order_id
      AND orders.user_id = auth.uid()
    )) OR
    (subscription_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = payment_transactions.subscription_id
      AND subscriptions.user_id = auth.uid()
    ))
  );

-- Users can create analytics events (for their own actions)
CREATE POLICY "Users can create analytics events" ON analytics_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can view public discounts
CREATE POLICY "Public can view active discounts" ON discounts
  FOR SELECT
  USING (active = true AND (valid_until IS NULL OR valid_until >= NOW()));

-- Admin Access Policies
-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admins have full access to products
CREATE POLICY "Admins have full access to products" ON products
  FOR ALL
  USING (is_admin());

-- Admins have full access to product variants
CREATE POLICY "Admins have full access to product variants" ON product_variants
  FOR ALL
  USING (is_admin());

-- Admins have full access to product images
CREATE POLICY "Admins have full access to product images" ON product_images
  FOR ALL
  USING (is_admin());

-- Admins have full access to categories
CREATE POLICY "Admins have full access to categories" ON categories
  FOR ALL
  USING (is_admin());

-- Admins have full access to product categories
CREATE POLICY "Admins have full access to product categories" ON product_categories
  FOR ALL
  USING (is_admin());

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT
  USING (is_admin());

-- Admins can update order status and admin notes
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE
  USING (is_admin());

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT
  USING (is_admin());

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions" ON subscriptions
  FOR SELECT
  USING (is_admin());

-- Admins can update subscription status
CREATE POLICY "Admins can update subscriptions" ON subscriptions
  FOR UPDATE
  USING (is_admin());

-- Admins can view all subscription items
CREATE POLICY "Admins can view all subscription items" ON subscription_items
  FOR ALL
  USING (is_admin());

-- Admins can view all inventory logs
CREATE POLICY "Admins can view all inventory logs" ON inventory_logs
  FOR SELECT
  USING (is_admin());

-- Admins can create inventory adjustments
CREATE POLICY "Admins can create inventory logs" ON inventory_logs
  FOR INSERT
  WITH CHECK (is_admin());

-- Admins can view stock alerts
CREATE POLICY "Admins can view stock alerts" ON stock_alerts
  FOR SELECT
  USING (is_admin());

-- Admins can mark alerts as notified
CREATE POLICY "Admins can update stock alerts" ON stock_alerts
  FOR UPDATE
  USING (is_admin());

-- Admins can view all payment transactions
CREATE POLICY "Admins can view all payment transactions" ON payment_transactions
  FOR SELECT
  USING (is_admin());

-- Admins can manage discounts
CREATE POLICY "Admins can manage discounts" ON discounts
  FOR ALL
  USING (is_admin());

-- Admins can view all analytics events
CREATE POLICY "Admins can view all analytics events" ON analytics_events
  FOR SELECT
  USING (is_admin());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  USING (is_admin());

-- Admins can update user profiles (for customer service)
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE
  USING (is_admin());

-- Special policies for system operations
-- Allow system operations for inventory updates
CREATE POLICY "System can update inventory" ON inventory_logs
  FOR INSERT
  WITH CHECK (true);

-- Allow system operations for stock alerts
CREATE POLICY "System can create stock alerts" ON stock_alerts
  FOR INSERT
  WITH CHECK (true);

-- Allow order creation for guests (e-commerce checkout)
CREATE POLICY "Allow guest orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Allow order items creation during checkout
CREATE POLICY "Allow order items creation" ON order_items
  FOR INSERT
  WITH CHECK (true);

-- Allow payment transaction creation
CREATE POLICY "Allow payment transaction creation" ON payment_transactions
  FOR INSERT
  WITH CHECK (true);