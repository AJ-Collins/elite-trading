import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';

interface Instructor {
  name: string;
  email: string;
}

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  instructor: Instructor;
  level: string;
  uploadDate: string;
}

interface UseUserSubscriptionCoursesResult {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export const useArchiveCourses  = (): UseUserSubscriptionCoursesResult => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFreeCourses = async () => {
      try {
        if (!user || !token) {
          setCourses([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/user/courses/archive?userId=${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || 'Failed to fetch courses');
        }

        const freeCourseData = await res.json();

        // Format courses
        const formattedCourses = freeCourseData.map((course: any): Course => {
          // Use course.thumbnail directly since backend provides it as a string path
          const thumbnailUrl = course.thumbnail
            ? `${API_URL}${course.thumbnail}`
            : '/images/course_card.jpeg';

          const instructor: Instructor = {
            name: course.author || 'Unknown Instructor',
            email: '', // Not available in current response
          };

          const startTime = new Date(course.startTime || new Date());
          const formattedDateTime = startTime.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          return {
            id: course.id,
            title: course.title || 'Untitled Course',
            slug: course.slug || `course-${course.id}`, // Fallback
            description: course.description || 'No description available',
            image: thumbnailUrl,
            instructor,
            level: course.level || 'Beginner',
            uploadDate: formattedDateTime,
          };
        });

        setCourses(formattedCourses);
      } catch (error: any) {
        console.error('Error fetching subscription courses:', error);
        setError(error.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFreeCourses();
  }, [user, token]);

  return { courses, loading, error };
};