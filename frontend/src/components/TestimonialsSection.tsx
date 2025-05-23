import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react'; // You can use any icon library or emoji
import { Link } from "react-router-dom";

const TestimonialCard = ({ initial, name, country, experience, quote, quote_text}) => (
  <div className="bg-white p-6 rounded-lg shadow-md w-80 flex-shrink-0">
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-600 font-bold">
        {initial}
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-semibold">{name}</h4>
        <p className="text-sm text-gray-500">{country} • {experience}</p>
      </div>
    </div>

    {/* Fading horizontal line for all cards */}
    <div className="my-4 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>

    <h4 className="text-gray-700 font-semibold text-sm mb-2">{quote}</h4>
    <p className="text-gray-600 text-xs">{quote_text}</p>
  </div>
);

const TestimonialsSection = () => {
  const scrollRef = useRef(null); // Reference to scroll container

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // Scroll by 300px to the right
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' }); // Scroll by 300px to the left
    }
  };

  const testimonials = [
    {
      initial: 'NA',
      name: 'Norbert Agwaronaye',
      country: 'NA',
      experience: 'Trading for 2 years now',
      quote: 'WHAT I’M SEEING IN Elite Trading Hub HAD BEEN MY EXPECTATIONS FOR OVER 3 YEARS OF TRADING...',
      quote_text: `What I am seeing in Elite Trading Hub had been my expectations for over 3 years of trading.
       I have the education and technical know-how that every trader needs. I am more than satisfied 
       with everything I see on daily basis. The interaction between the mentors and mentees is 
       fantastic and that makes me feel at home.`
    },
    {
      initial: 'US',
      name: 'Uthman S.',
      country: 'US',
      experience: 'Trading for 3 years now',
      quote: 'TAKE THE COURSE, IT’S WORTH EVERY PENNY, IF YOU WANT TO UNDERSTAND THE FINANCIAL MARKET...',
      quote_text: `I'm 2 weeks into the mentorship program. It's worth every penny. If you want to understand 
      the financial market take it. It's not just a course but you will also be mentored till you know how to 
      consistently win in the market.`
    },
    {
      initial: 'AS',
      name: 'Akachukwu Success',
      country: 'AS',
      experience: 'Trading for 1 year now',
      quote: 'ABDIRAHMAN REALLY INSPIRED ME SINCE I JOINED Elite Trading Hub, MY MINDSET ON TRADING ALL HE DOES HE REALLY DOES...',
      quote_text: `Since I joined Elite Trading Hub, my mindset on trading really changed,i looked onto Jeff I learnt all he does
       his strategy, his risk management, his money management,, all he does he really inspired me since then I have been
        seeing some results in my trading mindset.. Love you boss ABDIRAHMAN 💓`
    },
    {
      initial: 'OA',
      name: 'Oluwaseun Adewunmi',
      country: 'OA',
      experience: 'Trading for 1 year now',
      quote: 'EXCELLENT! JUST 2 WEEKS IN THE MENTORSHIP PROGRAM I CAN SEE THE ANATOMY OF PRICE ACTION...',
      quote_text: `Excellent! Just 2 weeks in the mentorship program I can see the anatomy of price action 
      crystal clear ( The Hidden Treasure). Is like you are in an institution longing to graduate so you can 
      start working ,making money:no pass no graduation! ABDIRAHMAN is a rare Gem!`
    },
    {
      initial: 'AC',
      name: 'Anamasonye Chike',
      country: 'AC',
      experience: 'Trading for 2 years now',
      quote: 'A VERY PROFITABLE AND WISE INVESTMENT I HIGHLY RECOMMEND ABDIRAHMAN MENTORSHIP...',
      quote_text: `I highly recommend ABDIRAHMAN Mentorship for anyone looking to be profitable in 
      the forex market`
    },
    {
      initial: 'LM',
      name: 'Lucas Muhammed',
      country: 'LM',
      experience: 'Trading for 1 year now',
      quote: 'TUTORS ARE SUPERB! I WAS A STUDENT IN ABDIRAHMAN, THE TUTORS THERE ARE SUPER...',
      quote_text: `I was a student in Elite Trading Hub. The tutors there are superb. They make sure 
      to touch all that trading entails from Technical, Fundamental and sentimental analysis.You can't 
      afford to miss Andirahman teaching too. All of them are just too good.Gracias, Elite Trading Hub.You guys are 
      the real GOAT in this Forex Industry.`
    },
  ];

  return (
    <div className="relative py-12 px-4 bg-gray-50">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="flex space-x-1 mr-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-green-500 rounded-full"></div>
          ))}
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Hear our students learning <span className="text-green-500">experiences</span>
        </h2>
      </div>

      {/* Testimonials Scrollable Section */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <ChevronLeft className="text-green-600" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <ChevronRight className="text-green-600" />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-700 font-semibold mb-4">
          We’ve got hundreds more reviews from our students!
        </p>
        <div className="flex justify-center space-x-4 mb-4">
          <a
            href="https://trustpilot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-white border border-green-600 rounded-full shadow-sm hover:bg-gray-100"
          >
            <span className="text-green-500 mr-2">★</span>
            TrustPilot
            <span className="ml-2">→</span>
          </a>
          <a
            href="https://google.com/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-white border border-green-600 rounded-full shadow-sm hover:bg-gray-100"
          >
            <span className="mr-2 w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#fbc02d" d="M43.6 20.5h-1.6V20H24v8h11.3c-1.6 4.5-5.8 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C33.8 6.5 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.2-.1-2.3-.4-3.5z"/>
                    <path fill="#e53935" d="M6.3 14.1l6.6 4.8c1.8-4.2 5.9-7.2 10.7-7.2 3.1 0 5.9 1.2 8 3.1l6-6C33.8 6.5 29.1 4 24 4c-7.6 0-14.2 4.2-17.7 10.1z"/>
                    <path fill="#4caf50" d="M24 44c5.1 0 9.8-1.9 13.3-5.1l-6.2-5.2c-2.1 1.6-4.7 2.5-7.6 2.5-5.4 0-9.9-3.5-11.4-8.2l-6.6 5.1C9.7 39.8 16.3 44 24 44z"/>
                    <path fill="#1565c0" d="M43.6 20.5h-1.6V20H24v8h11.3c-0.7 1.9-2 3.6-3.7 4.8v.1l6.2 5.2c-0.4.4 6.8-5 6.8-14.1 0-1.2-.1-2.3-.4-3.5z"/>
                </svg>
                </span>
                Google Reviews
            <span className="ml-2">→</span>
          </a>
        </div>
        <p className="text-gray-600 mb-4">You want to be like these amazing people?</p>
        <Link 
          to='/login'
          className="px-6 py-3 bg-green-100 text-green-500 rounded-full font-semibold hover:bg-green-200">
          Enroll with us now →
        </Link>
      </div>
    </div>
  );
};

export default TestimonialsSection;