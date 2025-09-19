import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        default: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-green-500",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

const loadingOverlayVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        overlay: "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        inline: "py-8",
        card: "clay-card p-8 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  }
)

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

export interface LoadingOverlayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingOverlayVariants> {
  message?: string
  spinnerSize?: "sm" | "default" | "lg" | "xl"
  spinnerVariant?: "default" | "secondary" | "muted" | "destructive" | "success"
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, variant, className }))}
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ 
    className, 
    variant, 
    message = "Loading...", 
    spinnerSize = "lg",
    spinnerVariant = "default",
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(loadingOverlayVariants({ variant, className }))}
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size={spinnerSize} variant={spinnerVariant} />
          {message && (
            <p className="text-sm text-muted-foreground font-medium">
              {message}
            </p>
          )}
        </div>
      </div>
    )
  }
)
LoadingOverlay.displayName = "LoadingOverlay"

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean
    loadingText?: string
    spinnerSize?: "sm" | "default" | "lg" | "xl"
  }
>(({ 
  className, 
  loading = false, 
  loadingText, 
  spinnerSize = "sm",
  children, 
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "clay-button relative",
        loading && "pointer-events-none opacity-80",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={spinnerSize} variant="default" className="text-primary-foreground" />
        </div>
      )}
      <span className={cn(loading && "invisible")}>
        {loading && loadingText ? loadingText : children}
      </span>
    </button>
  )
})
LoadingButton.displayName = "LoadingButton"

const LoadingCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    description?: string
    spinnerSize?: "sm" | "default" | "lg" | "xl"
  }
>(({ 
  className, 
  title = "Loading", 
  description,
  spinnerSize = "default",
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("clay-card p-6 text-center", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={spinnerSize} />
        <div>
          <h3 className="font-medium text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
})
LoadingCard.displayName = "LoadingCard"

// Pulse animation for skeleton loading
const LoadingPulse = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    lines?: number
    width?: "full" | "3/4" | "1/2" | "1/4"
  }
>(({ className, lines = 3, width = "full", ...props }, ref) => {
  const widthClasses = {
    full: "w-full",
    "3/4": "w-3/4",
    "1/2": "w-1/2",
    "1/4": "w-1/4",
  }

  return (
    <div
      ref={ref}
      className={cn("animate-pulse space-y-3", className)}
      {...props}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-4 bg-muted rounded clay-shadow-soft",
            index === lines - 1 && width !== "full" ? widthClasses[width] : "w-full"
          )}
        />
      ))}
    </div>
  )
})
LoadingPulse.displayName = "LoadingPulse"

export { 
  LoadingSpinner, 
  LoadingOverlay, 
  LoadingButton, 
  LoadingCard, 
  LoadingPulse 
}