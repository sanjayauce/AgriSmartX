import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is empty, allow all authenticated users
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(user.role)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 