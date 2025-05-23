import { ArrowRight } from 'lucide-react';
import ShieldIcon from '@/components/ui/shieldIcon';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Plan {
  id: number;
  type: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  currency: string | null;
  feature: string | null;
  benefits: string[] | null;
}

interface OnlineMentorshipPlansProps {
  openModal: (plan: Plan, someBoolean: boolean) => void;
}

const OnlineMentorshipPlans: React.FC<OnlineMentorshipPlansProps> = ({ openModal }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/subscriptions/public`);
        console.log('API Response Data:', response.data);
        setPlans(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setError(
          axios.isAxiosError(error) && error.response
            ? new Error(error.response.data.error?.message || 'Failed to fetch plans')
            : error instanceof Error
            ? error
            : new Error('An unexpected error occurred')
        );
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-600">
        <svg
          className="animate-spin h-5 w-5 mx-auto mb-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading plans...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600">Error fetching data: {error.message}</div>;
  }

  if (plans.length === 0) {
    return <div className="text-center text-gray-600">No mentorship plans available.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={plan.id || idx}
            className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col justify-between"
          >
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase mb-2">{plan.type}</h3>
              <div className="text-3xl font-bold text-green-500">
                {plan.currency || 'KES'} {plan.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-gray-600">Other payments </span>
                {['₿'].map((symbol, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-xs text-white"
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm font-bold mb-4">{plan.feature || 'No features listed'}</p>

            <ul className="mb-6 space-y-2">
              {(plan.benefits || []).length > 0 ? (
                (plan.benefits || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div>
                      <ShieldIcon />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No benefits listed</li>
              )}
            </ul>
            <button
              onClick={() => openModal(plan, true)}
              style={{
                backgroundColor: 'rgb(0, 128, 0)',
                borderColor: 'rgb(0, 128, 0)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderBottomRightRadius: 0,
              }}
              className="w-full max-w-[250px] bg-green-500 text-white px-4 py-2 rounded-2xl flex items-center justify-center hover:bg-green-600 transition"
            >
              Choose this plan
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineMentorshipPlans;