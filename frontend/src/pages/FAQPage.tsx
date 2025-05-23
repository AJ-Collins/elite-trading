import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState(0);

  const faqItems = [
    {
      id: 1,
      question: "How can I join the mentorship program?",
      answer: "You're just a click away from joining our mentorship program. Create an account with elite trading hub thereafter, join any of the mentorship plan."
    },
    {
      id: 2,
      question: "I've paid for the mentorship, what's next?",
      answer: "After payment confirmation, you'll receive an email with login details for our learning platform. You'll also be added to our community chat where you can interact with other traders and mentors."
    },
    {
      id: 3,
      question: "Is it a lifetime mentorship?",
      answer: "Our standard mentorship program runs for one month with full access to all materials and live sessions. We also offer extended support packages and alumni benefits after completion."
    },
    {
      id: 4,
      question: "Can I pay for the Mentorship program now but start a month later?",
      answer: "Yes, you can reserve your spot by paying now and specify your preferred start date during registration. Just note that course materials will only be accessible from your start date."
    }
  ];

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
      <div className="max-w-7xl mx-auto w-full px-2 py-2 mb-16 mt-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-gray-600">We have answered some of the questions you might have about Elite Trading Hub...</p>
          </div>
          <Link
            to="https://api.whatsapp.com/"
            style={{
              borderColor: 'rgb(0, 128, 0)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderBottomRightRadius: 0,
            }}
            className="w-full max-w-[270px] text-green-700 px-4 py-2 rounded-2xl flex items-center hover:bg-green-50 transition"
          >
            Speak with a representative
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="space-y-6">
          {faqItems.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-6">
              <button 
                className="w-full text-left flex justify-between items-center"
                onClick={() => toggleQuestion(item.id)}
              >
                <h4 className="text-green-700 font-medium">{item.question}</h4>
                {openQuestion === item.id ? (
                  <span className="text-gray-500">Close answer</span>
                ) : (
                  <span className="text-gray-500">Show answer</span>
                )}
              </button>
              
              {openQuestion === item.id && (
                <div className="mt-4 text-gray-700">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}