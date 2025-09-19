import React, { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Stepper, type StepData } from "@/components/ui/stepper"
import { 
  CheckoutForm, 
  CheckoutSection, 
  CheckoutFieldGroup, 
  CheckoutFormRow,
  CheckoutSummary,
  CheckoutSummaryItem 
} from "@/components/ui/checkout-form"
import { LoadingButton, LoadingCard } from "@/components/ui/loading-spinner"
import { toast } from "@/hooks/use-toast"

const checkoutSteps: StepData[] = [
  {
    id: "cart",
    title: "Cart Review",
    description: "Review your items"
  },
  {
    id: "shipping",
    title: "Shipping",
    description: "Delivery information"
  },
  {
    id: "payment",
    title: "Payment",
    description: "Payment details"
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "Order complete"
  }
]

interface CheckoutFlowDemoProps {
  className?: string
}

export default function CheckoutFlowDemo({ className }: CheckoutFlowDemoProps): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    saveInfo: false,
    paymentMethod: ""
  })

  const cartItems = [
    { id: "1", name: "Honduras Single Origin Coffee", price: 24.99, quantity: 2 },
    { id: "2", name: "Coffee Grinder", price: 89.99, quantity: 1 },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleNext = async (): Promise<void> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (currentStep < checkoutSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
      toast({
        title: "Step completed",
        description: `${checkoutSteps[currentStep].title} information saved.`,
        variant: "success"
      })
    } else {
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
        variant: "success"
      })
    }
    
    setIsLoading(false)
  }

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const updateFormData = (field: string, value: string | boolean): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className={className}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Honduras Coffee Checkout
          </h1>
          <p className="text-muted-foreground">
            Complete your order with our claymorphism checkout experience
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <Stepper activeStep={currentStep} steps={checkoutSteps} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm>
              {currentStep === 0 && (
                <CheckoutSection
                  title="Cart Review"
                  description="Review your selected items"
                  state="active"
                >
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 clay-card">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CheckoutSection>
              )}

              {currentStep === 1 && (
                <CheckoutSection
                  title="Shipping Information"
                  description="Where should we deliver your coffee?"
                  state="active"
                  required
                >
                  <div className="space-y-4">
                    <CheckoutFieldGroup label="Email Address" required>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                      />
                    </CheckoutFieldGroup>

                    <CheckoutFormRow columns={2}>
                      <CheckoutFieldGroup label="First Name" required>
                        <Input
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => updateFormData("firstName", e.target.value)}
                        />
                      </CheckoutFieldGroup>
                      <CheckoutFieldGroup label="Last Name" required>
                        <Input
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                        />
                      </CheckoutFieldGroup>
                    </CheckoutFormRow>

                    <CheckoutFieldGroup label="Address" required>
                      <Input
                        placeholder="123 Coffee Street"
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                      />
                    </CheckoutFieldGroup>

                    <CheckoutFormRow columns={3}>
                      <CheckoutFieldGroup label="City" required>
                        <Input
                          placeholder="Coffee City"
                          value={formData.city}
                          onChange={(e) => updateFormData("city", e.target.value)}
                        />
                      </CheckoutFieldGroup>
                      <CheckoutFieldGroup label="Country" required>
                        <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </CheckoutFieldGroup>
                      <CheckoutFieldGroup label="Postal Code" required>
                        <Input
                          placeholder="12345"
                          value={formData.postalCode}
                          onChange={(e) => updateFormData("postalCode", e.target.value)}
                        />
                      </CheckoutFieldGroup>
                    </CheckoutFormRow>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="save-info"
                        checked={formData.saveInfo}
                        onCheckedChange={(checked) => updateFormData("saveInfo", !!checked)}
                      />
                      <Label htmlFor="save-info" className="text-sm">
                        Save this information for faster checkout next time
                      </Label>
                    </div>
                  </div>
                </CheckoutSection>
              )}

              {currentStep === 2 && (
                <CheckoutSection
                  title="Payment Method"
                  description="How would you like to pay?"
                  state="active"
                  required
                >
                  <div className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        Your payment information is secure and encrypted.
                      </AlertDescription>
                    </Alert>

                    <CheckoutFieldGroup label="Payment Method" required>
                      <Select value={formData.paymentMethod} onValueChange={(value) => updateFormData("paymentMethod", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="apple-pay">Apple Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </CheckoutFieldGroup>

                    {formData.paymentMethod === "card" && (
                      <div className="space-y-4 p-4 clay-card">
                        <CheckoutFieldGroup label="Card Number" required>
                          <Input placeholder="1234 5678 9012 3456" />
                        </CheckoutFieldGroup>
                        <CheckoutFormRow columns={2}>
                          <CheckoutFieldGroup label="Expiry Date" required>
                            <Input placeholder="MM/YY" />
                          </CheckoutFieldGroup>
                          <CheckoutFieldGroup label="CVC" required>
                            <Input placeholder="123" />
                          </CheckoutFieldGroup>
                        </CheckoutFormRow>
                      </div>
                    )}
                  </div>
                </CheckoutSection>
              )}

              {currentStep === 3 && (
                <CheckoutSection
                  title="Order Confirmation"
                  description="Thank you for your order!"
                  state="completed"
                >
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Order Placed Successfully!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your order #HON-2024-001 has been confirmed and will be processed shortly.
                    </p>
                    <Badge variant="secondary" className="clay-badge">
                      Estimated delivery: 3-5 business days
                    </Badge>
                  </div>
                </CheckoutSection>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isLoading}
                >
                  Previous
                </Button>
                
                <LoadingButton
                  onClick={handleNext}
                  loading={isLoading}
                  loadingText={currentStep === checkoutSteps.length - 1 ? "Completing order..." : "Processing..."}
                  disabled={currentStep === checkoutSteps.length - 1}
                  variant="coffee"
                >
                  {currentStep === checkoutSteps.length - 1 ? "Order Complete" : "Continue"}
                </LoadingButton>
              </div>
            </CheckoutForm>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <CheckoutSummary sticky>
              <CardHeader className="p-0 pb-4">
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order details</CardDescription>
              </CardHeader>
              
              <div className="space-y-2">
                <CheckoutSummaryItem
                  label="Subtotal"
                  value={`$${subtotal.toFixed(2)}`}
                />
                <CheckoutSummaryItem
                  label="Shipping"
                  value={`$${shipping.toFixed(2)}`}
                  description="Standard delivery"
                />
                <CheckoutSummaryItem
                  label="Tax"
                  value={`$${tax.toFixed(2)}`}
                />
                <Separator className="my-4" />
                <CheckoutSummaryItem
                  label="Total"
                  value={`$${total.toFixed(2)}`}
                  highlight
                />
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Progress value={(currentStep / (checkoutSteps.length - 1)) * 100} className="mb-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Step {currentStep + 1} of {checkoutSteps.length}
                </p>
              </div>
            </CheckoutSummary>
          </div>
        </div>
      </div>
    </div>
  )
}