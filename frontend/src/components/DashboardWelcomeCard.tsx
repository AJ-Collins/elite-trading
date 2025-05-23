import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ProgressBox = ({ title, subtitle, borderRight }) => {
  return (
    <div className={`px-3 md:px-4 lg:px-6 py-2 ${borderRight ? 'border-r border-green-300' : ''}`}>
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold">{title}</h3>
      <p className="text-[10px] md:text-xs lg:text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

const DashboardWelcomeCard = () => {
  const [userData, setUserData] = useState(null);
   const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState({
    totalCourses: 0,
    completedCourses: 0,
    progressPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() /1000;
      return decoded.exp < currentTime;
  
    } catch (error) {
      console.log('Token decode failed');
      return true;
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user?.id || !token) {
        setLoading(false);
        return;
      }

      if(isTokenExpired(token)) {
        console.log('Token expired. Logging out.');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      setUserData(user);
      
      try {        
        // Fetch learning path with course progress
        const learningPathRes = await fetch(``, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!learningPathRes.ok) {
          throw new Error('Failed to fetch learning path');
        }
        
        const learningPathData = await learningPathRes.json();
        
        if (learningPathData.data && learningPathData.data.length > 0) {
          const learningPath = learningPathData.data[0];
          const allCourses = learningPath.attributes.courses.data || [];
          const courseProgress = learningPath.attributes.CourseProgress || [];
          
          // Calculate total progress
          const totalCourses = allCourses.length;
          const completedCourses = courseProgress.filter(cp => cp.progressPercentage === 100).length;
          
          // Calculate overall progress percentage
          const overallProgress = totalCourses > 0 
            ? courseProgress.reduce((sum, cp) => sum + cp.progressPercentage, 0) / totalCourses 
            : 0;
          
          setCoursesData({
            totalCourses,
            completedCourses,
            progressPercentage: parseFloat(overallProgress.toFixed(2))
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
          <span className="text-green-500">Hello</span> {userData?.username || ''}
        </h1>
      )}
      <p className="text-gray-600 mb-4 md:mb-6">Let's continue your journey to Fx trading mastery</p>
      <hr className="border-t border-green-400 mb-4 md:mb-6" />
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="w-full lg:w-1/2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3 md:mb-4">CURRENT PROGRESS</h2>
          <div className="flex flex-wrap">
            <ProgressBox
              title={loading ? "..." : `${coursesData.progressPercentage}%`}
              subtitle="Completed"
              borderRight={true}
            />
            <ProgressBox
              title={loading ? "..." : coursesData.completedCourses}
              subtitle="Courses watched"
              borderRight={true}
            />
            <ProgressBox
              title={loading ? "..." : coursesData.totalCourses - coursesData.completedCourses}
              subtitle="Courses to go"
              borderRight={false}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <Link to="/settings" className="block">
            <div className="bg-gray-900 rounded-lg p-4 text-white cursor-pointer hover:bg-gray-800 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <BarChart3 size={16} />
                  </div>
                  <h4 className="font-bold">
                    Upgrade to <span className="text-white">premium!</span>
                  </h4>
                </div>
                <ArrowRight size={20} className="text-green-400" />
              </div>
              <p className="text-xs text-gray-300">
                Choose a plan you prefer and get access to all courses
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcomeCard;