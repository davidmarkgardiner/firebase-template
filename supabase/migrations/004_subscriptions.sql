-- Honduras Coffee - Subscriptions
-- Coffee subscription service with Stripe integration

-- Subscriptions Table
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

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);

-- Subscription Items Table
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

-- Create trigger for updated_at
CREATE TRIGGER update_subscription_items_updated_at
  BEFORE UPDATE ON subscription_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_sub_items_subscription ON subscription_items(subscription_id);

-- Now add the foreign key constraint to orders table
ALTER TABLE orders
ADD CONSTRAINT fk_orders_subscription
FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);