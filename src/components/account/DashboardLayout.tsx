import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { 
  User, 
  Package, 
  MapPin, 
  RefreshCw, 
  CreditCard, 
  Settings, 
  Shield, 
  Download,
  Menu,
  Home,
  LogOut
} from 'lucide-react';
import type { AccountSection } from '../../pages/account/AccountApp';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
}

interface NavigationItem {
  id: AccountSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Dashboard', icon: Home },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Order History', icon: Package, badge: '3' },
  { id: 'addresses', label: 'Address Book', icon: MapPin },
  { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw, badge: '1' },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data-export', label: 'Data Export', icon: Download },
];

export function DashboardLayout({ children, activeSection, onSectionChange }: DashboardLayoutProps) {
  const currentItem = navigationItems.find(item => item.id === activeSection);
  
  const renderNavigation = () => (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start text-left ${
              isActive 
                ? 'clay-button bg-primary text-primary-foreground' 
                : 'hover:bg-accent/50 transition-colors'
            }`}
            onClick={() => onSectionChange(item.id)}
          >
            <Icon className="mr-3 h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto clay-badge">
                {item.badge}
              </Badge>
            )}
          </Button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border/40 bg-card/30 backdrop-blur-sm">
          <div className="flex h-full flex-col">
            {/* User Profile Header */}
            <div className="p-6 border-b border-border/40">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/images/user-avatar.jpg" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    john@example.com
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
              {renderNavigation()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/40">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="container max-w-6xl mx-auto p-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-2">
                {currentItem && (
                  <>
                    <currentItem.icon className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold text-foreground">
                      {currentItem.label}
                    </h1>
                  </>
                )}
              </div>
              <p className="text-muted-foreground">
                Manage your Honduras Coffee account and preferences
              </p>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              {currentItem && (
                <>
                  <currentItem.icon className="h-5 w-5 text-primary" />
                  <h1 className="text-lg font-semibold text-foreground">
                    {currentItem.label}
                  </h1>
                </>
              )}
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="clay-button">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex h-full flex-col">
                  {/* Mobile User Profile */}
                  <div className="p-6 border-b border-border/40">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/images/user-avatar.jpg" alt="User" />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-foreground truncate">
                          John Doe
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          john@example.com
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 px-4 py-6 overflow-y-auto">
                    {renderNavigation()}
                  </div>

                  {/* Mobile Footer */}
                  <div className="p-4 border-t border-border/40">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}