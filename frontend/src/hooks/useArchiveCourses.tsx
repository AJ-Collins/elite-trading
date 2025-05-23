import { useState, useEffect } from 'react';

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
  video: string | null;
  price: number | null;
  subscriptionPrice?: number;
  publishedWhen: string | null;
  instructor: Instructor;
  level: string;
  levelNumber: number;
  uploadDate: string;
  rating: number;
  color: string;
  modules: unknown[];
  nextCourse: { id: number } | number | null;
  instructorAvatar: string;
  isArchived?: boolean;
  progressPercentage: number;
}

interface UseArchiveCoursesResult {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export const useArchiveCourses = (userId: number | null, token: string | null): UseArchiveCoursesResult => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchivedCourses = async () => {
      try {
        if (!userId || !token) {
          throw new Error('User not authenticated');
        }

        const API_URL = '';

        // Fixed API request with proper nested population
        const userRes = await fetch(
          `${API_URL}/api/users/${userId}?populate[subscriptions][populate][courses][populate][thumbnail]=true&populate[subscriptions][populate][courses][populate][video]=true&populate[subscriptions][populate][courses][populate][author]=true&filters[subscriptions][isActive][$eq]=true`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = await userRes.json();
        if (!userRes.ok) {
          throw new Error(userData.error?.message || 'Failed to fetch user subscriptions');
        }

        // Validate we have subscriptions directly on the userData object (not nested in data)
        if (!userData?.subscriptions || !Array.isArray(userData.subscriptions)) {
          setCourses([]);
          setError('No active subscriptions found in user data');
          setLoading(false);
          return;
        }

        // Extract active subscriptions
        const activeSubscriptions = userData.subscriptions.filter((sub: any) => sub.isActive) || [];
        if (activeSubscriptions.length === 0) {
          setCourses([]);
          setError('No active subscriptions found');
          setLoading(false);
          return;
        }

        // Deduplicate courses by documentId and collect subscription prices
        const courseMap = new Map<string, any>();
        const subscriptionPriceMap = new Map<number, number>();

        for (const subscription of activeSubscriptions) {
          // Store subscription price by id
          subscriptionPriceMap.set(subscription.id, subscription.price || 0);

          // Check if courses exist directly on the subscription
          if (subscription.courses && Array.isArray(subscription.courses)) {
            for (const course of subscription.courses) {
              // Check if course is archived
              if (course.archived === true && course.documentId) {
                // Use documentId as the unique key
                courseMap.set(course.documentId, {
                  ...course,
                  subscriptionId: subscription.id,
                });
              }
            }
          }
        }

        // Format courses
        const formattedCourses: Course[] = Array.from(courseMap.values()).map((course: any): Course => {
          // Extract thumbnail URL
          let thumbnailUrl = '/images/course_card.jpeg'; // Default fallback
          if (course.thumbnail) {
            // Handle different thumbnail structures
            if (course.thumbnail.url) {
              thumbnailUrl = `${API_URL}${course.thumbnail.url}`;
            } else if (course.thumbnail.formats?.medium?.url) {
              thumbnailUrl = `${API_URL}${course.thumbnail.formats.medium.url}`;
            } else if (course.thumbnail.formats?.small?.url) {
              thumbnailUrl = `${API_URL}${course.thumbnail.formats.small.url}`;
            } else if (course.thumbnail.formats?.thumbnail?.url) {
              thumbnailUrl = `${API_URL}${course.thumbnail.formats.thumbnail.url}`;
            }
          }

          // Format date
          const startTime = new Date(course.publishedWhen || new Date());
          const formattedDateTime = startTime.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          // Extract video URL
          let videoUrl = null;
          if (course.video && Array.isArray(course.video) && course.video.length > 0) {
            const videoItem = course.video[0];
            if (videoItem && videoItem.url) {
              videoUrl = `${API_URL}${videoItem.url}`;
            }
          }

          // Extract instructor info
          const instructor: Instructor = course.author
            ? {
                name: course.author.username || 'Unknown Instructor',
                email: course.author.email || '',
              }
            : {
                name: 'Unknown Instructor',
                email: '',
              };

          return {
            id: course.id,
            title: course.title || 'Untitled Course',
            slug: course.slug || '',
            description: course.description || 'No description available',
            image: thumbnailUrl,
            video: videoUrl,
            price: course.price ?? null,
            subscriptionPrice: course.subscriptionId
              ? subscriptionPriceMap.get(course.subscriptionId)
              : undefined,
            publishedWhen: course.publishedWhen ?? null,
            instructor,
            level: course.level || 'Beginner',
            levelNumber: course.levelNumber || 0,
            uploadDate: formattedDateTime,
            rating: course.rating || 0,
            color: course.color || '#3182CE',
            modules: course.modules || [],
            nextCourse: course.nextCourse || null,
            instructorAvatar: '/images/avatar.png',
            isArchived: true,
            progressPercentage: 0, // No progress data without learning paths
          };
        });

        if (formattedCourses.length === 0) {
          setError(null);
        } else {
          setError(null);
        }

        setCourses(formattedCourses);
      } catch (error: any) {
        console.error('Error fetching archived courses:', error);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchArchivedCourses();
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [userId, token]);

  return { courses, loading, error };
};