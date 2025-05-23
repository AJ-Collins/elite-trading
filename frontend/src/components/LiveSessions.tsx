import React from 'react';
import SessionCard from './SessionCard';
import { useLiveSessions } from '../hooks/useLiveSessions';
import { useAuth } from '../context/useAuth'; // Import your auth hook or context

const LiveSessions = () => {
  // Get authentication data from your auth context/hook
  const { user, token } = useAuth();
  const authToken = token;
  const userId = user?.id || null;

  // Pass the required parameters to the hook
  const { sessions, loading, error } = useLiveSessions(userId, authToken);

  const getSessionStatus = (dateTime: string) => {
    const now = new Date();
    const sessionDate = new Date(dateTime);
    const isLive =
      now.toDateString() === sessionDate.toDateString() &&
      now.getHours() === sessionDate.getHours() &&
      Math.abs(now.getMinutes() - sessionDate.getMinutes()) <= 30; // 30-min window for "LIVE"
    const isUpcoming = sessionDate > now && !isLive;
    const isEnded = sessionDate < now && !isLive;
    return { isLive, isUpcoming, isEnded };
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8 lg:py-10">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">
            Live Sessions{' '}
            <span className="bg-green-800 text-white text-xs px-2 py-1 rounded-xl ml-2">
              {sessions.length} SESSIONS
            </span>
          </h2>
        </div>
        
        {/* Authentication warning if user is not logged in */}
        {(!userId || !authToken) && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
            You need to be logged in to view live sessions.
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}
        
        {/* Session Grid */}
        {loading ? (
          <div className="text-center text-gray-600">Loading sessions...</div>
        ) : sessions.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sessions.map((session, index) => {
              const { isLive, isUpcoming, isEnded } = getSessionStatus(session.dateTime);
              return (
                <SessionCard
                  key={`${session.title}-${index}`} // Using index as fallback for uniqueness
                  session={session}
                  isLive={isLive}
                  isUpcoming={isUpcoming}
                  isEnded={isEnded}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-600">No live sessions available</div>
        )}
      </div>
    </div>
  );
};

export default LiveSessions;