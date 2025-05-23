import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to the intended page or default to /dashboard
        if (data.user.role === 'admin') {
          navigate('/admin/analytics');
        } else {
          const from = location.state?.from || '/dashboard';
          navigate(from);
        }
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    const jwt = response.credential;
    const payload = JSON.parse(atob(jwt.split('.')[1]));

    try {
      const res = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: jwt,
          email: payload.email,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('auth_token', jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.error || 'Google login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      alert('An error occurred during login.');
    }
  };
  
  return (
    <GoogleOAuthProvider clientId="902036933193-70vi1723uvrglpag28rgd5at3h1a03t3.apps.googleusercontent.com">
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-5/12 p-8 flex flex-col">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-md flex items-center justify-center overflow-hidden"
            >
            <img
              src="/images/logo.jpeg"
              alt="ETH Logo"
              className="object-contain w-full h-full"
            />
            </div>
            <span className="font-bold text-xl text-dark-900" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Elite Trading Hub
            </span>
          </Link>

          {/* Login Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold">
              Login to your <span className="text-green-500">learning dashboard</span>
            </h1>
          </div>

          {/* Google Sign In */}
          <GoogleLogin 
            onSuccess={handleGoogleLoginSuccess} 
            onError={() => console.log('Google login failed')}
            useOneTap
          />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email to continue"
                style={{
                  borderBottomRightRadius: 0,
                }}
                className="w-full p-3 border border-green-300 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter a password"
                  style={{
                    borderBottomRightRadius: 0,
                  }}
                  className="w-full p-3 border border-green-300 rounded-xl pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              style={{
                borderBottomRightRadius: 0,
              }} 
              className="w-full p-3 bg-gray-300 hover:bg-green-400 rounded-xl transition-colors"
            >
              Login to learning dashboard
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-8">
            <div className="text-sm mb-4">Forgot your password?</div>
            <Link
              to=""
              style={{
                borderBottomRightRadius: 0,
              }}
              className="text-sm hover:bg-green-100 border border-green-300 rounded-xl px-4 py-2 inline-flex items-center">
              Reset your password
              <ArrowRight
                  size={18}
                  className="transition-transform text-green-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 text-xs text-gray-500">
            © 2025 Elite Trading Hub. All Rights Reserved
          </div>
        </div>

        {/* Right Side - Image Background */}
        <div className="hidden md:block md:w-7/12 bg-gray-800 relative" style={{ backgroundImage: "url('/images/photo-1.jpeg')" }}>
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
            <h2 className="text-4xl font-bold mb-2">
              Hello, the upcoming forex trading <span className="text-green-500">guru!</span>
            </h2>
            <p className="mb-8">Login to your learning dashboard...</p>
            
            <div className="flex items-center mb-12 w-full">
              <svg
                className="w-8 h-8 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <div className="h-1 flex-grow bg-gradient-to-r from-green-500 to-transparent -ml-6"></div>
            </div>
            
            <p className="mb-8">Are you new here? Take a free tour and experience Elite Trading Hub or enroll now.</p>
            
            <div className="flex space-x-4">
              <Link to="/register" 
                style={{
                  backgroundColor: 'rgb(0, 128, 0)',
                  borderColor: 'rgb(0, 128, 0)',
                  borderBottomRightRadius: 0,
                }}
                className="bg-red-500 text-white px-6 py-3 rounded-xl inline-flex items-center">
                Create learning account
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;