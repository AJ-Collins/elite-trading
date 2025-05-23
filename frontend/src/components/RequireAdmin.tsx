import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RequireAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('auth_token');

  // If no user or token exists
  if (!user || !token || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // in seconds

    // If token is expired
    if (decoded.exp < currentTime) {
      // Clear localStorage and redirect
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.error('Invalid token:', err);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
