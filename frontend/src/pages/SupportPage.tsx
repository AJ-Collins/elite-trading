import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowUpRight } from 'lucide-react';

export default function SupportPage() {
  const [showModal, setShowModal] = useState(false);
  
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  
  return (
    <div className="min-h-screen flex flex-col">
            <Navbar />
        <div className="min-h-screen relative">
        {/* Background image with overlay */}
        <div className="relative h-screen">
            <div className="absolute inset-0 bg-black/100 z-0">
            <img 
                src="/images/photo_3.jpg" 
                alt="Support background" 
                className="w-full h-full object-cover opacity-50"
            />
            </div>
            
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-6">
                Whatever the issue is, we are<br />here to help!
            </h1>
            
            <p className="text-white max-w-3xl mx-auto mb-12 text-lg">
                Create a <strong>support request ticket</strong> to tell us the issue you are experiencing with our services or ask any question you have to gain clarity about our prices, schedules, curriculum e.t.c. We usually respond between 2 to 4 hours. You can also talk to our support team using our Whatsapp customer support platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                onClick={openModal}
                style={{
                    backgroundColor: 'rgb(0, 128, 0)',
                    borderColor: 'rgb(0, 128, 0)',
                    borderBottomRightRadius: 0, // remove rounding from bottom-right
                }}
                className="w-full max-w-[240px] bg-green-500 text-xs text-white px-4 py-2 rounded-2xl flex items-center hover:bg-green-600 transition"
                >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create a support ticket
                </button>
                
                <a
                    href='https://api.whatsapp.com/'
                    target='_blank'
                    style={{
                        borderColor: 'rgb(255, 255, 255)',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderBottomRightRadius: 0,
                    }}
                className="w-full max-w-[270px] text-white text-xs px-4 py-2 rounded-2xl flex items-center">
                Talk to us on Whatsapp
                <ArrowUpRight size={16} className="ml-2" />
                </a>
            </div>
            </div>
        </div>
        
        {/* Support Request Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                <h2 className="text-3xl font-bold text-center mb-2">Create a support request ticket</h2>
                <p className="text-gray-600 text-center mb-8">
                    Please fill the form below to tell us how we can help your experience with us more wonderful.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                        type="text"
                        style={{
                            borderColor: 'rgb(0, 128, 0)',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderBottomRightRadius: 0,
                        }}
                        placeholder="Enter your full name e.g AMIIN"
                        className="w-full p-3 border border-green-800 rounded-xl"
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select 
                        style={{
                            borderColor: 'rgb(0, 128, 0)',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderBottomRightRadius: 0,
                        }}
                    className="w-full p-3 border border-gray-300 rounded-xl appearance-none">
                        <option value="">Select a category</option>
                        <option value="account-issues">Account Issues</option>
                        <option value="payment-issues">Payment Issues</option>
                        <option value="access-issues">Course Access Issues</option>
                        <option value="technical-errors">Technical Errors</option>
                        <option value="subscription-issues">Subscription/Plan Issues</option>
                        <option value="content-feedback">Content-Related Feedback</option>
                        <option value="general-inquiries">General Inquiries</option>
                        <option value="compliance-security">Compliance and Security</option>
                    </select>
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        style={{
                            borderColor: 'rgb(0, 128, 0)',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderBottomRightRadius: 0,
                        }}
                        type="email"
                        placeholder="Enter your email e.g email@example.com"
                        className="w-full p-3 border border-gray-300 rounded-xl"
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                        style={{
                            borderColor: 'rgb(0, 128, 0)',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderBottomRightRadius: 0,
                        }}
                        type="tel"
                        placeholder="Start with country code e.g +234"
                        className="w-full p-3 border border-gray-300 rounded-xl"
                    />
                    </div>
                    
                    <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Describe Your Issue</label>
                    <textarea
                        style={{
                            borderColor: 'rgb(0, 128, 0)',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderBottomRightRadius: 0,
                        }}
                        placeholder="Tell us how we can help..."
                        className="w-full p-3 border border-gray-300 rounded-xl h-32"
                    ></textarea>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <button 
                        style={{
                            backgroundColor: 'rgb(0, 128, 0)',
                            borderColor: 'rgb(0, 128, 0)',
                            borderBottomRightRadius: 0, // remove rounding from bottom-right
                        }}
                    className="w-full max-w-[140px] bg-green-500 text-xs text-white px-4 py-2 rounded-2xl flex items-center hover:bg-green-600 transition">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send message
                    </button>
                    
                    <button 
                    onClick={closeModal}
                        style={{
                            borderColor: 'rgb(0, 128, 0)',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderBottomRightRadius: 0,
                        }}
                    className="w-full max-w-[150px] text-black text-xs px-4 py-2 rounded-2xl flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel request
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
        <Footer />
    </div>    
  );
}