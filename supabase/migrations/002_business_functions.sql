-- Honduras Coffee Business Logic Functions
-- Functions for order processing, inventory management, and automation

-- ============================================================================
-- ORDER PROCESSING FUNCTIONS
-- ============================================================================

-- Generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    current_year INTEGER;
    order_count INTEGER;
BEGIN
    current_year := EXTRACT(YEAR FROM NOW());

    SELECT COUNT(*) + 1 INTO order_count
    FROM orders
    WHERE EXTRACT(YEAR FROM created_at) = current_year;

    NEW.order_number := 'HC-' || current_year || '-' || LPAD(order_count::TEXT, 4, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply order number trigger
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Update customer statistics when order status changes
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- When order is confirmed/paid, update customer totals
    IF NEW.status IN ('confirmed', 'delivered') AND OLD.status != NEW.status THEN
        UPDATE profiles
        SET
            total_spent_cents = total_spent_cents + NEW.total_cents,
            order_count = order_count + 1,
            last_order_at = NOW()
        WHERE id = NEW.user_id;
    END IF;

    -- When order is refunded, adjust customer totals
    IF NEW.status = 'refunded' AND OLD.status != 'refunded' THEN
        UPDATE profiles
        SET
            total_spent_cents = GREATEST(0, total_spent_cents - NEW.total_cents),
            order_count = GREATEST(0, order_count - 1)
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply customer stats trigger
CREATE TRIGGER update_customer_stats_trigger
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_stats();

-- ============================================================================
-- INVENTORY MANAGEMENT FUNCTIONS
-- ============================================================================

-- Update stock levels when order status changes
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    -- When order is confirmed, reduce stock
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        -- Update stock quantities
        UPDATE product_variants pv
        SET stock_quantity = stock_quantity - oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id
        AND pv.id = oi.product_variant_id
        AND pv.track_inventory = true;

        -- Log inventory changes
        INSERT INTO inventory_logs (
            product_variant_id,
            adjustment_type,
            quantity_change,
            quantity_before,
            quantity_after,
            reference_type,
            reference_id,
            reason
        )
        SELECT
            oi.product_variant_id,
            'sale',
            -oi.quantity,
            pv.stock_quantity + oi.quantity,
            pv.stock_quantity,
            'order',
            NEW.id,
            'Order confirmed: ' || NEW.order_number
        FROM order_items oi
        JOIN product_variants pv ON pv.id = oi.product_variant_id
        WHERE oi.order_id = NEW.id
        AND pv.track_inventory = true;
    END IF;

    -- When order is cancelled, restore stock
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        -- Restore stock quantities
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
            reference_id,
            reason
        )
        SELECT
            oi.product_variant_id,
            'return',
            oi.quantity,
            pv.stock_quantity - oi.quantity,
            pv.stock_quantity,
            'order',
            NEW.id,
            'Order cancelled: ' || NEW.order_number
        FROM order_items oi
        JOIN product_variants pv ON pv.id = oi.product_variant_id
        WHERE oi.order_id = NEW.id
        AND pv.track_inventory = true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply stock update trigger
CREATE TRIGGER update_stock_trigger
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_on_order();

-- Check for low stock and create alerts
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Only check if stock quantity changed
    IF NEW.stock_quantity != OLD.stock_quantity THEN
        -- Check if we need to create a stock alert
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
            )
            -- Only insert if we don't already have an unnotified alert
            ON CONFLICT DO NOTHING;
        END IF;

        -- If stock went back above threshold, create back_in_stock alert
        IF OLD.stock_quantity <= OLD.low_stock_threshold AND NEW.stock_quantity > NEW.low_stock_threshold THEN
            INSERT INTO stock_alerts (
                product_variant_id,
                alert_type,
                threshold,
                current_stock
            ) VALUES (
                NEW.id,
                'back_in_stock',
                NEW.low_stock_threshold,
                NEW.stock_quantity
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply low stock check trigger
CREATE TRIGGER check_low_stock_trigger
    AFTER UPDATE OF stock_quantity ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION check_low_stock();

-- ============================================================================
-- SUBSCRIPTION MANAGEMENT FUNCTIONS
-- ============================================================================

-- Create order from subscription
CREATE OR REPLACE FUNCTION create_subscription_order(
    p_subscription_id UUID,
    p_delivery_date DATE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_subscription subscriptions%ROWTYPE;
    v_user profiles%ROWTYPE;
    v_order_id UUID;
    v_subtotal_cents INTEGER := 0;
    v_item RECORD;
BEGIN
    -- Get subscription details
    SELECT * INTO v_subscription
    FROM subscriptions
    WHERE id = p_subscription_id
    AND status = 'active';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Active subscription not found: %', p_subscription_id;
    END IF;

    -- Get user details
    SELECT * INTO v_user
    FROM profiles
    WHERE id = v_subscription.user_id;

    -- Calculate subtotal from subscription items
    SELECT SUM(si.quantity * pv.price_cents) INTO v_subtotal_cents
    FROM subscription_items si
    JOIN product_variants pv ON pv.id = si.product_variant_id
    WHERE si.subscription_id = p_subscription_id
    AND si.is_active = true;

    -- Create the order
    INSERT INTO orders (
        user_id,
        email,
        status,
        shipping_address,
        billing_address,
        subtotal_cents,
        total_cents,
        is_subscription_order,
        subscription_id,
        stripe_customer_id
    ) VALUES (
        v_subscription.user_id,
        v_user.email,
        'pending',
        v_subscription.delivery_address,
        v_subscription.delivery_address,
        v_subtotal_cents,
        v_subtotal_cents, -- TODO: Add shipping/tax calculation
        true,
        p_subscription_id,
        v_subscription.stripe_customer_id
    )
    RETURNING id INTO v_order_id;

    -- Add order items from subscription items
    INSERT INTO order_items (
        order_id,
        product_variant_id,
        product_name,
        product_sku,
        variant_details,
        quantity,
        unit_price_cents,
        total_price_cents
    )
    SELECT
        v_order_id,
        si.product_variant_id,
        p.name,
        pv.sku,
        jsonb_build_object(
            'format', pv.format,
            'grind_type', pv.grind_type,
            'weight', pv.weight
        ),
        si.quantity,
        pv.price_cents,
        si.quantity * pv.price_cents
    FROM subscription_items si
    JOIN product_variants pv ON pv.id = si.product_variant_id
    JOIN products p ON p.id = pv.product_id
    WHERE si.subscription_id = p_subscription_id
    AND si.is_active = true;

    -- Update subscription next delivery date
    UPDATE subscriptions
    SET
        next_delivery_date = CASE
            WHEN frequency = 'weekly' THEN COALESCE(p_delivery_date, NOW()::DATE) + INTERVAL '1 week'
            WHEN frequency = 'biweekly' THEN COALESCE(p_delivery_date, NOW()::DATE) + INTERVAL '2 weeks'
            WHEN frequency = 'monthly' THEN COALESCE(p_delivery_date, NOW()::DATE) + INTERVAL '1 month'
        END,
        last_delivery_date = COALESCE(p_delivery_date, NOW()::DATE)
    WHERE id = p_subscription_id;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ANALYTICS FUNCTIONS
-- ============================================================================

-- Track analytics event
CREATE OR REPLACE FUNCTION track_analytics_event(
    p_event_type VARCHAR(50),
    p_user_id UUID DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_page_url TEXT DEFAULT NULL,
    p_referrer_url TEXT DEFAULT NULL,
    p_product_id UUID DEFAULT NULL,
    p_order_id UUID DEFAULT NULL,
    p_subscription_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO analytics_events (
        event_type,
        user_id,
        session_id,
        ip_address,
        user_agent,
        page_url,
        referrer_url,
        product_id,
        order_id,
        subscription_id,
        metadata
    ) VALUES (
        p_event_type,
        p_user_id,
        p_session_id,
        p_ip_address,
        p_user_agent,
        p_page_url,
        p_referrer_url,
        p_product_id,
        p_order_id,
        p_subscription_id,
        p_metadata
    )
    RETURNING id INTO v_event_id;

    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Get product availability
CREATE OR REPLACE FUNCTION get_product_availability(p_product_variant_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_variant product_variants%ROWTYPE;
    v_result JSONB;
BEGIN
    SELECT * INTO v_variant
    FROM product_variants
    WHERE id = p_product_variant_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('available', false, 'reason', 'Product not found');
    END IF;

    IF NOT v_variant.active THEN
        RETURN jsonb_build_object('available', false, 'reason', 'Product inactive');
    END IF;

    IF v_variant.track_inventory AND v_variant.stock_quantity <= 0 AND NOT v_variant.allow_backorder THEN
        RETURN jsonb_build_object('available', false, 'reason', 'Out of stock');
    END IF;

    RETURN jsonb_build_object(
        'available', true,
        'stock_quantity', v_variant.stock_quantity,
        'track_inventory', v_variant.track_inventory,
        'allow_backorder', v_variant.allow_backorder
    );
END;
$$ LANGUAGE plpgsql;

-- Calculate order totals (with tax and shipping)
CREATE OR REPLACE FUNCTION calculate_order_totals(
    p_order_id UUID,
    p_shipping_country VARCHAR(2) DEFAULT 'NL'
)
RETURNS JSONB AS $$
DECLARE
    v_subtotal_cents INTEGER;
    v_shipping_cents INTEGER := 0;
    v_tax_cents INTEGER := 0;
    v_total_cents INTEGER;
    v_tax_rate DECIMAL := 0.21; -- Default EU VAT rate
BEGIN
    -- Calculate subtotal from order items
    SELECT COALESCE(SUM(total_price_cents), 0) INTO v_subtotal_cents
    FROM order_items
    WHERE order_id = p_order_id;

    -- Calculate shipping (simplified - could be made more complex)
    IF v_subtotal_cents < 5000 THEN -- Free shipping over €50
        v_shipping_cents := 495; -- €4.95 shipping
    END IF;

    -- Calculate tax based on country (simplified EU logic)
    IF p_shipping_country IN ('NL', 'DE', 'FR', 'BE', 'LU') THEN
        v_tax_cents := ROUND((v_subtotal_cents + v_shipping_cents) * v_tax_rate);
    END IF;

    v_total_cents := v_subtotal_cents + v_shipping_cents + v_tax_cents;

    -- Update the order
    UPDATE orders
    SET
        subtotal_cents = v_subtotal_cents,
        shipping_cents = v_shipping_cents,
        tax_cents = v_tax_cents,
        total_cents = v_total_cents
    WHERE id = p_order_id;

    RETURN jsonb_build_object(
        'subtotal_cents', v_subtotal_cents,
        'shipping_cents', v_shipping_cents,
        'tax_cents', v_tax_cents,
        'total_cents', v_total_cents
    );
END;
$$ LANGUAGE plpgsql;