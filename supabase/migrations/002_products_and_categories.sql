-- Honduras Coffee - Products and Categories
-- Product catalog with Honduras-specific coffee data

-- Categories Table
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

-- Create trigger for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Products Table
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

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_origin_farm ON products(origin_farm);

-- Product Variants Table
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

-- Create trigger for updated_at
CREATE TRIGGER update_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_active ON product_variants(active);

-- Product Images Table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partial unique index to ensure only one primary image per product
CREATE UNIQUE INDEX idx_images_one_primary_per_product
  ON product_images(product_id)
  WHERE is_primary = true;

CREATE INDEX idx_images_product ON product_images(product_id);

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