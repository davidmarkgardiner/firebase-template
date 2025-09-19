import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const checkoutFormVariants = cva(
  "space-y-6",
  {
    variants: {
      variant: {
        default: "",
        compact: "space-y-4",
        spacious: "space-y-8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const checkoutSectionVariants = cva(
  "clay-card p-6 transition-all duration-300",
  {
    variants: {
      state: {
        default: "",
        active: "ring-2 ring-primary/20 border-primary/20",
        completed: "border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-900/30",
        error: "border-destructive/20 bg-destructive/5",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface CheckoutFormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof checkoutFormVariants> {}

export interface CheckoutSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof checkoutSectionVariants> {
  title: string
  description?: string
  required?: boolean
}

export interface CheckoutFieldGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
}

const CheckoutForm = React.forwardRef<HTMLFormElement, CheckoutFormProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn(checkoutFormVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
CheckoutForm.displayName = "CheckoutForm"

const CheckoutSection = React.forwardRef<HTMLDivElement, CheckoutSectionProps>(
  ({ className, state, title, description, required, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(checkoutSectionVariants({ state, className }))}
        {...props}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            {title}
            {required && <span className="text-destructive text-sm">*</span>}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {children}
      </div>
    )
  }
)
CheckoutSection.displayName = "CheckoutSection"

const CheckoutFieldGroup = React.forwardRef<HTMLDivElement, CheckoutFieldGroupProps>(
  ({ className, label, description, error, required, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      >
        {label && (
          <label className="text-sm font-medium text-foreground flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </label>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {children}
        {error && (
          <p className="text-xs text-destructive font-medium">{error}</p>
        )}
      </div>
    )
  }
)
CheckoutFieldGroup.displayName = "CheckoutFieldGroup"

const CheckoutFormRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    columns?: 1 | 2 | 3 | 4
  }
>(({ className, columns = 2, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
      {...props}
    />
  )
})
CheckoutFormRow.displayName = "CheckoutFormRow"

const CheckoutSummary = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    sticky?: boolean
  }
>(({ className, sticky = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "clay-card p-6",
        sticky && "sticky top-6",
        className
      )}
      {...props}
    />
  )
})
CheckoutSummary.displayName = "CheckoutSummary"

const CheckoutSummaryItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label: string
    value: string | number
    description?: string
    highlight?: boolean
  }
>(({ className, label, value, description, highlight = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex justify-between items-start py-2",
        highlight && "text-lg font-semibold border-t border-border pt-4 mt-2",
        className
      )}
      {...props}
    >
      <div className="flex-1">
        <span className="text-sm text-foreground">{label}</span>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <span className={cn(
        "text-sm font-medium text-foreground ml-4",
        highlight && "text-lg font-semibold"
      )}>
        {value}
      </span>
    </div>
  )
})
CheckoutSummaryItem.displayName = "CheckoutSummaryItem"

export {
  CheckoutForm,
  CheckoutSection,
  CheckoutFieldGroup,
  CheckoutFormRow,
  CheckoutSummary,
  CheckoutSummaryItem,
}