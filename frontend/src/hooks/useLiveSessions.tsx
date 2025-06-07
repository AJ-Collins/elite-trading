import { useState, useEffect } from 'react';

interface LiveSession {
  image: string;
  title: string;
  platform: string;
  instructor: string;
  dateTime: string;
  streamUrl: string;
  description?: string;
}

interface UseLiveSessionsResult {
  sessions: LiveSession[];
  loading: boolean;
  error: string | null;
}

export const useLiveSessions = (userId: number | null, token: string | null): UseLiveSessionsResult => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSessions = async () => {
      if (!userId || !token) {
        setSessions([]);
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const sessionsRes = await fetch(`${API_URL}/api/user/courses/live/sessions/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });

        if (!sessionsRes.ok) {
          const errorData = await sessionsRes.json();
          throw new Error(errorData.error?.message || 'Failed to fetch live sessions');
        }

        const sessionsData = await sessionsRes.json();

        console.log('Recived data: ', sessionsData);

        const formattedSessions = sessionsData.map((session: any): LiveSession => {
          const thumbnailUrl = session.thumbnail
            ? `${API_URL}${session.thumbnail}`
            : '/images/course_card.jpeg';

          const startTime = new Date(session.startTime || new Date());
          const formattedDateTime = startTime.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          return {
            image: thumbnailUrl,
            title: session.title || 'Untitled Session',
            description: session.description || '',
            platform: 'Zoom', // Adjust based on session.link or add platform field to LiveSession
            instructor: session.instructor?.username || 'Unknown Instructor',
            dateTime: formattedDateTime,
            streamUrl: session.link || '#',
          };
        });

        setSessions(formattedSessions);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch live sessions:', err);
        setError(err.message || 'Failed to fetch live sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId, token, API_URL]);

  return { sessions, loading, error };
};