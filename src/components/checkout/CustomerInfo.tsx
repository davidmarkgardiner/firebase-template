import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { User, Mail, Phone, Shield, ArrowRight } from 'lucide-react';

interface CustomerInfoProps {
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    createAccount: boolean;
  };
  errors: Record<string, string>;
  onUpdate: (customerInfo: CustomerInfoProps['customerInfo']) => void;
  onNext: () => void;
}

export function CustomerInfo({ customerInfo, errors, onUpdate, onNext }: CustomerInfoProps): JSX.Element {
  const [isGuestMode, setIsGuestMode] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!customerInfo.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (customerInfo.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!customerInfo.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (customerInfo.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (customerInfo.phone && !/^\+?[\d\s\-\(\)]+$/.test(customerInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfoProps['customerInfo'], value: string | boolean): void => {
    onUpdate({
      ...customerInfo,
      [field]: value,
    });
    
    // Clear field-specific error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = (): void => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleLoginClick = (): void => {
    // In a real app, this would open a login modal or redirect to login page
    alert('Login functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Guest vs Account Toggle */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={`cursor-pointer transition-all ${isGuestMode ? 'ring-2 ring-[#8B4513] bg-[#8B4513]/5' : 'hover:bg-gray-50'}`} data-testid="guest-checkout">
          <CardContent className="p-4" onClick={() => setIsGuestMode(true)}>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${isGuestMode ? 'bg-[#8B4513] border-[#8B4513]' : 'border-gray-300'}`} />
              <div>
                <h3 className="font-semibold text-[#8B4513]">Guest Checkout</h3>
                <p className="text-sm text-[#6B4E3D]">Quick checkout without creating an account</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${!isGuestMode ? 'ring-2 ring-[#8B4513] bg-[#8B4513]/5' : 'hover:bg-gray-50'}`} data-testid="create-account">
          <CardContent className="p-4" onClick={() => setIsGuestMode(false)}>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${!isGuestMode ? 'bg-[#8B4513] border-[#8B4513]' : 'border-gray-300'}`} />
              <div>
                <h3 className="font-semibold text-[#8B4513]">Create Account</h3>
                <p className="text-sm text-[#6B4E3D]">Save details for faster future orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Returning Customer Login */}
      {isGuestMode && (
        <Alert className="bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-blue-800">Already have an account?</span>
            <Button variant="outline" size="sm" onClick={handleLoginClick} className="ml-4">
              Sign In
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {/* Customer Information Form */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-[#8B4513]" />
          <h3 className="text-lg font-semibold text-[#8B4513]">Contact Information</h3>
          <Badge variant="secondary">Required</Badge>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>Email Address *</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={customerInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`clay-input ${(validationErrors.email || errors.email) ? 'border-red-500' : ''}`}
          />
          {(validationErrors.email || errors.email) && (
            <p className="text-sm text-red-600">{validationErrors.email || errors.email}</p>
          )}
          <p className="text-xs text-[#6B4E3D]">
            We'll send your order confirmation and updates to this email
          </p>
        </div>

        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={customerInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`clay-input ${(validationErrors.firstName || errors.firstName) ? 'border-red-500' : ''}`}
            />
            {(validationErrors.firstName || errors.firstName) && (
              <p className="text-sm text-red-600">{validationErrors.firstName || errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={customerInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`clay-input ${(validationErrors.lastName || errors.lastName) ? 'border-red-500' : ''}`}
            />
            {(validationErrors.lastName || errors.lastName) && (
              <p className="text-sm text-red-600">{validationErrors.lastName || errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Phone (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>Phone Number</span>
            <Badge variant="outline" className="text-xs">Optional</Badge>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+31 6 1234 5678"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`clay-input ${(validationErrors.phone || errors.phone) ? 'border-red-500' : ''}`}
          />
          {(validationErrors.phone || errors.phone) && (
            <p className="text-sm text-red-600">{validationErrors.phone || errors.phone}</p>
          )}
          <p className="text-xs text-[#6B4E3D]">
            For delivery updates and support (recommended)
          </p>
        </div>

        {/* Create Account Option for Guest */}
        {isGuestMode && (
          <div className="flex items-center space-x-2 p-4 bg-[#f8f6f3] rounded-lg">
            <Checkbox
              id="createAccount"
              checked={customerInfo.createAccount}
              onCheckedChange={(checked) => handleInputChange('createAccount', checked as boolean)}
            />
            <Label htmlFor="createAccount" className="text-sm">
              Create an account to track orders and save information for future purchases
            </Label>
          </div>
        )}
      </div>

      <Separator />

      {/* Benefits of Account Creation */}
      {(customerInfo.createAccount || !isGuestMode) && (
        <Alert className="bg-green-50 border-green-200">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="text-green-800">
              <strong>Account Benefits:</strong>
              <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                <li>Track your orders and delivery status</li>
                <li>Save addresses for faster checkout</li>
                <li>Manage coffee subscriptions</li>
                <li>Exclusive member discounts and early access</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          className="clay-button bg-[#8B4513] hover:bg-[#A0522D] text-white px-8"
          size="lg"
        >
          Continue to Shipping
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}