import React, { useState } from 'react';
import { ArrowRight, LogOut, Settings, Phone, Users, BarChart3, ChevronDown, Play, Clock, Calendar, User } from 'lucide-react';
import { Link, useNavigate  } from 'react-router-dom';

const DashboardHeader = ({ isDropdownOpen, setIsDropdownOpen }) => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
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
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1 text-gray-700 font-medium"
            >
              <span className="text-grey-900 font-bold">Learning-dashboard</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white font-bold rounded-md shadow-lg py-1 z-50">
                <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Learning Dashboard</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                <div className="border-t border-gray-300"></div>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-green-500 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;