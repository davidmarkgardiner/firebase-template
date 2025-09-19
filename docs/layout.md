# Honduras Coffee - Complete Project Structure

## 📁 Project Layout

```
honduras-coffee/
├── .env.local                        # Local environment variables
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore file
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind + shadcn config
├── components.json                   # shadcn/ui configuration
├── README.md                         # Project documentation
│
├── app/                              # Next.js App Router
│   ├── favicon.ico                  # Site favicon
│   ├── layout.tsx                   # Root layout with providers
│   ├── globals.css                  # Global styles + Tailwind
│   ├── not-found.tsx                # 404 page
│   ├── error.tsx                    # Error boundary
│   │
│   ├── (shop)/                      # Shop layout group
│   │   ├── layout.tsx               # Shop layout (header/footer)
│   │   ├── page.tsx                 # Homepage
│   │   ├── about/
│   │   │   └── page.tsx             # About/Our Story page
│   │   ├── products/
│   │   │   ├── page.tsx             # Product listing
│   │   │   └── [slug]/
│   │   │       ├── page.tsx         # Product detail
│   │   │       └── loading.tsx      # Loading state
│   │   ├── collections/
│   │   │   ├── page.tsx             # All collections
│   │   │   └── [collection]/
│   │   │       └── page.tsx         # Collection products
│   │   ├── cart/
│   │   │   └── page.tsx             # Shopping cart
│   │   ├── checkout/
│   │   │   ├── page.tsx             # Checkout flow
│   │   │   ├── success/
│   │   │   │   └── page.tsx         # Order success
│   │   │   └── cancel/
│   │   │       └── page.tsx         # Order cancelled
│   │   ├── account/
│   │   │   ├── layout.tsx           # Account layout (protected)
│   │   │   ├── page.tsx             # Account dashboard
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx         # Order history
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Order detail
│   │   │   ├── subscription/
│   │   │   │   └── page.tsx         # Manage subscription
│   │   │   ├── addresses/
│   │   │   │   └── page.tsx         # Address book
│   │   │   └── settings/
│   │   │       └── page.tsx         # Account settings
│   │   ├── subscription/
│   │   │   └── page.tsx             # Subscription plans
│   │   ├── brewing-guides/
│   │   │   ├── page.tsx             # Brewing guide list
│   │   │   └── [guide]/
│   │   │       └── page.tsx         # Individual guide
│   │   └── contact/
│   │       └── page.tsx             # Contact form
│   │
│   ├── (auth)/                      # Auth layout group
│   │   ├── layout.tsx               # Minimal auth layout
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── signup/
│   │   │   └── page.tsx             # Sign up page
│   │   ├── forgot-password/
│   │   │   └── page.tsx             # Password reset
│   │   └── verify-email/
│   │       └── page.tsx             # Email verification
│   │
│   ├── admin/                       # Admin panel
│   │   ├── layout.tsx               # Admin layout (protected)
│   │   ├── page.tsx                 # Admin dashboard
│   │   ├── products/
│   │   │   ├── page.tsx             # Product list
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Create product
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx     # Edit product
│   │   ├── orders/
│   │   │   ├── page.tsx             # Order management
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Order detail/edit
│   │   ├── inventory/
│   │   │   └── page.tsx             # Stock management
│   │   ├── customers/
│   │   │   ├── page.tsx             # Customer list
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Customer detail
│   │   ├── subscriptions/
│   │   │   └── page.tsx             # Subscription management
│   │   ├── analytics/
│   │   │   └── page.tsx             # Analytics dashboard
│   │   └── settings/
│   │       └── page.tsx             # Admin settings
│   │
│   └── api/                         # API routes
│       ├── auth/
│       │   ├── callback/route.ts    # Supabase auth callback
│       │   ├── login/route.ts       # Login endpoint
│       │   ├── logout/route.ts      # Logout endpoint
│       │   └── register/route.ts    # Registration endpoint
│       ├── stripe/
│       │   ├── checkout/route.ts    # Create checkout session
│       │   ├── webhooks/route.ts    # Stripe webhooks
│       │   ├── customer-portal/route.ts
│       │   └── subscription/
│       │       ├── create/route.ts
│       │       ├── pause/route.ts
│       │       └── cancel/route.ts
│       ├── products/
│       │   ├── route.ts             # Products CRUD
│       │   └── [id]/route.ts        # Single product
│       ├── orders/
│       │   ├── route.ts             # Orders CRUD
│       │   └── [id]/route.ts        # Single order
│       ├── admin/
│       │   ├── upload/route.ts      # Image upload
│       │   ├── inventory/route.ts   # Stock updates
│       │   └── reports/route.ts     # Generate reports
│       └── webhooks/
│           └── resend/route.ts      # Email service webhooks
│
├── components/                       # Reusable components
│   ├── ui/                          # shadcn/ui components
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── tooltip.tsx
│   │
│   ├── shop/                        # Shop components
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Shop header with nav
│   │   │   ├── Footer.tsx          # Shop footer
│   │   │   ├── MobileMenu.tsx      # Mobile navigation
│   │   │   └── CartButton.tsx      # Cart icon with count
│   │   ├── product/
│   │   │   ├── ProductCard.tsx     # Product grid card
│   │   │   ├── ProductGrid.tsx     # Products container
│   │   │   ├── ProductImages.tsx   # Image gallery
│   │   │   ├── ProductInfo.tsx     # Product details
│   │   │   ├── TastingNotes.tsx    # Flavor profile
│   │   │   ├── OriginStory.tsx     # Farm information
│   │   │   ├── GrindSelector.tsx   # Grind options
│   │   │   └── QuantityPicker.tsx  # Quantity selector
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx      # Slide-out cart
│   │   │   ├── CartItem.tsx        # Cart line item
│   │   │   ├── CartSummary.tsx     # Price breakdown
│   │   │   └── EmptyCart.tsx       # Empty state
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx    # Main checkout form
│   │   │   ├── ShippingForm.tsx    # Shipping address
│   │   │   ├── PaymentForm.tsx     # Stripe elements
│   │   │   ├── OrderReview.tsx     # Order summary
│   │   │   └── GuestCheckout.tsx   # Guest options
│   │   ├── subscription/
│   │   │   ├── SubscriptionToggle.tsx
│   │   │   ├── FrequencySelector.tsx
│   │   │   ├── SubscriptionBenefits.tsx
│   │   │   └── ManageSubscription.tsx
│   │   └── common/
│   │       ├── PriceDisplay.tsx    # Format prices
│   │       ├── StockBadge.tsx      # In stock/out
│   │       ├── LoadingSpinner.tsx  # Loading state
│   │       ├── ErrorMessage.tsx    # Error display
│   │       └── SuccessMessage.tsx  # Success state
│   │
│   ├── admin/                       # Admin components
│   │   ├── layout/
│   │   │   ├── AdminHeader.tsx     # Admin header
│   │   │   ├── AdminSidebar.tsx    # Navigation sidebar
│   │   │   └── AdminBreadcrumb.tsx # Breadcrumb nav
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx       # Metric card
│   │   │   ├── RevenueChart.tsx    # Revenue graph
│   │   │   ├── OrdersTable.tsx     # Recent orders
│   │   │   └── LowStockAlert.tsx   # Stock warnings
│   │   ├── products/
│   │   │   ├── ProductForm.tsx     # Create/edit form
│   │   │   ├── ProductTable.tsx    # Products list
│   │   │   ├── VariantManager.tsx  # Manage variants
│   │   │   └── ImageUploader.tsx   # Product images
│   │   ├── orders/
│   │   │   ├── OrderTable.tsx      # Orders list
│   │   │   ├── OrderDetail.tsx     # Order view
│   │   │   ├── OrderStatus.tsx     # Status update
│   │   │   └── ShippingLabel.tsx   # Print label
│   │   └── common/
│   │       ├── DataTable.tsx       # Reusable table
│   │       ├── SearchBar.tsx       # Search input
│   │       ├── FilterDropdown.tsx  # Filter options
│   │       ├── ExportButton.tsx    # Export CSV
│   │       └── ConfirmDialog.tsx   # Confirm actions
│   │
│   └── providers/                   # Context providers
│       ├── AuthProvider.tsx        # Authentication
│       ├── CartProvider.tsx        # Cart state
│       ├── ThemeProvider.tsx       # Theme context
│       └── ToastProvider.tsx       # Toast notifications
│
├── lib/                             # Utilities and configs
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   ├── admin.ts                # Admin client
│   │   ├── middleware.ts           # Auth middleware
│   │   └── types.ts                # Generated types
│   ├── stripe/
│   │   ├── client.ts               # Stripe browser
│   │   ├── server.ts               # Stripe server
│   │   ├── webhooks.ts            # Webhook handlers
│   │   └── products.ts             # Product sync
│   ├── email/
│   │   ├── client.ts               # Resend client
│   │   ├── templates/
│   │   │   ├── order-confirmation.tsx
│   │   │   ├── shipping-notification.tsx
│   │   │   ├── subscription-welcome.tsx
│   │   │   └── abandoned-cart.tsx
│   │   └── send.ts                 # Email sender
│   ├── utils/
│   │   ├── formatters.ts           # Format helpers
│   │   ├── validators.ts           # Zod schemas
│   │   ├── constants.ts            # App constants
│   │   ├── helpers.ts              # Misc helpers
│   │   └── cn.ts                   # Class names
│   └── config/
│       ├── site.ts                 # Site metadata
│       ├── navigation.ts           # Nav links
│       └── countries.ts            # EU countries
│
├── hooks/                           # Custom React hooks
│   ├── useAuth.ts                  # Auth state
│   ├── useCart.ts                  # Cart operations
│   ├── useCheckout.ts              # Checkout flow
│   ├── useProducts.ts              # Product queries
│   ├── useOrders.ts                # Order queries
│   ├── useSubscription.ts          # Subscription state
│   ├── useToast.ts                 # Toast notifications
│   ├── useDebounce.ts              # Debounce values
│   ├── useLocalStorage.ts          # Local storage
│   └── useMediaQuery.ts            # Responsive
│
├── types/                           # TypeScript types
│   ├── database.ts                 # Supabase types
│   ├── stripe.ts                   # Stripe types
│   ├── shop.ts                     # Shop types
│   ├── admin.ts                    # Admin types
│   ├── api.ts                      # API types
│   └── global.d.ts                 # Global types
│
├── styles/                          # Additional styles
│   ├── globals.css                 # Global + Tailwind
│   ├── admin.css                   # Admin styles
│   └── animations.css              # Custom animations
│
├── public/                          # Static assets
│   ├── images/
│   │   ├── logo.svg               # Site logo
│   │   ├── hero/                  # Hero images
│   │   ├── products/              # Product images
│   │   ├── about/                 # About page images
│   │   └── icons/                 # UI icons
│   ├── fonts/                     # Custom fonts
│   └── manifest.json              # PWA manifest
│
├── supabase/                        # Supabase config
│   ├── migrations/                 # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_products_table.sql
│   │   ├── 003_orders_table.sql
│   │   ├── 004_subscriptions.sql
│   │   └── 005_rls_policies.sql
│   ├── functions/                  # Edge functions
│   │   ├── process-order/
│   │   ├── update-inventory/
│   │   └── send-notification/
│   ├── seed.sql                   # Seed data
│   └── config.toml                # Supabase config
│
├── tests/                          # Test files
│   ├── e2e/                       # Playwright tests
│   │   ├── checkout.spec.ts
│   │   ├── subscription.spec.ts
│   │   └── admin.spec.ts
│   ├── unit/                      # Unit tests
│   │   ├── cart.test.ts
│   │   └── formatters.test.ts
│   └── fixtures/                  # Test data
│       └── products.json
│
└── docs/                           # Documentation
    ├── API.md                      # API documentation
    ├── DEPLOYMENT.md               # Deployment guide
    ├── CONTRIBUTING.md             # Contribution guide
    └── ARCHITECTURE.md             # Architecture overview
```

## 📝 File Descriptions

### Core Application Files

#### `app/layout.tsx`
Root layout wrapping entire application with providers:
```tsx
- Supabase Provider
- Theme Provider (claymorphism)
- Cart Provider (Zustand)
- Toast Provider
- Analytics
```

#### `app/(shop)/layout.tsx`
Shop-specific layout with:
```tsx
- Header with navigation
- Cart drawer
- Footer with links
- Newsletter signup
```

#### `app/admin/layout.tsx`
Admin layout with:
```tsx
- Auth protection
- Admin sidebar
- Role-based access
- Admin-specific providers
```

### Key Components

#### Shop Components
- **ProductCard**: Displays product in grid with hover effects
- **CartDrawer**: Slide-out cart with real-time updates
- **CheckoutForm**: Multi-step checkout with Stripe
- **SubscriptionToggle**: Switch between one-time and subscription

#### Admin Components
- **DataTable**: Reusable table with sorting/filtering
- **ProductForm**: Create/edit products with variants
- **OrderTable**: Manage orders with bulk actions
- **StatsCard**: Display key metrics

### API Routes

#### Authentication
- `/api/auth/*`: Supabase auth endpoints

#### Stripe
- `/api/stripe/checkout`: Create checkout session
- `/api/stripe/webhooks`: Handle Stripe events
- `/api/stripe/customer-portal`: Customer management

#### Admin
- `/api/admin/*`: Protected admin endpoints

### Database Structure

#### Key Tables
- `products`: Coffee products with origin info
- `product_variants`: Grind types and sizes
- `orders`: Customer orders
- `subscriptions`: Recurring orders
- `inventory_logs`: Stock tracking

### Environment Variables

```env
# Public (exposed to browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=

# Server-only
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```

## 🚀 Getting Started

1. **Clone repository**
```bash
git clone [repo-url]
cd honduras-coffee
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup shadcn/ui with claymorphism**
```bash
npx shadcn@latest init
npx shadcn@latest add https://tweakcn.com/r/themes/claymorphism.json
```

4. **Configure environment**
```bash
cp .env.example .env.local
# Add your keys
```

5. **Run migrations**
```bash
npx supabase db push
```

6. **Start development**
```bash
npm run dev
```

## 📦 Dependencies

### Core
- `next`: 14.x
- `react`: 18.x
- `typescript`: 5.x

### UI
- `tailwindcss`: 3.x
- `@radix-ui/*`: UI primitives
- `shadcn/ui`: Component library
- `framer-motion`: Animations

### Backend
- `@supabase/supabase-js`: Database
- `@supabase/auth-helpers-nextjs`: Auth

### Payments
- `stripe`: Payment processing
- `@stripe/stripe-js`: Frontend

### State
- `zustand`: Cart state
- `@tanstack/react-query`: Server state

### Forms
- `react-hook-form`: Form handling
- `zod`: Validation

### Email
- `resend`: Transactional emails
- `@react-email/components`: Email templates