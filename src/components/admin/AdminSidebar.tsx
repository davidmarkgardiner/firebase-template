import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  Coffee,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

interface AdminSidebarProps {
  className?: string
  isMobile?: boolean
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and metrics'
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    description: 'Manage coffee products',
    badge: '12'
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Order management',
    badge: '3'
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'Customer management'
  },
  {
    title: 'Inventory',
    href: '/admin/inventory',
    icon: Coffee,
    description: 'Stock management',
    alert: true
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Sales analytics'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System settings'
  }
]

function SidebarContent({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coffee-600 text-coffee-50">
            <Coffee className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-coffee-900">Honduras Coffee</h2>
            <p className="text-xs text-coffee-600">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                'hover:bg-coffee-50 hover:text-coffee-900',
                'focus:bg-coffee-50 focus:text-coffee-900 focus:outline-none',
                'group relative'
              )}
            >
              <item.icon className="h-4 w-4 text-coffee-600 group-hover:text-coffee-700" />
              <div className="flex-1">
                <div className="font-medium text-coffee-900">{item.title}</div>
                <div className="text-xs text-coffee-600">{item.description}</div>
              </div>

              {/* Badges and alerts */}
              <div className="flex items-center gap-1">
                {item.badge && (
                  <Badge variant="secondary" className="bg-coffee-100 text-coffee-700">
                    {item.badge}
                  </Badge>
                )}
                {item.alert && (
                  <AlertCircle className="h-3 w-3 text-orange-500" />
                )}
              </div>
            </a>
          ))}
        </nav>

        <Separator className="my-6" />

        {/* Quick Stats */}
        <div className="space-y-3 px-3">
          <h3 className="text-sm font-medium text-coffee-900">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-coffee-600">Today's Sales</span>
              <span className="font-medium text-coffee-900">€1,240</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-coffee-600">Pending Orders</span>
              <span className="font-medium text-coffee-900">8</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-coffee-600">+12% vs yesterday</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-coffee-100 flex items-center justify-center">
            <span className="text-sm font-medium text-coffee-700">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-coffee-900">Admin User</p>
            <p className="text-xs text-coffee-600">admin@hondurascoffee.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminSidebar({ className, isMobile = false }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className={cn('hidden border-r bg-coffee-25 md:block', className)}>
      <SidebarContent />
    </div>
  )
}