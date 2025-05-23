import React, { useState } from 'react';
import { ArrowRight, LogOut, Settings, Phone, Users, BarChart3, ChevronDown, Play, Clock, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardWelcomeCard from '@/components/DashboardWelcomeCard';
import LearningNavigationTabs from '@/components/LearningNavigationTabs';
import LearningPlanContent from '@/components/LearningPlanContent';
import FreeCourses from '@/components/FreeCourses';
import PremiumCourses from '@/components/PremiumCourses';
import LiveSessions from '@/components/LiveSessions';
import Archive from '@/components/Archive';
import Assignments from '@/components/Assignments';
import DashboardFooter from '@/components/DashboardFooter';


// Main Dashboard Layout
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("free-courses");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-80">
      {/* Header Component */}
      <DashboardHeader isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
      
      <div className="container mx-auto px-4 py-6">
        <DashboardWelcomeCard />
        {/* Navigation Tabs Component */}
        <LearningNavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Dynamic Content based on active tab */}
        {activeTab === "learning-path" && <LearningPlanContent />}
        {activeTab === "free-courses" && <FreeCourses />}
        {activeTab === "premium-courses" && <PremiumCourses />}
        {activeTab === "live-sessions" && <LiveSessions />}
        {activeTab === "archive" && <Archive setActiveTab={setActiveTab}/>}
        {activeTab === "assignments" && <Assignments />}
      </div>
      <DashboardFooter />
    </div>
  );
};

// Complete App Component
const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
};

export default App;