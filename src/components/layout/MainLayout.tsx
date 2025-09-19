import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  className?: string
  headerProps?: {
    cartItemCount?: number
    isAuthenticated?: boolean
    userEmail?: string
    onCartClick?: () => void
    onSignIn?: () => void
    onSignOut?: () => void
    onSignUp?: () => void
  }
  footerProps?: {
    onNewsletterSubmit?: (email: string) => void
  }
  showHeader?: boolean
  showFooter?: boolean
}

export default function MainLayout({
  children,
  className,
  headerProps = {},
  footerProps = {},
  showHeader = true,
  showFooter = true
}: MainLayoutProps) {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {/* Header */}
      {showHeader && (
        <Header
          cartItemCount={headerProps.cartItemCount}
          isAuthenticated={headerProps.isAuthenticated}
          userEmail={headerProps.userEmail}
          onCartClick={headerProps.onCartClick}
          onSignIn={headerProps.onSignIn}
          onSignOut={headerProps.onSignOut}
          onSignUp={headerProps.onSignUp}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <Footer
          onNewsletterSubmit={footerProps.onNewsletterSubmit}
        />
      )}
    </div>
  )
}