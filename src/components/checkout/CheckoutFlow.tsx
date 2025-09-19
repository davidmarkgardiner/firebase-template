import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { CheckoutLayout } from './CheckoutLayout';
import { CustomerInfo } from './CustomerInfo';
import { ShippingAddress } from './ShippingAddress';
import { BillingAddress } from './BillingAddress';
import { ShippingMethod } from './ShippingMethod';
import { PaymentForm } from './PaymentForm';
import { OrderSummary } from './OrderSummary';

interface CheckoutState {
  currentStep: number;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    createAccount: boolean;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  sameBillingAddress: boolean;
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  };
  isSubmitting: boolean;
  errors: Record<string, string>;
}

const CHECKOUT_STEPS = [
  { id: 1, title: 'Customer Information', description: 'Contact details' },
  { id: 2, title: 'Shipping Address', description: 'Delivery information' },
  { id: 3, title: 'Billing Address', description: 'Payment address' },
  { id: 4, title: 'Shipping Method', description: 'Delivery options' },
  { id: 5, title: 'Payment', description: 'Complete purchase' },
];

export function CheckoutFlow(): JSX.Element {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    currentStep: 1,
    customerInfo: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      createAccount: false,
    },
    shippingAddress: {
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      postalCode: '',
      country: 'NL',
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      postalCode: '',
      country: 'NL',
    },
    sameBillingAddress: true,
    shippingMethod: {
      id: '',
      name: '',
      price: 0,
      estimatedDays: '',
    },
    isSubmitting: false,
    errors: {},
  });

  const updateCheckoutState = (updates: Partial<CheckoutState>): void => {
    setCheckoutState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = (): void => {
    if (checkoutState.currentStep < CHECKOUT_STEPS.length) {
      updateCheckoutState({ currentStep: checkoutState.currentStep + 1 });
    }
  };

  const prevStep = (): void => {
    if (checkoutState.currentStep > 1) {
      updateCheckoutState({ currentStep: checkoutState.currentStep - 1 });
    }
  };

  const goToStep = (step: number): void => {
    if (step >= 1 && step <= CHECKOUT_STEPS.length) {
      updateCheckoutState({ currentStep: step });
    }
  };

  const renderStepContent = (): JSX.Element => {
    switch (checkoutState.currentStep) {
      case 1:
        return (
          <CustomerInfo
            customerInfo={checkoutState.customerInfo}
            errors={checkoutState.errors}
            onUpdate={(customerInfo) => updateCheckoutState({ customerInfo })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ShippingAddress
            shippingAddress={checkoutState.shippingAddress}
            errors={checkoutState.errors}
            onUpdate={(shippingAddress) => updateCheckoutState({ shippingAddress })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <BillingAddress
            billingAddress={checkoutState.billingAddress}
            shippingAddress={checkoutState.shippingAddress}
            sameBillingAddress={checkoutState.sameBillingAddress}
            errors={checkoutState.errors}
            onUpdate={(billingAddress, sameBillingAddress) => 
              updateCheckoutState({ billingAddress, sameBillingAddress })
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ShippingMethod
            shippingMethod={checkoutState.shippingMethod}
            shippingAddress={checkoutState.shippingAddress}
            onUpdate={(shippingMethod) => updateCheckoutState({ shippingMethod })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <PaymentForm
            checkoutState={checkoutState}
            onSubmit={() => updateCheckoutState({ isSubmitting: true })}
            onPrev={prevStep}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  const progressPercentage = (checkoutState.currentStep / CHECKOUT_STEPS.length) * 100;

  return (
    <CheckoutLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] to-[#f3f1ee]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Complete Your Order</h1>
            <p className="text-[#6B4E3D]">Secure checkout for your Honduras coffee</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Checkout Flow */}
            <div className="lg:col-span-2">
              {/* Progress Indicator */}
              <Card className="clay-card mb-6" data-testid="progress-indicator">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-lg">Checkout Progress</CardTitle>
                    <Badge variant="secondary" data-testid="current-step">
                      Step {checkoutState.currentStep} of {CHECKOUT_STEPS.length}
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="mb-4" />
                  <div className="flex justify-between text-sm">
                    {CHECKOUT_STEPS.map((step) => (
                      <button
                        key={step.id}
                        onClick={() => goToStep(step.id)}
                        className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                          step.id === checkoutState.currentStep
                            ? 'bg-[#8B4513] text-white'
                            : step.id < checkoutState.currentStep
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                        disabled={step.id > checkoutState.currentStep}
                      >
                        <span className="font-medium">{step.title}</span>
                        <span className="text-xs opacity-75">{step.description}</span>
                      </button>
                    ))}
                  </div>
                </CardHeader>
              </Card>

              {/* Step Content */}
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>
                    {CHECKOUT_STEPS.find(s => s.id === checkoutState.currentStep)?.title}
                  </CardTitle>
                  <Separator />
                </CardHeader>
                <CardContent>
                  {renderStepContent()}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary 
                checkoutState={checkoutState}
                onPromoCodeApply={(code) => {
                  // Handle promo code application
                  console.log('Applying promo code:', code);
                }}
                data-testid="order-summary"
              />
            </div>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}