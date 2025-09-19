import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home,
  Building,
  Check,
  X
} from 'lucide-react';

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'shipping',
    isDefault: true,
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Coffee Street',
    city: 'Amsterdam',
    postalCode: '1012 AB',
    country: 'Netherlands',
    phone: '+31 20 123 4567'
  },
  {
    id: '2',
    type: 'billing',
    isDefault: false,
    firstName: 'John',
    lastName: 'Doe',
    company: 'Coffee Corp',
    street: '456 Business Ave',
    city: 'Rotterdam',
    postalCode: '3011 AB',
    country: 'Netherlands',
    phone: '+31 10 987 6543'
  }
];

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const AddressCard = ({ address }: { address: Address }) => (
    <Card className="clay-card hover:clay-shadow-medium transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {address.type === 'shipping' ? (
              <Home className="h-5 w-5 text-primary" />
            ) : (
              <Building className="h-5 w-5 text-primary" />
            )}
            <span className="font-medium capitalize">{address.type}</span>
            {address.isDefault && (
              <Badge className="clay-badge bg-green-100 text-green-800">
                Default
              </Badge>
            )}
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setEditingAddress(address)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <p className="font-medium">
            {address.firstName} {address.lastName}
          </p>
          {address.company && (
            <p className="text-muted-foreground">{address.company}</p>
          )}
          <p>{address.street}</p>
          <p>{address.postalCode} {address.city}</p>
          <p>{address.country}</p>
          {address.phone && (
            <p className="text-muted-foreground">{address.phone}</p>
          )}
        </div>

        {!address.isDefault && (
          <div className="mt-3 pt-3 border-t border-border/40">
            <Button variant="outline" size="sm" className="w-full">
              Set as Default
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const AddressForm = ({ address, onClose }: { address?: Address; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      type: address?.type || 'shipping',
      firstName: address?.firstName || '',
      lastName: address?.lastName || '',
      company: address?.company || '',
      street: address?.street || '',
      city: address?.city || '',
      postalCode: address?.postalCode || '',
      country: address?.country || 'Netherlands',
      phone: address?.phone || '',
      isDefault: address?.isDefault || false
    });

    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {address ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
          <DialogDescription>
            {address ? 'Update your address information' : 'Add a new shipping or billing address'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Address Type</Label>
            <Select value={formData.type} onValueChange={(value: 'shipping' | 'billing') => 
              setFormData(prev => ({ ...prev, type: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping Address</SelectItem>
                <SelectItem value="billing">Billing Address</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input 
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="clay-input"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input 
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="clay-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Company (Optional)</Label>
            <Input 
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="clay-input"
            />
          </div>

          <div className="space-y-2">
            <Label>Street Address *</Label>
            <Input 
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              className="clay-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Postal Code *</Label>
              <Input 
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="clay-input"
              />
            </div>
            <div className="space-y-2">
              <Label>City *</Label>
              <Input 
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="clay-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={formData.country} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, country: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Netherlands">Netherlands</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="Belgium">Belgium</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Phone (Optional)</Label>
            <Input 
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="clay-input"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="default"
              checked={formData.isDefault}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
            />
            <Label htmlFor="default">Set as default address</Label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button className="flex-1 clay-button">
              <Check className="mr-2 h-4 w-4" />
              {address ? 'Update' : 'Add'} Address
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Address Book</h2>
          <p className="text-muted-foreground">Manage your shipping and billing addresses</p>
        </div>
        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
          <DialogTrigger asChild>
            <Button className="clay-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <AddressForm onClose={() => setIsAddingAddress(false)} />
        </Dialog>
      </div>

      {/* Address Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>

      {/* Edit Address Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        {editingAddress && (
          <AddressForm 
            address={editingAddress} 
            onClose={() => setEditingAddress(null)} 
          />
        )}
      </Dialog>

      {/* Info Alert */}
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          We currently ship to EU countries only. Free shipping on orders over €50.
        </AlertDescription>
      </Alert>
    </div>
  );
}