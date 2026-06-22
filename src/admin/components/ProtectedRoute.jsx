import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

/**
 * Wraps admin routes — redirects to /admin/login if not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { admin } = useAdminAuth();
  const location = useLocation();

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
