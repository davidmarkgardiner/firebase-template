import { Button } from '@/components/ui/button'
import { Coffee, Menu } from 'lucide-react'
import { CartButton } from './layout/CartButton'

export default function Header() {
  return (
    <header className="clay-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-primary">Honduras Coffee</h1>
                <p className="text-xs text-muted-foreground -mt-1">Mountain Grown</p>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium hover:text-primary">Home</a>
            <a href="/products" className="text-sm font-medium hover:text-primary">Coffee</a>
            <a href="/subscription" className="text-sm font-medium hover:text-primary">Subscription</a>
            <a href="/about" className="text-sm font-medium hover:text-primary">Our Story</a>
          </nav>

          <div className="flex items-center space-x-2">
            <CartButton />
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}