import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { CreditCard, MapPin, ArrowRight, ArrowLeft, Info, Building } from 'lucide-react';

interface BillingAddressProps {
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
  sameBillingAddress: boolean;
  errors: Record<string, string>;
  onUpdate: (billingAddress: BillingAddressProps['billingAddress'], sameBillingAddress: boolean) => void;
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

export function BillingAddress({ 
  billingAddress, 
  shippingAddress, 
  sameBillingAddress, 
  errors, 
  onUpdate, 
  onNext, 
  onPrev 
}: BillingAddressProps): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [vatNumber, setVatNumber] = useState('');
  const [isBusinessPurchase, setIsBusinessPurchase] = useState(false);

  // Sync billing address with shipping when checkbox is checked
  useEffect(() => {
    if (sameBillingAddress) {
      onUpdate(shippingAddress, true);
    }
  }, [sameBillingAddress, shippingAddress, onUpdate]);

  const validateForm = (): boolean => {
    if (sameBillingAddress) {
      return true; // No validation needed if using shipping address
    }

    const newErrors: Record<string, string> = {};

    if (!billingAddress.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!billingAddress.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!billingAddress.address1) {
      newErrors.address1 = 'Street address is required';
    }

    if (!billingAddress.city) {
      newErrors.city = 'City is required';
    }

    if (!billingAddress.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    }

    if (!billingAddress.country) {
      newErrors.country = 'Country is required';
    }

    // VAT number validation for business purchases
    if (isBusinessPurchase && vatNumber && !validateVatNumber(vatNumber, billingAddress.country)) {
      newErrors.vatNumber = 'Please enter a valid VAT number';
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVatNumber = (vat: string, country: string): boolean => {
    // Basic VAT number validation by country
    const vatPatterns: Record<string, RegExp> = {
      'NL': /^NL[0-9]{9}B[0-9]{2}$/,
      'DE': /^DE[0-9]{9}$/,
      'FR': /^FR[0-9A-Z]{2}[0-9]{9}$/,
      'BE': /^BE[0-9]{10}$/,
      'AT': /^ATU[0-9]{8}$/,
      'IT': /^IT[0-9]{11}$/,
      'ES': /^ES[0-9A-Z][0-9]{7}[0-9A-Z]$/,
    };

    const pattern = vatPatterns[country];
    return pattern ? pattern.test(vat.replace(/\s/g, '')) : vat.length >= 8;
  };

  const handleInputChange = (field: keyof BillingAddressProps['billingAddress'], value: string): void => {
    if (sameBillingAddress) {
      onUpdate(shippingAddress, false);
      return;
    }

    onUpdate({
      ...billingAddress,
      [field]: value,
    }, false);
    
    // Clear field-specific error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSameBillingAddressChange = (checked: boolean): void => {
    if (checked) {
      onUpdate(shippingAddress, true);
    } else {
      onUpdate(billingAddress, false);
    }
  };

  const handleNext = (): void => {
    if (validateForm()) {
      onNext();
    }
  };

  const formatPostalCode = (value: string): string => {
    const cleanValue = value.replace(/\s/g, '').toUpperCase();
    
    if (billingAddress.country === 'NL' && cleanValue.length >= 4) {
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
        <CreditCard className="w-5 h-5 text-[#8B4513]" />
        <h3 className="text-lg font-semibold text-[#8B4513]">Billing Address</h3>
        <Badge variant="secondary">Step 3 of 5</Badge>
      </div>

      {/* Same as Shipping Checkbox */}
      <div className="flex items-center space-x-3 p-4 bg-[#f8f6f3] rounded-lg">
        <Checkbox
          id="sameBillingAddress"
          checked={sameBillingAddress}
          onCheckedChange={handleSameBillingAddressChange}
        />
        <Label htmlFor="sameBillingAddress" className="text-sm font-medium">
          My billing address is the same as my shipping address
        </Label>
      </div>

      {/* Business Purchase Toggle */}
      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Checkbox
          id="businessPurchase"
          checked={isBusinessPurchase}
          onCheckedChange={setIsBusinessPurchase}
        />
        <div className="flex-1">
          <Label htmlFor="businessPurchase" className="text-sm font-medium flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>This is a business purchase</span>
          </Label>
          <p className="text-xs text-[#6B4E3D] mt-1">
            Check this if you need a VAT invoice for business expenses
          </p>
        </div>
      </div>

      {/* Billing Address Form (only show if different from shipping) */}
      {!sameBillingAddress && (
        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingFirstName">First Name *</Label>
              <Input
                id="billingFirstName"
                type="text"
                placeholder="John"
                value={billingAddress.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`clay-input ${(validationErrors.firstName || errors.firstName) ? 'border-red-500' : ''}`}
              />
              {(validationErrors.firstName || errors.firstName) && (
                <p className="text-sm text-red-600">{validationErrors.firstName || errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingLastName">Last Name *</Label>
              <Input
                id="billingLastName"
                type="text"
                placeholder="Doe"
                value={billingAddress.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`clay-input ${(validationErrors.lastName || errors.lastName) ? 'border-red-500' : ''}`}
              />
              {(validationErrors.lastName || errors.lastName) && (
                <p className="text-sm text-red-600">{validationErrors.lastName || errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Company (Required for business) */}
          <div className="space-y-2">
            <Label htmlFor="billingCompany" className="flex items-center space-x-1">
              <span>Company</span>
              {isBusinessPurchase ? (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Optional</Badge>
              )}
            </Label>
            <Input
              id="billingCompany"
              type="text"
              placeholder="Company name"
              value={billingAddress.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="clay-input"
              required={isBusinessPurchase}
            />
          </div>

          {/* Address Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billingAddress1" className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Street Address *</span>
              </Label>
              <Input
                id="billingAddress1"
                type="text"
                placeholder="123 Main Street"
                value={billingAddress.address1}
                onChange={(e) => handleInputChange('address1', e.target.value)}
                className={`clay-input ${(validationErrors.address1 || errors.address1) ? 'border-red-500' : ''}`}
              />
              {(validationErrors.address1 || errors.address1) && (
                <p className="text-sm text-red-600">{validationErrors.address1 || errors.address1}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingAddress2">Apartment, suite, etc.</Label>
              <Input
                id="billingAddress2"
                type="text"
                placeholder="Apartment, suite, unit, building, floor, etc."
                value={billingAddress.address2 || ''}
                onChange={(e) => handleInputChange('address2', e.target.value)}
                className="clay-input"
              />
            </div>
          </div>

          {/* City, Postal Code, Country */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingCity">City *</Label>
              <Input
                id="billingCity"
                type="text"
                placeholder="Amsterdam"
                value={billingAddress.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`clay-input ${(validationErrors.city || errors.city) ? 'border-red-500' : ''}`}
              />
              {(validationErrors.city || errors.city) && (
                <p className="text-sm text-red-600">{validationErrors.city || errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingPostalCode">Postal Code *</Label>
              <Input
                id="billingPostalCode"
                type="text"
                placeholder="1234 AB"
                value={billingAddress.postalCode}
                onChange={(e) => handleInputChange('postalCode', formatPostalCode(e.target.value))}
                className={`clay-input ${(validationErrors.postalCode || errors.postalCode) ? 'border-red-500' : ''}`}
              />
              {(validationErrors.postalCode || errors.postalCode) && (
                <p className="text-sm text-red-600">{validationErrors.postalCode || errors.postalCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingCountry">Country *</Label>
              <Select
                value={billingAddress.country}
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
        </div>
      )}

      {/* VAT Number (for business purchases) */}
      {isBusinessPurchase && (
        <div className="space-y-2">
          <Label htmlFor="vatNumber" className="flex items-center space-x-1">
            <span>VAT Number</span>
            <Badge variant="outline" className="text-xs">Optional</Badge>
          </Label>
          <Input
            id="vatNumber"
            type="text"
            placeholder={`e.g., ${sameBillingAddress ? shippingAddress.country : billingAddress.country}123456789B01`}
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value.toUpperCase())}
            className={`clay-input ${validationErrors.vatNumber ? 'border-red-500' : ''}`}
          />
          {validationErrors.vatNumber && (
            <p className="text-sm text-red-600">{validationErrors.vatNumber}</p>
          )}
          <p className="text-xs text-[#6B4E3D]">
            Enter your VAT number to receive a VAT invoice. Leave empty if not applicable.
          </p>
        </div>
      )}

      <Separator />

      {/* Address Summary */}
      <Alert className="bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <div className="text-green-800">
            <strong>Billing Address Summary:</strong>
            <div className="mt-2 text-sm">
              {sameBillingAddress ? (
                <p>Same as shipping address ({getCountryName(shippingAddress.country)})</p>
              ) : (
                <p>{getCountryName(billingAddress.country)}</p>
              )}
              {isBusinessPurchase && (
                <p className="mt-1">Business purchase - VAT invoice will be generated</p>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>

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
          Continue to Shipping
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}