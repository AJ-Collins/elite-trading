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

export const useCourses = (): UseUserSubscriptionCoursesResult => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        if (!user || !token) {
          setCourses([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/user/courses/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || 'Failed to fetch courses');
        }

        const courseData = await res.json();

        // Format courses
        const formattedCourses = courseData.map((course: any): Course => {
          // Use course.thumbnail directly since backend provides it as a string path
          const thumbnailUrl = course.thumbnail
            ? `${API_URL}${course.thumbnail}`
            : '/images/course_card.jpeg';

          const instructor: Instructor = {
            name: course.author || 'Unknown Instructor',
            email: '', // Not available in current response
          };

          return {
            id: course.id,
            title: course.title || 'Untitled Course',
            slug: course.slug || `course-${course.id}`, // Fallback
            description: course.description || 'No description available',
            image: thumbnailUrl,
            instructor,
            level: course.level || 'Beginner',
            uploadDate: course.publishedWhen || 'Unknown Date',
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

    fetchUserCourses();
  }, [user, token]);

  return { courses, loading, error };
};