import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Calendar } from '@/components/ui/calendar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sonner, toast } from '@/components/ui/sonner'
import Header from '@/components/layout/Header'
import ProductCard from '@/components/shop/ProductCard'
import { 
  Coffee, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  ChevronDown,
  Star
} from 'lucide-react'

export default function ComponentShowcase() {
  const [progress, setProgress] = useState(45)
  const [sliderValue, setSliderValue] = useState([50])
  const [date, setDate] = useState<Date | undefined>(new Date())

  const mockProducts = [
    {
      id: '1',
      name: 'Honduras Single Origin Premium',
      description: 'Rich, full-bodied coffee with notes of chocolate and caramel from the mountains of Honduras',
      price: 24.99,
      originalPrice: 29.99,
      rating: 4.8,
      reviewCount: 127,
      badge: 'Best Seller',
      tags: ['Single Origin', 'Fair Trade', 'Organic'],
      isOnSale: true,
      stockLevel: 8,
      maxStock: 20
    },
    {
      id: '2',
      name: 'Medium Roast Blend',
      description: 'Smooth and balanced coffee blend perfect for everyday brewing',
      price: 19.99,
      rating: 4.6,
      reviewCount: 89,
      tags: ['Blend', 'Smooth'],
      stockLevel: 15,
      maxStock: 20
    },
    {
      id: '3',
      name: 'Dark Roast Espresso',
      description: 'Bold and intense espresso beans for the perfect shot',
      price: 22.99,
      rating: 4.9,
      reviewCount: 203,
      badge: 'Premium',
      tags: ['Espresso', 'Bold', 'Intense'],
      isInStock: false
    }
  ]

  const handleShowToast = () => {
    toast.success('Added to cart!', {
      description: 'Honduras Single Origin has been added to your cart.',
      action: {
        label: 'View Cart',
        onClick: () => console.log('View cart clicked'),
      },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Demo */}
      <Header
        cartItemCount={3}
        isAuthenticated={false}
        onCartClick={() => toast.info('Cart clicked!')}
        onSignIn={() => toast.info('Sign in clicked!')}
        onSignUp={() => toast.info('Sign up clicked!')}
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            Honduras Coffee Component Showcase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of shadcn/ui components with claymorphism theming, 
            designed specifically for the Honduras Coffee e-commerce experience.
          </p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4 clay-card">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card className="clay-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="h-5 w-5" />
                  Product Cards with Claymorphism Theme
                </CardTitle>
                <CardDescription>
                  Interactive product cards featuring ratings, stock levels, options selection, and wishlist functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {mockProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onAddToCart={() => handleShowToast()}
                      onToggleWishlist={(id) => toast.info(`Toggled wishlist for product ${id}`)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="clay-card">
              <CardHeader>
                <CardTitle>Product Carousel</CardTitle>
                <CardDescription>Showcase featured products with smooth carousel navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {mockProducts.map((product, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card className="clay-card">
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <div className="text-center space-y-2">
                                <Coffee className="h-12 w-12 mx-auto text-primary" />
                                <span className="text-lg font-semibold">{product.name}</span>
                                <Badge variant="secondary">${product.price}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Form Controls</CardTitle>
                  <CardDescription>All form components with claymorphism styling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Customer Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Order Notes</Label>
                    <Textarea id="message" placeholder="Any special instructions..." />
                  </div>

                  <div className="space-y-3">
                    <Label>Coffee Size</Label>
                    <RadioGroup defaultValue="medium">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="small" />
                        <Label htmlFor="small">12oz ($19.99)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">1lb ($24.99)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="large" />
                        <Label htmlFor="large">2lb ($45.99)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="subscribe" />
                    <Label htmlFor="subscribe">Subscribe to monthly delivery</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" />
                    <Label htmlFor="notifications">Email notifications</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity: {sliderValue[0]}</Label>
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Order Calendar</CardTitle>
                  <CardDescription>Select your preferred delivery date</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="clay-card border-0"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="grid gap-6">
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Progress & Status</CardTitle>
                  <CardDescription>Visual feedback components for order tracking and status updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Order Processing</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                        +10%
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>
                        -10%
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Alert className="clay-card border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle>Order Confirmed!</AlertTitle>
                      <AlertDescription>
                        Your Honduras coffee order has been confirmed and is being processed.
                      </AlertDescription>
                    </Alert>

                    <Alert className="clay-card border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertTitle>Limited Stock</AlertTitle>
                      <AlertDescription>
                        Only 3 bags left of our Honduras Single Origin. Order soon!
                      </AlertDescription>
                    </Alert>

                    <Alert className="clay-card border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle>Brewing Tip</AlertTitle>
                      <AlertDescription>
                        For best results, use a 1:16 coffee-to-water ratio with water at 200°F.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleShowToast}>Show Success Toast</Button>
                    <Button variant="outline" onClick={() => toast.error('Something went wrong!')}>
                      Show Error Toast
                    </Button>
                    <Button variant="outline" onClick={() => toast('Info message', { description: 'This is an info toast' })}>
                      Show Info Toast
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>What our customers say about our coffee</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Maria Rodriguez', rating: 5, review: 'Amazing coffee! The flavors are incredible.' },
                      { name: 'John Smith', rating: 4, review: 'Great quality and fast shipping. Highly recommend!' },
                      { name: 'Sarah Johnson', rating: 5, review: 'Best coffee I\'ve ever had. Will definitely order again.' }
                    ].map((customer, index) => (
                      <div key={index} className="flex items-start space-x-3 clay-card p-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                          <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{customer.name}</span>
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < customer.rating 
                                      ? 'fill-amber-400 text-amber-400' 
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{customer.review}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <div className="grid gap-6">
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Collapsible Content</CardTitle>
                  <CardDescription>Expandable sections for detailed information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 w-full justify-between p-0">
                        <span>Coffee Origins & Processing</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 clay-card p-4">
                      <p className="text-sm text-muted-foreground">
                        Our Honduras coffee is sourced from small family farms in the Copán region, 
                        processed using the washed method, and dried on raised beds to ensure optimal flavor development.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>

              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>FAQ Accordion</CardTitle>
                  <CardDescription>Frequently asked questions about our coffee</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How fresh is the coffee?</AccordionTrigger>
                      <AccordionContent>
                        All our coffee is roasted to order and shipped within 24 hours to ensure maximum freshness.
                        We recommend consuming within 2-4 weeks of the roast date for optimal flavor.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>What brewing methods work best?</AccordionTrigger>
                      <AccordionContent>
                        Our Honduras coffee works well with all brewing methods including pour over, French press, 
                        espresso, and drip coffee makers. Each method will highlight different flavor characteristics.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Do you offer subscriptions?</AccordionTrigger>
                      <AccordionContent>
                        Yes! We offer flexible subscription plans with delivery every 2, 3, or 4 weeks. 
                        Subscribers save 10% on every order and can modify or cancel anytime.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>Your recent coffee orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 w-full rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 10 }, (_, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">HC-{1000 + i}</TableCell>
                            <TableCell>Honduras Single Origin</TableCell>
                            <TableCell>2024-01-{15 + i}</TableCell>
                            <TableCell className="text-right">$24.99</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Toast container */}
      <Sonner />
    </div>
  )
}