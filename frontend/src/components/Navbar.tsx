
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Would connect to auth state in real app

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-2 pr-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to={{ pathname: "/", hash: "#top" }} className="text-gray-700 text-sm hover:text-tradingblue-600 transition-colors">Home</Link>
            <Link to={{ pathname: "/", hash: "#mentor-profile" }} className="text-gray-700 text-sm hover:text-tradingblue-600 transition-colors">About</Link>
            <Link to="/plans" className="text-gray-700 text-sm hover:text-tradingblue-600 transition-colors">Plans</Link>
            <Link to="/blog" className="text-gray-700 text-sm hover:text-tradingblue-600 transition-colors">Blog</Link>
            <Link to="/faqs" className="text-gray-700 text-sm hover:text-tradingblue-600 transition-colors">FAQs</Link>
            <Link to="/support" className="text-gray-700 text-sm hover:text-tradingblue-600 transition-colors">Support</Link>
            <Link to="/lotsize-calculator" className="text-gray-700 text-sm hover:text-tradingblue-600 transition-colors">Lotsize Calculator</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login"
                  style={{
                    backgroundColor: 'rgb(0, 128, 0)',
                    borderColor: 'rgb(0, 128, 0)',
                    borderBottomRightRadius: 0,
                  }}
                  className="hover:bg-white text-white font-bold px-6 py-3 text-sm transition-colors rounded-2xl h-[50px] flex items-center justify-center"
                >
                  Access learning dashboard
                  <ArrowUpRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none" 
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link 
                to={{ pathname: "/", hash: "#top" }} 
                className="px-2 py-1 text-gray-700 hover:text-tradingblue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to={{ pathname: "/", hash: "#mentor-profile" }}
                className="px-2 py-1 text-gray-700 hover:text-tradingblue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/plans"                
                className="px-2 py-1 text-gray-700 hover:text-tradingblue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Plans
              </Link>
              <Link 
                to="/blog"
                className="px-2 py-1 text-gray-700 hover:text-tradingblue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/faqs"
                className="px-2 py-1 text-gray-700 hover:text-tradingblue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                FAQs
              </Link>
              <Link 
                to="/support"
                className="px-2 py-1 text-gray-700 hover:text-tradingblue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Support
              </Link>
              <Link 
                to="/lotsize-calculator"
                className="px-2 py-1 text-gray-700 hover:text-tradingblue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Lotsize Calculator
              </Link>
              
              {/* Auth Links */}
              <div className="pt-3 border-t border-gray-100">
                {!isLoggedIn ? (
                  <>
                    <Link 
                      to="/login"
                      style={{
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          borderBottomRightRadius: 0,
                      }} 
                      className="block w-full py-2 px-4 text-center text-black bg-transparent border border-green-600 rounded-xl mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link 
                      to="/register"
                      style={{
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          borderBottomRightRadius: 0,
                      }} 
                      className="block w-full py-2 px-4 text-center text-black border border-green-600 bg-green-600 rounded-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="block w-full py-2 px-4 text-center text-tradingblue-600 bg-transparent border border-tradingblue-600 rounded-md mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      className="block w-full py-2 px-4 text-center text-gray-600 hover:text-tradingblue-600 transition-colors"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
