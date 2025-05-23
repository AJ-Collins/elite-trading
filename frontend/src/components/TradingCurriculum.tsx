import { Download, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ShieldIcon from '@/components/ui/shieldIcon';
import PaymentModal from '@/components/PaymentModal'; // Use the refactored ModalComponent
import OnlineMentorshipPlans from '@/components/OnlineMentorshipPlans';
import { useNavigate } from 'react-router-dom';


export default function TradingCurriculum() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(''); // Fixed: Removed duplicate declaration
  const [amount, setAmount] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();

  const openModal = (plan, price, online = false) => {
    const isAuthenticated = localStorage.getItem('auth_token');

    if (!isAuthenticated) {
      navigate('/login'); // or use `navigate('/login')` if using `useNavigate`
      return;
    }

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
    <div className="max-w-65xl mx-auto px-8 py-0 mb-16">
      {/* Learning Curriculum Section */}
      <div className="mb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our learning curriculum</h1>

        <p className="text-gray-700 mb-8">
          Unlock the path to success with our comprehensive curriculum, designed to equip you with
          the skills and knowledge needed to excel in forex trading. Whether you're just starting
          out or looking to advance, our step-by-step modules cover everything from foundational
          concepts to advanced strategies. Take the first step toward mastering your future. Click
          the button below to download the curriculum now and begin your journey today!
        </p>

        <div className="flex flex-wrap md:flex-nowrap gap-4">
          {[
            { label: 'Download timetable', to: '/downloads/timetable.pdf', primary: true },
            { label: 'Beginners curriculum', to: '/downloads/beginners.pdf' },
            { label: 'Intermediate curriculum', to: '/downloads/intermediate.pdf' },
            { label: 'Advanced curriculum', to: '/downloads/advanced.pdf' },
          ].map(({ label, to, primary }, index) => (
            <div key={index} className="flex items-center">
              <Link
                to={to}
                style={{
                  backgroundColor: 'rgb(0, 128, 0)',
                  borderColor: 'rgb(0, 128, 0)',
                  borderBottomRightRadius: 0,
                }}
                className="hover:bg-white hover:text-black font-bold text-white px-6 py-3 font-medium transition-colors rounded-2xl opacity-70 inline-flex items-center text-sm gap-2"
              >
                <span>{label}</span>
                <Download size={16} />
              </Link>
              {index < 3 && <div className="hidden md:block h-6 w-px bg-gray-400 mx-3" />}
            </div>
          ))}
        </div>
      </div>

      {/* Mentorship Plans Section */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-green-500 rounded-full relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-white rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Our mentorship plans</h2>
        </div>

        <p className="text-gray-700 mb-12">
          We offer online and physical mentorship classes in our branches at Nairobi Kenya, Diamond plaza one Annex building 3rd floor. You can pay for our online mentorship by choosing a plan below to get started.
          If you would prefer our physical classes, you can start the enrollment process by
          clicking the button below.
        </p>

        <div>
        <OnlineMentorshipPlans openModal={openModal} />
        </div>
      </div>

      {/* Modal Component */}
      <PaymentModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedPlan={selectedPlan}
        isOnline={isOnline}
      />
    </div>
  );
}