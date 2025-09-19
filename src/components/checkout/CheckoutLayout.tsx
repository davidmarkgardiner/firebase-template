import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, ShieldCheck, Truck, CreditCard } from 'lucide-react';

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

export function CheckoutLayout({ children }: CheckoutLayoutProps): JSX.Element {
  const handleBackToShop = (): void => {
    window.location.href = '/products';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] to-[#f3f1ee]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#8B4513]/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToShop}
                className="text-[#8B4513] hover:bg-[#8B4513]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Button>
              <div className="hidden md:block h-6 w-px bg-[#8B4513]/20" />
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-[#8B4513]">Honduras Coffee</h1>
                <Badge variant="outline" className="hidden md:inline-flex">
                  Secure Checkout
                </Badge>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-4 text-sm text-[#6B4E3D]">
              <div className="hidden lg:flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>SSL Secure</span>
              </div>
              <div className="hidden lg:flex items-center space-x-1">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>EU Shipping</span>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-[#8B4513]/10 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-[#6B4E3D]">
              © 2024 Honduras Coffee. Secure checkout powered by Stripe.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacy" className="text-[#6B4E3D] hover:text-[#8B4513] transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-[#6B4E3D] hover:text-[#8B4513] transition-colors">
                Terms of Service
              </a>
              <a href="/refunds" className="text-[#6B4E3D] hover:text-[#8B4513] transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
          
          {/* Security Badges */}
          <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-[#8B4513]/10">
            <div className="flex items-center space-x-2 text-xs text-[#6B4E3D]">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#6B4E3D]">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>PCI DSS compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#6B4E3D]">
              <Truck className="w-4 h-4 text-orange-600" />
              <span>EU-wide delivery</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}