import React from 'react';
import { Clock, Video } from 'lucide-react';

const SessionCard = ({ session, isLive, isUpcoming, isEnded }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="relative h-48">
        <img
          src={session.image || '/images/session_placeholder.jpeg'}
          alt={session.title}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-4 left-4 text-white text-xs font-bold px-2 py-1 rounded ${
            isLive ? 'bg-red-500' : isUpcoming ? 'bg-yellow-500' : 'bg-gray-500'
          }`}
        >
          {isLive ? 'LIVE' : isUpcoming ? 'UPCOMING' : 'ENDED'}
        </span>
        <span className="absolute top-4 right-4 bg-green-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {session.platform}
        </span>
      </div>

      {/* Session Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{session.title}</h3>
        <div className="h-0.5 w-full bg-gradient-to-r from-green-500 to-transparent mb-3 rounded-full" />
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="w-6 h-6 bg-green-300 rounded-full flex items-center justify-center text-xs text-black mr-2">
            {session.instructor.charAt(0)}
          </div>
          <span className="mr-2 font-bold text-gray-900">{session.instructor}</span>
          <span className="hidden sm:inline mx-2">•</span>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span className='text-xs'>{session.dateTime}</span>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <a
            style={{
              borderBottomRightRadius: 0,
            }}
            href={isEnded ? '#' : session.streamUrl}
            target={isEnded ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className={`text-xs font-medium px-3 py-1 rounded-full transition-colors flex items-center ${
              isEnded
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Video className="w-4 h-4 mr-1" />
            {isLive ? 'Join Now' : isUpcoming ? 'Join Session' : 'Session Ended'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;