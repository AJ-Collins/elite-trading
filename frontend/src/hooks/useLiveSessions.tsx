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
      // Early return if authentication is missing
      if (!userId || !token) {
        setSessions([]);
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        // Fetch live sessions directly (backend filters by subscriptions)
        const sessionsRes = await fetch(`${API_URL}/api/user-sessions`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const sessionsData = await sessionsRes.json();

        if (!sessionsRes.ok) {
          throw new Error(sessionsData.message || 'Failed to fetch live sessions');
        }

        console.log('Raw live sessions API response:', JSON.stringify(sessionsData, null, 2));

        if (!sessionsData.data || !Array.isArray(sessionsData.data)) {
          throw new Error('No live sessions data returned');
        }

        // Deduplicate sessions by ID
        const sessionMap = new Map<string, any>();

        for (const sessionItem of sessionsData.data) {
          const session = sessionItem.attributes || sessionItem;
          const sessionId = session.documentId || sessionItem.id.toString();

          if (!sessionMap.has(sessionId)) {
            sessionMap.set(sessionId, { id: sessionItem.id, ...session });
          }
        }

        // Format sessions
        const formattedSessions: LiveSession[] = Array.from(sessionMap.values()).map((session: any): LiveSession => {
          // Handle thumbnail with different possible structures
          let thumbnailUrl = '/images/session_placeholder.jpeg';
          if (session.thumbnail?.url) {
            thumbnailUrl = `${API_URL}${session.thumbnail.url}`;
          } else if (session.thumbnail?.data?.attributes?.url) {
            thumbnailUrl = `${API_URL}${session.thumbnail.data.attributes.url}`;
          } else if (session.thumbnail?.data?.attributes?.formats?.medium?.url) {
            thumbnailUrl = `${API_URL}${session.thumbnail.data.attributes.formats.medium.url}`;
          } else if (session.thumbnail?.data?.attributes?.formats?.small?.url) {
            thumbnailUrl = `${API_URL}${session.thumbnail.data.attributes.formats.small.url}`;
          }

          // Format date
          const startTime = new Date(session.startTime || new Date());
          const formattedDateTime = startTime.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          // Handle instructor
          let instructorName = 'Default Instructor';
          if (session.instructor?.username) {
            instructorName = session.instructor.username;
          } else if (session.instructor?.data?.attributes?.username) {
            instructorName = session.instructor.data.attributes.username;
          }

          return {
            image: thumbnailUrl,
            title: session.title || 'Untitled Session',
            description: session.description || '',
            platform: 'Zoom', // Hardcoded as per original
            instructor: instructorName,
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