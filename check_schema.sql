-- Check if our Honduras Coffee tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'products', 'product_variants', 'product_images', 'categories',
  'profiles', 'addresses', 'orders', 'order_items',
  'subscriptions', 'subscription_items', 'inventory_logs',
  'stock_alerts', 'payment_transactions', 'discounts',
  'analytics_events'
)
ORDER BY table_name;