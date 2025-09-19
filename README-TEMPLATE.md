# Modern Business Template

A modern, AI-optimized template for building business websites with agentic coding workflows. Perfect for retail, services, e-commerce, or any business requiring user management and payments.

## Tech Stack

- **Frontend:** Astro + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Real-time + Storage)
- **Payments:** Stripe
- **Testing:** Playwright + Vitest
- **AI Agents:** Claude Code with specialized agents

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone <your-repo-url>
   cd business-template
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.sample .env
   # Edit .env with your actual credentials
   ```

3. **Configure MCP Servers (Optional):**
   Add to your `.claude/settings.json` for enhanced AI capabilities:

   **Supabase MCP Server:**
   ```json
   {
     "mcpServers": {
       "supabase": {
         "command": "npx",
         "args": [
           "-y",
           "@supabase/mcp-server-supabase@latest",
           "--read-only",
           "--project-ref=<your-project-ref>"
         ],
         "env": {
           "SUPABASE_ACCESS_TOKEN": "<your-personal-access-token>"
         }
       }
     }
   }
   ```

   **Stripe MCP Server:**
   ```json
   {
     "mcpServers": {
       "stripe": {
         "command": "npx",
         "args": ["-y", "@stripe/mcp", "--tools=all"],
         "env": {
           "STRIPE_SECRET_KEY": "sk_test_YOUR_API_KEY"
         }
       }
     }
   }
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── forms/           # Form components
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
│   ├── supabase.ts      # Supabase client
│   ├── stripe.ts        # Stripe client
│   ├── utils.ts         # Utility functions
│   ├── validations.ts   # Zod schemas
│   └── constants.ts     # App constants
├── types/               # TypeScript definitions
└── styles/              # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:e2e` - Run E2E tests
- `npm run test:e2e:ui` - Run E2E tests with UI

## Environment Variables

See `.env.sample` for required environment variables:

- Supabase credentials
- Stripe keys
- App configuration

## MCP Server Setup

When creating a new project, configure Supabase and MCP servers for enhanced AI development capabilities:

### Required Links:
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com

### Supabase MCP Configuration:
1. Get your project reference from your Supabase dashboard URL
2. Generate a personal access token from Supabase settings
3. Add the configuration to your Claude settings

### Stripe MCP Configuration:
1. Get your API keys from Stripe dashboard
2. Use test keys for development environment
3. Configure the MCP server for payment processing capabilities

## Features

### E-commerce/Retail
- Product/service catalog
- Online ordering system
- Inventory management
- Customer loyalty programs
- POS integration ready

### Service/Appointment Business
- Booking/scheduling system
- Service provider management
- Membership/subscription management
- Payment processing

### Core Features
- User authentication
- Admin dashboard
- Business analytics ready
- Mobile-first design
- TypeScript strict mode
- Comprehensive testing setup

## Development Workflow

This template is optimized for AI-assisted development. See `CLAUDE.md` for detailed instructions on working with AI agents.

## License

MIT License - see LICENSE file for details