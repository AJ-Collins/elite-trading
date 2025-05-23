import React,{ useState } from 'react';
import { User, Copy, Check, AlertCircle } from 'lucide-react';

const ReferralTab = () => {
    const [copied, setCopied] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const [userData, setUserData] = useState<any>(null);
    
    // Dummy referral link (can be fetched from backend later)
    const referralCode = userData?.referralCode || ' ';
    const referralLink = `${API_URL}/referral=${referralCode}`;
    
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Your referral link</h2>
        <div className="flex items-center">
          <div className="flex-1 truncate text-gray-600">{referralLink}</div>
          <button onClick={handleCopy}>
            {copied ? (
                <Check size={16} className="text-green-500" />
            ) : (
                <Copy size={16} className="text-green-500 hover:text-green-600 transition" />
            )}
            </button>
        </div>
        <div className="border-t border-green-300 my-6"></div>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-600">Referral made</div>
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-600">Active referrals</div>
          </div>
          <div>
            <div className="text-2xl font-bold">Ksh. 0</div>
            <div className="text-sm text-gray-600">Commission received</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div>
          <h2 className="text-lg font-semibold p-6 pb-2">All referrals</h2>
          <p className="text-sm text-gray-600 px-6 pb-4">
            All active referrals will give you a commission of 10% each
          </p>
        </div>

        <div className="border-b border-green-300">
          <div className="flex">
            <button className="px-6 py-3 text-green-500 font-medium border-b-2 border-green-500">
              Active Referrals
            </button>
            <button className="px-6 py-3 text-green-600 hover:text-gray-900">
              Pending Referrals
            </button>
          </div>
        </div>

        <div className="p-6 flex items-center justify-center text-gray-500 py-12">
          <div className="text-center">
            <AlertCircle size={24} className="mx-auto mb-2 text-gray-400" />
            <p>No referrals so far</p>
          </div>
        </div>

        <div className="border-t border-green-300 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            style={{
                borderBottomRightRadius: 0,
              }}
            className="bg-green-500 text-white rounded-2xl px-4 py-2 text-sm font-medium">
            Withdraw commission
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralTab;