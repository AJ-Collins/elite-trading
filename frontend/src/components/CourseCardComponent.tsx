import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useAuth } from '../context/useAuth'; // Import useAuth
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

interface Course {
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
  archived: boolean; // Add archived property
}

interface CourseCardComponentProps {
  course: Course;
  onUnarchive?: (courseId: number) => void; // Optional callback to notify parent of unarchive
}

const CourseCardComponent: React.FC<CourseCardComponentProps> = ({ course, onUnarchive }) => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleNavigate = () => {
    navigate(`/watch-course/${course.id}`);
  };

  const handleUnarchive = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/api/user/courses/unarchive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ courseId: course.id, userId: user?.id }),
      });

      if (!res.ok) throw new Error(`Failed to unarchive course: ${res.status}`);

      toast.success('Course unarchived successfully!');
      if (onUnarchive) onUnarchive(course.id);
    } catch (err: any) {
      console.error('Error unarchiving course:', err);
      toast.error('Failed to unarchive course');
    }
  };

  const instructorName = course.instructor.name
    ? course.instructor.name.charAt(0).toUpperCase() + course.instructor.name.slice(1)
    : 'Unknown Instructor';

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="relative h-48">
        <img
          src={course.image || '/images/course_card.jpeg'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 right-4 bg-green-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {course.level}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <div className="h-0.5 w-full bg-gradient-to-r from-green-500 to-transparent mb-3 rounded-full" />
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="w-6 h-6 bg-green-300 rounded-full flex items-center justify-center text-xs text-black mr-2">
            {instructorName.charAt(0)}
          </div>
          <span className="mr-2 font-bold text-gray-900">{instructorName}</span>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-xs">{course.uploadDate}</span>
          </div>
        </div>
        {course.progressPercentage > 0 && (
          <div className="text-xs text-green-600 mb-2">
            Progress: {course.progressPercentage}%
          </div>
        )}
        {course.subscriptionPrice !== undefined && (
          <div className="text-xs text-gray-600 mb-2">
            {course.subscriptionPrice === 0 ? 'Free Subscription' : 'Premium Subscription'}
          </div>
        )}
        {course.archived && (
          <div className="text-xs text-gray-600 mb-2">Archived</div>
        )}
        <div className="flex items-center justify-end gap-2">
          {course.archived ? (
            <button
              style={{ borderBottomRightRadius: 0 }}
              onClick={handleUnarchive}
              className="bg-green-100 text-gray-700 hover:bg-green-200 text-xs font-medium px-3 py-1 rounded-full transition-colors"
              aria-label="Unarchive course"
            >
              Unarchive
            </button>
          ) : (
            <button
              style={{ borderBottomRightRadius: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
              className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full transition-colors"
            >
              {course.progressPercentage > 0 ? 'Continue' : 'Start'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCardComponent;