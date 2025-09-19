import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  Eye,
  RotateCcw,
  Truck,
  Calendar,
  Coffee,
  MapPin,
  CreditCard,
  CheckCircle
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'HC-2024-012',
    date: '2024-01-15',
    status: 'delivered',
    total: 49.99,
    trackingNumber: 'DHL123456789',
    deliveredDate: '2024-01-18',
    items: [
      { id: '1', name: 'Honduras Mountain Reserve', variant: '500g, Whole Bean', quantity: 1, price: 34.99 },
      { id: '2', name: 'Ceramic Coffee Mug', variant: 'Blue', quantity: 1, price: 15.00 }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Coffee Street',
      city: 'Amsterdam',
      postalCode: '1012 AB',
      country: 'Netherlands'
    }
  },
  {
    id: '2',
    orderNumber: 'HC-2024-011',
    date: '2024-01-02',
    status: 'delivered',
    total: 34.99,
    trackingNumber: 'DHL987654321',
    deliveredDate: '2024-01-05',
    items: [
      { id: '3', name: 'Morning Blend', variant: '250g, Ground', quantity: 1, price: 24.99 },
      { id: '4', name: 'Coffee Filters Pack', variant: 'Size 4', quantity: 1, price: 10.00 }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Coffee Street',
      city: 'Amsterdam',
      postalCode: '1012 AB',
      country: 'Netherlands'
    }
  },
  {
    id: '3',
    orderNumber: 'HC-2024-010',
    date: '2023-12-18',
    status: 'delivered',
    total: 89.97,
    trackingNumber: 'DHL555666777',
    deliveredDate: '2023-12-21',
    items: [
      { id: '5', name: 'Holiday Gift Set', variant: 'Premium', quantity: 1, price: 59.99 },
      { id: '6', name: 'Premium Grinder', variant: 'Stainless Steel', quantity: 1, price: 29.98 }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Coffee Street',
      city: 'Amsterdam',
      postalCode: '1012 AB',
      country: 'Netherlands'
    }
  },
  {
    id: '4',
    orderNumber: 'HC-2024-009',
    date: '2023-12-01',
    status: 'shipped',
    total: 39.99,
    trackingNumber: 'DHL111222333',
    estimatedDelivery: '2023-12-04',
    items: [
      { id: '7', name: 'Dark Roast Espresso', variant: '1kg, Whole Bean', quantity: 1, price: 39.99 }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Coffee Street',
      city: 'Amsterdam',
      postalCode: '1012 AB',
      country: 'Netherlands'
    }
  }
];

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusColors = {
    delivered: 'bg-green-100 text-green-800 border-green-200',
    shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReorder = (order: Order) => {
    // Add order items to cart
    console.log('Reordering:', order.orderNumber);
  };

  const handleDownloadInvoice = (order: Order) => {
    // Download invoice PDF
    console.log('Downloading invoice for:', order.orderNumber);
  };

  const OrderDetailModal = ({ order }: { order: Order }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <Package className="mr-2 h-5 w-5 text-primary" />
          Order #{order.orderNumber}
        </DialogTitle>
        <DialogDescription>
          Placed on {new Date(order.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Order Status */}
        <Card className="clay-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-semibold">Order Status</h4>
                  <Badge className={`clay-badge ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
              {order.trackingNumber && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-mono text-sm font-medium">{order.trackingNumber}</p>
                </div>
              )}
            </div>
            
            {order.deliveredDate && (
              <p className="text-sm text-muted-foreground">
                Delivered on {new Date(order.deliveredDate).toLocaleDateString()}
              </p>
            )}
            {order.estimatedDelivery && order.status === 'shipped' && (
              <p className="text-sm text-muted-foreground">
                Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="clay-card">
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted/30 rounded-lg flex items-center justify-center">
                      <Coffee className="h-6 w-6 text-primary/70" />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">€{item.price.toFixed(2)}</p>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="clay-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button 
            className="flex-1 clay-button" 
            onClick={() => handleReorder(order)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reorder Items
          </Button>
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => handleDownloadInvoice(order)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="clay-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 clay-input"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-primary" />
              Order History ({filteredOrders.length})
            </span>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </CardTitle>
          <CardDescription>
            View and manage your coffee orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        {order.trackingNumber && (
                          <p className="text-xs text-muted-foreground font-mono">
                            {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p>{new Date(order.date).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={`clay-badge ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <p key={item.id} className="text-sm">
                            {item.name} × {item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold">€{order.total.toFixed(2)}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedOrder && <OrderDetailModal order={selectedOrder} />}
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReorder(order)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'You haven\'t placed any orders yet'
                }
              </p>
              <Button className="clay-button">
                <Coffee className="mr-2 h-4 w-4" />
                Start Shopping
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}