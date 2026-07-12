import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import toast from "react-hot-toast";

// Create context for state consumption
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login verification on application mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("car_dealership_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Contact profile endpoint to confirm token hasn't expired/revoked
        const profile = await authService.getProfile();
        const savedEmail = localStorage.getItem("car_dealership_user_email") || "";
        
        setUser({
          userId: profile.userId,
          role: profile.role,
          email: savedEmail,
        });
      } catch (error) {
        console.error("Session verification failed:", error);
        // Clean stale token keys
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  /**
   * Triggers login operation and stores session state.
   */
  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      
      // Load current profile claims immediately post-login
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
    } finally {
      setLoading(false);
    }
  };

  /**
   * Triggers user registration.
   */
  const registerUser = async (name, email, password) => {
    try {
      setLoading(true);
      const data = await authService.register(name, email, password);
      toast.success(data.message || "Account registered successfully! Please login.");
      return true;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed.";
      toast.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
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
        loading,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
