import { useState, useEffect } from 'react';

interface Subscription {
  id: number;
  type: string;
  isActive: boolean;
  duration: number;
  createdAt: string;
  price?: number;
  currency?: string;
  features?: string;
  benefits?: string[];
}

interface UseUserSubscriptionsResult {
  subscriptions: Subscription[];
  activeSubscription: Subscription | null;
  loading: boolean;
  error: string | null;
  fetchSubscriptions: () => Promise<void>;
}

export const useUserSubscriptions = (
  userId: number | null,
  token: string | null
): UseUserSubscriptionsResult => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);

    if (!userId || !token) {
      setError('User not authenticated');
      setSubscriptions([]);
      setActiveSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/subscriptions/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('User subscriptions response:', JSON.stringify(data, null, 2));

      if (response.ok && data.data && Array.isArray(data.data)) {
        const userSubs = data.data.map((record: any) => {
          const sub = record.subscription;
          return {
            id: sub?.id || 0,
            type: sub?.type || 'Unknown',
            isActive: record.isActive || false,
            duration: sub?.duration || 0,
            createdAt: record.createdAt || new Date().toISOString(),
            price: sub?.price,
            currency: sub?.currency,
            features: sub?.features,
            benefits: sub?.benefits,
          };
        });

        setSubscriptions(userSubs);
        const active = userSubs.find((sub) => sub.isActive);
        setActiveSubscription(active || null);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch subscriptions');
      }

    } catch (err: any) {
      console.error('Failed to fetch subscriptions:', err);
      setError(err.message || 'Failed to fetch subscriptions');
      setSubscriptions([]);
      setActiveSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [userId, token]);

  return {
    subscriptions,
    activeSubscription,
    loading,
    error,
    fetchSubscriptions,
  };
};
