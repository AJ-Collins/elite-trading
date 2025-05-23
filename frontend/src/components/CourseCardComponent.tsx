import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  subscriptionPrice?: number; // Optional: to indicate free (0) or premium (>0)
}

interface CourseCardComponentProps {
  course: Course;
}

const CourseCardComponent: React.FC<CourseCardComponentProps> = ({ course }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/watch-course/${course.id}`);
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
          <span className="hidden sm:inline mx-2">•</span>
          <span className="text-xs">{course.uploadDate}</span>
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
        <div className="flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full transition-colors"
          >
            {course.progressPercentage > 0 ? 'Continue' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCardComponent;