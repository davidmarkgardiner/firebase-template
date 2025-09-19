import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CheckCircle, 
  Mail, 
  Truck, 
  Package, 
  Calendar,
  Download,
  Coffee,
  Home,
  Share
} from 'lucide-react';

export function OrderConfirmation(): JSX.Element {
  // Mock order data
  const orderData = {
    orderNumber: 'HC-2024-001234',
    orderDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    customer: {
      email: 'john@example.com',
      name: 'John Doe',
    },
    shipping: {
      address: {
        name: 'John Doe',
        line1: 'Keizersgracht 123',
        city: 'Amsterdam',
        postalCode: '1015 CJ',
        country: 'Netherlands',
      },
      method: 'Standard Delivery (3-5 days)',
    },
    items: [
      {
        id: '1',
        name: 'Honduras Mountain Reserve',
        description: 'Single origin, high altitude beans',
        price: 24.99,
        quantity: 2,
        weight: '250g',
        grind: 'Whole Bean',
      },
      {
        id: '2',
        name: 'Estate Premium Blend',
        description: 'Family farm exclusive blend',
        price: 29.99,
        quantity: 1,
        weight: '500g',
        grind: 'Filter Grind',
      },
    ],
    totals: {
      subtotal: 79.97,
      shipping: 0,
      vat: 16.79,
      total: 96.76,
    },
  };

  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2)}`;
  };

  const handleContinueShopping = (): void => {
    window.location.href = '/products';
  };

  const handleViewOrder = (): void => {
    window.location.href = `/account/orders/${orderData.orderNumber}`;
  };

  const handleDownloadReceipt = (): void => {
    // In a real app, this would generate and download a PDF receipt
    alert('Receipt download would be implemented here');
  };

  const handleShareOrder = (): void => {
    if (navigator.share) {
      navigator.share({
        title: 'My Honduras Coffee Order',
        text: `I just ordered amazing coffee from Honduras Coffee! Order #${orderData.orderNumber}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Order link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] to-[#f3f1ee]">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Order Confirmed!</h1>
          <p className="text-[#6B4E3D] text-lg">
            Thank you for your order, {orderData.customer.name}
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <span className="text-sm text-[#6B4E3D]">Order Number:</span>
            <Badge variant="secondary" className="font-mono">
              {orderData.orderNumber}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card className="clay-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-[#8B4513]" />
                  <span>Order Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">Payment Confirmed</h3>
                      <p className="text-sm text-green-600">Your payment has been processed successfully</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">Completed</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Coffee className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-800">Order Processing</h3>
                      <p className="text-sm text-blue-600">We're preparing your coffee for shipment</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-600 text-white">In Progress</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-75">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-6 h-6 text-gray-500" />
                    <div>
                      <h3 className="font-semibold text-gray-700">Shipped</h3>
                      <p className="text-sm text-gray-500">Your order is on its way</p>
                    </div>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="clay-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-[#8B4513]" />
                  <span>Shipping Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Delivery Address</h4>
                    <div className="text-sm text-[#6B4E3D] space-y-1">
                      <p>{orderData.shipping.address.name}</p>
                      <p>{orderData.shipping.address.line1}</p>
                      <p>
                        {orderData.shipping.address.postalCode} {orderData.shipping.address.city}
                      </p>
                      <p>{orderData.shipping.address.country}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Delivery Details</h4>
                    <div className="text-sm text-[#6B4E3D] space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Estimated delivery: {orderData.estimatedDelivery}</span>
                      </div>
                      <p>Method: {orderData.shipping.method}</p>
                      <p>Carrier: DHL</p>
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Tracking information will be sent to {orderData.customer.email}</strong>
                    <p className="text-sm mt-1">
                      You'll receive an email with tracking details once your order ships.
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="clay-card">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/50 rounded-lg">
                      <div className="w-16 h-16 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                        <Coffee className="w-8 h-8 text-[#8B4513]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-[#6B4E3D]">{item.description}</p>
                        <p className="text-sm text-[#6B4E3D]">{item.weight} • {item.grind}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-sm text-[#6B4E3D]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(orderData.totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (21%)</span>
                    <span>{formatPrice(orderData.totals.vat)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(orderData.totals.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Buttons */}
            <Card className="clay-card">
              <CardContent className="p-4 space-y-3">
                <Button 
                  onClick={handleViewOrder}
                  className="w-full clay-button bg-[#8B4513] hover:bg-[#A0522D] text-white"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View Order Details
                </Button>
                
                <Button 
                  onClick={handleDownloadReceipt}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                
                <Button 
                  onClick={handleShareOrder}
                  variant="outline"
                  className="w-full"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share Order
                </Button>
                
                <Button 
                  onClick={handleContinueShopping}
                  variant="ghost"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card className="clay-card">
              <CardHeader>
                <CardTitle className="text-base">What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-[#6B4E3D]">We'll prepare your coffee within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Shipping</p>
                    <p className="text-[#6B4E3D]">Your order will be shipped via DHL</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-[#6B4E3D]">Enjoy your Honduras coffee!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="clay-card">
              <CardContent className="p-4 text-center space-y-2">
                <h4 className="font-medium">Need Help?</h4>
                <p className="text-sm text-[#6B4E3D]">
                  Our coffee experts are here to help
                </p>
                <div className="space-y-1 text-xs">
                  <p>📧 orders@hondurascoffee.eu</p>
                  <p>📞 +31 20 123 4567</p>
                  <p>💬 Live chat available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}