import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Shield, Key, Smartphone, Eye, Trash2, AlertTriangle } from 'lucide-react';

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5 text-primary" />
            Password Settings
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" className="clay-input" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" className="clay-input" />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" className="clay-input" />
          </div>
          <Button className="clay-button">Update Password</Button>
        </CardContent>
      </Card>

      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="mr-2 h-5 w-5 text-primary" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Secure your account with SMS or authenticator app
              </p>
            </div>
            <Badge className="clay-badge bg-red-100 text-red-800">Disabled</Badge>
          </div>
          <Button className="mt-4 clay-button">Enable 2FA</Button>
        </CardContent>
      </Card>

      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5 text-primary" />
            Login Activity
          </CardTitle>
          <CardDescription>
            Recent login sessions and devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { device: 'Chrome on MacOS', location: 'Amsterdam, Netherlands', time: '2 hours ago', current: true },
              { device: 'Safari on iPhone', location: 'Amsterdam, Netherlands', time: '1 day ago', current: false },
              { device: 'Chrome on Windows', location: 'Rotterdam, Netherlands', time: '3 days ago', current: false },
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border/40 rounded-lg">
                <div>
                  <p className="font-medium">{session.device}</p>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                  <p className="text-xs text-muted-foreground">{session.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {session.current && (
                    <Badge className="clay-badge bg-green-100 text-green-800">Current</Badge>
                  )}
                  {!session.current && (
                    <Button variant="outline" size="sm">Revoke</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="clay-card border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible account actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}