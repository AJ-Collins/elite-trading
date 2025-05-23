import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useLearningPath } from '../hooks/useLearningPath';
import CourseCardComponent from './CourseCardComponent';

const LearningPlanContent = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  if (!user || !token) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-center">
          Error: User not authenticated. Please{' '}
          <button
            onClick={() => navigate('/login')}
            className="underline text-red-700 hover:text-red-800"
          >
            log in
          </button>{' '}
          to access your learning path.
        </div>
      </div>
    );
  }

  const { learningPath, loading, error } = useLearningPath(user.id, token);
  const courses = learningPath.courses || [];

  const handleEnroll = () => {
    navigate('/settings?tab=subscriptions');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8 lg:py-10">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">
            Your Learning Path{' '}
            <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-xl ml-2">
              {courses.length} COURSES
            </span>
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Loading your learning path...</div>
        ) : courses.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              You don’t have an active learning plan
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Subscribe to any of our online mentorship plans to get access to all courses and materials you need to reach your goal!
            </p>
            <button
              onClick={handleEnroll}
              className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-2xl transition-colors"
              style={{ borderBottomRightRadius: 0 }}
            >
              Enroll Now
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <div key={course.id} className="relative">
                <CourseCardComponent course={course} />
                {course.progressPercentage > 0 && (
                  <div className="absolute bottom-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    {course.progressPercentage}% Complete
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPlanContent;