import React from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCardComponent from './CourseCardComponent';
import { useArchiveCourses } from '../hooks/useArchiveCourses';
import { useAuth } from '../context/useAuth'; // Import the auth context

const Archive = ({setActiveTab}) => {
  const navigate = useNavigate();
  const { user, token } = useAuth(); // Get user and token from auth context
  
  // Use the hook with user and token
  const { courses, loading, error } = useArchiveCourses(user?.id || null, token);

  // If user is not authenticated, show login prompt
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
          to access your archived courses.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8 lg:py-10">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">
            Archived courses{' '}
            <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-xl ml-2">
              {courses.length} COURSES
            </span>
          </h2>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}
        
        {/* Course Grid */}
        {loading ? (
          <div className="text-center text-gray-600">Loading archived courses...</div>
        ) : courses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCardComponent key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              You don't have any archived courses
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Courses that you've completed or chosen to archive will appear here.
            </p>
            <button
              onClick={() => setActiveTab('learning-path')}
              className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-2xl transition-colors"
              style={{ borderBottomRightRadius: 0 }}
            >
              Go to Learning Path
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;