import { useCourses } from '../hooks/useCourses';
import CourseCardComponent from './CourseCardComponent';
import { useNavigate } from 'react-router-dom';

const FreeCourses = () => {
  const { courses, loading, error } = useCourses();
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate('/settings?tab=subscriptions');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8 lg:py-10">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">
            All Free Courses{' '}
            <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-xl ml-2">{courses.length} COURSES</span>
          </h2>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        {/* When there are no courses */}
        {loading ? (
          <div className="text-center text-gray-600">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              You don’t have an active learning plan
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Subscribe to any of our online mentorship plans to get access to all courses and materials you need to get to your goal!
            </p>
            <button
              onClick={handleEnroll}
              style={{
                borderBottomRightRadius: 0,
              }}
              className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-2xl transition-colors"
            >
              Enroll now
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCardComponent key={course.id} course={{ ...course, progressPercentage: 0 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeCourses;
