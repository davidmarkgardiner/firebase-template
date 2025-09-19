import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CheckIcon } from "@radix-ui/react-icons"

const stepperVariants = cva(
  "flex items-center",
  {
    variants: {
      orientation: {
        horizontal: "w-full",
        vertical: "flex-col h-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

const stepVariants = cva(
  "flex items-center transition-all duration-300",
  {
    variants: {
      orientation: {
        horizontal: "flex-1",
        vertical: "w-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

const stepIndicatorVariants = cva(
  "flex items-center justify-center rounded-full border-2 transition-all duration-300 clay-shadow-soft",
  {
    variants: {
      state: {
        pending: "border-border bg-background text-muted-foreground",
        current: "border-primary bg-primary text-primary-foreground clay-button",
        completed: "border-green-500 bg-green-500 text-white",
        error: "border-destructive bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "h-6 w-6 text-xs",
        default: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
      },
    },
    defaultVariants: {
      state: "pending",
      size: "default",
    },
  }
)

const stepConnectorVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      orientation: {
        horizontal: "flex-1 h-[2px] mx-2",
        vertical: "w-[2px] h-8 mx-auto",
      },
      state: {
        pending: "bg-border",
        completed: "bg-green-500",
        current: "bg-primary",
        error: "bg-destructive",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      state: "pending",
    },
  }
)

export interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  activeStep: number
  steps: StepData[]
}

export interface StepData {
  id: string
  title: string
  description?: string
  optional?: boolean
}

export interface StepProps {
  step: StepData
  index: number
  activeStep: number
  totalSteps: number
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "default" | "lg"
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, orientation, activeStep, steps, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(stepperVariants({ orientation, className }))}
        {...props}
      >
        {steps.map((step, index) => (
          <Step
            key={step.id}
            step={step}
            index={index}
            activeStep={activeStep}
            totalSteps={steps.length}
            orientation={orientation}
          />
        ))}
      </div>
    )
  }
)
Stepper.displayName = "Stepper"

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ step, index, activeStep, totalSteps, orientation = "horizontal", size = "default" }, ref) => {
    const stepState = getStepState(index, activeStep)
    const isLast = index === totalSteps - 1

    return (
      <div
        ref={ref}
        className={cn(stepVariants({ orientation }))}
      >
        <div className={cn(
          "flex items-center",
          orientation === "vertical" ? "w-full" : ""
        )}>
          <StepIndicator
            state={stepState}
            size={size}
            stepNumber={index + 1}
          />
          
          <div className={cn(
            "ml-3",
            orientation === "vertical" ? "flex-1" : "hidden sm:block"
          )}>
            <StepLabel
              title={step.title}
              description={step.description}
              optional={step.optional}
              state={stepState}
            />
          </div>
        </div>

        {!isLast && (
          <StepConnector
            orientation={orientation}
            state={stepState}
          />
        )}
      </div>
    )
  }
)
Step.displayName = "Step"

const StepIndicator = React.forwardRef<
  HTMLDivElement,
  {
    state: "pending" | "current" | "completed" | "error"
    size: "sm" | "default" | "lg"
    stepNumber: number
  }
>(({ state, size, stepNumber }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(stepIndicatorVariants({ state, size }))}
    >
      {state === "completed" ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <span className="font-medium">{stepNumber}</span>
      )}
    </div>
  )
})
StepIndicator.displayName = "StepIndicator"

const StepLabel = React.forwardRef<
  HTMLDivElement,
  {
    title: string
    description?: string
    optional?: boolean
    state: "pending" | "current" | "completed" | "error"
  }
>(({ title, description, optional, state }, ref) => {
  return (
    <div ref={ref}>
      <div className={cn(
        "text-sm font-medium transition-colors",
        state === "current" && "text-primary",
        state === "completed" && "text-green-600 dark:text-green-400",
        state === "error" && "text-destructive",
        state === "pending" && "text-muted-foreground"
      )}>
        {title}
        {optional && (
          <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
        )}
      </div>
      {description && (
        <div className="text-xs text-muted-foreground mt-1">
          {description}
        </div>
      )}
    </div>
  )
})
StepLabel.displayName = "StepLabel"

const StepConnector = React.forwardRef<
  HTMLDivElement,
  {
    orientation: "horizontal" | "vertical"
    state: "pending" | "current" | "completed" | "error"
  }
>(({ orientation, state }, ref) => {
  const connectorState = state === "completed" ? "completed" : "pending"
  
  return (
    <div
      ref={ref}
      className={cn(stepConnectorVariants({ orientation, state: connectorState }))}
    />
  )
})
StepConnector.displayName = "StepConnector"

function getStepState(stepIndex: number, activeStep: number): "pending" | "current" | "completed" | "error" {
  if (stepIndex < activeStep) return "completed"
  if (stepIndex === activeStep) return "current"
  return "pending"
}

export { Stepper, Step, StepIndicator, StepLabel, StepConnector, type StepData }