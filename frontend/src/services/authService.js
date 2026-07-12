import axiosInstance from "../api/axiosInstance";

/**
 * Service handlers for User authentication operations.
 * Communicates directly with /api/auth routes.
 */
export const authService = {
  /**
   * Registers a new user account.
   * @param {string} name - Display name
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {Promise<object>} Response message
   */
  register: async (name, email, password) => {
    const response = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Log in user and save JWT token.
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {Promise<object>} Object containing token and message
   */
  login: async (email, password) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    const { token } = response.data;
    if (token) {
      localStorage.setItem("car_dealership_token", token);
      
      // Attempt to store the email to display a friendly identifier in the header,
      // since the profile API only returns the decoded JWT payload (userId & role).
      localStorage.setItem("car_dealership_user_email", email);
    }
    return response.data;
  },

  /**
   * Fetches profile session info (verifies token integrity).
   * @returns {Promise<object>} User payload containing userId and role
   */
  getProfile: async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response.data.user;
  },

  /**
   * Terminate user session and clear storage keys.
   */
  logout: () => {
    localStorage.removeItem("car_dealership_token");
    localStorage.removeItem("car_dealership_user_email");
  },
};

export default authService;
