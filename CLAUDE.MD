# Claude Configuration for Modern Business Template

This repository contains a modern, AI-optimized template for building business websites with agentic coding workflows.

## Project Overview

**Tech Stack:**
- **Frontend:** node.js + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Real-time + Storage)
- **Payments:** Stripe
- **Deployment:** Vercel + Railway
- **Testing:** Playwright + Vitest
- **AI Agents:** Claude Code with specialized agents

**Target Features:**
- E-commerce/Retail: Product catalog, ordering, inventory management, loyalty programs, POS integration
- Service/Booking: Appointment scheduling, service provider management, memberships, payments
- Core: User authentication, admin dashboard, analytics, mobile-first design

## Development Philosophy

This codebase is designed for **agentic development** where AI agents collaborate with humans to build production-ready applications rapidly. Every component, API, and configuration follows predictable patterns that AI can understand and extend.

## Code Standards

### TypeScript Requirements
- **Strict mode enabled** - No `any` types allowed
- **Explicit return types** for all functions
- **Interface over type aliases** for object shapes
- **Generated types from Supabase** for database operations

### Component Patterns
```tsx
// Always use this pattern for React components
interface ComponentNameProps {
  prop1: string
  prop2?: number
  onAction?: () => void
}

export default function ComponentName({ prop1, prop2, onAction }: ComponentNameProps) {
  // Component logic here
  return (
    <div className="tailwind-classes">
      {/* JSX here */}
    </div>
  )
}
```

### API Endpoint Patterns
```typescript
// src/pages/api/[endpoint].ts
import type { APIRoute } from 'node.js'
import { createServerClient } from '@supabase/ssr'

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createServerClient(/* config */)
    // API logic here
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

### Database Patterns
- **Always use RLS (Row Level Security)**
- **UUID primary keys** for all tables
- **created_at and updated_at** timestamps on all tables
- **Proper foreign key relationships** with CASCADE deletes where appropriate
- **Descriptive table and column names** (no abbreviations)

## File Organization

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated)
│   ├── forms/           # Form components with validation
│   ├── booking/         # Booking/appointment system components
│   ├── shop/            # E-commerce/catalog components
│   ├── admin/           # Admin dashboard components
│   └── layout/          # Layout and navigation
├── pages/
│   ├── api/             # API endpoints
│   ├── auth/            # Authentication pages
│   ├── admin/           # Admin dashboard pages
│   ├── booking/         # Booking/appointment pages
│   └── shop/            # E-commerce/catalog pages
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   ├── stripe.ts        # Stripe client configuration
│   ├── utils.ts         # Utility functions
│   ├── validations.ts   # Zod schemas
│   └── constants.ts     # Application constants
├── types/
│   ├── database.ts      # Generated Supabase types
│   ├── stripe.ts        # Stripe type definitions
│   └── app.ts           # Application-specific types
└── styles/
    └── globals.css      # Global styles and Tailwind imports
```

## Agent Specializations

When working on this codebase, please identify yourself as one of these specialized agents based on the task:

### 🎨 Frontend Agent
**Expertise:** React components, node.js pages, UI/UX, Tailwind CSS, shadcn/ui
**Focus:** User interface, forms, responsive design, accessibility
**Commands:** `/component`, `/page`, `/style`

### 🔧 Backend Agent  
**Expertise:** API endpoints, Supabase integration, authentication, business logic
**Focus:** Server-side logic, database operations, API design, security
**Commands:** `/api`, `/auth`, `/integration`

### 🗄️ Database Agent
**Expertise:** PostgreSQL, schema design, migrations, RLS policies, optimization
**Focus:** Data modeling, performance, security policies, relationships
**Commands:** `/schema`, `/migration`, `/policy`

### 💳 Payment Agent
**Expertise:** Stripe integration, webhooks, subscription billing, PCI compliance
**Focus:** Payment processing, billing logic, financial workflows
**Commands:** `/payment`, `/subscription`, `/webhook`

### 🧪 Testing Agent
**Expertise:** Playwright, Vitest, E2E testing, performance testing
**Focus:** Test automation, quality assurance, bug prevention
**Commands:** `/test`, `/e2e`, `/performance`

## Development Commands

Use these commands to request specific types of work:

- `/component [name]` - Create a new React component with TypeScript and Tailwind
- `/page [route]` - Create a new node.js page with proper structure
- `/api [endpoint]` - Create a new API endpoint with error handling
- `/schema [table]` - Design or modify database schema
- `/test [feature]` - Generate comprehensive tests for a feature
- `/deploy` - Prepare application for production deployment

## Environment Configuration

```bash
# Required Environment Variables
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_or_live_key
STRIPE_SECRET_KEY=sk_test_or_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Quality Requirements

### Performance Standards
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score:** 90+ in all categories
- **Bundle Size:** Keep JavaScript bundles under 100KB gzipped
- **API Response Time:** < 200ms for database queries

### Security Standards
- **Authentication:** All sensitive routes require authentication
- **Authorization:** Implement proper RLS policies in Supabase
- **Input Validation:** Use Zod schemas for all user inputs
- **Rate Limiting:** Implement rate limiting on all API endpoints

### Accessibility Standards
- **WCAG 2.1 AA compliance** minimum
- **Semantic HTML** for all components
- **Keyboard navigation** support
- **Screen reader compatibility**
- **Color contrast** ratios meeting standards

## Testing Strategy

### Unit Tests (Vitest)
- All utility functions
- Form validation logic
- Business logic functions
- API helpers

### Integration Tests (Playwright)
- User authentication flows
- Booking/appointment workflows
- Payment processing
- Admin dashboard functionality

### E2E Tests (Playwright)
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Performance benchmarks

## Deployment Process

1. **Development:** Feature branches with AI agent collaboration
2. **Testing:** Automated test suite must pass
3. **Review:** AI-powered code review + human approval
4. **Staging:** Deploy to staging environment for final testing
5. **Production:** Deploy to Vercel/Railway with monitoring

## AI Collaboration Guidelines

### When Creating Components
1. Always include TypeScript interfaces
2. Use shadcn/ui components when possible
3. Implement proper error handling
4. Add loading states and empty states
5. Ensure mobile responsiveness

### When Building APIs
1. Validate all inputs with Zod
2. Implement proper error responses
3. Add rate limiting middleware
4. Include proper CORS headers
5. Use consistent response formats

### When Working with Database
1. Always use parameterized queries
2. Implement RLS policies
3. Add proper indexes for performance
4. Use transactions for related operations
5. Handle constraint violations gracefully

## Success Metrics

A successful implementation should have:
- **100% TypeScript coverage** with no `any` types
- **90+ Lighthouse scores** across all pages
- **Zero accessibility violations** in automated testing
- **Sub-200ms API response times** for all endpoints
- **Complete test coverage** for critical user flows

## Getting Started

1. Clone this template repository
2. Run the setup script: `npm run setup`
3. Configure environment variables
4. Deploy database schema to Supabase
5. Start development server: `npm run dev`
6. Begin building features with AI agent collaboration

Remember: This codebase is designed for **predictable, scalable, AI-friendly development**. Every decision should optimize for both human maintainability and AI comprehension.

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
