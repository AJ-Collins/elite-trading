import { useState, useEffect } from 'react';

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  instructor: { name: string; email: string };
  level: string;
  uploadDate: string;
  progressPercentage: number;
  subscriptionPrice?: number;
}

export interface LearningPath {
  courses: Course[];
  subscriptions: any[];
  progress: any[];
}

export const useLearningPath = (userId: number | null, token: string | null) => {
  const [learningPath, setLearningPath] = useState<LearningPath>({
    courses: [],
    subscriptions: [],
    progress: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        if (!userId || !token) {
          throw new Error('User not authenticated');
        }

        const API_URL = '';
        
        // First, get all learning paths (without filters)
        const res = await fetch(
          `${API_URL}/api/learning-paths?populate=users_permissions_user`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        const responseData = await res.json();
        console.log('All Learning Paths:', responseData);

        if (!res.ok) {
          throw new Error(responseData.error?.message || 'Failed to fetch learning paths');
        }

        // Find the learning path for this user
        const allPaths = responseData.data || [];
        const userPath = allPaths.find((path: any) => {
          const userRelation = path.attributes?.users_permissions_user?.data;
          return userRelation && userRelation.id === userId;
        });

        if (!userPath) {
          console.log('No learning path found for user');
          setLearningPath({ courses: [], subscriptions: [], progress: [] });
          return;
        }

        // Now fetch the complete data for this specific learning path
        const pathId = userPath.id;
        console.log(`Found learning path with ID: ${pathId}`);
        
        const detailRes = await fetch(
          `${API_URL}/api/learning-paths/${pathId}?populate[0]=courses.thumbnail&populate[1]=courses.author&populate[2]=subscriptions.courses&populate[3]=subscriptions.courses.thumbnail&populate[4]=subscriptions.courses.author&populate[5]=progress.course`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const detailData = await detailRes.json();
        console.log('Learning Path Details:', detailData);
        
        if (!detailRes.ok) {
          throw new Error(detailData.error?.message || 'Failed to fetch learning path details');
        }
        
        if (!detailData.data) {
          throw new Error('No data returned for learning path');
        }
        
        const pathData = detailData.data.attributes;
        
        // Process courses and subscriptions
        const subscriptionPriceMap = new Map<number, number>();
        const subscriptions = pathData.subscriptions?.data || [];
        
        // Map subscription prices
        subscriptions.forEach((subscription: any) => {
          subscriptionPriceMap.set(subscription.id, subscription.attributes.price || 0);
        });
        
        // Get courses from subscriptions
        const subscriptionCourses = subscriptions
          .flatMap((subscription: any) =>
            (subscription.attributes.courses?.data || []).map((course: any) => ({
              ...course,
              subscriptionId: subscription.id
            }))
          )
          .filter(Boolean);
        
        // Get direct courses
        const directCourses = pathData.courses?.data || [];
        
        // Combine and deduplicate courses
        const allCourses = [...subscriptionCourses, ...directCourses].filter(
          (course: any, index: number, self: any[]) =>
            course && course.id && index === self.findIndex((c) => c.id === course.id)
        );
        
        // Format courses with proper data
        const formattedCourses = allCourses.map((course: any) => {
          const thumbnailUrl = course.attributes.thumbnail?.data?.attributes?.url
            ? `${API_URL}${course.attributes.thumbnail.data.attributes.url}`
            : '/images/course_card.jpeg';

          const instructor = course.attributes.author?.data
            ? {
                name: course.attributes.author.data.attributes.username || 'Unknown Instructor',
                email: course.attributes.author.data.attributes.email || ''
              }
            : { name: 'Unknown Instructor', email: '' };

          // Find progress for this course
          const progress = pathData.progress?.find((p: any) => 
            p.course?.data?.id === course.id
          ) || {};
          
          return {
            id: course.id,
            title: course.attributes.title || '',
            slug: course.attributes.slug || '',
            description: course.attributes.description || '',
            image: thumbnailUrl,
            instructor,
            level: course.attributes.level || 'Beginner',
            uploadDate: course.attributes.publishedWhen || 'Unknown Date',
            progressPercentage: progress.progressPercentage || 0,
            subscriptionPrice: course.subscriptionId
              ? subscriptionPriceMap.get(course.subscriptionId)
              : undefined
          };
        });

        console.log('Formatted Courses:', formattedCourses);
        
        setLearningPath({
          courses: formattedCourses,
          subscriptions: subscriptions,
          progress: pathData.progress || []
        });
      } catch (error: any) {
        console.error('Failed to fetch learning path:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [userId, token]);

  return { learningPath, loading, error };
};