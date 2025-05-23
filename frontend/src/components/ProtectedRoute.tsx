import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  
  // Check if the token exists and is not expired
  const isAuthenticated = token && !isTokenExpired(token); // Check if token is expired using a helper function

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  // If the user is authenticated, render the protected route
  return children;
};

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // JWT expiration time is in seconds
    return Date.now() > expirationTime;
  } catch (e) {
    return true;
  }
};

export default ProtectedRoute;
