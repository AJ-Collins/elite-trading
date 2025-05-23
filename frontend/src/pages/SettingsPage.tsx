import { useState } from 'react';
import { User, CreditCard, UserPlus } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardFooter from '@/components/DashboardFooter';
import ProfileTab from '@/components/ProfileTab';
import SubscriptionsTab from '@/components/SubscriptionsTab';
import ReferralTab from '@/components/ReferralTab';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-80">
      <DashboardHeader isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="border-b border-green-300">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-t-lg font-medium text-sm ${
                activeTab === 'profile' ? 'bg-green-100 text-green-500' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-1">
                <User size={16} />
                <span>Your profile</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-4 py-2 rounded-t-lg font-medium text-sm ${
                activeTab === 'subscriptions'
                  ? 'bg-green-100 text-green-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-1">
                <CreditCard size={16} />
                <span>Manage subscriptions</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('referral')}
              className={`px-4 py-2 rounded-t-lg font-medium text-sm ${
                activeTab === 'referral' ? 'bg-green-100 text-green-500' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-1">
                <UserPlus size={16} />
                <span>Referral program</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-8">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'subscriptions' && <SubscriptionsTab />}
          {activeTab === 'referral' && <ReferralTab />}
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
}