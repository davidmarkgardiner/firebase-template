# 🚀 Honduras Coffee Deployment Setup Guide

This guide covers setting up environment variables for local development and production deployment to Vercel.

## 📋 Environment Configuration Overview

The project uses different environment files for different deployment stages:

- **`.env.local`** - Local development (localhost:3000)
- **`.env.production`** - Production deployment template (Vercel)
- **`.env.sample`** - Template with all required variables

## 🏠 Local Development Setup

### 1. Environment Variables
The `.env.local` file has been configured with the Honduras Coffee Supabase project:

```bash
# Supabase (Already configured)
PUBLIC_SUPABASE_URL=https://ncnigccrjowzarspxeww.supabase.co
PUBLIC_SUPABASE_ANON_KEY=[configured]
SUPABASE_SERVICE_ROLE_KEY=[configured]

# Stripe (Test mode)
PUBLIC_STRIPE_PUBLISHABLE_KEY=[test key configured]
STRIPE_SECRET_KEY=[test key configured]

# App URLs
PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Setup
The Supabase database schema has been created with:
- ✅ 15 core tables (products, orders, subscriptions, etc.)
- ✅ Row Level Security policies
- ✅ Database functions and triggers
- ✅ Honduras coffee seed data
- ✅ Analytics views

### 3. Local Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## 🌐 Production Deployment (Vercel)

### 1. Vercel Project Setup

**Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy project
vercel

# Follow prompts to link/create Vercel project
```

### 2. Environment Variables in Vercel

Go to **Vercel Dashboard > Project > Settings > Environment Variables** and add:

#### Required Variables:
```bash
# Supabase (Same as local)
PUBLIC_SUPABASE_URL=https://ncnigccrjowzarspxeww.supabase.co
PUBLIC_SUPABASE_ANON_KEY=[same as local]
SUPABASE_SERVICE_ROLE_KEY=[same as local]

# Stripe (LIVE KEYS - Get from Stripe Dashboard)
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your_live_key]
STRIPE_SECRET_KEY=sk_live_[your_live_key]
STRIPE_WEBHOOK_SECRET=whsec_[your_webhook_secret]

# App URLs (Update with your domain)
PUBLIC_APP_URL=https://[your-domain].vercel.app
NEXT_PUBLIC_APP_URL=https://[your-domain].vercel.app
NODE_ENV=production

# Email (Get API key from Resend.com)
RESEND_API_KEY=re_[your_resend_key]
RESEND_FROM_EMAIL=orders@[yourdomain].com

# Admin
ADMIN_EMAIL=admin@[yourdomain].com
```

### 3. Stripe Live Mode Setup

**To switch to live payments:**

1. **Get Live Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Toggle to "Live mode"
   - Copy Publishable key (`pk_live_...`)
   - Copy Secret key (`sk_live_...`)

2. **Setup Webhook:**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://[your-domain].vercel.app/api/stripe/webhooks`
   - Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated`
   - Copy webhook secret (`whsec_...`)

3. **Update Vercel Environment:**
   - Replace test keys with live keys
   - Add webhook secret

### 4. Domain Configuration

**Custom Domain (Optional):**
1. Go to Vercel Dashboard > Project > Settings > Domains
2. Add your custom domain (e.g., `hondurascoffee.com`)
3. Update environment variables with new domain
4. Update Stripe webhook URL with new domain

## 🗄️ Database Migration to Production

The database is already set up on Supabase and will work for both local and production:

```bash
# Database URL (same for both environments)
https://ncnigccrjowzarspxeww.supabase.co

# No migration needed - already configured
```

## 📧 Email Setup (Resend)

**Set up transactional emails:**

1. **Create Resend Account:**
   - Go to [resend.com](https://resend.com)
   - Sign up and verify your account

2. **Add Domain:**
   - Add your domain (e.g., `hondurascoffee.com`)
   - Configure DNS records
   - Verify domain

3. **Get API Key:**
   - Go to API Keys section
   - Create new API key
   - Add to environment variables

4. **Configure From Email:**
   - Use verified domain: `orders@yourdomain.com`

## 🔒 Security Checklist

**Before going live:**

- [ ] All environment variables set in Vercel
- [ ] Stripe webhook configured with live keys
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Supabase RLS policies enabled
- [ ] Admin email configured
- [ ] Database backups enabled (Supabase Pro)
- [ ] Domain verified in Resend
- [ ] GDPR compliance implemented (EU customers)

## 📊 Monitoring & Analytics

**Optional additions:**

```bash
# Vercel Analytics
VERCEL_ANALYTICS_ID=[from Vercel dashboard]

# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Sentry (Error tracking)
SENTRY_DSN=[your_sentry_dsn]
```

## 🚨 Troubleshooting

**Common issues:**

1. **Environment variables not loading:**
   - Check variable names match exactly
   - Restart Vercel deployment
   - Check Vercel environment settings

2. **Stripe payments failing:**
   - Verify live keys are correct
   - Check webhook endpoint is accessible
   - Test webhook in Stripe dashboard

3. **Database connection issues:**
   - Verify Supabase project is active
   - Check RLS policies
   - Test connection with service role key

4. **Email not sending:**
   - Verify Resend domain
   - Check API key permissions
   - Test with Resend's test mode

## 📞 Support

**Getting help:**

- **Supabase:** [docs.supabase.com](https://docs.supabase.com)
- **Stripe:** [stripe.com/docs](https://stripe.com/docs)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Resend:** [resend.com/docs](https://resend.com/docs)

The Honduras Coffee e-commerce platform is now ready for deployment! ☕🇭🇳