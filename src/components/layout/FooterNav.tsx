import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CoffeeIcon,
  ShieldCheckIcon,
  TruckIcon,
  RecycleIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterNavProps {
  className?: string
  onNewsletterSignup?: (email: string) => void
}

const FOOTER_LINKS = {
  coffee: [
    { title: 'Single Origin', href: '/products?category=single-origin' },
    { title: 'Estate Reserve', href: '/products?category=estate' },
    { title: 'Seasonal Harvest', href: '/products?category=seasonal' },
    { title: 'Subscription Plans', href: '/subscription' },
    { title: 'Brewing Guides', href: '/brewing-guides' }
  ],
  company: [
    { title: 'Our Story', href: '/about' },
    { title: 'Farm Partners', href: '/farms' },
    { title: 'Sustainability', href: '/sustainability' },
    { title: 'Quality Promise', href: '/quality' },
    { title: 'Press Kit', href: '/press' }
  ],
  support: [
    { title: 'Contact Us', href: '/contact' },
    { title: 'FAQ', href: '/faq' },
    { title: 'Shipping Info', href: '/shipping' },
    { title: 'Returns', href: '/returns' },
    { title: 'Track Order', href: '/track' }
  ],
  account: [
    { title: 'My Account', href: '/account' },
    { title: 'Order History', href: '/account/orders' },
    { title: 'Manage Subscription', href: '/account/subscription' },
    { title: 'Address Book', href: '/account/addresses' },
    { title: 'Rewards Program', href: '/rewards' }
  ],
  legal: [
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Terms of Service', href: '/terms' },
    { title: 'Cookie Policy', href: '/cookies' },
    { title: 'GDPR Compliance', href: '/gdpr' }
  ]
}

const SOCIAL_LINKS = [
  { 
    name: 'Facebook', 
    href: 'https://facebook.com/hondurascoffee', 
    icon: FacebookIcon,
    color: 'hover:text-blue-600'
  },
  { 
    name: 'Instagram', 
    href: 'https://instagram.com/hondurascoffee', 
    icon: InstagramIcon,
    color: 'hover:text-pink-600'
  },
  { 
    name: 'Twitter', 
    href: 'https://twitter.com/hondurascoffee', 
    icon: TwitterIcon,
    color: 'hover:text-blue-400'
  }
]

const TRUST_BADGES = [
  { icon: ShieldCheckIcon, text: 'Secure Payments', color: 'text-green-600' },
  { icon: TruckIcon, text: 'Fast Shipping', color: 'text-blue-600' },
  { icon: RecycleIcon, text: 'Sustainable', color: 'text-emerald-600' },
  { icon: CoffeeIcon, text: 'Premium Quality', color: 'text-amber-600' }
]

export default function FooterNav({ className, onNewsletterSignup }: FooterNavProps) {
  const currentYear = new Date().getFullYear()

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    if (email && onNewsletterSignup) {
      onNewsletterSignup(email)
    }
  }

  return (
    <footer className={cn("border-t bg-background clay-card", className)}>
      {/* Trust Badges */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 py-6 md:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {TRUST_BADGES.map((badge) => (
              <div 
                key={badge.text}
                className="flex items-center justify-center gap-2 text-sm font-medium"
              >
                <badge.icon className={cn("h-5 w-5", badge.color)} />
                <span className="hidden sm:inline">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Company Info & Newsletter */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Logo and Description */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-bold">HC</span>
                  </div>
                  <span className="font-bold text-lg">Honduras Coffee</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Premium single-origin coffee from the mountains of Honduras. 
                  Direct from family farms to your cup, bringing you the authentic 
                  taste of Central American highlands.
                </p>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <Label htmlFor="newsletter-email" className="text-sm font-semibold">
                  Stay Connected
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get exclusive offers, brewing tips, and new harvest updates.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="clay-input flex-1"
                    required
                  />
                  <Button type="submit" className="clay-button">
                    <MailIcon className="h-4 w-4" />
                    <span className="sr-only">Subscribe</span>
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Amsterdam, Netherlands</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>+31 20 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  <span>hello@hondurascoffee.eu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Coffee */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Coffee</h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.coffee.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Support</h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Account</h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.account.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="container px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Copyright and Legal */}
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p>© {currentYear} Honduras Coffee. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              {FOOTER_LINKS.legal.map((link, index) => (
                <span key={link.title} className="flex items-center">
                  <a 
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </a>
                  {index < FOOTER_LINKS.legal.length - 1 && (
                    <span className="mx-2">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Follow us:</span>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 clay-button", social.color)}
                  asChild
                >
                  <a 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EU Compliance Notice */}
      <div className="border-t bg-muted/20">
        <div className="container px-4 py-3 md:px-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>
              🇪🇺 Proudly serving the European Union with sustainable coffee
            </p>
            <Badge variant="outline" className="text-xs">
              GDPR Compliant
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}