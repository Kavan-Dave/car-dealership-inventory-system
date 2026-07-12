import axios from "axios";

// Create a globally reusable Axios instance with predefined backend configurations
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to dynamically inject authorization JWT token if present in client storage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("car_dealership_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
