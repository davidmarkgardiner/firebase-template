-- Honduras Coffee - Analytics and Events
-- Analytics tracking and business intelligence views

-- Analytics Events Table
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

-- Revenue Dashboard View
CREATE VIEW revenue_dashboard AS
SELECT
  DATE(created_at) as order_date,
  COUNT(*) as order_count,
  SUM(total_cents) / 100.0 as revenue,
  AVG(total_cents) / 100.0 as average_order_value,
  COUNT(DISTINCT user_id) as unique_customers
FROM orders
WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- Best Selling Products View
CREATE VIEW best_selling_products AS
SELECT
  p.id,
  p.name,
  p.origin_farm,
  p.roast_level,
  COUNT(DISTINCT oi.order_id) as order_count,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.total_price_cents) / 100.0 as total_revenue
FROM products p
JOIN product_variants pv ON pv.product_id = p.id
JOIN order_items oi ON oi.product_variant_id = pv.id
JOIN orders o ON o.id = oi.order_id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY p.id, p.name, p.origin_farm, p.roast_level
ORDER BY total_quantity_sold DESC;

-- Subscription Metrics View
CREATE VIEW subscription_metrics AS
SELECT
  COUNT(*) FILTER (WHERE status = 'active') as active_subscriptions,
  COUNT(*) FILTER (WHERE status = 'paused') as paused_subscriptions,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_subscriptions,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_subscriptions_30d,
  COUNT(*) FILTER (WHERE cancelled_at >= NOW() - INTERVAL '30 days') as cancellations_30d,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'active')::DECIMAL /
    NULLIF(COUNT(*) FILTER (WHERE status IN ('active', 'cancelled')), 0) * 100,
    2
  ) as retention_rate_percentage
FROM subscriptions;

-- Customer Lifetime Value View
CREATE VIEW customer_lifetime_value AS
SELECT
  p.id as customer_id,
  p.email,
  p.first_name,
  p.last_name,
  p.created_at as customer_since,
  COUNT(DISTINCT o.id) as total_orders,
  SUM(o.total_cents) / 100.0 as total_spent,
  AVG(o.total_cents) / 100.0 as average_order_value,
  MAX(o.created_at) as last_order_date,
  CASE
    WHEN COUNT(DISTINCT s.id) > 0 THEN true
    ELSE false
  END as has_subscription
FROM profiles p
LEFT JOIN orders o ON o.user_id = p.id AND o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
LEFT JOIN subscriptions s ON s.user_id = p.id AND s.status = 'active'
GROUP BY p.id, p.email, p.first_name, p.last_name, p.created_at
HAVING COUNT(DISTINCT o.id) > 0
ORDER BY total_spent DESC;

-- Monthly Recurring Revenue (MRR) View
CREATE VIEW monthly_recurring_revenue AS
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) FILTER (WHERE status = 'active' AND frequency = 'monthly') as monthly_subscriptions,
  COUNT(*) FILTER (WHERE status = 'active' AND frequency = 'biweekly') as biweekly_subscriptions,
  COUNT(*) FILTER (WHERE status = 'active' AND frequency = 'weekly') as weekly_subscriptions,
  -- Calculate MRR (assuming average subscription value)
  (
    COUNT(*) FILTER (WHERE status = 'active' AND frequency = 'monthly') * 25.00 +
    COUNT(*) FILTER (WHERE status = 'active' AND frequency = 'biweekly') * 25.00 * 2 +
    COUNT(*) FILTER (WHERE status = 'active' AND frequency = 'weekly') * 25.00 * 4
  ) as estimated_mrr
FROM subscriptions
WHERE created_at >= DATE_TRUNC('month', NOW() - INTERVAL '12 months')
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Product Performance by Origin View
CREATE VIEW origin_performance AS
SELECT
  p.origin_farm,
  p.origin_municipality,
  p.roast_level,
  COUNT(DISTINCT p.id) as product_count,
  COUNT(DISTINCT oi.order_id) as order_count,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.total_price_cents) / 100.0 as total_revenue,
  AVG(p.cupping_score) as average_cupping_score
FROM products p
JOIN product_variants pv ON pv.product_id = p.id
JOIN order_items oi ON oi.product_variant_id = pv.id
JOIN orders o ON o.id = oi.order_id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY p.origin_farm, p.origin_municipality, p.roast_level
ORDER BY total_revenue DESC;

-- Inventory Status View
CREATE VIEW inventory_status AS
SELECT
  p.name as product_name,
  p.origin_farm,
  pv.format,
  pv.grind_type,
  pv.weight,
  pv.stock_quantity,
  pv.low_stock_threshold,
  CASE
    WHEN pv.stock_quantity = 0 THEN 'out_of_stock'
    WHEN pv.stock_quantity <= pv.low_stock_threshold THEN 'low_stock'
    ELSE 'in_stock'
  END as stock_status,
  pv.price_cents / 100.0 as price
FROM products p
JOIN product_variants pv ON pv.product_id = p.id
WHERE pv.active = true AND p.status = 'active'
ORDER BY
  CASE
    WHEN pv.stock_quantity = 0 THEN 1
    WHEN pv.stock_quantity <= pv.low_stock_threshold THEN 2
    ELSE 3
  END,
  p.name;