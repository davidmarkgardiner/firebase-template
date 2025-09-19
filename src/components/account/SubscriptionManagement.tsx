import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RefreshCw, Calendar, Coffee, Pause, Settings, X } from 'lucide-react';

export function SubscriptionManagement() {
  return (
    <div className="space-y-6">
      <Card className="clay-card coffee-gradient text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Active Subscription</h2>
              <p className="text-white/90">Honduras Mountain Coffee - Monthly Delivery</p>
            </div>
            <RefreshCw className="h-8 w-8 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="clay-card">
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Status</span>
              <Badge className="clay-badge bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span>Next Delivery</span>
              <span>January 28, 2024</span>
            </div>
            <div className="flex justify-between">
              <span>Frequency</span>
              <span>Monthly</span>
            </div>
            <div className="flex justify-between">
              <span>Price</span>
              <span>€34.99/month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="clay-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Pause className="mr-2 h-4 w-4" />
              Pause Subscription
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Modify Subscription
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Change Delivery Date
            </Button>
            <Button className="w-full justify-start text-destructive" variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}