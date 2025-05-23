import { Users, MonitorSmartphone, PenTool, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureBox = ({ icon: Icon, title, description, buttonText, buttonLink, isLast }) => {
  return (
    <div
      className={`relative p-6 flex flex-col h-full ${
        !isLast ? 'after:absolute after:top-6 after:bottom-6 after:right-0 after:w-px after:bg-gradient-to-b after:from-transparent after:via-green-700 after:to-transparent' : ''
      }`}
    >
      <div className="text-green-700 mb-4">
        <Icon size={36} strokeWidth={1.5} />
      </div>
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      <p className="text-gray-600 text-sm mb-8 flex-grow">{description}</p>
      <div>
        <a
          href={buttonLink}
          style={{
            backgroundColor: 'rgb(0, 128, 0)',
            borderColor: 'rgb(0, 128, 0)',
            borderBottomRightRadius: 0,
          }}
          className="hover:bg-white hover:text-black font-bold text-white px-6 py-3 font-medium transition-colors rounded-2xl opacity-70 inline-flex items-center text-sm gap-2"
        >
          {buttonText}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "A vast community of awesome Fx traders.",
      description:
        "We foster a trading community of over 100,000 subscribers where high quality signals, trading resources and tools are shared for free.",
      buttonText: "Join our community",
      buttonLink: "https://t.me/",
    },
    {
      icon: MonitorSmartphone,
      title: "Forex enlightenment",
      description:
        "We provide a robust curriculum that covers everything from forex basics to advanced trading strategies. Our aim is to equip you with the knowledge and skills you need to thrive in the forex market.",
      buttonText: "Enroll now and get started",
      buttonLink: "/login",
    },
    {
      icon: PenTool,
      title: "Live trading sessions with professionals",
      description:
        "Our free live trading session on YouTube every Monday 1:00 PM GMT+1 was created to help traders improve their trading and be consistently profitable.",
      buttonText: "Enroll now and join waitlist",
      buttonLink: "/login",
    },
    {
      icon: MessageCircle,
      title: "One-on-one mentorship calls",
      description:
        "Book intensive one-on-one meetings with our experienced tutors at Elite Trading Hub and get access to a private live session to learn and gain insights.",
      buttonText: "Book a session",
      buttonLink: "/login",
    },
  ];

  return (
    <div className="max-w-65xl mx-auto px-8 py-0 mb-16">
      <div className="flex items-center mb-16">
        <div className="mr-4 text-green-500">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 8L32 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 16L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 24L28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M5 32L35 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 5L10 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 12L18 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M26 20L26 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M34 26L34 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold">
          Learning with <span className="font-black">Elite Trading</span> <br />
          <span className="font-black">Hub</span> offers you...
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10">
        {features.map((feature, index) => (
          <FeatureBox key={index} {...feature} isLast={index === features.length - 1} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;