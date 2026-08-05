import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
