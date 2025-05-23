import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import PaymentModal from '@/components/PaymentModal';
import OnlineMentorshipPlans from '@/components/OnlineMentorshipPlans';
import { useUserSubscriptions } from '@/hooks/useUserSubscriptions';

const SubscriptionsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData?.id;
  const token = localStorage.getItem('auth_token');

  // Fetch subscriptions
  const { subscriptions, loading, error } = useUserSubscriptions(userId, token);

  const openModal = (plan: string, online = false) => {
    setSelectedPlan(plan);
    setIsOnline(online);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan('');
    setIsOnline(false);
  };

  // Calculate days remaining
  const calculateDaysRemaining = (createdAt: string, duration: number): string => {
    if (duration === 0) return '∞'; // Free or unlimited plans
    const createdDate = new Date(createdAt);
    const endDate = new Date(createdDate.getTime() + duration * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
    return daysRemaining === 0 ? 'Expired' : daysRemaining.toString();
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-base font-semibold text-gray-900 uppercase mb-4">Current subscription</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="text-xs font-medium text-gray-500">Plan</div>
            <div className="text-xs font-medium text-gray-500">Status</div>
            <div className="text-xs font-medium text-gray-500">Days remaining</div>
          </div>
          {loading ? (
            <div className="grid grid-cols-3 px-4 py-3">
              <div className="text-sm font-medium text-gray-500">Loading...</div>
              <div className="text-sm font-medium text-gray-500">Loading...</div>
              <div className="text-sm font-medium text-gray-500">Loading...</div>
            </div>
          ) : error ? (
            <div className="grid grid-cols-3 px-4 py-3">
              <div className="text-sm font-medium text-red-500">Error</div>
              <div className="text-sm font-medium text-red-500">{error}</div>
              <div className="text-sm font-medium text-red-500">-</div>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="grid grid-cols-3 px-4 py-3">
              <div className="text-sm font-medium text-red-500">Free</div>
              <div className="text-sm font-medium text-green-500">Active</div>
              <div className="text-sm font-medium">∞</div>
            </div>
          ) : (
            subscriptions.map((subscription) => (
              <div key={subscription.id} className="grid grid-cols-3 px-4 py-3">
                <div className="text-sm font-medium text-gray-900">{subscription.type}</div>
                <div className="text-sm font-medium text-green-500">
                  {subscription.isActive ? 'Active' : 'Inactive'}
                </div>
                <div className="text-sm font-medium">
                  {calculateDaysRemaining(subscription.createdAt, subscription.duration)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">More subscriptions available</h2>
        <p className="text-sm text-gray-600 mb-6">
          Please note that you will be paying 20% off when you renew your subscription.
        </p>
        <OnlineMentorshipPlans openModal={openModal} />
      </div>

      <PaymentModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedPlan={selectedPlan}
        isOnline={isOnline}
      />
    </div>
  );
};

export default SubscriptionsTab;