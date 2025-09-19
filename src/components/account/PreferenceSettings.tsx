import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Settings, Mail, Bell, Coffee, Shield } from 'lucide-react';

export function PreferenceSettings() {
  return (
    <div className="space-y-6">
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-primary" />
            Email Preferences
          </CardTitle>
          <CardDescription>
            Choose what email communications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: 'marketing', label: 'Marketing Emails', description: 'Product updates and special offers' },
            { id: 'order', label: 'Order Updates', description: 'Order confirmations and shipping notifications' },
            { id: 'brewing', label: 'Brewing Tips', description: 'Weekly coffee brewing guides and tips' },
            { id: 'newsletter', label: 'Newsletter', description: 'Monthly coffee industry news and stories' },
          ].map((pref) => (
            <div key={pref.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">{pref.label}</Label>
                <p className="text-xs text-muted-foreground">{pref.description}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage your push and SMS notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: 'push', label: 'Push Notifications', description: 'Browser notifications for important updates' },
            { id: 'sms', label: 'SMS Notifications', description: 'Text messages for delivery updates' },
            { id: 'reminders', label: 'Delivery Reminders', description: 'Reminders before your next delivery' },
          ].map((pref) => (
            <div key={pref.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">{pref.label}</Label>
                <p className="text-xs text-muted-foreground">{pref.description}</p>
              </div>
              <Switch />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coffee className="mr-2 h-5 w-5 text-primary" />
            Coffee Preferences
          </CardTitle>
          <CardDescription>
            Help us personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: 'recommendations', label: 'Personalized Recommendations', description: 'Get coffee suggestions based on your taste' },
            { id: 'tasting', label: 'Tasting Notes', description: 'Include detailed tasting notes with deliveries' },
            { id: 'brewing-guides', label: 'Brewing Guides', description: 'Include brewing instructions with each order' },
          ].map((pref) => (
            <div key={pref.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">{pref.label}</Label>
                <p className="text-xs text-muted-foreground">{pref.description}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}