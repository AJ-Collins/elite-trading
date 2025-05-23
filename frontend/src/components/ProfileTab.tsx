import React, { useState, useEffect } from 'react';
import { User, Copy, Check } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ProfileTab = () => {
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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

  const isTokenExpired = (token: string) => {
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() /1000;
        return decoded.exp < currentTime;

    } catch (error) {
      console.log('Token decode failed');
      return true;
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('auth_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.id || !token) return;

      if(isTokenExpired(token)) {
        console.log('Token expired. Logging out.');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      setUserData(user);

      try {
        const res = await fetch(`http://127.0.0.1:5000/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log('User data:', data);
        setUserData(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-green-400" />
          </div>
        </div>
        <div className="text-left">
            <div className="text-sm font-bold text-gray-600">Your referral link</div>
                <div className="text-sm flex items-center">
                    <span className="text-gray-800 lex-1 truncate max-w-xs">{referralLink}</span>
                    <button onClick={handleCopy} className="ml-2">
                        {copied ? (
                            <Check size={16} className="text-green-500" />
                        ) : (
                            <Copy size={16} className="text-green-500 hover:text-green-600 transition" />
                        )}
                    </button>
                </div>
            </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Email</label>
          <div className="text-gray-600 text-sm">{userData?.email || 'Loading...'}</div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={userData?.username || ''}
            placeholder="AMIIN"
            style={{
                borderBottomRightRadius: 0,
            }}
            className="w-full p-3 border border-green-300 rounded-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={userData?.Name || ''}
            placeholder="AMIIN"
            style={{
                borderBottomRightRadius: 0,
            }}
            className="w-full p-3 border border-green-300 rounded-2xl"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={userData?.phone || ''}
            placeholder="+25474423423"
            style={{
                borderBottomRightRadius: 0,
            }}
            className="w-full p-3 border border-green-300 rounded-2xl"
          />
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold uppercase text-gray-700">Reset Your Password</label>
          <button className="text-green-500 hover:text-green-600 text-sm font-medium">Reset password</button>
        </div>
        <input
          type="password"
          value="••••••••••••••"
          readOnly
          style={{
                borderBottomRightRadius: 0,
            }}
          className="w-full p-3 border border-green-300 rounded-2xl mt-2"
        />
      </div>

      <div className="max-w-md mx-auto">
        <button
            style={{
                borderBottomRightRadius: 0,
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 font-medium">
          Save changes
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;