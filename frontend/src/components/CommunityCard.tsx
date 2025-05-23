
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, User } from 'lucide-react';

interface CommunityCardProps {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  replies: number;
  lastActivity: string;
  previewText: string;
  category: string;
  isLocked?: boolean;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  id,
  title,
  author,
  authorAvatar,
  replies,
  lastActivity,
  previewText,
  category,
  isLocked = false
}) => {
  const getCategoryStyles = () => {
    switch (category.toLowerCase()) {
      case 'stocks':
        return 'bg-blue-100 text-blue-800';
      case 'forex':
        return 'bg-green-100 text-green-800';
      case 'crypto':
        return 'bg-purple-100 text-purple-800';
      case 'beginners':
        return 'bg-yellow-100 text-yellow-800';
      case 'strategies':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/community/thread/${id}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-300 group card-hover relative">
        {/* Lock icon for premium content */}
        {isLocked && (
          <div className="absolute top-0 right-0 w-full h-full bg-black/5 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center z-10">
            <div className="bg-white/90 p-4 rounded-lg shadow-lg text-center">
              <svg
                className="w-8 h-8 mx-auto text-tradingblue-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="font-medium text-gray-900">Premium Content</p>
              <p className="text-sm text-gray-600 mt-1">Upgrade your membership to access</p>
            </div>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryStyles()}`}>
            {category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{replies} replies</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-tradingblue-600 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {previewText}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={authorAvatar} 
              alt={author} 
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <span className="text-sm font-medium">{author}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{lastActivity}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
