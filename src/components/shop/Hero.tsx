import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Coffee, Mountain, ArrowRight, Star, Truck, Leaf, Award } from 'lucide-react'

interface HeroProps {
  onShopNowClick?: () => void
  onLearnMoreClick?: () => void
}

export default function Hero({ onShopNowClick, onLearnMoreClick }: HeroProps) {
  const features = [
    {
      icon: Leaf,
      title: 'Sustainably Sourced',
      description: 'Direct trade with family farms'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Specialty grade coffee beans'
    },
    {
      icon: Truck,
      title: 'Fresh Roasted',
      description: 'Roasted to order weekly'
    }
  ]

  const stats = [
    { value: '15+', label: 'Partner Farms' },
    { value: '1500m+', label: 'Altitude' },
    { value: '4.9★', label: 'Customer Rating' },
    { value: '100%', label: 'Traceable' }
  ]

  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/coffee-pattern.svg')] opacity-5" />

      <div className="container relative px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center min-h-[80vh] py-12 lg:py-20">

          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="clay-card">
                <Mountain className="h-3 w-3 mr-1" />
                🇭🇳 Direct from Honduras
              </Badge>
              <Badge variant="outline" className="clay-card">
                Limited Edition
              </Badge>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Mountain Coffee
                <span className="block text-primary">From Honduras</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                Experience the rich, complex flavors of specialty coffee grown at 1500+ meters
                in the mountains of Honduras. Every cup supports family farmers and sustainable agriculture.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="clay-button"
                onClick={onShopNowClick}
              >
                Shop Coffee
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="clay-button"
                onClick={onLearnMoreClick}
              >
                Our Story
              </Button>
            </div>

            {/* Customer Rating */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Rated 4.9/5 by over 2,000+ coffee lovers
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image & Features */}
          <div className="space-y-6">
            {/* Main Hero Image */}
            <div className="relative">
              <Card className="clay-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Coffee className="h-24 w-24 text-primary mx-auto" />
                      <div className="text-lg font-semibold">Honduras Marcala Bourbon</div>
                      <div className="text-sm text-muted-foreground">Rich chocolate and caramel notes</div>
                      <div className="text-2xl font-bold text-primary">€12.50</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Badge */}
              <div className="absolute -top-2 -right-2">
                <Badge className="clay-card bg-primary text-primary-foreground">
                  New Harvest
                </Badge>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="clay-card">
                  <CardContent className="p-4 text-center space-y-2">
                    <feature.icon className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}