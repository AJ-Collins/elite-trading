import React, { useState } from 'react';
import { MapPin, Check, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Curriculum from '@/components/Curriculum';
import PaymentModal from '@/components/PaymentModal';
import ShieldIcon from '@/components/ui/shieldIcon';
import OnlineMentorshipPlans from '@/components/OnlineMentorshipPlans';

export default function MentorshipPlans() {
  const [activeTab, setActiveTab] = useState('physical');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  const openModal = (plan, price, online = false) => {
    setSelectedPlan(plan);
    setAmount(price);
    setIsOnline(online);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan('');
    setAmount('');
    setIsOnline(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-65xl mx-auto px-8 py-0 mb-16">
        <h1 className="text-4xl font-bold mb-4">Mentorship plans</h1>

        <p className="text-gray-700 mb-6">
          We offer online and physical mentorship classes in our branches at Diamond Plaza One Annex Building, 3rd floor,
          Mombasa, Nairobi, Kilifi, KENYA. You can pay for our online mentorship by choosing a plan below to get started.
          If you would prefer our physical classes, you can start the enrollment process by
          clicking the button below.
        </p>

        <div className="mb-8">
          <h3 className="text-sm font-medium mb-2">Select a mentorship type</h3>
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`py-2 px-4 ${
                  activeTab === 'physical'
                    ? 'text-green-500 border-b-2 border-green-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('physical')}
              >
                Physical mentorship
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === 'online'
                    ? 'text-green-500 border-b-2 border-green-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('online')}
              >
                Online mentorship
              </button>
            </div>
          </div>
        </div>

        {/* Physical Mentorship Section */}
        {activeTab === 'physical' && (
          <div className="relative bg-white rounded-lg shadow-lg p-6">
            {/* Vertical Dividers */}
            <div className="hidden md:block absolute inset-y-0 left-1/3 w-[2px] bg-gradient-to-b from-transparent via-green-500 to-transparent z-10" />
            <div className="hidden md:block absolute inset-y-0 left-2/3 w-[2px] bg-gradient-to-b from-transparent via-green-500 to-transparent z-10" />

            <div className="grid md:grid-cols-3 gap-8 relative z-20">
              {/* Pricing Section */}
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-green-500">Ksh. 5,000</h2>
                <p className="uppercase text-xs font-medium text-gray-500 mt-1">per month</p>
                <div className="mt-auto pt-8">
                  <button
                    onClick={() => openModal('Physical Plan', '$157', false)}
                    style={{
                      backgroundColor: 'rgb(0, 128, 0)',
                      borderColor: 'rgb(0, 128, 0)',
                      borderBottomRightRadius: 0,
                    }}
                    className="w-full max-w-[250px] bg-green-500 text-white px-4 py-2 rounded-2xl flex items-center hover:bg-green-600 transition"
                  >
                    Enroll to our physical class
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>

              {/* Features Section */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-green-500">
                    <Check size={20} />
                  </div>
                  <h3 className="font-medium">What You'll Get</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Learning in one of our physical locations has loads of benefits. Some of these
                  benefits include:
                </p>
                <ul className="space-y-3">
                  {[
                    'Intensive one month trading class ranging from beginners to advance level',
                    'Live trade signals (paid mentorship period)',
                    'Live trading session with Jeffrey Benson and other instructors',
                    'Free trading Journal',
                    'Access to a community of professional Forex traders',
                    'Access a community manager who attends to your concerns outside class',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="text-red-500">
                        <div>
                          <ShieldIcon />
                        </div>
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Locations Section */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-green-500">
                    <MapPin size={20} />
                  </div>
                  <h3 className="font-medium">Our Physical Locations</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  The mentorship classes will take place in all our physical locations in Nairobi, Mombasa and Kilifi:
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase mb-1">Nairobi Branch</h4>
                    <p className="text-sm text-gray-600">
                    Diamond Plaza One Annex Building, 3rd floor, KENYA.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase mb-1">Mombasa Branch</h4>
                    <p className="text-sm text-gray-600">
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase mb-1">Kilifi Branch</h4>
                    <p className="text-sm text-gray-600">
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Online Mentorship Plans */}
        {activeTab === 'online' && <OnlineMentorshipPlans openModal={openModal} />}
      </div>

      {/* Modal Component */}
      <PaymentModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedPlan={selectedPlan}
        isOnline={isOnline}
      />

      <Curriculum />
      <Footer />
    </div>
  );
}