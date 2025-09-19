import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { LoadingSpinner } from '../ui/loading-spinner';
import { 
  CreditCard, 
  Shield, 
  Lock, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  AlertTriangle,
  Info
} from 'lucide-react';

interface PaymentFormProps {
  checkoutState: {
    currentStep: number;
    customerInfo: {
      email: string;
      firstName: string;
      lastName: string;
    };
    shippingAddress: {
      country: string;
      city: string;
    };
    shippingMethod: {
      name: string;
      price: number;
    };
    isSubmitting: boolean;
  };
  onSubmit: () => void;
  onPrev: () => void;
}

export function PaymentForm({ checkoutState, onSubmit, onPrev }: PaymentFormProps): JSX.Element {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock total calculation
  const subtotal = 49.98;
  const shipping = checkoutState.shippingMethod.price;
  const vat = (subtotal + shipping) * 0.21;
  const total = subtotal + shipping + vat;

  const handlePaymentSubmit = async (): Promise<void> => {
    if (!termsAccepted) {
      setPaymentError('Please accept the terms and conditions to continue');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      setPaymentSuccess(true);
      onSubmit();
      
      // Redirect to success page after showing success message
      setTimeout(() => {
        window.location.href = '/checkout/success';
      }, 2000);
      
    } catch (error) {
      setPaymentError('Payment failed. Please try again or use a different payment method.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2)}`;
  };

  if (paymentSuccess) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-[#6B4E3D]">Redirecting to order confirmation...</p>
        </div>
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <CreditCard className="w-5 h-5 text-[#8B4513]" />
        <h3 className="text-lg font-semibold text-[#8B4513]">Payment Information</h3>
        <Badge variant="secondary">Step 5 of 5</Badge>
      </div>

      {/* Security Notice */}
      <Alert className="bg-green-50 border-green-200">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>Secure Payment Processing</strong>
              <p className="text-sm mt-1">Your payment is protected by 256-bit SSL encryption</p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Lock className="w-4 h-4" />
              <span>SSL</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Payment Methods */}
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mock Stripe Payment Element */}
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
                  AMEX
                </div>
                <div className="w-8 h-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  IDEAL
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Stripe Payment Elements</h4>
                <p className="text-sm text-[#6B4E3D]">
                  In a real implementation, this would be the Stripe Payment Elements component
                </p>
                <div className="bg-white p-4 rounded border space-y-3">
                  <div className="text-left">
                    <label className="text-sm font-medium">Card number</label>
                    <div className="mt-1 p-2 border rounded bg-gray-100 text-gray-500">
                      •••• •••• •••• 4242
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-left">
                      <label className="text-sm font-medium">Expiry</label>
                      <div className="mt-1 p-2 border rounded bg-gray-100 text-gray-500">
                        12/25
                      </div>
                    </div>
                    <div className="text-left">
                      <label className="text-sm font-medium">CVC</label>
                      <div className="mt-1 p-2 border rounded bg-gray-100 text-gray-500">
                        ••••
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Error */}
          {paymentError && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {paymentError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="clay-card">
        <CardHeader>
          <CardTitle>Final Order Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{checkoutState.customerInfo.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivering to:</span>
              <span>{checkoutState.shippingAddress.city}, {checkoutState.shippingAddress.country}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping method:</span>
              <span>{checkoutState.shippingMethod.name}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (21%):</span>
              <span>{formatPrice(vat)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Newsletter */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={setTermsAccepted}
            className="mt-1"
          />
          <div className="text-sm">
            <label htmlFor="terms" className="font-medium cursor-pointer">
              I accept the{' '}
              <a href="/terms" className="text-[#8B4513] hover:underline" target="_blank">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-[#8B4513] hover:underline" target="_blank">
                Privacy Policy
              </a>
            </label>
            <p className="text-[#6B4E3D] mt-1">
              Required to complete your purchase
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="newsletter"
            checked={newsletterSubscribed}
            onCheckedChange={setNewsletterSubscribed}
          />
          <div className="text-sm">
            <label htmlFor="newsletter" className="font-medium cursor-pointer">
              Subscribe to our newsletter
            </label>
            <p className="text-[#6B4E3D] mt-1">
              Get exclusive offers, coffee tips, and updates on new arrivals
            </p>
          </div>
        </div>
      </div>

      {/* Money-back Guarantee */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div>
            <strong>30-Day Money-Back Guarantee</strong>
            <p className="text-sm mt-1">
              Not satisfied with your coffee? Return it within 30 days for a full refund.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          onClick={onPrev}
          variant="outline"
          className="px-8"
          disabled={isProcessing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handlePaymentSubmit}
          disabled={!termsAccepted || isProcessing}
          className="clay-button bg-[#8B4513] hover:bg-[#A0522D] text-white px-8 relative"
          size="lg"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              Complete Order {formatPrice(total)}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-6 pt-4 text-xs text-[#6B4E3D]">
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4 text-green-600" />
          <span>SSL Secure</span>
        </div>
        <div className="flex items-center space-x-1">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>PCI Compliant</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4 text-purple-600" />
          <span>Stripe Verified</span>
        </div>
      </div>
    </div>
  );
}