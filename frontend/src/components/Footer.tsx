import React from 'react';
import megaphoneIcon from '/images/speakerIcon.png';
import {Twitter, Instagram, Facebook, Youtube,PhoneCall,Linkedin } from 'lucide-react';
import { FaWhatsapp, FaTelegram, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const socialIcons = {
  whatsapp: FaWhatsapp,
  instagram: Instagram,
  facebook: Facebook,
  telegram: FaTelegram,
  tiktok: FaTiktok,
  twitter: FaXTwitter,
  youtube: Youtube,
};
const currentYear = new Date().getFullYear();
const Footer = () => {
  return (
    <footer className="bg-green-900 text-gray-400 py-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Section: Newsletter Subscription */}
        <div className="flex-1">
          <div className="flex items-center mb-4">
          <img
            src={megaphoneIcon}
            alt="Megaphone Icon"
            className="w-12 h-12 mr-2 transform -rotate-45"
          />
            <h2 className="text-3xl font-bold text-white">Let's keep you informed!</h2>
          </div>
          <p className="mb-4">
            Subscribe to our newsletter to receive updates from Elite Trading Hub
          </p>
          <div className="flex flex-col space-y-2">
            <input
              style={{
                borderColor: 'rgb(0, 128, 0)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderBottomRightRadius: 0,
              }}
              type="email"
              placeholder="Enter your email to continue"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              style={{
                borderColor: 'rgb(0, 128, 0)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderBottomRightRadius: 0,
              }} 
              className="w-full p-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600">
              Subscribe to our newsletter
            </button>
          </div>
        </div>

        <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-green-200 to-transparent"></div>

        {/* Middle Section: Navigation Links */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-4">Elite Trading Hub</h3>
          <ul className="space-y-2">
            {[
              { label: 'About', to: '/#mentor-profile' },
              { label: 'Mentorship Plans', to: '/plans' },
              { label: 'Blog', to: '/blog' },
              { label: 'FAQs', to: '/faqs' },
              { label: 'Access learning dashboard', to: '/login' },
              { label: 'Back to the top', to: '/#top' },
            ].map((link, index) => (
              <li key={index}>
                <Link to={link.to} className="hover:text-green-500">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-green-200 to-transparent"></div>

        {/* Right Section: Company Details and Social Media */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-4">Elite Trading Hub</h3>
          <p className="mb-4">
            Diamond Plaza One Annex Building, 3rd floor, KENYA.
            <br />
            Mombasa, Nairobi, Kilifi.
            <br />
            +254111532085
          </p>
          <h4 className="text-sm font-semibold text-white mb-2">
            Connect with us on social media
          </h4>
          <div className="flex space-x-4 mb-4">
            {[
              { name: 'twitter', url: 'https://twitter.com/' },
              { name: 'whatsapp', url: 'https://wa.me/' },
              { name: 'instagram', url: 'https://www.instagram.com/amiin__fx/' },
              { name: 'facebook', url: 'https://facebook.com/' },
              { name: 'youtube', url: 'https://youtube.com/' },
              { name: 'tiktok', url: 'https://tiktok.com/' },
              { name: 'telegram', url: 'https://t.me/elitecommunitytraders' }
            ].map((platform, index) => {
              const Icon = socialIcons[platform.name];
              return (
                <a key={index} href={platform.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500">
                  <Icon className="w-6 h-6" />
                </a>
              );
            })}
          </div>
          <div className="space-y-2">
            <Link to="terms" className="block hover:text-green-500">
              Terms and conditions →
            </Link>
            <a href="#" className="block hover:text-green-500">
              Privacy Policy →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section: Copyright, Disclaimer, and Refund Policy */}
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-sm">
        <div className="flex justify-between items-center">
          <p>© {currentYear} Elite Trading Hub. All Rights Reserved</p>
        </div>
        <div className="mt-4">
          <p className="font-semibold">DISCLAIMER:</p>
          <p className="text-xs">
            This legal disclaimer applies to the use of Elitetradinghub.com and its related services.
            The information contained on this website for purposes of education only. We are not
            authorized as a financial advisor but only as a training organization and by viewing any
            material or using the information within this site you agree that this is general
            education material and you will not hold anybody responsible for loss or damages
            resulting from the content or general advice provided here by Elite Trading Hub, its employees,
            directors or fellow members. Futures, options, and spot currency trading have large
            potential rewards, but also large potential risk. You must be aware of the risks and be
            willing to accept them in order to invest in the futures and options markets. Don't trade
            with money you can't afford to lose. This website is neither a solicitation nor an offer
            to Buy/Sell futures, spot forex, cfds, options or other financial products. No
            representation is being made that any account will or is likely to achieve profits or
            losses similar to those discussed in any material on this website. The past performance
            of any trading system or methodology is not necessarily indicative of future results. The
            high degree of leverage can work against you as well as for you. Before deciding to trade
            foreign exchange you should carefully consider your investment objectives, level of
            experience, and risk appetite. The possibility exists that you could sustain a loss of
            some or all of your initial investment and therefore you should not invest money that you
            cannot afford to lose. You should be aware of all the risks associated with foreign
            exchange trading, and seek advice from an independent financial advisor if you have any
            doubts. Once again, This is our full Disclaimer.
          </p>
          <p className="font-semibold mt-4">REFUND POLICY:</p>
          <p className="text-xs">
            Refund of mentorship fee is only valid within one week of subscription. Refund will not
            be processed if request is made after the first week that is after five (5) working days
            of subscription.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;