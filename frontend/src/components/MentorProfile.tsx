import { useState } from 'react';

const MentorProfile = () => {
  return (
    <section id="mentor-profile">
          
      <div className="max-w-65xl mx-auto px-8 py-0 mb-16">
        {/* Header with logo and title */}
        <div className="flex items-center mb-10">
          <div className="mr-4 text-green-500">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 10L5 20M10 5L20 15M30 10L20 25M20 10L10 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M45 15L15 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M40 35L25 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M35 40L50 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold">
            Meet your <span className="font-black">mentor...</span>
          </h1>
        </div>

        {/* Main content with bio and image */}
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-2/3">
            <p className="text-gray-700 mb-8 text-lg">
              <span className="text-xl font-bold uppercase text-green-700 mb-2">Abdirahman FX </span>is a professional, profitable and notable forex trader with over 8 years of experience, a thought leader, an investor and an international keynote speaker. He is also a kingmaker, passionate about helping humans through their "grass to grace" journeys.
            </p>
            
            <p className="text-gray-700 text-lg">
              He is the founder of Elite Trading Hub, a leading online forex and crypto trading academy, where he trains over one million beginners and advanced traders on how to trade profitably.
            </p>
          </div>
          
          <div className="md:w-1/3">
            <div className="rounded-xl  max-w-sm overflow-hidden bg-gray-100">
              <img 
                src="/images/photo_7.jpg" 
                alt="AMIIN" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorProfile;