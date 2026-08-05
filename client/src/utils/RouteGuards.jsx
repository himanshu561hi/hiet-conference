import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const ProtectedRoute = ({ isAllowed, redirectPath = ROUTES.AUTH.LOGIN, children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

export const PublicRoute = ({ isAuthenticated, redirectPath = ROUTES.DASHBOARD.OVERVIEW, children }) => {
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

export const RoleRoute = ({ isAllowedRole, redirectPath = ROUTES.PUBLIC.HOME, children }) => {
  if (!isAllowedRole) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};
