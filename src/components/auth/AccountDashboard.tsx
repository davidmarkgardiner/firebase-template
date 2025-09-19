import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Package,
  CreditCard,
  MapPin,
  Bell,
  Shield,
  Coffee,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'

interface AccountDashboardProps {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
  }
  orders?: Array<{
    id: string
    orderNumber: string
    date: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    total: number
    items: number
  }>
  subscription?: {
    id: string
    status: 'active' | 'paused' | 'cancelled'
    nextDelivery: string
    frequency: string
    plan: string
  }
  onUpdateProfile: (data: any) => Promise<void>
  onUpdateSettings: (settings: any) => Promise<void>
  onCancelSubscription?: () => Promise<void>
  onPauseSubscription?: () => Promise<void>
  onResumeSubscription?: () => Promise<void>
}

export default function AccountDashboard({
  user,
  orders = [],
  subscription,
  onUpdateProfile,
  onUpdateSettings,
  onCancelSubscription,
  onPauseSubscription,
  onResumeSubscription
}: AccountDashboardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: true,
    backInStock: false
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      case 'processing':
        return <Badge className="bg-purple-100 text-purple-800">Processing</Badge>
      case 'shipped':
        return <Badge className="bg-indigo-100 text-indigo-800">Shipped</Badge>
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'processing':
        return <Clock className="h-4 w-4 text-purple-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.firstName} />
          <AvatarFallback className="text-lg">
            {user.firstName[0]}{user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.firstName}!</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">
                  {orders.filter(o => o.status === 'delivered').length} delivered
                </p>
              </CardContent>
            </Card>

            {subscription && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                  <Coffee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subscription.plan}</div>
                  <p className="text-xs text-muted-foreground">
                    Next delivery: {new Date(subscription.nextDelivery).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2024</div>
                <p className="text-xs text-muted-foreground">Coffee enthusiast</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest coffee purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">#{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{order.total.toFixed(2)}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {subscription && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                  <CardDescription>Your coffee subscription details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    {getStatusBadge(subscription.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Plan</span>
                    <span className="font-medium">{subscription.plan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Frequency</span>
                    <span className="font-medium">{subscription.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Next Delivery</span>
                    <span className="font-medium">
                      {new Date(subscription.nextDelivery).toLocaleDateString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    {subscription.status === 'active' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onPauseSubscription}
                        >
                          Pause
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={onCancelSubscription}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {subscription.status === 'paused' && (
                      <Button
                        size="sm"
                        onClick={onResumeSubscription}
                      >
                        Resume
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>All your coffee orders in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items} items</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">€{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          {subscription ? (
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Manage your coffee subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Subscription Plan</Label>
                      <p className="text-lg font-semibold">{subscription.plan}</p>
                    </div>
                    <div>
                      <Label>Delivery Frequency</Label>
                      <p className="text-lg font-semibold">{subscription.frequency}</p>
                    </div>
                    <div>
                      <Label>Next Delivery Date</Label>
                      <p className="text-lg font-semibold">
                        {new Date(subscription.nextDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">{getStatusBadge(subscription.status)}</div>
                    </div>

                    <Alert>
                      <Coffee className="h-4 w-4" />
                      <AlertDescription>
                        Your subscription includes our premium selection of single-origin Honduras coffee beans.
                        Change or cancel anytime.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Manage Subscription</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button>
                      <Edit className="mr-2 h-4 w-4" />
                      Modify Plan
                    </Button>
                    <Button variant="outline">
                      <MapPin className="mr-2 h-4 w-4" />
                      Change Address
                    </Button>
                    {subscription.status === 'active' && (
                      <>
                        <Button variant="outline" onClick={onPauseSubscription}>
                          Pause Delivery
                        </Button>
                        <Button variant="destructive" onClick={onCancelSubscription}>
                          Cancel Subscription
                        </Button>
                      </>
                    )}
                    {subscription.status === 'paused' && (
                      <Button onClick={onResumeSubscription}>
                        Resume Subscription
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Coffee className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No Active Subscription</h3>
                  <p className="text-muted-foreground">
                    Subscribe to receive fresh Honduras coffee beans regularly at your doorstep.
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Start Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  {isEditing ? (
                    <Input defaultValue={user.firstName} />
                  ) : (
                    <p className="p-2 bg-muted rounded">{user.firstName}</p>
                  )}
                </div>
                <div>
                  <Label>Last Name</Label>
                  {isEditing ? (
                    <Input defaultValue={user.lastName} />
                  ) : (
                    <p className="p-2 bg-muted rounded">{user.lastName}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Email</Label>
                  <p className="p-2 bg-muted rounded">{user.email}</p>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button onClick={() => setIsEditing(false)}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
                <Button variant="outline">
                  Change Password
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}