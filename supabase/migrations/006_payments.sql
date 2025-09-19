-- Honduras Coffee - Payments and Discounts
-- Payment transactions and discount codes

-- Payment Transactions Table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  subscription_id UUID REFERENCES subscriptions(id),

  -- Transaction Details
  type VARCHAR(30) NOT NULL, -- 'payment', 'refund', 'partial_refund'
  status VARCHAR(30) NOT NULL, -- 'pending', 'succeeded', 'failed'

  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',

  -- Payment Method
  payment_method VARCHAR(30),
  last_four_digits VARCHAR(4),

  -- Stripe References
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  stripe_refund_id VARCHAR(255),

  -- Fees
  processing_fee_cents INTEGER,

  -- Metadata
  metadata JSONB,
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_order ON payment_transactions(order_id);
CREATE INDEX idx_transactions_subscription ON payment_transactions(subscription_id);

-- Discounts Table
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,

  -- Discount Type
  discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value INTEGER NOT NULL, -- percentage (10 = 10%) or cents

  -- Conditions
  minimum_order_cents INTEGER,
  applicable_products UUID[], -- array of product_ids
  applicable_categories UUID[], -- array of category_ids

  -- Usage Limits
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  usage_limit_per_customer INTEGER DEFAULT 1,

  -- Valid Period
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,

  active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER update_discounts_updated_at
  BEFORE UPDATE ON discounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_active ON discounts(active);

-- Function to validate and apply discount
CREATE OR REPLACE FUNCTION validate_discount(
  discount_code VARCHAR(50),
  order_total_cents INTEGER,
  customer_id UUID DEFAULT NULL,
  product_ids UUID[] DEFAULT NULL
)
RETURNS TABLE (
  valid BOOLEAN,
  discount_amount_cents INTEGER,
  error_message TEXT
) AS $$
DECLARE
  discount_record discounts%ROWTYPE;
  usage_count_for_customer INTEGER;
BEGIN
  -- Find the discount
  SELECT * INTO discount_record
  FROM discounts
  WHERE code = discount_code
  AND active = true
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW());

  -- Check if discount exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'Invalid or expired discount code';
    RETURN;
  END IF;

  -- Check usage limits
  IF discount_record.usage_limit IS NOT NULL AND discount_record.usage_count >= discount_record.usage_limit THEN
    RETURN QUERY SELECT false, 0, 'Discount code has reached its usage limit';
    RETURN;
  END IF;

  -- Check per-customer usage limit
  IF customer_id IS NOT NULL AND discount_record.usage_limit_per_customer IS NOT NULL THEN
    SELECT COUNT(*) INTO usage_count_for_customer
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = customer_id
    AND oi.discount_reason = discount_code;

    IF usage_count_for_customer >= discount_record.usage_limit_per_customer THEN
      RETURN QUERY SELECT false, 0, 'You have already used this discount code';
      RETURN;
    END IF;
  END IF;

  -- Check minimum order value
  IF discount_record.minimum_order_cents IS NOT NULL AND order_total_cents < discount_record.minimum_order_cents THEN
    RETURN QUERY SELECT false, 0, 'Order does not meet minimum amount for this discount';
    RETURN;
  END IF;

  -- Calculate discount amount
  IF discount_record.discount_type = 'percentage' THEN
    RETURN QUERY SELECT
      true,
      (order_total_cents * discount_record.discount_value / 100)::INTEGER,
      NULL::TEXT;
  ELSE
    RETURN QUERY SELECT
      true,
      LEAST(discount_record.discount_value, order_total_cents),
      NULL::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql;