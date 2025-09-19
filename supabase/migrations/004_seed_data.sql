-- Seed Data for Honduras Coffee E-commerce
-- Initial products, categories, and sample data

-- ============================================================================
-- CATEGORIES
-- ============================================================================

INSERT INTO categories (slug, name, description, active, position) VALUES
    ('single-origin', 'Single Origin', 'Pure coffee from a single farm or region in Honduras', true, 1),
    ('estate-reserve', 'Estate Reserve', 'Premium single-estate coffees from our partner farms', true, 2),
    ('mountain-select', 'Mountain Select', 'High-altitude beans from 1400m+ elevations', true, 3),
    ('seasonal-harvest', 'Seasonal Harvest', 'Limited edition beans from the latest harvest', true, 4),
    ('subscription-eligible', 'Subscription Eligible', 'Available for monthly coffee subscriptions', true, 5),
    ('washed-process', 'Washed Process', 'Clean, bright coffees with washed processing', true, 6),
    ('honey-process', 'Honey Process', 'Sweet, complex coffees with honey processing', true, 7),
    ('natural-process', 'Natural Process', 'Fruity, wine-like coffees with natural processing', true, 8);

-- ============================================================================
-- HONDURAS COFFEE PRODUCTS
-- ============================================================================

-- Product 1: Honduras Marcala Bourbon
INSERT INTO products (
    sku, slug, name, description, origin_farm, origin_municipality,
    altitude_min, altitude_max, variety, processing_method, roast_level,
    tasting_notes, cupping_score, acidity, body, sweetness,
    story, brewing_methods, featured, status, published_at
) VALUES (
    'HND-MAR-BOU-001',
    'honduras-marcala-bourbon',
    'Honduras Marcala Bourbon',
    'An exceptional bourbon variety from the high mountains of Marcala, featuring notes of chocolate and caramel with a bright, crisp acidity. This coffee represents the best of Honduran specialty coffee.',
    'Finca La Esperanza',
    'Marcala, La Paz',
    1400, 1600,
    'Bourbon',
    'washed',
    'medium',
    '{"primary": ["chocolate", "caramel"], "secondary": ["orange", "brown sugar"], "finish": ["clean", "sweet"], "notes": "A classic Honduran profile with exceptional balance"}',
    86.5,
    7, 8, 9,
    'Finca La Esperanza has been in the Morales family for three generations. Located in the mountains of Marcala at 1500 meters above sea level, this farm produces some of Honduras'' finest bourbon variety coffee. The high altitude and volcanic soil create perfect conditions for slow cherry maturation, resulting in dense beans with complex flavors.',
    ARRAY['espresso', 'filter', 'french-press', 'chemex'],
    true,
    'active',
    NOW()
),
-- Product 2: Honduras Copán Catuai
(
    'HND-COP-CAT-001',
    'honduras-copan-catuai',
    'Honduras Copán Catuai',
    'From the renowned Copán region, this catuai offers a complex cup with fruit-forward notes and wine-like characteristics. The honey processing adds sweetness and body.',
    'Finca San Rafael',
    'Copán Ruinas',
    1200, 1500,
    'Catuai',
    'honey',
    'light-medium',
    '{"primary": ["red fruit", "honey"], "secondary": ["wine", "floral"], "finish": ["juicy", "bright"], "notes": "Complex fruit-forward profile with honey sweetness"}',
    87.0,
    8, 7, 8,
    'The San Rafael farm sits in the shadow of ancient Mayan ruins in Copán. The Hernández family has perfected their honey processing technique over decades, creating coffees with incredible sweetness and complexity. The volcanic soil and consistent rainfall create ideal growing conditions.',
    ARRAY['filter', 'pour-over', 'aeropress', 'chemex'],
    true,
    'active',
    NOW()
),
-- Product 3: Honduras Ocotepeque Pacas
(
    'HND-OCO-PAC-001',
    'honduras-ocotepeque-pacas',
    'Honduras Ocotepeque Pacas',
    'A rare Pacas variety from the western highlands of Ocotepeque. Natural processing brings out intense fruit flavors with wine-like complexity and full body.',
    'Finca El Mirador',
    'Ocotepeque',
    1500, 1700,
    'Pacas',
    'natural',
    'light',
    '{"primary": ["blueberry", "wine"], "secondary": ["chocolate", "tropical fruit"], "finish": ["long", "complex"], "notes": "Intense fruit bomb with wine-like complexity"}',
    88.0,
    9, 9, 7,
    'Finca El Mirador sits at the highest elevations in Ocotepeque, where the Pacas variety thrives in the cool mountain air. The natural processing method, combined with the high altitude, creates coffees with intense fruit flavors that are truly unique to this region.',
    ARRAY['filter', 'pour-over', 'cold-brew'],
    false,
    'active',
    NOW()
),
-- Product 4: Honduras Comayagua Typica
(
    'HND-COM-TYP-001',
    'honduras-comayagua-typica',
    'Honduras Comayagua Typica',
    'A classic Typica variety from the central highlands of Comayagua. Traditional washed processing highlights the clean, balanced cup character with notes of nuts and chocolate.',
    'Finca Santa Elena',
    'Comayagua',
    1300, 1500,
    'Typica',
    'washed',
    'medium-dark',
    '{"primary": ["nuts", "chocolate"], "secondary": ["caramel", "vanilla"], "finish": ["smooth", "balanced"], "notes": "Classic Honduran profile with traditional variety character"}',
    85.5,
    6, 8, 8,
    'Santa Elena farm represents traditional Honduran coffee growing at its finest. The Typica variety, one of the original coffee varieties brought to Honduras, is grown using time-tested methods passed down through generations of the Reyes family.',
    ARRAY['espresso', 'moka-pot', 'french-press', 'drip'],
    false,
    'active',
    NOW()
);

-- ============================================================================
-- PRODUCT VARIANTS (Different sizes and grinds)
-- ============================================================================

-- Function to create variants for all products
DO $$
DECLARE
    product_record RECORD;
    format_record RECORD;
    weight_record RECORD;
    price_base INTEGER;
BEGIN
    -- For each product, create variants
    FOR product_record IN SELECT id, slug FROM products LOOP
        -- For each format (whole bean, ground options)
        FOR format_record IN
            VALUES
                ('whole_bean', NULL::TEXT),
                ('ground', 'espresso'),
                ('ground', 'filter'),
                ('ground', 'french_press'),
                ('ground', 'moka_pot')
        LOOP
            -- For each weight option
            FOR weight_record IN VALUES (250), (500), (1000) LOOP
                -- Calculate price based on weight
                price_base := CASE
                    WHEN weight_record.column1 = 250 THEN 1200  -- €12.00
                    WHEN weight_record.column1 = 500 THEN 2200  -- €22.00
                    WHEN weight_record.column1 = 1000 THEN 4000 -- €40.00
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
                    50, -- Initial stock
                    true
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- ============================================================================
-- PRODUCT CATEGORIES ASSIGNMENTS
-- ============================================================================

-- Assign products to categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id
FROM products p, categories c
WHERE
    -- All products are single origin and subscription eligible
    c.slug IN ('single-origin', 'subscription-eligible')
    OR
    -- Assign based on processing method
    (p.processing_method = 'washed' AND c.slug = 'washed-process')
    OR
    (p.processing_method = 'honey' AND c.slug = 'honey-process')
    OR
    (p.processing_method = 'natural' AND c.slug = 'natural-process')
    OR
    -- Assign high altitude coffees to mountain select
    (p.altitude_min >= 1400 AND c.slug = 'mountain-select')
    OR
    -- Featured products go to estate reserve
    (p.featured = true AND c.slug = 'estate-reserve');

-- ============================================================================
-- SAMPLE ADMIN USER
-- ============================================================================

-- Note: This will need to be run after a user signs up with this email
-- UPDATE profiles SET is_admin = true WHERE email = 'admin@hondurascoffee.com';

-- ============================================================================
-- DISCOUNTS
-- ============================================================================

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
        2000, -- Minimum €20 order
        1,
        NOW(),
        NOW() + INTERVAL '6 months',
        true
    ),
    (
        'FREESHIP',
        'Free shipping on orders over €35',
        'fixed_amount',
        495, -- €4.95 shipping cost
        3500, -- Minimum €35 order
        NULL, -- No usage limit
        NOW(),
        NOW() + INTERVAL '1 year',
        true
    ),
    (
        'HARVEST2024',
        'New harvest celebration - 15% off',
        'percentage',
        15,
        NULL, -- No minimum
        2, -- Can use twice
        NOW(),
        NOW() + INTERVAL '2 months',
        true
    );

-- ============================================================================
-- SAMPLE ANALYTICS EVENTS FOR TESTING
-- ============================================================================

-- Insert some sample analytics events for dashboard testing
INSERT INTO analytics_events (
    event_type, session_id, page_url, product_id, metadata
)
SELECT
    'product_view',
    'session_' || generate_random_uuid()::text,
    '/products/' || slug,
    id,
    jsonb_build_object('source', 'homepage', 'position', row_number() OVER ())
FROM products
LIMIT 10;

-- ============================================================================
-- PRODUCT IMAGES (Placeholder URLs)
-- ============================================================================

-- Add placeholder images for products
INSERT INTO product_images (product_id, url, alt_text, position, is_primary)
SELECT
    p.id,
    'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=800&h=600&fit=crop', -- Coffee beans image
    p.name || ' - Premium Honduran Coffee',
    0,
    true
FROM products p;

-- Add secondary images
INSERT INTO product_images (product_id, url, alt_text, position, is_primary)
SELECT
    p.id,
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop', -- Coffee farm image
    p.name || ' - ' || p.origin_farm,
    1,
    false
FROM products p;

-- ============================================================================
-- USEFUL QUERIES FOR TESTING
-- ============================================================================

-- View all products with variants
/*
SELECT
    p.name,
    p.origin_farm,
    pv.format,
    pv.grind_type,
    pv.weight,
    pv.price_cents / 100.0 as price_eur,
    pv.stock_quantity
FROM products p
JOIN product_variants pv ON pv.product_id = p.id
ORDER BY p.name, pv.format, pv.weight;
*/

-- View product categories
/*
SELECT
    p.name as product_name,
    c.name as category_name
FROM products p
JOIN product_categories pc ON pc.product_id = p.id
JOIN categories c ON c.id = pc.category_id
ORDER BY p.name, c.name;
*/

-- Check stock levels
/*
SELECT
    p.name,
    pv.format,
    pv.weight,
    pv.stock_quantity,
    CASE
        WHEN pv.stock_quantity <= pv.low_stock_threshold THEN 'LOW STOCK'
        WHEN pv.stock_quantity = 0 THEN 'OUT OF STOCK'
        ELSE 'IN STOCK'
    END as stock_status
FROM products p
JOIN product_variants pv ON pv.product_id = p.id
ORDER BY pv.stock_quantity ASC;
*/