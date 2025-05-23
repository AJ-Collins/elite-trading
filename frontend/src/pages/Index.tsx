
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import CommunityCard from '@/components/CommunityCard';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import MentorProfile from '@/components/MentorProfile';
import MentorAdditionalInfo from '@/components/MentorAdditionalInfo';
import JourneySection from '@/components/JourneySection';
import FancyDivider from '@/components/FancyDivider';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import TradingCurriculum from '@/components/TradingCurriculum';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, BookOpen, Users, BarChart, Clock, DollarSign, ShieldCheck, ChevronsDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {

  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Slight delay to ensure DOM is ready
      }else {
        // Scroll to top when there's no hash
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location]);

  // Sample data for featured courses
  const featuredCourses = [
    {
      id: "1",
      title: "Technical Analysis Fundamentals",
      instructor: "Jane Smith",
      image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "6 hours",
      level: "Beginner" as const,
      students: 3240,
      rating: 4.8,
      price: 49.99,
      membershipTier: "Basic" as const
    },
    {
      id: "2",
      title: "Advanced Candlestick Patterns",
      instructor: "Michael Johnson",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "8 hours",
      level: "Intermediate" as const,
      students: 1890,
      rating: 4.7,
      price: 79.99,
      membershipTier: "Pro" as const
    },
    {
      id: "3",
      title: "Risk Management Strategies",
      instructor: "Sarah Williams",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "5 hours",
      level: "Intermediate" as const,
      students: 2150,
      rating: 4.9,
      price: 69.99,
      membershipTier: "Basic" as const
    }
  ];

  // Sample data for community posts
  const communityPosts = [
    {
      id: "1",
      title: "How to identify market trends early?",
      author: "TradingPro",
      authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      replies: 24,
      lastActivity: "2 hours ago",
      previewText: "I've been studying various indicators to spot market trends before they fully develop. I'd love to hear what combinations of indicators others are using...",
      category: "Strategies"
    },
    {
      id: "2",
      title: "My journey from $1k to $10k trading account",
      author: "GrowthInvestor",
      authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      replies: 56,
      lastActivity: "1 day ago",
      previewText: "I wanted to share my trading journey over the past year and the key lessons I've learned. It wasn't easy but with proper risk management...",
      category: "Beginners",
      isLocked: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12 justify-center">
              <h4 className="text-xl md:text-xl font-bold text-green-700 mb-4">
                Learn more about Elite Trading hub
              </h4>
              <div className="flex justify-center mb-2">
                <ChevronsDown
                  size={24}
                  className="transition-transform text-green-700 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
            </div>            
          </div>
        </section>
        <MentorProfile />
        <MentorAdditionalInfo />
        <JourneySection/>
        <FancyDivider/>
        <FeaturesSection />
        <TradingCurriculum />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
