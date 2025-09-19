# Authentication Components

This directory contains a complete authentication system for the Honduras Coffee e-commerce platform, built with shadcn/ui components and the claymorphism theme.

## Components

### Main Components

#### LoginForm
- **Location**: `src/components/auth/LoginForm.tsx`
- **Shadcn/ui Components Used**: Form, Card, Input, Label, Button, Checkbox, Separator, Alert
- **Features**:
  - Email and password validation with Zod
  - Remember me functionality
  - Social login divider
  - Error handling with Alert components
  - Loading states

#### LoginModal
- **Location**: `src/components/auth/LoginModal.tsx`
- **Shadcn/ui Components Used**: Dialog, DialogTrigger, DialogContent, Button
- **Features**:
  - Modal wrapper for LoginForm
  - Custom trigger support
  - Success callback handling

#### RegisterForm
- **Location**: `src/components/auth/RegisterForm.tsx`
- **Shadcn/ui Components Used**: Form, Card, Input, Textarea, Progress, Badge, Select, Separator
- **Features**:
  - Multi-step registration (Account → Profile → Preferences)
  - Progress indicator with percentages
  - Form validation for each step
  - Address information collection
  - Coffee preferences
  - Terms and conditions agreement

#### PasswordReset
- **Location**: `src/components/auth/PasswordReset.tsx`
- **Shadcn/ui Components Used**: Form, Card, Input, Progress, Badge, Alert, Separator
- **Features**:
  - Request password reset flow
  - Reset password with token
  - Password strength indicator
  - Success confirmation states

#### AccountDashboard
- **Location**: `src/components/auth/AccountDashboard.tsx`
- **Shadcn/ui Components Used**: Tabs, Card, Button, Input, Label, Switch, Select, Avatar, Badge, Table, Pagination, Alert, Progress
- **Features**:
  - Overview with order statistics
  - Order history with filtering
  - Subscription management
  - Profile editing
  - Notification settings
  - Security settings

#### MobileAuth
- **Location**: `src/components/auth/MobileAuth.tsx`
- **Shadcn/ui Components Used**: Sheet, Button, NavigationMenu, DropdownMenu, Avatar, Badge, Separator
- **Features**:
  - Mobile-optimized authentication flow
  - Slide-out auth forms
  - User account dropdown
  - Mobile navigation menu
  - Cart indicator with badge

### UI Components

#### AuthCard
- **Location**: `src/components/auth/ui/AuthCard.tsx`
- **Purpose**: Reusable card wrapper for auth forms with consistent styling

#### AuthForm
- **Location**: `src/components/auth/ui/AuthForm.tsx`
- **Purpose**: Form wrapper with built-in error handling and loading states

#### PasswordStrength
- **Location**: `src/components/auth/ui/PasswordStrength.tsx`
- **Shadcn/ui Components Used**: Progress, Badge
- **Features**:
  - Real-time password strength calculation
  - Visual strength indicator
  - Requirements checklist
  - Color-coded strength levels

#### SocialLoginDivider
- **Location**: `src/components/auth/ui/SocialLoginDivider.tsx`
- **Shadcn/ui Components Used**: Button, Separator
- **Purpose**: Social login options with terms and conditions links

## Pages

### Authentication Pages
- **Login**: `src/pages/auth/login.astro`
- **Sign Up**: `src/pages/auth/signup.astro`
- **Forgot Password**: `src/pages/auth/forgot-password.astro`
- **Verify Email**: `src/pages/auth/verify-email.astro`

### API Routes
- **Login**: `src/pages/api/auth/login.json.ts`
- **Register**: `src/pages/api/auth/register.json.ts`
- **Logout**: `src/pages/api/auth/logout.json.ts`
- **Reset Password**: `src/pages/api/auth/reset-password.json.ts`
- **Update Password**: `src/pages/api/auth/update-password.json.ts`
- **Get User**: `src/pages/api/auth/user.json.ts`
- **OAuth Callback**: `src/pages/api/auth/callback.json.ts`

## Usage Examples

### Basic Login Form
```tsx
import { LoginForm } from '@/components/auth'

function LoginPage() {
  const handleLogin = async (values) => {
    // Implement login logic
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  )
}
```

### Mobile Authentication
```tsx
import { MobileAuth } from '@/components/auth'

function Header() {
  return (
    <MobileAuth
      user={user}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onLogout={handleLogout}
      cartItemCount={cartItems.length}
    />
  )
}
```

### Account Dashboard
```tsx
import { AccountDashboard } from '@/components/auth'

function AccountPage() {
  return (
    <AccountDashboard
      user={user}
      orders={orders}
      subscription={subscription}
      onUpdateProfile={updateProfile}
      onUpdateSettings={updateSettings}
      onCancelSubscription={cancelSubscription}
    />
  )
}
```

## Integration with Supabase

The authentication system is designed to work with Supabase Auth:

1. **Authentication Methods**:
   - Email/password
   - OAuth providers (Google, Facebook, GitHub)
   - Password reset flows

2. **User Profiles**:
   - Extended user data stored in `user_profiles` table
   - Address information
   - Coffee preferences
   - Newsletter subscription status

3. **Security Features**:
   - Row Level Security (RLS) enabled
   - JWT token management
   - Session handling

## Styling

All components use the claymorphism theme with:
- Soft, rounded corners
- Subtle shadows
- Organic shapes
- Warm, earthy color palette suitable for coffee
- Consistent spacing and typography

## TypeScript Support

Full TypeScript support with:
- Strict type checking
- Interface definitions for all props
- Zod schemas for form validation
- Generated types from Supabase

## Accessibility

- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader compatibility
- Focus management in modals
- High contrast colors

## Mobile Responsiveness

- Mobile-first design approach
- Touch-friendly interface elements
- Optimized layouts for small screens
- Sheet components for mobile modals
- Collapsible navigation menus