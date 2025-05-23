import { ArrowUpRight } from "lucide-react";
import { Link } from 'react-router-dom';

const MentorAdditionalInfo = () => {
  return (
    <div className="max-w-65xl mx-auto px-8 py-0 mb-16">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Left side - Image */}
        <div className="md:w-1/2  max-w-sm rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gray-100 rounded-2xl">
            <img 
              src="/images/photo_2.jpg" 
              alt="AMIIN" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        {/* Right side - Content */}
        <div className="md:w-1/2">          
          <p className="text-gray-700 text-lg mb-8">
            <span className="text-xl font-bold uppercase text-green-700 mb-2">ASIDES HIS PAID MENTORSHIP </span>Mohammed Abdirahman helps youths all over the world take charge of their finances by making hundreds of forex videos, courses, and webinars available for FREE on both his website and YouTube Channel.
          </p>
          
          <p className="text-gray-700 text-lg mb-12">
            He is the founder and pioneer of the Forex Millionaire Expo, launched in 2023, out of the need to create a haven for forex traders to learn from and connect with the industry's biggest thought leader in Africa.
          </p>
          
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900">
              Want to know more about Elite Trading Hub Mentorship?
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                  href='https://api.whatsapp.com/'
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgb(0, 128, 0)',
                    borderColor: 'rgb(0, 128, 0)',
                    borderBottomRightRadius: 0,
                  }}
                  className="hover:bg-white hover:text-black font-bold text-white px-6 py-3 font-medium transition-colors rounded-2xl opacity-70"
              >
                <span className="flex items-center text-sm font-bold gap-2">
                  Speak with a representative
                  <ArrowUpRight size={18} />
                </span>
              </a>
              <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: '2px solid green',
                    backgroundColor: 'transparent',
                    borderColor: '2px solid green',
                    borderBottomRightRadius: 0,
                  }}
                  className="text-black px-6 py-3 font-medium transition-colors rounded-2xl"
                >
                <span className="flex items-center text-sm font-bold gap-2">
                  Visit telegram group
                  <ArrowUpRight size={18} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAdditionalInfo;