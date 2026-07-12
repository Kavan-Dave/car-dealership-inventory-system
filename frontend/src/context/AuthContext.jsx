import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import toast from "react-hot-toast";

// Create context for state consumption
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * `initializing` is true ONLY during the startup session-verification phase.
   * It is separate from form-level loading states (loginUser/registerUser) to
   * avoid triggering the fullscreen route-guard spinner during normal form submissions.
   */
  const [initializing, setInitializing] = useState(true);

  // Auto-login verification on application mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("car_dealership_token");
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        // Contact profile endpoint to confirm token hasn't expired or been revoked
        const profile = await authService.getProfile();
        const savedEmail = localStorage.getItem("car_dealership_user_email") || "";

        setUser({
          userId: profile.userId,
          role: profile.role,
          email: savedEmail,
        });
      } catch (error) {
        console.error("Session verification failed:", error);
        // Clean stale token keys silently — user will be redirected to login by ProtectedRoute
        authService.logout();
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    verifySession();
  }, []);

  /**
   * Triggers login operation and stores session state.
   * Does not toggle `initializing`; form components manage their own submit loaders.
   */
  const loginUser = async (email, password) => {
    try {
      const data = await authService.login(email, password);

      // Fetch profile claims immediately post-login to confirm role
      const profile = await authService.getProfile();
      setUser({
        userId: profile.userId,
        role: profile.role,
        email: email,
      });
      toast.success(data.message || "Logged in successfully!");
      return true;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Login failed. Please check credentials.";
      toast.error(errMsg);
      throw error;
    }
  };

  /**
   * Triggers user registration.
   * Does not toggle `initializing`; form components manage their own submit loaders.
   */
  const registerUser = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      toast.success(data.message || "Account registered successfully! Please login.");
      return true;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed.";
      toast.error(errMsg);
      throw error;
    }
  };

  /**
   * Terminates active session.
   */
  const logoutUser = () => {
    authService.logout();
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        // Expose `loading` as an alias so existing consumers (ProtectedRoute, AdminRoute) work unchanged
        loading: initializing,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
