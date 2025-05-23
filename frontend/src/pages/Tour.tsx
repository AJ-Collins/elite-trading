import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tour = () => {
  // State to handle modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="py-12 px-4">
        <div className="relative overflow-hidden flex items-center justify-between p-8">
            {/* Left Section: Text and Buttons */}
            <div className="max-w-md">
            <h2 className="text-4xl font-bold text-green-500 mb-4">
            <span className="text-black">Watch the first</span> beginner’s course!
            </h2>
            <p className="text-gray-700 text-sm mb-6">
                Go from a beginner to an advanced FX trader with the one and only AMIIN. Gain
                access to over 80 in-depth courses that carefully explains the extreme complexities of
                the forex market.
            </p>
            <div className="flex items-center mb-4">
                <div className="flex items-center mb-4">
                    <img
                        src="/images/photo_2.jpg"
                        alt=""
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <p className="text-gray-600 text-sm font-bold">AMIIN • Uploaded 24 Jun, 2024</p>
                </div>
            </div>
            <div className="flex space-x-4">
                <button
                    style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderBottomRightRadius: 0,
                    }}
                    className="px-6 py-3 bg-green-500 text-white border border-green-100 rounded-xl font-semibold flex items-center hover:bg-green-600"
                    onClick={openModal} // Open modal when clicked
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    Start course
                </button>
                <Link
                    to="/login"
                    style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderBottomRightRadius: 0,
                    }}
                    className="px-6 py-3 bg-green-100 text-green-500 border border-green-100 rounded-xl font-semibold hover:bg-green-200">
                    <span className="flex items-center gap-x-2">
                        Enroll now for free <ArrowUpRight className="w-5 h-5" />
                    </span>
                </Link>
            </div>
            </div>

            {/* Right Section: Text Overlay */}
            <div className="hidden md:flex flex-grow justify-end">
                <img 
                    src="/images/photo_1.jpg" 
                    alt="FirePips Mentorship" 
                    className="opacity-90 object-cover h-64 md:h-80 w-full max-w-[800px] rounded-xl"
                />
            </div>
        </div>
        </div>

        {/* Modal: YouTube Video */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                <div className="text-white p-8 rounded-xl max-w-4xl w-full">
                    {/* Close Button */}
                    <div className="w-full md:w-1/2 text-[#fff] text-[14px] font-[900] mb-[10px] md:cursor-pointer">
                        <button
                            onClick={closeModal}
                            className="text-white font-bold">
                            Close tab
                        </button>
                    </div>

                    {/* YouTube Embed */}
                    <div className="w-full h-[300px]">
                        <iframe
                            className="w-full h-full rounded-xl"
                            src="https://www.youtube.com/embed/ytVdEbCGysg"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        )}

        <Footer />
    </div>
  );
};

export default Tour;