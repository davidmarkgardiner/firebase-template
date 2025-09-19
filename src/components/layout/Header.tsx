import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  LogInIcon,
  LogOutIcon,
  UserPlusIcon,
  PackageIcon,
  HeartIcon,
  SettingsIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import SearchCommand from './SearchCommand'
import ShoppingCart from './ShoppingCart'

interface HeaderProps {
  cartItemCount?: number
  isAuthenticated?: boolean
  userEmail?: string
  onCartClick?: () => void
  onSignIn?: () => void
  onSignOut?: () => void
  onSignUp?: () => void
  className?: string
}

export default function Header({
  cartItemCount = 0,
  isAuthenticated = false,
  userEmail,
  onCartClick,
  onSignIn,
  onSignOut,
  onSignUp,
  className
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      title: 'Coffee',
      href: '/products',
      submenu: [
        { title: 'Single Origin', href: '/products?category=single-origin' },
        { title: 'Estate Reserve', href: '/products?category=estate' },
        { title: 'Seasonal Harvest', href: '/products?category=seasonal' },
        { title: 'All Coffee', href: '/products' }
      ]
    },
    { title: 'Our Story', href: '/about' },
    { title: 'Subscription', href: '/subscription' },
    { title: 'Brewing Guides', href: '/brewing-guides' },
    { title: 'Contact', href: '/contact' },
  ]

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full clay-card border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">HC</span>
            </div>
            <span className="hidden font-bold sm:inline-block">Honduras Coffee</span>
          </a>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <SearchCommand className="w-full" />
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.submenu ? (
                  <>
                    <NavigationMenuTrigger className="clay-button">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] clay-card">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.title}>
                            <NavigationMenuLink asChild>
                              <a
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                href={subItem.href}
                              >
                                <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.title === 'Single Origin' && 'Premium beans from specific farms with unique flavor profiles'}
                                  {subItem.title === 'Estate Reserve' && 'Limited edition selections from our partner estates'}
                                  {subItem.title === 'Seasonal Harvest' && 'Fresh seasonal offerings and limited-time specials'}
                                  {subItem.title === 'All Coffee' && 'Browse our complete collection of premium Honduran coffee'}
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "clay-button")}
                    href={item.href}
                  >
                    {item.title}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Cart Button */}
          <ShoppingCart onCheckout={onCartClick} />

          {/* User Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="clay-button">
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">User account menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 clay-card">
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {userEmail}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PackageIcon className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HeartIcon className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={onSignIn}>
                    <LogInIcon className="mr-2 h-4 w-4" />
                    <span>Sign in</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSignUp}>
                    <UserPlusIcon className="mr-2 h-4 w-4" />
                    <span>Create account</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden clay-button"
                aria-label="Open mobile menu"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] clay-card">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              {/* Mobile Search */}
              <div className="mt-4">
                <SearchCommand className="w-full" />
              </div>
              
              <nav className="mt-8 flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <div key={item.title}>
                    <a
                      href={item.href}
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.title}
                    </a>
                    {item.submenu && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.submenu.map((subItem) => (
                          <a
                            key={subItem.title}
                            href={subItem.href}
                            className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Auth Section */}
              <div className="mt-8 space-y-4 border-t pt-8">
                {isAuthenticated ? (
                  <>
                    <div className="text-sm text-muted-foreground">
                      Signed in as {userEmail}
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start clay-button">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button variant="outline" className="w-full justify-start clay-button">
                        <PackageIcon className="mr-2 h-4 w-4" />
                        Orders
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start clay-button"
                        onClick={onSignOut}
                      >
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button
                      className="w-full clay-button"
                      onClick={onSignIn}
                    >
                      <LogInIcon className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full clay-button"
                      onClick={onSignUp}
                    >
                      <UserPlusIcon className="mr-2 h-4 w-4" />
                      Create Account
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}