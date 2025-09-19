import React, { useState } from 'react';
import { DashboardLayout } from '../../components/account/DashboardLayout';
import { AccountOverview } from '../../components/account/AccountOverview';
import { ProfileManagement } from '../../components/account/ProfileManagement';
import { OrderHistory } from '../../components/account/OrderHistory';
import { AddressBook } from '../../components/account/AddressBook';
import { SubscriptionManagement } from '../../components/account/SubscriptionManagement';
import { PaymentMethods } from '../../components/account/PaymentMethods';
import { PreferenceSettings } from '../../components/account/PreferenceSettings';
import { SecuritySettings } from '../../components/account/SecuritySettings';
import { DataExport } from '../../components/account/DataExport';

export type AccountSection = 
  | 'overview' 
  | 'profile' 
  | 'orders' 
  | 'addresses' 
  | 'subscriptions' 
  | 'payments' 
  | 'preferences' 
  | 'security' 
  | 'data-export';

interface AccountAppProps {}

export function AccountApp({}: AccountAppProps) {
  const [activeSection, setActiveSection] = useState<AccountSection>('overview');

  const renderContent = (): React.ReactNode => {
    switch (activeSection) {
      case 'overview':
        return <AccountOverview />;
      case 'profile':
        return <ProfileManagement />;
      case 'orders':
        return <OrderHistory />;
      case 'addresses':
        return <AddressBook />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      case 'payments':
        return <PaymentMethods />;
      case 'preferences':
        return <PreferenceSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'data-export':
        return <DataExport />;
      default:
        return <AccountOverview />;
    }
  };

  return (
    <DashboardLayout 
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}