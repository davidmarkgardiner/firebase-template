# Honduras Coffee - Stripe Payment System Setup Guide

This guide will walk you through setting up the complete Stripe payment system for the Honduras Coffee e-commerce platform.

## Overview

The payment system includes:
- **One-time purchases** - Individual coffee orders
- **Subscription billing** - Recurring coffee deliveries
- **Webhook handling** - Order fulfillment automation
- **EU compliance** - VAT calculation and payment methods
- **Inventory management** - Stock tracking with order processing
- **Multi-currency support** - EUR primary, with expansion capability

## Prerequisites

1. **Stripe Account** - Sign up at [stripe.com](https://stripe.com)
2. **Supabase Project** - Database and authentication
3. **Environment Variables** - Configured in `.env.local`

## Step 1: Database Setup

### 1.1 Run Database Migrations

The database schema is already created in the migration files. Apply them to your Supabase project:

```bash
# Using Supabase CLI (recommended)
supabase db reset

# Or manually apply each migration file in order:
# 001_honduras_coffee_schema.sql
# 002_business_functions.sql
# 003_rls_policies.sql
# 004_seed_data.sql
```

### 1.2 Verify Database Schema

Check that these tables exist in your Supabase project:
- `profiles` - Customer data and preferences
- `products` - Coffee products with Honduras-specific fields
- `product_variants` - Different sizes and grinds
- `orders` - Customer orders with payment tracking
- `order_items` - Individual order line items
- `subscriptions` - Recurring delivery subscriptions
- `payment_transactions` - Payment history and status
- `inventory_logs` - Stock movement tracking

## Step 2: Stripe Configuration

### 2.1 Create Products in Stripe

The system automatically creates Stripe products when needed, but you can pre-create them:

```bash
# This will be handled automatically by the checkout API
# Products are created with metadata linking to our database
```

### 2.2 Set Up Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set URL: `https://yourdomain.com/api/stripe/webhooks`
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.created`

5. Copy the webhook signing secret to your environment variables

### 2.3 Configure Payment Methods

Enable these payment methods in your Stripe dashboard:
- **Card payments** (Visa, Mastercard, etc.)
- **SEPA Direct Debit** (for EU customers)
- **iDEAL** (Netherlands)
- **Bancontact** (Belgium)

## Step 3: Environment Variables

Update your `.env.local` file:

```bash
# Stripe Configuration
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
PUBLIC_APP_URL=http://localhost:4321
NODE_ENV=development

# Email Configuration (for order confirmations)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=orders@hondurascoffee.com

# Admin Configuration
ADMIN_EMAIL=admin@hondurascoffee.com
```

## Step 4: Test the Payment System

### 4.1 Test Cards

Use these Stripe test card numbers:

```
# Successful payments
4242424242424242 (Visa)
4000002500003155 (Mastercard)

# Requires 3D Secure authentication
4000002760003184

# Declined payments
4000000000000002 (Generic decline)
4000000000009995 (Insufficient funds)
```

### 4.2 Test Scenarios

1. **One-time Purchase**
   - Add products to cart
   - Go through checkout flow
   - Complete payment with test card
   - Verify order creation in database
   - Check webhook processing in logs

2. **Subscription Creation**
   - Select subscription option
   - Choose frequency (weekly/biweekly/monthly)
   - Complete subscription setup
   - Verify subscription in Stripe dashboard
   - Check database subscription record

3. **Webhook Testing**
   - Use Stripe CLI to forward webhooks locally:
   ```bash
   stripe listen --forward-to localhost:4321/api/stripe/webhooks
   ```

### 4.3 Local Development Testing

```bash
# Start the development server
npm run dev

# In another terminal, forward Stripe webhooks
stripe listen --forward-to localhost:4321/api/stripe/webhooks

# Test the checkout flow
curl -X POST http://localhost:4321/api/stripe/checkout \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"items\": [{\n      \"product_variant_id\": \"uuid-here\",\n      \"quantity\": 1\n    }],\n    \"shipping_address\": {\n      \"first_name\": \"Test\",\n      \"last_name\": \"Customer\",\n      \"address_line_1\": \"123 Test St\",\n      \"city\": \"Amsterdam\",\n      \"postal_code\": \"1000AA\",\n      \"country_code\": \"NL\"\n    },\n    \"customer_email\": \"test@example.com\"\n  }'\n```\n\n## Step 5: Production Setup\n\n### 5.1 Switch to Live Keys\n\nReplace test keys with live keys in production environment:\n\n```bash\n# Production environment variables\nPUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key\nSTRIPE_SECRET_KEY=sk_live_your_live_secret_key\nSTRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret\n```\n\n### 5.2 Configure Live Webhooks\n\n1. Add production webhook endpoint in Stripe\n2. Update webhook URL to production domain\n3. Copy live webhook secret to environment\n\n### 5.3 Enable Production Features\n\n1. **Tax Calculation** - Enable automatic tax in Stripe\n2. **Radar** - Enable fraud protection\n3. **Connect** - If supporting multiple sellers\n4. **Billing Portal** - Customer self-service\n\n## Step 6: API Endpoints Reference\n\n### Products\n- `GET /api/products` - List products with filtering\n- `GET /api/products/[slug]` - Get product details\n\n### Cart\n- `POST /api/cart` - Add item to cart\n- `PUT /api/cart` - Validate and calculate cart\n\n### Checkout\n- `POST /api/stripe/checkout` - Create checkout session\n\n### Webhooks\n- `POST /api/stripe/webhooks` - Handle Stripe events\n\n### Subscriptions\n- `GET /api/stripe/subscriptions` - List user subscriptions\n- `POST /api/stripe/subscriptions` - Manage subscription (pause/resume/cancel)\n\n## Step 7: Monitoring and Maintenance\n\n### 7.1 Stripe Dashboard Monitoring\n\n- Monitor payment success rates\n- Track subscription churn\n- Review failed payments\n- Monitor webhook delivery\n\n### 7.2 Database Monitoring\n\n```sql\n-- Check order status distribution\nSELECT status, COUNT(*) \nFROM orders \nGROUP BY status;\n\n-- Monitor subscription health\nSELECT status, COUNT(*) \nFROM subscriptions \nGROUP BY status;\n\n-- Check inventory levels\nSELECT \n  p.name,\n  pv.weight,\n  pv.stock_quantity,\n  CASE \n    WHEN pv.stock_quantity <= pv.low_stock_threshold THEN 'LOW'\n    WHEN pv.stock_quantity = 0 THEN 'OUT'\n    ELSE 'OK'\n  END as stock_status\nFROM products p\nJOIN product_variants pv ON pv.product_id = p.id\nWHERE pv.track_inventory = true\nORDER BY pv.stock_quantity ASC;\n```\n\n### 7.3 Failed Payment Recovery\n\nThe system automatically handles:\n- Subscription payment retries\n- Customer notifications\n- Automatic pausing of subscriptions\n\n## Step 8: Troubleshooting\n\n### Common Issues\n\n1. **Webhook not receiving events**\n   - Check webhook URL is publicly accessible\n   - Verify webhook signing secret\n   - Check webhook event selection\n\n2. **Payment failures**\n   - Review Stripe logs for error details\n   - Check test card numbers\n   - Verify API keys are correct\n\n3. **Database errors**\n   - Check RLS policies are correct\n   - Verify foreign key relationships\n   - Review database function logs\n\n### Debug Commands\n\n```bash\n# Check Stripe webhook deliveries\nstripe events list --limit 10\n\n# Test webhook endpoint locally\nstripe listen --events payment_intent.succeeded,customer.subscription.created\n\n# Check database connectivity\nnpx supabase db inspect\n```\n\n## Security Considerations\n\n1. **API Keys** - Never expose secret keys in frontend code\n2. **Webhook Verification** - Always verify webhook signatures\n3. **HTTPS** - Use HTTPS in production for all endpoints\n4. **RLS Policies** - Ensure proper row-level security\n5. **Input Validation** - Validate all inputs with Zod schemas\n\n## Support\n\nFor issues with this payment system:\n\n1. Check Stripe Dashboard for payment-related issues\n2. Review Supabase logs for database issues\n3. Monitor application logs for API errors\n4. Use Stripe CLI for webhook debugging\n\n## Next Steps\n\n1. **Analytics** - Add revenue tracking and reporting\n2. **Promotions** - Implement discount codes and campaigns\n3. **Internationalization** - Add support for multiple currencies\n4. **Mobile App** - Integrate with React Native or Flutter\n5. **B2B Features** - Add wholesale pricing and bulk orders\n\nThis payment system provides a solid foundation for a specialty coffee e-commerce business with room for growth and customization."