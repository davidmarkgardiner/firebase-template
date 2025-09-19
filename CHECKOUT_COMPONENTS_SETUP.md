# Honduras Coffee Checkout Flow Components Setup

## Overview

This project now includes a complete shadcn/ui foundation with custom checkout flow components, specifically designed for the Honduras Coffee business with a claymorphism theme.

## Components Included

### Core shadcn/ui Components (Pre-configured)
All standard shadcn/ui components are installed and configured with claymorphism styling:

- **Form Components**: `button`, `input`, `label`, `checkbox`, `select`, `radio-group`, `textarea`, `form`
- **Layout Components**: `card`, `separator`, `sheet`, `dialog`, `drawer`, `tabs`, `accordion`
- **Feedback Components**: `alert`, `toast`, `progress`, `badge`, `skeleton`
- **Navigation Components**: `breadcrumb`, `navigation-menu`, `pagination`
- **Data Display**: `table`, `avatar`, `hover-card`, `popover`, `tooltip`
- **Interactive**: `calendar`, `carousel`, `collapsible`, `command`, `dropdown-menu`, `scroll-area`, `slider`, `switch`

### Custom Checkout Flow Components

#### 1. Stepper Component (`/src/components/ui/stepper.tsx`)
Multi-step progress indicator with support for:
- Horizontal and vertical orientations
- Multiple states: pending, current, completed, error
- Optional steps
- Custom step descriptions
- Claymorphism styling

```tsx
import { Stepper, type StepData } from "@/components/ui/stepper"

const steps: StepData[] = [
  { id: "cart", title: "Cart Review", description: "Review items" },
  { id: "shipping", title: "Shipping", description: "Delivery info" },
  { id: "payment", title: "Payment", description: "Payment details" }
]

<Stepper activeStep={1} steps={steps} orientation="horizontal" />
```

#### 2. Checkout Form Components (`/src/components/ui/checkout-form.tsx`)
Specialized form components for checkout flows:

- `CheckoutForm`: Main form wrapper with variants
- `CheckoutSection`: Sectioned form areas with states
- `CheckoutFieldGroup`: Field grouping with labels and validation
- `CheckoutFormRow`: Responsive grid layouts
- `CheckoutSummary`: Order summary sidebar
- `CheckoutSummaryItem`: Individual summary line items

```tsx
import { 
  CheckoutForm, 
  CheckoutSection, 
  CheckoutFieldGroup,
  CheckoutFormRow,
  CheckoutSummary,
  CheckoutSummaryItem 
} from "@/components/ui/checkout-form"

<CheckoutForm>
  <CheckoutSection title="Shipping" state="active" required>
    <CheckoutFormRow columns={2}>
      <CheckoutFieldGroup label="First Name" required>
        <Input placeholder="John" />
      </CheckoutFieldGroup>
      <CheckoutFieldGroup label="Last Name" required>
        <Input placeholder="Doe" />
      </CheckoutFieldGroup>
    </CheckoutFormRow>
  </CheckoutSection>
</CheckoutForm>
```

#### 3. Loading Components (`/src/components/ui/loading-spinner.tsx`)
Comprehensive loading states with claymorphism styling:

- `LoadingSpinner`: Basic spinner with variants
- `LoadingOverlay`: Full-screen or inline overlays
- `LoadingButton`: Button with loading states
- `LoadingCard`: Card with loading display
- `LoadingPulse`: Skeleton loading animation

```tsx
import { LoadingButton, LoadingCard, LoadingSpinner } from "@/components/ui/loading-spinner"

<LoadingButton loading={isLoading} loadingText="Processing...">
  Place Order
</LoadingButton>

<LoadingCard title="Processing Payment" description="Please wait..." />
```

## Theme Configuration

### Claymorphism Design System
The components use a custom claymorphism theme with Honduras Coffee-inspired colors:

```css
/* Key CSS Classes Available */
.clay-card          /* Standard card with soft shadows */
.clay-button        /* Button with gradient and shadows */
.clay-input         /* Input with inset shadows */
.clay-badge         /* Badge with subtle backdrop */
.clay-shadow-soft   /* Soft shadow utility */
.clay-shadow-medium /* Medium shadow utility */
.clay-shadow-strong /* Strong shadow utility */
.glass-effect       /* Glass morphism effect */
```

### Color Palette
- **Primary**: Coffee brown (`oklch(0.6397 0.1720 36.4421)`)
- **Background**: Warm cream (`oklch(0.9383 0.0042 236.4993)`)
- **Card**: Soft clay (`oklch(1.0000 0 0)`)
- **Accent**: Warm accent (`oklch(0.9119 0.0222 243.8174)`)

## Usage Examples

### Complete Checkout Flow
See `/src/components/demo/CheckoutFlowDemo.tsx` for a complete implementation showing:

1. **Cart Review Step**: Display items with quantities and prices
2. **Shipping Information**: Address forms with validation
3. **Payment Method**: Payment selection and card details
4. **Order Confirmation**: Success state with order details

### Integration with Forms
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const checkoutSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(1),
})

function CheckoutPage() {
  const form = useForm({
    resolver: zodResolver(checkoutSchema)
  })

  return (
    <Form {...form}>
      <CheckoutForm onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form content */}
      </CheckoutForm>
    </Form>
  )
}
```

### Toast Notifications
The toast system is enhanced with claymorphism styling and success/warning variants:

```tsx
import { toast } from "@/hooks/use-toast"

// Success notification
toast({
  title: "Order placed successfully!",
  description: "You will receive a confirmation email shortly.",
  variant: "success"
})

// Warning notification
toast({
  title: "Address verification needed",
  description: "Please check your shipping address.",
  variant: "warning"
})
```

## TypeScript Support

All components include comprehensive TypeScript definitions:

```tsx
interface StepData {
  id: string
  title: string
  description?: string
  optional?: boolean
}

interface CheckoutSectionProps {
  title: string
  description?: string
  required?: boolean
  state?: "default" | "active" | "completed" | "error"
}
```

## Responsive Design

Components are mobile-first and responsive:

- **Stepper**: Switches to vertical layout on mobile
- **CheckoutFormRow**: Responsive grid (1 col mobile, 2+ cols desktop)
- **CheckoutSummary**: Sticks to top on desktop, flows normally on mobile
- **All inputs**: Touch-friendly sizing (44px minimum)

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Visible focus indicators with clay styling
- **Color Contrast**: WCAG 2.1 AA compliance
- **Semantic HTML**: Proper heading hierarchy and form structure

## File Structure

```
src/components/ui/
├── index.ts                 # Export all components
├── stepper.tsx              # Multi-step progress indicator
├── checkout-form.tsx        # Checkout-specific form components
├── loading-spinner.tsx      # Loading states and animations
├── toast.tsx               # Enhanced toast with claymorphism
├── toaster.tsx             # Toast provider (fixed import path)
└── [all other shadcn components]

src/components/demo/
└── CheckoutFlowDemo.tsx     # Complete checkout flow example

src/styles/
└── globals.css              # Claymorphism theme and utilities
```

## Next Steps

1. **Implement checkout pages** using the demo as a template
2. **Add form validation** with React Hook Form and Zod
3. **Integrate with Stripe** for payment processing
4. **Add order management** with Supabase backend
5. **Implement cart state** with Zustand or React Context
6. **Add product selection** components for coffee varieties

## Performance Optimizations

- **Tree-shaking**: Only import components you use
- **Code splitting**: Lazy load checkout components
- **Optimized animations**: Hardware-accelerated transforms
- **Minimal bundle impact**: Components use existing dependencies

The checkout flow is now ready for implementation with a complete, type-safe, accessible, and beautifully designed component system that matches the Honduras Coffee brand aesthetic.