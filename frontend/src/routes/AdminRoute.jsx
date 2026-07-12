import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

/**
 * Admin role authorization routing filter.
 * Restricts views strictly to administrator roles. Redirects standard salesperson accounts
 * back to the dashboard with an access error notification.
 */
const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if user session is not found
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to base route if role lacks administrative permissions
  if (user.role !== "admin") {
    // Fire dynamic toast notification to warn about privilege mismatch
    toast.error("Access denied. Admin privileges required.", {
      id: "admin-route-denied", // Avoid multiple stacked toasts on redirect loop
    });
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
