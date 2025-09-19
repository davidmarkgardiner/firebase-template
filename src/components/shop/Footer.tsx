import { Coffee } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="clay-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Coffee className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-bold text-primary">Honduras Coffee</h3>
                <p className="text-sm text-muted-foreground">Mountain Grown</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium specialty coffee sourced directly from family farms
              in the mountains of Honduras.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-primary">Home</a></li>
              <li><a href="/products" className="text-muted-foreground hover:text-primary">Coffee</a></li>
              <li><a href="/subscription" className="text-muted-foreground hover:text-primary">Subscription</a></li>
              <li><a href="/about" className="text-muted-foreground hover:text-primary">Our Story</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>hello@hondurascoffee.com</p>
              <p>Amsterdam, Netherlands</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Honduras Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}