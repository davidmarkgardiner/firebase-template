import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { HomeIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

const DEFAULT_HOME_ITEM: BreadcrumbItem = {
  label: 'Home',
  href: '/',
  icon: <HomeIcon className="h-4 w-4" />
}

export default function BreadcrumbNav({
  items,
  className,
  showHome = true
}: BreadcrumbNavProps) {
  const allItems = showHome ? [DEFAULT_HOME_ITEM, ...items] : items
  
  if (allItems.length <= 1) {
    return null
  }

  return (
    <Breadcrumb className={cn("clay-card bg-background/50 backdrop-blur-sm", className)}>
      <BreadcrumbList>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          
          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-2 text-foreground font-medium">
                    {item.icon}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={item.href || '#'}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRightIcon className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1
    
    // Convert segment to readable label
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // Special cases for common routes
    const labelMap: Record<string, string> = {
      'products': 'Coffee',
      'brewing-guides': 'Brewing Guides',
      'single-origin': 'Single Origin',
      'estate': 'Estate Reserve',
      'seasonal': 'Seasonal Harvest',
      'account': 'My Account',
      'subscription': 'Subscription',
      'checkout': 'Checkout',
      'cart': 'Shopping Cart'
    }
    
    if (labelMap[segment]) {
      label = labelMap[segment]
    }
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : href
    })
  })
  
  return breadcrumbs
}

// Hook for using breadcrumbs with URL parameters
export function useBreadcrumbs(pathname: string, searchParams?: URLSearchParams) {
  const breadcrumbs = generateBreadcrumbs(pathname)
  
  // Add category information if present
  if (searchParams?.has('category')) {
    const category = searchParams.get('category')
    const categoryMap: Record<string, string> = {
      'single-origin': 'Single Origin',
      'estate': 'Estate Reserve', 
      'seasonal': 'Seasonal Harvest'
    }
    
    if (category && categoryMap[category]) {
      // If we're on products page with category, update the last breadcrumb
      if (pathname === '/products') {
        breadcrumbs[breadcrumbs.length - 1].label = categoryMap[category]
      }
    }
  }
  
  return breadcrumbs
}