-- Honduras Coffee - Seed Data
-- Initial products and data for Honduras specialty coffee

-- Insert Honduras-specific sample products
INSERT INTO products (
  sku,
  slug,
  name,
  description,
  origin_farm,
  origin_municipality,
  altitude_min,
  altitude_max,
  variety,
  processing_method,
  roast_level,
  harvest_year,
  harvest_month,
  tasting_notes,
  cupping_score,
  acidity,
  body,
  sweetness,
  story,
  brewing_methods,
  status,
  featured,
  published_at,
  meta_title,
  meta_description
) VALUES
(
  'HON-MAR-BOU-001',
  'honduras-marcala-bourbon',
  'Honduras Marcala Bourbon',
  'An exceptional bourbon variety from the high mountains of Marcala, featuring notes of chocolate and caramel with a bright acidity. This coffee represents the pinnacle of Honduran coffee craftsmanship.',
  'Finca La Esperanza',
  'Marcala, La Paz',
  1400,
  1600,
  'Bourbon',
  'washed',
  'medium',
  2024,
  'December-February',
  '{"primary": ["chocolate", "caramel"], "secondary": ["orange", "brown sugar"], "finish": ["clean", "sweet"]}',
  86.5,
  7,
  8,
  8,
  'Finca La Esperanza has been in the Hernández family for three generations. Located in the mountains of Marcala, this farm produces some of Honduras''s finest bourbon variety coffee. The family''s dedication to sustainable farming and meticulous processing creates a cup that tells the story of Honduran coffee excellence.',
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
  'From the renowned Copán region, this catuai offers a complex cup with fruit-forward notes and wine-like characteristics. A true representation of Honduras''s diverse coffee terroir.',
  'Finca San Rafael',
  'Copán Ruinas',
  1200,
  1500,
  'Catuai',
  'honey',
  'light-medium',
  2024,
  'January-March',
  '{"primary": ["red fruit", "honey"], "secondary": ["wine", "floral"], "finish": ["juicy", "bright"]}',
  87.0,
  8,
  6,
  9,
  'The García family has been cultivating coffee at Finca San Rafael for over 40 years. Their honey processing method brings out the natural sweetness of the catuai variety, creating a cup that showcases the unique terroir of the Copán region.',
  ARRAY['filter', 'pour-over', 'aeropress'],
  'active',
  true,
  NOW(),
  'Honduras Copán Catuai - Honey Process Single Origin',
  'Complex honey-processed catuai from Copán region with fruit-forward notes and wine-like characteristics.'
),
(
  'HON-OCO-PAC-001',
  'honduras-ocotepeque-pacas',
  'Honduras Ocotepeque Pacas',
  'A rare pacas variety from the remote mountains of Ocotepeque. This coffee delivers intense floral aromatics with a silky body and notes of tropical fruit.',
  'Finca El Mirador',
  'Ocotepeque, Ocotepeque',
  1600,
  1800,
  'Pacas',
  'natural',
  'light',
  2024,
  'February-April',
  '{"primary": ["tropical fruit", "floral"], "secondary": ["jasmine", "mango"], "finish": ["silky", "lingering"]}',
  88.0,
  9,
  7,
  8,
  'Finca El Mirador sits at the highest altitudes in Ocotepeque, where the Morales family has perfected the art of natural processing. The extreme altitude and careful drying process create a coffee of extraordinary complexity and elegance.',
  ARRAY['filter', 'chemex', 'v60'],
  'active',
  false,
  NOW(),
  'Honduras Ocotepeque Pacas - Natural Process High Altitude',
  'Rare pacas variety from extreme altitude with intense floral aromatics and tropical fruit notes.'
),
(
  'HON-INT-MIX-001',
  'honduras-intibuca-mixed',
  'Honduras Intibucá Mixed Varieties',
  'A carefully curated blend of bourbon, catuai, and lempira varieties from small farms in Intibucá. This coffee represents the collective excellence of Honduran coffee farmers.',
  'Cooperativa Café Orgánico',
  'La Esperanza, Intibucá',
  1300,
  1700,
  'Mixed Varieties',
  'washed',
  'medium-dark',
  2024,
  'December-March',
  '{"primary": ["dark chocolate", "nuts"], "secondary": ["spices", "orange peel"], "finish": ["smooth", "balanced"]}',
  85.0,
  6,
  9,
  7,
  'The Cooperativa Café Orgánico represents 150 small-scale farmers in Intibucá who have joined together to achieve organic certification and fair prices. This blend showcases the diversity and quality that can be achieved through cooperation and shared knowledge.',
  ARRAY['espresso', 'moka-pot', 'french-press'],
  'active',
  false,
  NOW(),
  'Honduras Intibucá Cooperative - Organic Mixed Varieties',
  'Organic cooperative coffee blend from Intibucá featuring bourbon, catuai, and lempira varieties.'
);

-- Insert product variants for each product
-- For Honduras Marcala Bourbon
INSERT INTO product_variants (product_id, sku, format, grind_type, weight, price_cents, stock_quantity, low_stock_threshold)
SELECT
  p.id,
  p.sku || '-' || format || '-' || COALESCE(grind, 'whole') || '-' || weight,
  format,
  grind,
  weight,
  CASE
    WHEN weight = 250 THEN 1400  -- €14.00
    WHEN weight = 500 THEN 2600  -- €26.00
    WHEN weight = 1000 THEN 4800 -- €48.00
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
WHERE p.slug = 'honduras-marcala-bourbon';

-- For Honduras Copán Catuai
INSERT INTO product_variants (product_id, sku, format, grind_type, weight, price_cents, stock_quantity, low_stock_threshold)
SELECT
  p.id,
  p.sku || '-' || format || '-' || COALESCE(grind, 'whole') || '-' || weight,
  format,
  grind,
  weight,
  CASE
    WHEN weight = 250 THEN 1600  -- €16.00
    WHEN weight = 500 THEN 3000  -- €30.00
    WHEN weight = 1000 THEN 5500 -- €55.00
  END,
  CASE
    WHEN weight = 250 THEN 40
    WHEN weight = 500 THEN 25
    WHEN weight = 1000 THEN 15
  END,
  5
FROM products p
CROSS JOIN (
  VALUES
    ('whole_bean', NULL),
    ('ground', 'filter'),
    ('ground', 'espresso')
) AS formats(format, grind)
CROSS JOIN (VALUES (250), (500), (1000)) AS weights(weight)
WHERE p.slug = 'honduras-copan-catuai';

-- For Honduras Ocotepeque Pacas (limited edition, higher prices)
INSERT INTO product_variants (product_id, sku, format, grind_type, weight, price_cents, stock_quantity, low_stock_threshold)
SELECT
  p.id,
  p.sku || '-' || format || '-' || COALESCE(grind, 'whole') || '-' || weight,
  format,
  grind,
  weight,
  CASE
    WHEN weight = 250 THEN 2200  -- €22.00
    WHEN weight = 500 THEN 4200  -- €42.00
    WHEN weight = 1000 THEN 8000 -- €80.00
  END,
  CASE
    WHEN weight = 250 THEN 20
    WHEN weight = 500 THEN 12
    WHEN weight = 1000 THEN 8
  END,
  3
FROM products p
CROSS JOIN (
  VALUES
    ('whole_bean', NULL),
    ('ground', 'filter')
) AS formats(format, grind)
CROSS JOIN (VALUES (250), (500), (1000)) AS weights(weight)
WHERE p.slug = 'honduras-ocotepeque-pacas';

-- For Honduras Intibucá Mixed (cooperative pricing)
INSERT INTO product_variants (product_id, sku, format, grind_type, weight, price_cents, stock_quantity, low_stock_threshold)
SELECT
  p.id,
  p.sku || '-' || format || '-' || COALESCE(grind, 'whole') || '-' || weight,
  format,
  grind,
  weight,
  CASE
    WHEN weight = 250 THEN 1200  -- €12.00
    WHEN weight = 500 THEN 2200  -- €22.00
    WHEN weight = 1000 THEN 4000 -- €40.00
  END,
  CASE
    WHEN weight = 250 THEN 60
    WHEN weight = 500 THEN 40
    WHEN weight = 1000 THEN 25
  END,
  10
FROM products p
CROSS JOIN (
  VALUES
    ('whole_bean', NULL),
    ('ground', 'espresso'),
    ('ground', 'filter'),
    ('ground', 'french_press'),
    ('ground', 'moka_pot')
) AS formats(format, grind)
CROSS JOIN (VALUES (250), (500), (1000)) AS weights(weight)
WHERE p.slug = 'honduras-intibuca-mixed';

-- Associate products with categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id
FROM products p
CROSS JOIN categories c
WHERE
  (p.slug IN ('honduras-marcala-bourbon', 'honduras-copan-catuai', 'honduras-ocotepeque-pacas') AND c.slug = 'single-origin') OR
  (p.slug = 'honduras-ocotepeque-pacas' AND c.slug = 'limited-edition') OR
  (p.slug IN ('honduras-marcala-bourbon', 'honduras-copan-catuai', 'honduras-intibuca-mixed') AND c.slug = 'subscription-eligible') OR
  (p.harvest_year = 2024 AND c.slug = 'new-harvest');

-- Insert sample discount codes
INSERT INTO discounts (code, description, discount_type, discount_value, minimum_order_cents, usage_limit, usage_limit_per_customer, valid_until)
VALUES
  ('WELCOME10', 'Welcome 10% discount for new customers', 'percentage', 10, 2000, 100, 1, NOW() + INTERVAL '30 days'),
  ('HONDURAS20', '20% off Honduras single origins', 'percentage', 20, 3000, 50, 2, NOW() + INTERVAL '14 days'),
  ('FREESHIP', 'Free shipping on orders over €50', 'fixed_amount', 500, 5000, NULL, 1, NOW() + INTERVAL '60 days'),
  ('LOYALTY15', '15% loyalty discount', 'percentage', 15, 0, NULL, 1, NOW() + INTERVAL '365 days');

-- Create a sample admin user profile (will need to be updated with actual auth user ID)
-- This is just to set up the structure - the actual admin user will need to be created through auth
-- Note: Admin user must be created manually through authentication first, then profile updated:
-- UPDATE profiles SET is_admin = true WHERE email = 'admin@hondurascoffee.com';
/*
INSERT INTO profiles (id, email, first_name, last_name, is_admin, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder ID
  'admin@hondurascoffee.com',
  'Admin',
  'User',
  true,
  NOW()
) ON CONFLICT (id) DO NOTHING;
*/

-- Insert some sample analytics events to demonstrate the structure
INSERT INTO analytics_events (event_type, product_id, metadata, created_at)
SELECT
  'product_view',
  p.id,
  jsonb_build_object('source', 'seed_data', 'product_name', p.name),
  NOW() - (random() * INTERVAL '7 days')
FROM products p
ORDER BY random()
LIMIT 10;