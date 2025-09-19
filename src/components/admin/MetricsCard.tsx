import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react'

interface MetricData {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

interface MetricsCardProps {
  metric: MetricData
  className?: string
}

export function MetricsCard({ metric, className }: MetricsCardProps) {
  const { title, value, description, trend, icon: Icon, variant = 'default' } = metric

  const cardVariants = {
    default: 'border-coffee-200 bg-white',
    success: 'border-green-200 bg-green-50',
    warning: 'border-orange-200 bg-orange-50',
    danger: 'border-red-200 bg-red-50'
  }

  const iconColors = {
    default: 'text-coffee-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    danger: 'text-red-600'
  }

  return (
    <Card className={cn(
      'admin-card transition-all duration-200 hover:shadow-lg',
      cardVariants[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-coffee-700">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn('h-4 w-4', iconColors[variant])} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-coffee-900 mb-1">
          {value}
        </div>

        <div className="flex items-center gap-2">
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <Badge
                variant={trend.isPositive ? 'default' : 'destructive'}
                className="text-xs"
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Badge>
            </div>
          )}

          {description && (
            <p className="text-xs text-coffee-600">
              {description}
            </p>
          )}

          {trend?.label && (
            <p className="text-xs text-coffee-500">
              {trend.label}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Predefined metrics for the dashboard
export const dashboardMetrics: MetricData[] = [
  {
    title: 'Total Revenue',
    value: '€12,450',
    description: 'Total revenue this month',
    trend: {
      value: 15.3,
      label: 'vs last month',
      isPositive: true
    },
    icon: DollarSign,
    variant: 'success'
  },
  {
    title: 'Orders',
    value: '156',
    description: '8 pending orders',
    trend: {
      value: 8.2,
      label: 'vs last month',
      isPositive: true
    },
    icon: ShoppingCart,
    variant: 'default'
  },
  {
    title: 'Customers',
    value: '1,250',
    description: '45 new customers',
    trend: {
      value: 12.5,
      label: 'vs last month',
      isPositive: true
    },
    icon: Users,
    variant: 'default'
  },
  {
    title: 'Low Stock Items',
    value: '3',
    description: 'Items need restocking',
    trend: {
      value: -2,
      label: 'vs last week',
      isPositive: false
    },
    icon: Package,
    variant: 'warning'
  }
]

// Metrics grid component
interface MetricsGridProps {
  metrics?: MetricData[]
  className?: string
}

export function MetricsGrid({ metrics = dashboardMetrics, className }: MetricsGridProps) {
  return (
    <div className={cn(
      'grid gap-4 md:grid-cols-2 lg:grid-cols-4',
      className
    )}>
      {metrics.map((metric, index) => (
        <MetricsCard key={index} metric={metric} />
      ))}
    </div>
  )
}