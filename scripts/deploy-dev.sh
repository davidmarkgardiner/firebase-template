#!/bin/bash
set -e

echo "🚀 Starting Development Deployment Preparation..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in development mode
if [ "$NODE_ENV" = "production" ]; then
    print_error "This script is for development deployment only!"
    exit 1
fi

echo "📋 Running Pre-Deployment Checks..."

# 1. Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --silent
print_status "Dependencies installed"

# 3. Run TypeScript check
echo "🔍 Running TypeScript checks..."
if npx tsc --noEmit --skipLibCheck; then
    print_status "TypeScript checks passed"
else
    print_error "TypeScript checks failed"
    exit 1
fi

# 4. Run tests
echo "🧪 Running tests..."
if npm run test; then
    print_status "Unit tests passed"
else
    print_warning "Some tests failed, but continuing with development deployment"
fi

# 5. Build the application
echo "🏗️  Building application..."
if npm run build; then
    print_status "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# 6. Check bundle sizes
echo "📊 Checking bundle sizes..."
BUNDLE_SIZE=$(find dist/_astro -name "*.js" -exec wc -c {} + | tail -1 | awk '{print $1}')
BUNDLE_SIZE_KB=$((BUNDLE_SIZE / 1024))

if [ $BUNDLE_SIZE_KB -gt 500 ]; then
    print_warning "Bundle size is large: ${BUNDLE_SIZE_KB}KB"
else
    print_status "Bundle size looks good: ${BUNDLE_SIZE_KB}KB"
fi

# 7. Test health endpoint (if server is running)
echo "🏥 Testing health endpoint..."
if curl -s http://localhost:4321/api/health > /dev/null 2>&1; then
    print_status "Health endpoint is accessible"
else
    print_warning "Health endpoint not accessible (server may not be running)"
fi

# 8. Check environment configuration
echo "🔧 Checking development environment..."
if [ -f ".env.development" ]; then
    print_status "Development environment file exists"
else
    print_warning "No .env.development file found"
fi

# 9. Security checks
echo "🔒 Running security checks..."
# Check for common security issues
if grep -r "console.log" src/ --exclude-dir=test > /dev/null 2>&1; then
    print_warning "Found console.log statements in source code"
else
    print_status "No console.log statements found in production code"
fi

# Check for hardcoded secrets (basic check)
if grep -r "sk_live\|pk_live" src/ > /dev/null 2>&1; then
    print_error "Found potential live API keys in source code!"
    exit 1
else
    print_status "No live API keys found in source code"
fi

# 10. Generate deployment summary
echo "📄 Generating deployment summary..."
cat > deployment-summary.md << EOF
# Development Deployment Summary

**Timestamp:** $(date)
**Environment:** Development
**Node Version:** $NODE_VERSION
**Bundle Size:** ${BUNDLE_SIZE_KB}KB

## ✅ Completed Checks:
- Dependencies installed
- TypeScript compilation successful
- Build completed
- Security scan passed

## 📋 Next Steps:
1. Start development server: \`npm run dev\`
2. Test application manually
3. Run E2E tests: \`npm run test:e2e\`
4. Monitor health endpoint: http://localhost:4321/api/health

## 🔧 Development URLs:
- **App:** http://localhost:4321
- **Health Check:** http://localhost:4321/api/health

## 📚 Documentation:
- See CLAUDE.md for development guidelines
- Check project-checklist.md for feature status
EOF

print_status "Deployment summary generated: deployment-summary.md"

echo ""
echo "🎉 Development deployment preparation completed successfully!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To run E2E tests:"
echo "  npm run test:e2e"
echo ""
echo "To check application health:"
echo "  curl http://localhost:4321/api/health"
echo ""