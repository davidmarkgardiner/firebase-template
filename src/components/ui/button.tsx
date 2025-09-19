import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "clay-button text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl shadow-md transition-all duration-300",
        outline:
          "border border-input bg-background/60 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground rounded-xl clay-shadow-soft",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary rounded-xl backdrop-blur-sm clay-shadow-soft",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-xl transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline transition-all duration-200",
        coffee: "coffee-gradient text-white hover:scale-[1.02] hover:brightness-110 rounded-xl shadow-lg transition-all duration-300",
        mountain: "mountain-gradient text-white hover:scale-[1.02] hover:brightness-110 rounded-xl shadow-lg transition-all duration-300",
        premium: "premium-gradient border border-white/20 backdrop-blur-md text-foreground hover:scale-[1.02] rounded-xl shadow-lg",
        glass: "glass-effect text-foreground hover:bg-white/15 rounded-xl transition-all duration-300",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }