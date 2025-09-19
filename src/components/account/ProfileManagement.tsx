import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Coffee,
  Upload,
  Camera,
  Check,
  AlertCircle,
  Globe,
  Clock
} from 'lucide-react';

interface ProfileField {
  label: string;
  value: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export function ProfileManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    timezone: 'Europe/Amsterdam',
    language: 'English',
    coffeePreference: 'Medium Roast',
    brewingMethod: 'Pour Over',
    bio: 'Coffee enthusiast and Honduras coffee lover. I enjoy trying new brewing methods and exploring different flavor profiles.',
  });

  const [preferences, setPreferences] = useState({
    emailMarketing: true,
    smsNotifications: false,
    orderUpdates: true,
    brewingTips: true,
    newProducts: true,
  });

  const profileCompletion = 85;

  const profileFields: Record<string, ProfileField> = {
    firstName: { label: 'First Name', value: profileData.firstName, type: 'text', required: true },
    lastName: { label: 'Last Name', value: profileData.lastName, type: 'text', required: true },
    email: { label: 'Email Address', value: profileData.email, type: 'email', required: true },
    phone: { label: 'Phone Number', value: profileData.phone, type: 'tel' },
    dateOfBirth: { label: 'Date of Birth', value: profileData.dateOfBirth, type: 'date' },
    timezone: { 
      label: 'Timezone', 
      value: profileData.timezone, 
      type: 'select',
      options: ['Europe/Amsterdam', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo']
    },
    language: { 
      label: 'Language', 
      value: profileData.language, 
      type: 'select',
      options: ['English', 'Spanish', 'French', 'German', 'Dutch']
    },
    coffeePreference: { 
      label: 'Coffee Preference', 
      value: profileData.coffeePreference, 
      type: 'select',
      options: ['Light Roast', 'Medium Roast', 'Dark Roast', 'Espresso Blend']
    },
    brewingMethod: { 
      label: 'Preferred Brewing Method', 
      value: profileData.brewingMethod, 
      type: 'select',
      options: ['Pour Over', 'French Press', 'Espresso', 'Cold Brew', 'Drip Coffee']
    },
    bio: { 
      label: 'Bio', 
      value: profileData.bio, 
      type: 'textarea', 
      placeholder: 'Tell us about your coffee journey...'
    },
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    setIsEditing(false);
    // Show success toast
  };

  const handleFieldChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (preference: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [preference]: value }));
  };

  const renderField = (key: string, field: ProfileField) => {
    const commonProps = {
      value: field.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleFieldChange(key, e.target.value),
      disabled: !isEditing,
      className: isEditing ? 'clay-input' : 'bg-muted/30 border-none'
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea 
            {...commonProps}
            placeholder={field.placeholder}
            rows={3}
          />
        );
      case 'select':
        return (
          <Select 
            value={field.value} 
            onValueChange={(value) => handleFieldChange(key, value)}
            disabled={!isEditing}
          >
            <SelectTrigger className={isEditing ? 'clay-input' : 'bg-muted/30 border-none'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input {...commonProps} type={field.type} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="clay-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/images/user-avatar.jpg" alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full clay-button p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-muted-foreground">{profileData.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="clay-badge bg-green-100 text-green-800">
                    Active Member
                  </Badge>
                  <Badge className="clay-badge bg-blue-100 text-blue-800">
                    Subscriber
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="clay-button">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="clay-button">
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Profile Completion</span>
              <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Complete your profile to get personalized coffee recommendations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(profileFields)
              .filter(([key]) => ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'].includes(key))
              .map(([key, field]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(key, field)}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coffee className="mr-2 h-5 w-5 text-primary" />
            Coffee Preferences
          </CardTitle>
          <CardDescription>
            Help us personalize your coffee experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(profileFields)
              .filter(([key]) => ['coffeePreference', 'brewingMethod'].includes(key))
              .map(([key, field]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium">
                    {field.label}
                  </Label>
                  {renderField(key, field)}
                </div>
              ))}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
            {renderField('bio', profileFields.bio)}
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-primary" />
            Regional Settings
          </CardTitle>
          <CardDescription>
            Configure your timezone and language preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(profileFields)
              .filter(([key]) => ['timezone', 'language'].includes(key))
              .map(([key, field]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium">
                    {field.label}
                  </Label>
                  {renderField(key, field)}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-primary" />
            Communication Preferences
          </CardTitle>
          <CardDescription>
            Choose how you'd like to hear from us
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {getPreferenceDescription(key)}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => handlePreferenceChange(key, checked)}
                disabled={!isEditing}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {isEditing && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Remember to save your changes when you're done editing your profile.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function getPreferenceDescription(key: string): string {
  const descriptions: Record<string, string> = {
    emailMarketing: 'Receive marketing emails about new products and offers',
    smsNotifications: 'Get SMS notifications for important updates',
    orderUpdates: 'Email notifications about your order status',
    brewingTips: 'Weekly brewing tips and coffee education',
    newProducts: 'Be the first to know about new coffee arrivals',
  };
  return descriptions[key] || '';
}