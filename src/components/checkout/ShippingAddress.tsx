import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Truck, MapPin, ArrowRight, ArrowLeft, Info } from 'lucide-react';

interface ShippingAddressProps {
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
  errors: Record<string, string>;
  onUpdate: (shippingAddress: ShippingAddressProps['shippingAddress']) => void;
  onNext: () => void;
  onPrev: () => void;
}

const EU_COUNTRIES = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
];

export function ShippingAddress({ shippingAddress, errors, onUpdate, onNext, onPrev }: ShippingAddressProps): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!shippingAddress.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!shippingAddress.address1) {
      newErrors.address1 = 'Street address is required';
    } else if (shippingAddress.address1.length < 5) {
      newErrors.address1 = 'Please enter a complete street address';
    }

    if (!shippingAddress.city) {
      newErrors.city = 'City is required';
    }

    if (!shippingAddress.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    } else {
      // Basic postal code validation for EU countries
      const postalCodePattern = /^[0-9]{4,5}[A-Z]{0,2}$/;
      if (!postalCodePattern.test(shippingAddress.postalCode.replace(/\s/g, ''))) {
        newErrors.postalCode = 'Please enter a valid postal code';
      }
    }

    if (!shippingAddress.country) {
      newErrors.country = 'Country is required';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingAddressProps['shippingAddress'], value: string): void => {
    onUpdate({
      ...shippingAddress,
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

  const formatPostalCode = (value: string): string => {
    // Auto-format postal codes for certain countries
    const cleanValue = value.replace(/\s/g, '').toUpperCase();
    
    if (shippingAddress.country === 'NL' && cleanValue.length >= 4) {
      return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 6)}`;
    }
    
    return cleanValue;
  };

  const getCountryName = (code: string): string => {
    return EU_COUNTRIES.find(country => country.code === code)?.name || code;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Truck className="w-5 h-5 text-[#8B4513]" />
        <h3 className="text-lg font-semibold text-[#8B4513]">Shipping Address</h3>
        <Badge variant="secondary">Step 2 of 5</Badge>
      </div>

      {/* EU Shipping Notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          We currently ship to all EU countries. Free shipping on orders over €50!
        </AlertDescription>
      </Alert>

      {/* Name Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shippingFirstName">First Name *</Label>
          <Input
            id="shippingFirstName"
            type="text"
            placeholder="John"
            value={shippingAddress.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`clay-input ${(validationErrors.firstName || errors.firstName) ? 'border-red-500' : ''}`}
          />
          {(validationErrors.firstName || errors.firstName) && (
            <p className="text-sm text-red-600">{validationErrors.firstName || errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shippingLastName">Last Name *</Label>
          <Input
            id="shippingLastName"
            type="text"
            placeholder="Doe"
            value={shippingAddress.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`clay-input ${(validationErrors.lastName || errors.lastName) ? 'border-red-500' : ''}`}
          />
          {(validationErrors.lastName || errors.lastName) && (
            <p className="text-sm text-red-600">{validationErrors.lastName || errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Company (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="shippingCompany" className="flex items-center space-x-1">
          <span>Company</span>
          <Badge variant="outline" className="text-xs">Optional</Badge>
        </Label>
        <Input
          id="shippingCompany"
          type="text"
          placeholder="Company name"
          value={shippingAddress.company || ''}
          onChange={(e) => handleInputChange('company', e.target.value)}
          className="clay-input"
        />
      </div>

      {/* Address Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shippingAddress1" className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>Street Address *</span>
          </Label>
          <Input
            id="shippingAddress1"
            type="text"
            placeholder="123 Main Street"
            value={shippingAddress.address1}
            onChange={(e) => handleInputChange('address1', e.target.value)}
            className={`clay-input ${(validationErrors.address1 || errors.address1) ? 'border-red-500' : ''}`}
          />
          {(validationErrors.address1 || errors.address1) && (
            <p className="text-sm text-red-600">{validationErrors.address1 || errors.address1}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shippingAddress2">Apartment, suite, etc.</Label>
          <Input
            id="shippingAddress2"
            type="text"
            placeholder="Apartment, suite, unit, building, floor, etc."
            value={shippingAddress.address2 || ''}
            onChange={(e) => handleInputChange('address2', e.target.value)}
            className="clay-input"
          />
        </div>
      </div>

      {/* City, Postal Code, Country */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shippingCity">City *</Label>
          <Input
            id="shippingCity"
            type="text"
            placeholder="Amsterdam"
            value={shippingAddress.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`clay-input ${(validationErrors.city || errors.city) ? 'border-red-500' : ''}`}
          />
          {(validationErrors.city || errors.city) && (
            <p className="text-sm text-red-600">{validationErrors.city || errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shippingPostalCode">Postal Code *</Label>
          <Input
            id="shippingPostalCode"
            type="text"
            placeholder="1234 AB"
            value={shippingAddress.postalCode}
            onChange={(e) => handleInputChange('postalCode', formatPostalCode(e.target.value))}
            className={`clay-input ${(validationErrors.postalCode || errors.postalCode) ? 'border-red-500' : ''}`}
          />
          {(validationErrors.postalCode || errors.postalCode) && (
            <p className="text-sm text-red-600">{validationErrors.postalCode || errors.postalCode}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shippingCountry">Country *</Label>
          <Select
            value={shippingAddress.country}
            onValueChange={(value) => handleInputChange('country', value)}
          >
            <SelectTrigger className={`clay-input ${(validationErrors.country || errors.country) ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {EU_COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(validationErrors.country || errors.country) && (
            <p className="text-sm text-red-600">{validationErrors.country || errors.country}</p>
          )}
        </div>
      </div>

      {/* Phone (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="shippingPhone" className="flex items-center space-x-1">
          <span>Phone Number</span>
          <Badge variant="outline" className="text-xs">Optional</Badge>
        </Label>
        <Input
          id="shippingPhone"
          type="tel"
          placeholder="+31 6 1234 5678"
          value={shippingAddress.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="clay-input"
        />
        <p className="text-xs text-[#6B4E3D]">
          For delivery coordination and SMS updates
        </p>
      </div>

      {/* Delivery Instructions */}
      <div className="space-y-2">
        <Label htmlFor="deliveryInstructions">Special Delivery Instructions</Label>
        <Textarea
          id="deliveryInstructions"
          placeholder="e.g., Leave with neighbor, Ring twice, Gate code: 1234, etc."
          value={deliveryInstructions}
          onChange={(e) => setDeliveryInstructions(e.target.value)}
          className="clay-input min-h-[80px]"
          maxLength={200}
        />
        <p className="text-xs text-[#6B4E3D]">
          {deliveryInstructions.length}/200 characters
        </p>
      </div>

      <Separator />

      {/* Shipping Information */}
      {shippingAddress.country && (
        <Alert className="bg-green-50 border-green-200">
          <Truck className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="text-green-800">
              <strong>Shipping to {getCountryName(shippingAddress.country)}:</strong>
              <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                <li>Standard delivery: 3-5 business days (€5.99)</li>
                <li>Express delivery: 1-2 business days (€12.99)</li>
                <li>Free standard shipping on orders over €50</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
          className="clay-button bg-[#8B4513] hover:bg-[#A0522D] text-white px-8"
          size="lg"
        >
          Continue to Billing
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}