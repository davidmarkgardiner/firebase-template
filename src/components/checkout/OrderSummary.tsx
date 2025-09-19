import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { ShoppingBag, Gift, Percent, Euro, Info, Truck } from 'lucide-react';

interface OrderSummaryProps {
  checkoutState: {
    currentStep: number;
    shippingMethod: {
      id: string;
      name: string;
      price: number;
      estimatedDays: string;
    };
    shippingAddress: {
      country: string;
    };
  };
  onPromoCodeApply: (code: string) => void;
}

// Mock cart items for demo
const CART_ITEMS = [
  {
    id: '1',
    name: 'Honduras Mountain Reserve',
    description: 'Single origin, high altitude beans',
    price: 24.99,
    quantity: 2,
    weight: '250g',
    grind: 'Whole Bean',
    image: '/images/coffee-bag-1.jpg',
  },
  {
    id: '2',
    name: 'Estate Premium Blend',
    description: 'Family farm exclusive blend',
    price: 29.99,
    quantity: 1,
    weight: '500g',
    grind: 'Filter Grind',
    image: '/images/coffee-bag-2.jpg',
  },
];

export function OrderSummary({ checkoutState, onPromoCodeApply }: OrderSummaryProps): JSX.Element {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Calculate totals
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = checkoutState.shippingMethod.price || 0;
  const discountAmount = (subtotal * promoDiscount) / 100;
  const vatRate = 0.21; // 21% VAT for EU
  const vatAmount = (subtotal - discountAmount + shippingCost) * vatRate;
  const total = subtotal - discountAmount + shippingCost + vatAmount;

  // Check for free shipping
  const freeShippingThreshold = 50;
  const isEligibleForFreeShipping = subtotal >= freeShippingThreshold;
  const amountForFreeShipping = freeShippingThreshold - subtotal;

  const handlePromoCodeSubmit = (): void => {
    setPromoError('');
    
    // Mock promo code validation
    const validPromoCodes: Record<string, number> = {
      'WELCOME10': 10,
      'COFFEE20': 20,
      'FIRST15': 15,
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      const discount = validPromoCodes[promoCode.toUpperCase()];
      setAppliedPromoCode(promoCode.toUpperCase());
      setPromoDiscount(discount);
      onPromoCodeApply(promoCode.toUpperCase());
      setPromoCode('');
    } else if (promoCode) {
      setPromoError('Invalid promo code');
    }
  };

  const removePromoCode = (): void => {
    setAppliedPromoCode(null);
    setPromoDiscount(0);
    setPromoCode('');
    setPromoError('');
  };

  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2)}`;
  };

  return (
    <div className="space-y-4" data-testid="order-summary">
      {/* Order Summary Card */}
      <Card className="clay-card sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#8B4513]" />
            <span>Order Summary</span>
            <Badge variant="secondary">{CART_ITEMS.length} items</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {CART_ITEMS.map((item) => (
              <div key={item.id} className="flex space-x-3 p-3 bg-white/50 rounded-lg">
                <div className="w-12 h-12 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#8B4513]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-[#6B4E3D]">{item.weight} • {item.grind}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#6B4E3D]">Qty: {item.quantity}</span>
                    <span className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Promo Code */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-[#8B4513]" />
              <span className="font-medium text-sm">Promo Code</span>
            </div>

            {appliedPromoCode ? (
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Percent className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{appliedPromoCode}</span>
                  <span className="text-xs text-green-600">-{promoDiscount}%</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removePromoCode}
                  className="text-green-600 hover:text-green-800"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 clay-input"
                    onKeyPress={(e) => e.key === 'Enter' && handlePromoCodeSubmit()}
                  />
                  <Button
                    onClick={handlePromoCodeSubmit}
                    variant="outline"
                    size="sm"
                    disabled={!promoCode}
                  >
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p className="text-xs text-red-600">{promoError}</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Order Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span data-testid="subtotal">{formatPrice(subtotal)}</span>
            </div>

            {appliedPromoCode && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({appliedPromoCode})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>Shipping</span>
              </span>
              <span data-testid="shipping-cost">
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatPrice(shippingCost)
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="flex items-center space-x-1">
                <Euro className="w-4 h-4" />
                <span>VAT (21%)</span>
              </span>
              <span>{formatPrice(vatAmount)}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg" data-testid="total">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Free Shipping Notice */}
          {!isEligibleForFreeShipping && amountForFreeShipping > 0 && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                Add {formatPrice(amountForFreeShipping)} more for free shipping!
              </AlertDescription>
            </Alert>
          )}

          {/* Security Notice */}
          <Alert className="bg-green-50 border-green-200">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-xs">
              <div className="space-y-1">
                <p><strong>Secure Checkout</strong></p>
                <p>• SSL encrypted payment processing</p>
                <p>• 30-day satisfaction guarantee</p>
                <p>• Free returns within EU</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Shipping Information */}
          {checkoutState.shippingMethod.id && (
            <div className="p-3 bg-[#f8f6f3] rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="w-4 h-4 text-[#8B4513]" />
                <span className="font-medium text-sm">Selected Shipping</span>
              </div>
              <p className="text-sm">{checkoutState.shippingMethod.name}</p>
              <p className="text-xs text-[#6B4E3D]">
                Estimated delivery: {checkoutState.shippingMethod.estimatedDays}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="clay-card">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-medium text-sm">Need Help?</h4>
            <p className="text-xs text-[#6B4E3D]">
              Contact our coffee experts for assistance with your order
            </p>
            <div className="space-y-1 text-xs">
              <p>📧 help@hondurascoffee.eu</p>
              <p>📞 +31 20 123 4567</p>
              <p>💬 Live chat available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}