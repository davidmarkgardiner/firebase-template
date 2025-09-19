import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CoffeeIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
  onNewsletterSubmit?: (email: string) => void
}

export default function Footer({ className, onNewsletterSubmit }: FooterProps) {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    if (email && onNewsletterSubmit) {
      onNewsletterSubmit(email)
    }
  }

  const footerSections = [
    {
      title: 'Coffee',
      links: [
        { name: 'All Coffee', href: '/products' },
        { name: 'Single Origin', href: '/products?category=single-origin' },
        { name: 'Limited Edition', href: '/products?category=limited' },
        { name: 'Subscription', href: '/subscription' },
      ]
    },
    {
      title: 'Learn',
      links: [
        { name: 'Our Story', href: '/about' },
        { name: 'Brewing Guides', href: '/brewing-guides' },
        { name: 'Farm Partners', href: '/farms' },
        { name: 'Sustainability', href: '/sustainability' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'Sign In', href: '/login' },
        { name: 'My Orders', href: '/account/orders' },
        { name: 'Subscription', href: '/account/subscription' },
        { name: 'Address Book', href: '/account/addresses' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: FacebookIcon },
    { name: 'Instagram', href: '#', icon: InstagramIcon },
    { name: 'Twitter', href: '#', icon: TwitterIcon },
  ]

  return (
    <footer className={cn("w-full clay-card border-t bg-muted/30", className)}>
      <div className="container px-4 md:px-6">
        {/* Newsletter Section */}
        <div className="py-12 text-center">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <CoffeeIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Stay Connected</h2>
            </div>
            <p className="text-muted-foreground">
              Get the latest updates on new coffee arrivals, brewing tips, and exclusive offers
              from our mountain farms in Honduras.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto space-x-2">
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="clay-input flex-1"
                required
              />
              <Button type="submit" className="clay-button">
                <MailIcon className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator />

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">HC</span>
                </div>
                <span className="font-bold">Honduras Coffee</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Premium specialty coffee sourced directly from family farms in the mountains of Honduras.
                Every cup tells a story of tradition, quality, and sustainability.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Amsterdam, Netherlands</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>+31 20 123 4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MailIcon className="h-4 w-4" />
                  <span>hello@hondurascoffee.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bottom Section */}
        <div className="py-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Honduras Coffee. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="hover:text-primary transition-colors">
                Cookie Policy
              </a>
              <a href="/gdpr" className="hover:text-primary transition-colors">
                GDPR
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}