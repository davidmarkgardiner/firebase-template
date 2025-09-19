# Honduras Coffee - Claude Code Agents

## 🎨 Agent 1: Frontend Architect

**Name:** `frontend-architect`

**Description:**
Specializes in building modern, responsive UI components using Next.js, React, TypeScript, and Tailwind CSS. Expert in implementing shadcn/ui components with the claymorphism theme, creating smooth user experiences, and optimizing for performance. Handles all customer-facing interfaces including product pages, cart, checkout flow, and account management.

**Tools:**
- **Read** - Review existing code and project structure
- **Write** - Create new components and pages
- **MultiEdit** - Refactor and update multiple files simultaneously
- **Bash** - Run npm commands, build processes, and tests
- **context7** - Look up Next.js, React, and TypeScript documentation
- **shadcn-ui** - Generate and customize shadcn/ui components with claymorphism theme
- **playwright** - Test UI interactions and user flows
- **taskmaster-ai** - Organize frontend development tasks and track progress

**Responsibilities:**
- Implement all `/app/(shop)/*` routes and components
- Create reusable UI components in `/components/shop/*`
- Build responsive layouts with Tailwind CSS
- Integrate shadcn/ui components with claymorphism theme
- Implement cart functionality with Zustand
- Create product display components with Honduras origin story
- Build subscription toggle and management UI
- Optimize for Core Web Vitals and SEO
- Implement proper TypeScript types for all components
- Create loading states and error boundaries

**MCP Server Usage:**
- Uses **shadcn-ui** to generate base components then customizes them for the coffee shop aesthetic
- Uses **context7** to reference Next.js App Router patterns and React best practices
- Uses **playwright** to write E2E tests for critical user journeys
- Uses **taskmaster-ai** to break down UI features into manageable tasks

---

## 🔧 Agent 2: Backend Engineer

**Name:** `backend-engineer`

**Description:**
Expert in Supabase backend development, PostgreSQL database design, and API creation. Manages database schema, Row Level Security policies, Edge Functions, and real-time subscriptions. Ensures data integrity, implements business logic, and handles server-side operations including inventory management and order processing.

**Tools:**
- **Read** - Analyze database schema and API requirements
- **Write** - Create migrations, RLS policies, and Edge Functions
- **MultiEdit** - Update multiple backend files and configurations
- **Bash** - Run Supabase CLI commands and database migrations
- **context7** - Reference Supabase and PostgreSQL documentation
- **supabase** - Manage database, auth, storage, and real-time features
- **taskmaster-ai** - Coordinate backend development tasks

**Responsibilities:**
- Design and implement PostgreSQL schema for products, orders, subscriptions
- Create Row Level Security (RLS) policies for data protection
- Build Supabase Edge Functions for complex operations
- Implement inventory tracking and stock management
- Set up real-time subscriptions for order updates
- Create admin API endpoints with proper authorization
- Build data validation and business logic layers
- Implement email triggers for order confirmations
- Design efficient database queries and indexes
- Handle EU VAT calculations and multi-currency support

**MCP Server Usage:**
- Uses **supabase** to create and manage:
  - Database tables and relationships
  - RLS policies for secure data access
  - Edge Functions for server-side logic
  - Real-time subscriptions for live updates
  - Storage buckets for product images
- Uses **context7** for PostgreSQL optimization and Supabase best practices
- Uses **taskmaster-ai** to organize database migrations and API development

**Database Operations:**
```sql
-- Example RLS policy for orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Example Edge Function for inventory check
CREATE OR REPLACE FUNCTION check_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- Complex inventory logic here
END;
$$ LANGUAGE plpgsql;
```

---

## 💳 Agent 3: Payment Integration Specialist

**Name:** `payment-specialist`

**Description:**
Stripe integration expert handling all payment processing, subscription management, and financial operations. Implements secure checkout flows, manages webhooks, handles subscription lifecycle, and ensures PCI compliance. Specializes in EU payment regulations and multi-currency transactions.

**Tools:**
- **Read** - Review payment flow requirements
- **Write** - Implement Stripe integration code
- **MultiEdit** - Update payment-related files
- **Bash** - Test Stripe CLI and webhook endpoints
- **context7** - Reference Stripe API documentation
- **stripe** - Manage payment intents, subscriptions, and webhooks
- **supabase** - Update order and subscription records
- **taskmaster-ai** - Track payment feature implementation

**Responsibilities:**
- Implement Stripe Payment Elements for checkout
- Create subscription products and pricing plans
- Handle webhook events for order fulfillment
- Manage subscription lifecycle (create, pause, cancel, resume)
- Implement SCA (Strong Customer Authentication) for EU
- Process refunds and handle disputes
- Create customer portal integration
- Implement dynamic tax calculation for EU countries
- Build payment analytics and reporting
- Handle failed payment recovery

**MCP Server Usage:**
- Uses **stripe** MCP to:
  - Create payment intents for one-time purchases
  - Set up subscription products and prices
  - Test webhook endpoints locally
  - Manage customer payment methods
  - Handle subscription modifications
- Uses **supabase** to sync payment data with database
- Uses **context7** for Stripe best practices and EU compliance
- Uses **taskmaster-ai** to manage payment feature rollout

**Integration Points:**
```typescript
// Example Stripe webhook handler
async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update order status in Supabase
      break;
    case 'customer.subscription.created':
      // Create subscription record
      break;
    case 'invoice.payment_failed':
      // Handle failed subscription payment
      break;
  }
}
```

---

## 🚀 Claude Code Commands

### Command 1: Initialize Project
```bash
# Full project setup with all dependencies
claude-code "Initialize the Honduras Coffee e-commerce project with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui with claymorphism theme, Supabase client, and Stripe integration. Set up the project structure as defined in the PRD with separate shop and admin routes. Create the base configuration files and environment variables template."
```

### Command 2: Build Core Features
```bash
# Implement the main shopping experience
claude-code "Build the complete product catalog system with: 1) Product listing page with filters for Honduras origin stories, 2) Product detail pages showing tasting notes and altitude info, 3) Cart functionality using Zustand, 4) Guest checkout flow with Stripe Payment Elements, 5) Subscription toggle on product pages. Use the shadcn/ui components and ensure all pages are responsive."
```

### Command 3: Create Admin Panel
```bash
# Complete admin dashboard implementation
claude-code "Create the admin panel with: 1) Authentication using Supabase Auth with admin role checking, 2) Product management CRUD with image upload, 3) Order management with status updates and shipping labels, 4) Inventory tracking with stock alerts, 5) Analytics dashboard showing sales, best sellers, and subscription metrics. Implement proper RLS policies and use shadcn/ui data tables."
```

---

## 📋 Agent Collaboration Workflow

### Typical Development Flow:

1. **Frontend Architect** creates UI components and pages
2. **Backend Engineer** implements required APIs and database operations  
3. **Payment Specialist** integrates Stripe for the checkout flow
4. All agents use **taskmaster-ai** to coordinate and track progress

### Example Task Breakdown:

```yaml
Epic: Implement Subscription System
├── Frontend Tasks (frontend-architect):
│   ├── Create subscription toggle component
│   ├── Build subscription management dashboard
│   └── Design frequency selector UI
│
├── Backend Tasks (backend-engineer):
│   ├── Create subscriptions table
│   ├── Implement RLS policies
│   └── Build subscription CRUD operations
│
└── Payment Tasks (payment-specialist):
    ├── Create Stripe subscription products
    ├── Implement webhook handlers
    └── Build customer portal integration
```

### Cross-Agent Communication:
- Agents share types via `/types/*` directory
- API contracts defined in `/lib/api/*`
- Shared utilities in `/lib/utils/*`
- Documentation in `/docs/*` for handoffs

---

## 🔑 Environment Setup

Each agent needs access to:

```env
# Frontend Architect needs:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=

# Backend Engineer needs:
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
SUPABASE_JWT_SECRET=

# Payment Specialist needs:
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SUBSCRIPTION_PRICE_IDS=
```

---

## 📚 MCP Server Configuration

Ensure these MCP servers are installed and configured:

1. **shadcn-ui**: For UI component generation
   ```bash
   npm install -g @shadcn/ui-mcp
   ```

2. **supabase**: For backend operations
   ```bash
   npm install -g @supabase/mcp
   ```

3. **stripe**: For payment processing
   ```bash
   npm install -g @stripe/mcp
   ```

4. **context7**: For documentation lookup
   ```bash
   npm install -g @context7/mcp
   ```

5. **taskmaster-ai**: For task management
   ```bash
   npm install -g @taskmaster/mcp
   ```

6. **playwright**: For testing
   ```bash
   npm install -g @playwright/mcp
   ```

Each agent will automatically utilize these MCP servers based on their defined responsibilities and the task at hand.