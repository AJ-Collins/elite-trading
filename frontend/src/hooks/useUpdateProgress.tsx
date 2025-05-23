import { useCallback } from 'react';

export const useUpdateProgress = (token: string | null, learningPathId: number | null) => {
  const API_URL = '';

  const updateProgress = useCallback(
    async (courseId: number, newProgress: number) => {
      if (!token || !learningPathId) return;

      try {
        // Fetch current learning path to get existing progress
        const res = await fetch(`${API_URL}/api/learning-paths/${learningPathId}?populate=CourseProgress.course`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const current = await res.json();
        const currentProgress = current.data.attributes.CourseProgress || [];

        // Filter out old progress for the course
        const updatedProgress = [
          ...currentProgress
            .filter((p: any) => p.course?.data?.id !== courseId)
            .map((p: any) => ({
              course: p.course.data.id,
              progressPercentage: p.progressPercentage,
              lastUpdated: p.lastUpdated,
            })),
          {
            course: courseId,
            progressPercentage: newProgress,
            lastUpdated: new Date().toISOString(),
          }
        ];

        // Update the learning path
        await fetch(`${API_URL}/api/learning-paths/${learningPathId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              CourseProgress: updatedProgress,
            },
          }),
        });

        console.log('✅ Progress updated successfully!');
      } catch (err) {
        console.error('❌ Failed to update course progress:', err);
      }
    },
    [token, learningPathId]
  );

  return { updateProgress };
};