import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Route protection wrapper.
 * Intercepts routing requests and redirects unauthenticated users back to the login screen
 * while preserving their target pathname in router navigation history.
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Suspend route rendering during initial session verification to prevent layout flashes
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if user is unauthenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child components
  return <Outlet />;
};

export default ProtectedRoute;
