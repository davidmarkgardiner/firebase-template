import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'
import { Mountain, Coffee, Calendar, ArrowRight, Leaf, Award } from 'lucide-react'

export type CategoryType = 'all' | 'estate' | 'mountain' | 'seasonal'

interface CategoryConfig {
  title: string
  subtitle: string
  description: string
  bgGradient: string
  icon: React.ReactNode
  features: string[]
  heroImage?: string
  stats?: {
    label: string
    value: string
  }[]
}

const categoryConfigs: Record<CategoryType, CategoryConfig> = {
  all: {
    title: 'All Coffee',
    subtitle: 'Premium Honduran Coffee Collection',
    description: 'Discover our complete range of specialty coffees sourced directly from family farms in the mountains of Honduras. Each bean tells a story of tradition, quality, and exceptional flavor.',
    bgGradient: 'hero-gradient',
    icon: <Coffee className="h-8 w-8" />,
    features: ['Direct Trade', 'Family Farms', 'Premium Quality', 'Sustainable'],
    stats: [
      { label: 'Varieties', value: '12+' },
      { label: 'Farms', value: '8' },
      { label: 'Altitude', value: '1200-1800m' }
    ]
  },
  estate: {
    title: 'Estate Reserve',
    subtitle: 'Premium Single-Farm Coffees',
    description: 'Exclusive coffees from our family estates, carefully cultivated and processed to showcase the unique terroir of each farm. These are our most prized selections.',
    bgGradient: 'coffee-gradient',
    icon: <Award className="h-8 w-8" />,
    features: ['Single Origin', 'Estate Grown', 'Limited Production', 'Premium Grade'],
    stats: [
      { label: 'Estates', value: '3' },
      { label: 'Avg. Altitude', value: '1600m' },
      { label: 'Cupping Score', value: '88+' }
    ]
  },
  mountain: {
    title: 'Mountain Select',
    subtitle: 'High-Altitude Excellence',
    description: 'Coffees grown at elevations of 1500m and above, where the cool mountain air and volcanic soil create beans with exceptional complexity and brightness.',
    bgGradient: 'mountain-gradient',
    icon: <Mountain className="h-8 w-8" />,
    features: ['High Altitude', 'Volcanic Soil', 'Complex Flavor', 'Bright Acidity'],
    stats: [
      { label: 'Min. Altitude', value: '1500m' },
      { label: 'Varieties', value: '5' },
      { label: 'Processing', value: 'Washed' }
    ]
  },
  seasonal: {
    title: 'Seasonal Harvest',
    subtitle: 'Limited-Time Offerings',
    description: 'Special harvests and experimental lots available for a limited time. These unique coffees showcase innovation and the finest seasonal selections.',
    bgGradient: 'premium-gradient',
    icon: <Calendar className="h-8 w-8" />,
    features: ['Limited Edition', 'Seasonal', 'Experimental', 'Micro-Lot'],
    stats: [
      { label: 'Current Lots', value: '4' },
      { label: 'Harvest', value: '2024' },
      { label: 'Availability', value: 'Limited' }
    ]
  }
}

interface CategoryHeroProps {
  category: CategoryType
  productCount?: number
  onExploreClick?: () => void
  onBreadcrumbClick?: (category: CategoryType) => void
  className?: string
}

/**
 * CategoryHero - Hero section for product category pages
 * Features coffee-themed gradients and comprehensive category information
 */
export default function CategoryHero({
  category,
  productCount,
  onExploreClick,
  onBreadcrumbClick,
  className
}: CategoryHeroProps) {
  const config = categoryConfigs[category]

  const breadcrumbItems = [
    { label: 'Coffee', category: 'all' as CategoryType },
    ...(category !== 'all' ? [{ label: config.title, category }] : [])
  ]

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('/coffee-pattern.svg')] bg-repeat bg-center" />
      </div>

      {/* Main Hero Card */}
      <Card className={cn(
        "relative border-0 rounded-none md:rounded-2xl m-0 md:m-4",
        config.bgGradient
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

        <div className="relative p-6 md:p-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList className="text-white/80">
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.category}>
                    <BreadcrumbItem>
                      {index === breadcrumbItems.length - 1 ? (
                        <BreadcrumbPage className="text-white font-medium">
                          {item.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => onBreadcrumbClick?.(item.category)}
                          className="text-white/80 hover:text-white cursor-pointer transition-colors"
                        >
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator className="text-white/60" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Icon & Title */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <div className="text-white">
                    {config.icon}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {config.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90">
                    {config.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                {config.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {config.features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="premium"
                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                  >
                    <Leaf className="h-3 w-3 mr-1" />
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Product Count */}
              {productCount !== undefined && (
                <div className="flex items-center gap-4 text-white/90">
                  <span className="text-lg">
                    <strong className="text-white">{productCount}</strong> products available
                  </span>
                  {productCount > 0 && onExploreClick && (
                    <Button
                      variant="glass"
                      onClick={onExploreClick}
                      className="text-white border-white/30 hover:bg-white/20"
                    >
                      Explore Collection
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Stats Card */}
            {config.stats && (
              <div className="lg:col-span-1">
                <Card className="glass-effect border-white/20 text-white">
                  <div className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Coffee className="h-5 w-5" />
                      Quick Stats
                    </h3>
                    <div className="space-y-3">
                      {config.stats.map((stat) => (
                        <div key={stat.label} className="flex justify-between items-center">
                          <span className="text-white/80 text-sm">{stat.label}</span>
                          <span className="font-bold text-lg">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}