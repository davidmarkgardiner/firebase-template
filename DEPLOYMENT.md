# Deployment Guide - Honduras Coffee

This guide covers deploying the Honduras Coffee e-commerce platform to production using Vercel (frontend) and Railway/Supabase (backend).

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Supabase project created and configured
- [ ] Stripe account set up (live keys obtained)
- [ ] Domain name purchased and DNS configured
- [ ] Email service configured (Resend/SendGrid)
- [ ] Analytics tracking set up (Google Analytics)

### Code Preparation
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Build process completed without errors
- [ ] Performance optimizations applied
- [ ] Security review completed

## 🚀 Production Deployment

### Step 1: Supabase Production Setup

1. **Create Production Database**
   ```bash
   # Run migrations on production database
   npx supabase db push --project-ref your-prod-ref
   
   # Apply RLS policies
   npx supabase db push --include-seed
   ```

2. **Configure Auth Settings**
   - Enable email confirmations
   - Set up custom SMTP (optional)
   - Configure OAuth providers if needed
   - Set redirect URLs for production domain

3. **Set up Storage Buckets**
   ```sql
   -- Create product images bucket
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('product-images', 'product-images', true);
   
   -- Set up RLS for bucket
   CREATE POLICY "Public Access" ON storage.objects
   FOR SELECT USING (bucket_id = 'product-images');
   ```

### Step 2: Stripe Production Configuration

1. **Switch to Live Keys**
   - Replace all `pk_test_` and `sk_test_` keys with live keys
   - Update webhook endpoints to production URLs

2. **Configure Webhooks**
   - Add webhook endpoint: `https://yourdomain.com/api/stripe/webhooks`
   - Enable events: `payment_intent.succeeded`, `invoice.payment_succeeded`, etc.
   - Copy webhook signing secret

3. **Set up Products in Stripe**
   ```bash
   # Sync products to Stripe (if using price syncing)
   npm run stripe:sync-products
   ```

### Step 3: Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Environment Variables in Vercel**
   Go to Project Settings > Environment Variables and add:
   
   ```env
   # Production Environment Variables
   PUBLIC_SUPABASE_URL=https://your-prod-ref.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   
   PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
   STRIPE_SECRET_KEY=sk_live_your_live_secret
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   PUBLIC_APP_URL=https://hondurascoffee.eu
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=orders@hondurascoffee.eu
   
   JWT_SECRET=your_super_secure_jwt_secret_min_32_chars
   ADMIN_EMAIL=admin@hondurascoffee.eu
   NODE_ENV=production
   ```

3. **Configure Domains**
   - Add custom domain in Vercel dashboard
   - Configure DNS records as instructed
   - Enable SSL (automatic with Vercel)

### Step 4: Database Seeding

1. **Add Initial Admin User**
   ```sql
   -- Run in Supabase SQL editor
   INSERT INTO auth.users (
     id,
     email,
     encrypted_password,
     email_confirmed_at,
     created_at,
     updated_at,
     role
   ) VALUES (
     gen_random_uuid(),
     'admin@hondurascoffee.eu',
     crypt('your_secure_password', gen_salt('bf')),
     now(),
     now(),
     now(),
     'admin'
   );
   ```

2. **Seed Product Data**
   ```bash
   # Run seed script
   npm run db:seed
   ```

## 🔐 Security Configuration

### SSL/TLS Setup
- Vercel provides automatic SSL
- Ensure all external API calls use HTTPS
- Configure HSTS headers

### Content Security Policy
Add to `astro.config.mjs`:
```js
export default defineConfig({
  output: 'server',
  security: {
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https://your-supabase-url.supabase.co'],
        'connect-src': ["'self'", 'https://api.stripe.com', 'https://your-supabase-url.supabase.co']
      }
    }
  }
})
```

### Rate Limiting
Configure rate limiting for API endpoints:
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})
```

## 📊 Monitoring & Analytics

### Error Tracking
1. **Sentry Setup**
   ```bash
   npm install @sentry/astro
   ```

2. **Configure in `astro.config.mjs`**
   ```js
   import { sentry } from '@sentry/astro'
   
   export default defineConfig({
     integrations: [
       sentry({
         dsn: 'your-sentry-dsn'
       })
     ]
   })
   ```

### Performance Monitoring
- Enable Vercel Analytics
- Set up Google Analytics/Plausible
- Configure Core Web Vitals tracking

### Health Checks
Create health check endpoint:
```typescript
// src/pages/api/health.ts
export async function GET() {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 Post-Deployment

### Testing Production
1. **Smoke Tests**
   - Homepage loads correctly
   - Product browsing works
   - Search functionality
   - Add to cart flow
   - Checkout process (with test card)
   - User registration/login

2. **Performance Testing**
   ```bash
   # Lighthouse audit
   npx lighthouse https://hondurascoffee.eu --view
   
   # Load testing
   npx artillery quick --count 100 --num 10 https://hondurascoffee.eu
   ```

### Monitoring Setup
1. **Uptime Monitoring**
   - UptimeRobot or similar
   - Monitor key endpoints: /, /products, /api/health

2. **Error Alerting**
   - Configure Sentry alerts
   - Set up Slack/email notifications

3. **Performance Monitoring**
   - Monitor Core Web Vitals
   - Track conversion funnel metrics
   - Set up business KPI dashboards

## 🚨 Troubleshooting

### Common Issues

**Build Failures**
- Check TypeScript errors
- Verify all environment variables are set
- Ensure all dependencies are in package.json

**Database Connection Issues**
- Verify Supabase URL and keys
- Check RLS policies
- Confirm database migrations ran successfully

**Stripe Integration Problems**
- Verify webhook endpoints are reachable
- Check webhook secret matches
- Confirm live/test key consistency

**Performance Issues**
- Enable Vercel Edge Functions for API routes
- Optimize images with Vercel Image Optimization
- Implement proper caching headers

### Rollback Procedure
```bash
# Rollback to previous deployment
vercel rollback https://hondurascoffee.eu

# Rollback database migration (if needed)
npx supabase db reset --project-ref your-prod-ref
```

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Check Stripe webhook delivery logs
4. Review error tracking in Sentry

## 🔄 Maintenance

### Regular Tasks
- Weekly dependency updates
- Monthly security audits
- Quarterly performance reviews
- Backup verification (Supabase handles automatic backups)

### Scaling Considerations
- Monitor Supabase usage and upgrade plan if needed
- Consider CDN for static assets
- Implement caching strategies for high-traffic periods
- Plan for seasonal traffic spikes (holidays, harvest seasons)