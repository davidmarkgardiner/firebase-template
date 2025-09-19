import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Truck, Clock, Euro, Package, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface ShippingMethodProps {
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  };
  shippingAddress: {
    country: string;
  };
  onUpdate: (shippingMethod: ShippingMethodProps['shippingMethod']) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  estimatedDays: string;
  carrier: string;
  features: string[];
  icon: string;
  popular?: boolean;
  freeThreshold?: number;
}

const SHIPPING_OPTIONS: Record<string, ShippingOption[]> = {
  // Netherlands and Belgium - faster delivery
  'NL': [
    {
      id: 'standard-nl',
      name: 'Standard Delivery',
      description: 'Reliable delivery to your door',
      price: 4.99,
      estimatedDays: '2-3 business days',
      carrier: 'PostNL',
      features: ['Track your package', 'Delivered to your door', 'Signature required'],
      icon: '📦',
      freeThreshold: 50,
    },
    {
      id: 'express-nl',
      name: 'Express Delivery',
      description: 'Fastest delivery option',
      price: 9.99,
      estimatedDays: 'Next business day',
      carrier: 'DHL Express',
      features: ['Express handling', 'Priority delivery', 'SMS tracking updates'],
      icon: '⚡',
      popular: true,
    },
    {
      id: 'pickup-nl',
      name: 'Pickup Point',
      description: 'Collect from a nearby pickup point',
      price: 3.99,
      estimatedDays: '2-3 business days',
      carrier: 'PostNL',
      features: ['1000+ pickup points', 'Extended opening hours', 'Hold for 7 days'],
      icon: '📍',
    },
  ],
  'BE': [
    {
      id: 'standard-be',
      name: 'Standard Delivery',
      description: 'Reliable delivery to your door',
      price: 5.99,
      estimatedDays: '2-4 business days',
      carrier: 'bpost',
      features: ['Track your package', 'Delivered to your door', 'Signature required'],
      icon: '📦',
      freeThreshold: 50,
    },
    {
      id: 'express-be',
      name: 'Express Delivery',
      description: 'Fastest delivery option',
      price: 12.99,
      estimatedDays: '1-2 business days',
      carrier: 'DHL Express',
      features: ['Express handling', 'Priority delivery', 'SMS tracking updates'],
      icon: '⚡',
      popular: true,
    },
  ],
  // Default EU countries
  'DEFAULT': [
    {
      id: 'standard-eu',
      name: 'Standard EU Delivery',
      description: 'Reliable delivery across Europe',
      price: 7.99,
      originalPrice: 9.99,
      estimatedDays: '4-7 business days',
      carrier: 'DHL',
      features: ['Track your package', 'Customs handled', 'Signature required'],
      icon: '📦',
      freeThreshold: 50,
    },
    {
      id: 'express-eu',
      name: 'Express EU Delivery',
      description: 'Fastest option for EU delivery',
      price: 15.99,
      estimatedDays: '2-4 business days',
      carrier: 'DHL Express',
      features: ['Priority handling', 'Express customs clearance', 'SMS updates'],
      icon: '⚡',
      popular: true,
    },
  ],
};

export function ShippingMethod({ shippingMethod, shippingAddress, onUpdate, onNext, onPrev }: ShippingMethodProps): JSX.Element {
  const [selectedMethod, setSelectedMethod] = useState<string>(shippingMethod.id);
  const [cartTotal] = useState(49.98); // Mock cart total

  // Get shipping options based on country
  const getShippingOptions = (): ShippingOption[] => {
    return SHIPPING_OPTIONS[shippingAddress.country] || SHIPPING_OPTIONS['DEFAULT'];
  };

  const shippingOptions = getShippingOptions();

  // Auto-select first option if none selected
  useEffect(() => {
    if (!selectedMethod && shippingOptions.length > 0) {
      const defaultOption = shippingOptions.find(option => option.popular) || shippingOptions[0];
      setSelectedMethod(defaultOption.id);
      onUpdate({
        id: defaultOption.id,
        name: defaultOption.name,
        price: getEffectivePrice(defaultOption),
        estimatedDays: defaultOption.estimatedDays,
      });
    }
  }, [selectedMethod, shippingOptions, onUpdate]);

  const getEffectivePrice = (option: ShippingOption): number => {
    if (option.freeThreshold && cartTotal >= option.freeThreshold) {
      return 0;
    }
    return option.price;
  };

  const handleMethodSelect = (option: ShippingOption): void => {
    setSelectedMethod(option.id);
    onUpdate({
      id: option.id,
      name: option.name,
      price: getEffectivePrice(option),
      estimatedDays: option.estimatedDays,
    });
  };

  const handleNext = (): void => {
    if (selectedMethod) {
      onNext();
    }
  };

  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2)}`;
  };

  const getCountryName = (code: string): string => {
    const countries: Record<string, string> = {
      'NL': 'Netherlands',
      'BE': 'Belgium',
      'DE': 'Germany',
      'FR': 'France',
      'AT': 'Austria',
      'IT': 'Italy',
      'ES': 'Spain',
      'PT': 'Portugal',
    };
    return countries[code] || code;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Truck className="w-5 h-5 text-[#8B4513]" />
        <h3 className="text-lg font-semibold text-[#8B4513]">Shipping Method</h3>
        <Badge variant="secondary">Step 4 of 5</Badge>
      </div>

      {/* Delivery Location */}
      <Alert className="bg-blue-50 border-blue-200">
        <Package className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Delivering to:</strong> {getCountryName(shippingAddress.country)}
        </AlertDescription>
      </Alert>

      {/* Shipping Options */}
      <div className="space-y-4">
        {shippingOptions.map((option) => {
          const effectivePrice = getEffectivePrice(option);
          const isFree = option.freeThreshold && cartTotal >= option.freeThreshold;
          const isSelected = selectedMethod === option.id;

          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all clay-card ${
                isSelected 
                  ? 'ring-2 ring-[#8B4513] bg-[#8B4513]/5' 
                  : 'hover:bg-gray-50/50'
              }`}
              onClick={() => handleMethodSelect(option)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Radio button */}
                  <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                    isSelected ? 'border-[#8B4513] bg-[#8B4513]' : 'border-gray-300'
                  }`}>
                    {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>

                  {/* Option details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{option.icon}</span>
                        <h4 className="font-semibold">{option.name}</h4>
                        {option.popular && (
                          <Badge variant="secondary" className="bg-[#8B4513] text-white">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-right">
                        {isFree ? (
                          <div>
                            <span className="text-lg font-semibold text-green-600">Free</span>
                            {option.price > 0 && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(option.price)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span className="text-lg font-semibold">{formatPrice(effectivePrice)}</span>
                            {option.originalPrice && option.originalPrice > option.price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(option.originalPrice)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-[#6B4E3D] mb-3">{option.description}</p>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1 text-sm">
                        <Clock className="w-4 h-4 text-[#8B4513]" />
                        <span>{option.estimatedDays}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Truck className="w-4 h-4 text-[#8B4513]" />
                        <span>{option.carrier}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                      {option.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs text-[#6B4E3D]">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Free shipping notice */}
                    {option.freeThreshold && cartTotal < option.freeThreshold && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                        💡 Add {formatPrice(option.freeThreshold - cartTotal)} more for free {option.name.toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      {/* Delivery Information */}
      <Alert className="bg-green-50 border-green-200">
        <Package className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <div className="text-green-800">
            <strong>Delivery Information:</strong>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1">
              <li>All orders are shipped Monday to Friday</li>
              <li>Orders placed before 2 PM are processed same day</li>
              <li>Weekend orders are processed on Monday</li>
              <li>You'll receive tracking information via email</li>
              <li>Signature required for all deliveries</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Special Delivery Options */}
      <Card className="clay-card bg-[#f8f6f3]">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 flex items-center space-x-2">
            <Euro className="w-4 h-4 text-[#8B4513]" />
            <span>Special Delivery Options</span>
          </h4>
          <div className="space-y-2 text-sm text-[#6B4E3D]">
            <p>🎁 <strong>Gift Wrapping:</strong> Add beautiful gift wrapping for €3.99</p>
            <p>📝 <strong>Personal Message:</strong> Include a handwritten note (free)</p>
            <p>📞 <strong>Delivery Instructions:</strong> Special instructions already saved</p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          onClick={onPrev}
          variant="outline"
          className="px-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!selectedMethod}
          className="clay-button bg-[#8B4513] hover:bg-[#A0522D] text-white px-8"
          size="lg"
        >
          Continue to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}