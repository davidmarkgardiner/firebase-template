import React, { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { PasswordReset } from './PasswordReset'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Menu,
  X,
  User,
  ShoppingBag,
  Heart,
  LogOut,
  Settings,
  Coffee,
  MapPin,
  CreditCard,
  Bell,
  ChevronDown
} from 'lucide-react'

interface MobileAuthProps {
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
  }
  onLogin: (credentials: { email: string; password: string }) => Promise<void>
  onRegister: (data: any) => Promise<void>
  onLogout: () => void
  cartItemCount?: number
}

export default function MobileAuth({
  user,
  onLogin,
  onRegister,
  onLogout,
  cartItemCount = 0
}: MobileAuthProps) {
  const [authSheetOpen, setAuthSheetOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (values: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true)
    setError(null)
    try {
      await onLogin({ email: values.email, password: values.password })
      setAuthSheetOpen(false)
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: any) => {
    setIsLoading(true)
    setError(null)
    try {
      await onRegister(data)
      setAuthSheetOpen(false)
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestReset = async (email: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement password reset request
      console.log('Password reset requested for:', email)
      // Show success message
    } catch (err) {
      setError('Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (token: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement password reset
      console.log('Password reset with token:', token)
    } catch (err) {
      setError('Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="md:hidden">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.firstName} />
                <AvatarFallback>
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/account" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                My Account
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/account/orders" className="cursor-pointer">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/account/subscription" className="cursor-pointer">
                <Coffee className="mr-2 h-4 w-4" />
                Subscription
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/account/addresses" className="cursor-pointer">
                <MapPin className="mr-2 h-4 w-4" />
                Addresses
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/account/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Sheet open={authSheetOpen} onOpenChange={setAuthSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>
                  {authMode === 'login' && 'Sign In'}
                  {authMode === 'register' && 'Create Account'}
                  {authMode === 'reset' && 'Reset Password'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthSheetOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetTitle>
              <SheetDescription>
                {authMode === 'login' && 'Sign in to your Honduras Coffee account'}
                {authMode === 'register' && 'Join us for exclusive access to premium coffee'}
                {authMode === 'reset' && 'Reset your password securely'}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6">
              {authMode === 'login' && (
                <LoginForm
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                  error={error || undefined}
                />
              )}

              {authMode === 'register' && (
                <RegisterForm
                  onSubmit={handleRegister}
                  isLoading={isLoading}
                  error={error || undefined}
                />
              )}

              {authMode === 'reset' && (
                <PasswordReset
                  onRequestReset={handleRequestReset}
                  onResetPassword={handleResetPassword}
                  isLoading={isLoading}
                  error={error || undefined}
                />
              )}

              <div className="mt-4 text-center">
                {authMode === 'login' && (
                  <p className="text-sm">
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setAuthMode('register')}
                    >
                      Sign up
                    </Button>
                  </p>
                )}
                {authMode === 'register' && (
                  <p className="text-sm">
                    Already have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setAuthMode('login')}
                    >
                      Sign in
                    </Button>
                  </p>
                )}
                {(authMode === 'login' || authMode === 'register') && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs"
                      onClick={() => setAuthMode('reset')}
                    >
                      Forgot your password?
                    </Button>
                  </p>
                )}
                {authMode === 'reset' && (
                  <p className="text-sm">
                    Remember your password?{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setAuthMode('login')}
                    >
                      Sign in
                    </Button>
                  </p>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Navigation Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <NavigationMenu orientation="vertical">
              <NavigationMenuItem>
                <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <a href="/" className="flex items-center gap-3">
                    <Coffee className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <a href="/products" className="flex items-center gap-3">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Shop Coffee</span>
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <a href="/subscription" className="flex items-center gap-3">
                    <Heart className="h-4 w-4" />
                    <span>Subscribe</span>
                    <Badge variant="secondary" className="ml-auto">New</Badge>
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <a href="/about" className="flex items-center gap-3">
                    <User className="h-4 w-4" />
                    <span>Our Story</span>
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <a href="/brewing-guides" className="flex items-center gap-3">
                    <MapPin className="h-4 w-4" />
                    <span>Brewing Guides</span>
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenu>

            <Separator />

            {user && (
              <NavigationMenu orientation="vertical">
                <NavigationMenuItem>
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <a href="/account" className="flex items-center gap-3">
                      <Settings className="h-4 w-4" />
                      <span>My Account</span>
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <a href="/account/orders" className="flex items-center gap-3">
                      <ShoppingBag className="h-4 w-4" />
                      <span>My Orders</span>
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenu>
            )}

            <div className="pt-4">
              <Button className="w-full" variant="outline" asChild>
                <a href="/contact">
                  <MapPin className="mr-2 h-4 w-4" />
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Button */}
      <Button variant="ghost" size="sm" className="relative" asChild>
        <a href="/cart">
          <ShoppingBag className="h-5 w-5" />
          {cartItemCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </Badge>
          )}
        </a>
      </Button>
    </div>
  )
}