import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Package, 
  RefreshCw, 
  CreditCard, 
  MapPin,
  Calendar,
  Coffee,
  TrendingUp,
  Clock
} from 'lucide-react';

interface QuickStatProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function QuickStat({ title, value, description, icon: Icon, trend }: QuickStatProps) {
  return (
    <Card className="clay-card hover:clay-shadow-medium transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Icon className="h-8 w-8 text-primary/70" />
            {trend && (
              <div className={`flex items-center text-xs ${
                trend.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend.value}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentOrderProps {
  orderNumber: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: string[];
}

function RecentOrderCard({ orderNumber, date, status, total, items }: RecentOrderProps) {
  const statusColors = {
    delivered: 'bg-green-100 text-green-800 border-green-200',
    shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Card className="clay-card hover:clay-shadow-medium transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-foreground">#{orderNumber}</h4>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
          <Badge className={`clay-badge ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {items.slice(0, 2).map((item, index) => (
              <div key={index}>• {item}</div>
            ))}
            {items.length > 2 && (
              <div className="text-xs text-muted-foreground/70">
                +{items.length - 2} more items
              </div>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">€{total.toFixed(2)}</span>
            <Button size="sm" variant="outline" className="clay-button text-xs">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AccountOverview() {
  const quickStats = [
    {
      title: 'Total Orders',
      value: '12',
      description: 'All time orders',
      icon: Package,
      trend: { value: '+2 this month', positive: true }
    },
    {
      title: 'Active Subscriptions',
      value: '1',
      description: 'Monthly delivery',
      icon: RefreshCw,
    },
    {
      title: 'Saved Cards',
      value: '2',
      description: 'Payment methods',
      icon: CreditCard,
    },
    {
      title: 'Addresses',
      value: '3',
      description: 'Delivery locations',
      icon: MapPin,
    },
  ];

  const recentOrders = [
    {
      orderNumber: 'HC-2024-012',
      date: 'January 15, 2024',
      status: 'delivered' as const,
      total: 49.99,
      items: ['Honduras Mountain Reserve 500g', 'Ceramic Coffee Mug']
    },
    {
      orderNumber: 'HC-2024-011',
      date: 'January 2, 2024',
      status: 'delivered' as const,
      total: 34.99,
      items: ['Morning Blend 250g', 'Coffee Filters Pack']
    },
    {
      orderNumber: 'HC-2024-010',
      date: 'December 18, 2023',
      status: 'delivered' as const,
      total: 89.97,
      items: ['Holiday Gift Set', 'Premium Grinder', 'Coffee Beans Variety Pack']
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="clay-card coffee-gradient text-white overflow-hidden relative">
        <CardContent className="p-8">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
            <p className="text-white/90 mb-4">
              Your next Honduras Mountain Coffee delivery is scheduled for January 28th
            </p>
            <div className="flex items-center space-x-4">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Coffee className="mr-2 h-4 w-4" />
                Shop More Coffee
              </Button>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <Coffee className="h-32 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <QuickStat key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
            <Button variant="outline" size="sm" className="clay-button">
              View All Orders
            </Button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <RecentOrderCard key={index} {...order} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Card className="clay-card hover:clay-shadow-medium transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Manage Subscription</h4>
                    <p className="text-sm text-muted-foreground">Pause, modify, or cancel</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="clay-card hover:clay-shadow-medium transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Reorder Favorites</h4>
                    <p className="text-sm text-muted-foreground">Quickly reorder past items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="clay-card hover:clay-shadow-medium transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Update Address</h4>
                    <p className="text-sm text-muted-foreground">Manage delivery locations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="clay-card hover:clay-shadow-medium transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Brewing Guides</h4>
                    <p className="text-sm text-muted-foreground">Learn new techniques</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}