-- Honduras Coffee - Inventory Management
-- Stock tracking, logging, and alerts

-- Inventory Logs Table
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),

  -- Change Details
  adjustment_type VARCHAR(30) NOT NULL,
  -- Values: 'restock', 'sale', 'return', 'damage', 'loss', 'correction'

  quantity_change INTEGER NOT NULL, -- positive or negative
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,

  -- Reference
  reference_type VARCHAR(30), -- 'order', 'return', 'manual'
  reference_id UUID, -- order_id or return_id

  -- Who & Why
  adjusted_by UUID REFERENCES profiles(id),
  reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_logs_variant ON inventory_logs(product_variant_id);
CREATE INDEX idx_inventory_logs_created ON inventory_logs(created_at DESC);

-- Stock Alerts Table
CREATE TABLE stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),

  alert_type VARCHAR(30) NOT NULL, -- 'low_stock', 'out_of_stock', 'back_in_stock'
  threshold INTEGER,
  current_stock INTEGER,

  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_alerts_variant ON stock_alerts(product_variant_id);
CREATE INDEX idx_stock_alerts_notified ON stock_alerts(notified);

-- Function to check low stock and create alerts
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_quantity <= NEW.low_stock_threshold THEN
    INSERT INTO stock_alerts (
      product_variant_id,
      alert_type,
      threshold,
      current_stock
    ) VALUES (
      NEW.id,
      CASE
        WHEN NEW.stock_quantity = 0 THEN 'out_of_stock'
        ELSE 'low_stock'
      END,
      NEW.low_stock_threshold,
      NEW.stock_quantity
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check low stock on inventory changes
CREATE TRIGGER check_low_stock_trigger
  AFTER UPDATE OF stock_quantity ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION check_low_stock();

-- Function to update stock on order status changes
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- When order is confirmed, reduce stock
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    UPDATE product_variants pv
    SET stock_quantity = stock_quantity - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
    AND pv.id = oi.product_variant_id
    AND pv.track_inventory = true;

    -- Log inventory change
    INSERT INTO inventory_logs (
      product_variant_id,
      adjustment_type,
      quantity_change,
      quantity_before,
      quantity_after,
      reference_type,
      reference_id
    )
    SELECT
      oi.product_variant_id,
      'sale',
      -oi.quantity,
      pv.stock_quantity + oi.quantity,
      pv.stock_quantity,
      'order',
      NEW.id
    FROM order_items oi
    JOIN product_variants pv ON pv.id = oi.product_variant_id
    WHERE oi.order_id = NEW.id;
  END IF;

  -- When order is cancelled, restore stock
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE product_variants pv
    SET stock_quantity = stock_quantity + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
    AND pv.id = oi.product_variant_id
    AND pv.track_inventory = true;

    -- Log inventory restoration
    INSERT INTO inventory_logs (
      product_variant_id,
      adjustment_type,
      quantity_change,
      quantity_before,
      quantity_after,
      reference_type,
      reference_id
    )
    SELECT
      oi.product_variant_id,
      'return',
      oi.quantity,
      pv.stock_quantity - oi.quantity,
      pv.stock_quantity,
      'order',
      NEW.id
    FROM order_items oi
    JOIN product_variants pv ON pv.id = oi.product_variant_id
    WHERE oi.order_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stock on order status changes
CREATE TRIGGER update_stock_trigger
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_order();