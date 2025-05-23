import { useState, useEffect } from 'react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  completedDate: string;
  assignmentFile: string | null;
  score: number;
  instructor: string;
}
interface UseAssignmentsResult {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  refresh: () => void; // Added to trigger refresh
}

export const useAssignments = (userId: number | null, token: string | null): UseAssignmentsResult => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const API_URL = '';
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = userData?.id;
        const token = localStorage.getItem('auth_token');
        console.log('Fetching assignments for userId:', userId);

        if (!userId || !token) {
          throw new Error('User not authenticated');
        }

        // Fetch assignments where the current user is in the users_permissions_users relation
        // This is the correct way to filter by relation in Strapi v4
        const res = await fetch(
          `${API_URL}/api/assignments?populate=*&filters[users_permissions_users][id][$eq]=${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const data = await res.json();
        console.log('Raw user API response:', JSON.stringify(userData, null, 2));

        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('No assignment data returned');
        }

        const formattedAssignments: Assignment[] = data.data.map((item: any) => {
          const assignment = item.attributes || item;
          
          // Format dates
          const dueDateObj = new Date(assignment.dueDate || new Date());
          const completedDateObj = assignment.completedDate ? new Date(assignment.completedDate) : null;
          
          const formattedDueDate = dueDateObj.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          
          const formattedCompletedDate = completedDateObj 
            ? completedDateObj.toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
            : '';
          
          // Handle file URL with Strapi v4 structure
          let fileUrl = null;
          if (assignment.assignmentFile?.data?.attributes?.url) {
            fileUrl = `${API_URL}${assignment.assignmentFile.data.attributes.url}`;
          } else if (assignment.assignmentFile?.url) {
            fileUrl = `${API_URL}${assignment.assignmentFile.url}`;
          }
          
          return {
            id: item.id,
            title: assignment.title || '',
            description: assignment.description || '',
            status: assignment.AssignmentStatus || '',
            dueDate: formattedDueDate,
            completedDate: formattedCompletedDate,
            assignmentFile: fileUrl,
            score: assignment.score || 0,
          };
        });

        console.log('Formatted assignments:', formattedAssignments);
        setAssignments(formattedAssignments);
        setLoading(false);
      } catch (error: any) {
        console.error('Failed to fetch assignments:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [userId, token, refreshTrigger]);

  return { assignments, loading, error, refresh};
};