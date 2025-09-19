import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

/**
 * CoffeeShowcase - Demonstrates Honduras Coffee theme variants
 * This component showcases all the enhanced shadcn/ui components with coffee-themed variants
 */
export default function CoffeeShowcase() {
  return (
    <div className="container mx-auto p-8 space-y-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Honduras Coffee Theme Showcase
        </h1>
        <p className="text-lg text-muted-foreground">
          Demonstrating our enhanced shadcn/ui components with claymorphism design
        </p>
      </div>

      {/* Button Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Button Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="default">Default</Button>
          <Button variant="coffee">Coffee</Button>
          <Button variant="mountain">Mountain</Button>
          <Button variant="premium">Premium</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      {/* Card Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Card Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard claymorphism design</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Perfect for general content and layouts.</p>
            </CardContent>
          </Card>

          <Card variant="product">
            <CardHeader>
              <CardTitle>Product Card</CardTitle>
              <CardDescription>Enhanced for product displays</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Ideal for coffee product showcases with hover effects.</p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>Glassmorphism effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Beautiful transparent overlay effects.</p>
            </CardContent>
          </Card>

          <Card variant="premium">
            <CardHeader>
              <CardTitle>Premium Card</CardTitle>
              <CardDescription>Luxury gradient design</CardDescription>
            </CardHeader>
            <CardContent>
              <p>For premium coffee collections.</p>
            </CardContent>
          </Card>

          <Card variant="testimonial">
            <CardHeader>
              <CardTitle>Testimonial Card</CardTitle>
              <CardDescription>Customer reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <p>"The best Honduran coffee I've ever tasted!"</p>
            </CardContent>
          </Card>

          <Card variant="feature">
            <CardHeader>
              <CardTitle>Feature Card</CardTitle>
              <CardDescription>Highlight key features</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Perfect for benefits and feature callouts.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Badge Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Badge Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="coffee">Coffee</Badge>
          <Badge variant="mountain">Mountain</Badge>
          <Badge variant="premium">Premium</Badge>
          <Badge variant="featured">Featured</Badge>
          <Badge variant="in-stock">In Stock</Badge>
          <Badge variant="low-stock">Low Stock</Badge>
          <Badge variant="out-of-stock">Out of Stock</Badge>
          <Badge variant="success">Organic</Badge>
          <Badge variant="warning">Limited</Badge>
          <Badge variant="outline">Origin</Badge>
        </div>
      </section>

      {/* Input Showcase */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Input Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input placeholder="Search coffee..." className="w-full" />
            <Input placeholder="Email address" type="email" className="w-full" />
            <Input placeholder="Your name" className="w-full" />
          </div>
          <div className="space-y-4">
            <Input placeholder="Phone number" type="tel" className="w-full" />
            <Input placeholder="Quantity" type="number" className="w-full" />
            <Input placeholder="Special instructions" className="w-full" />
          </div>
        </div>
      </section>

      {/* Coffee Product Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Coffee Product Example</h2>
        <Card variant="product" className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Honduras Mountain Reserve</CardTitle>
                <CardDescription>High altitude, single origin</CardDescription>
              </div>
              <Badge variant="featured">Featured</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">$24.99</span>
              <Badge variant="in-stock">In Stock</Badge>
            </div>
            <div className="flex gap-2">
              <Badge variant="coffee">Dark Roast</Badge>
              <Badge variant="mountain">1,500m</Badge>
              <Badge variant="success">Organic</Badge>
            </div>
            <div className="space-y-3">
              <Input placeholder="Quantity" type="number" defaultValue="1" />
              <div className="flex gap-2">
                <Button variant="coffee" className="flex-1">Add to Cart</Button>
                <Button variant="outline">♡</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}