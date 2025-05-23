import React, { useState } from 'react';
import { ArrowRight, LogOut, Settings, Phone, Users, BarChart3, ChevronDown, Play, Clock, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';


const LearningNavigationTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
      { id: "learning-path", name: "Your learning path" },
      { id: "free-courses", name: "Free courses" },
      { id: "premium-courses", name: "Premium courses" },
      { id: "live-sessions", name: "Live sessions" },
      { id: "archive", name: "Archive" },
      { id: "assignments", name: "Assignments" }
    ];
    
    return (
      <div className="mb-6 md:mb-8 overflow-x-auto">
        <div className="border-b border-gray-200 min-w-max">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }}
                className={`py-3 md:py-4 px-3 md:px-6 text-center border-b-2 font-medium font-bold text-xs md:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-500 bg-green-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  export default LearningNavigationTabs;