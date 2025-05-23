
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, LogOut, Settings, Phone, BarChart3, ChevronDown, Play, Calendar, User } from 'lucide-react';

const CourseCard = ({ title, image, instructor, date, level, isFree, premium, archived, progress = 0 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative">
        <img 
          src={image || "/api/placeholder/400/320"} 
          alt={title} 
          className="w-full h-40 sm:h-48 object-cover" 
        />
        {isFree && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
            FREE
          </span>
        )}
        {premium && !isFree && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-bold">
            PREMIUM
          </span>
        )}
        {level && (
          <span className="absolute top-3 right-3 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {level}
          </span>
        )}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base md:text-lg font-medium mb-2">{title}</h3>
        <div className="flex items-center text-xs md:text-sm text-gray-500 mb-4">
          <span className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-xs">
            {instructor.charAt(0)}
          </span>
          <span>{instructor}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
        <button 
          className={`flex items-center justify-center w-full py-2 rounded-md text-sm font-medium ${
            premium && !archived ? 'bg-gray-200 text-gray-500' : 'bg-red-500 hover:bg-red-600 text-white'
          } transition-colors`}
        >
          {archived ? (
            <>Rewatch</>
          ) : premium && !isFree ? (
            <>Unlock</>
          ) : (
            <>
              <Play size={16} className="mr-1" /> Start course
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
