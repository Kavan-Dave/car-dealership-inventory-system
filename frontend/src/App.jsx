import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global Notification Toast Container */}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "bg-white text-slate-800 border border-slate-100 shadow-lg rounded-xl text-sm font-medium",
            duration: 4000,
            success: {
              iconTheme: {
                primary: "#3b82f6",
                secondary: "#ffffff",
              },
            },
          }}
        />

        <Routes>
          {/* Core Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            {/* Public authentication routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            
            {/* Protected dashboard and vehicle operations (Salespersons & Admins) */}
            <Route element={<ProtectedRoute />}>
              <Route index element={<DashboardPage />} />
              
              {/* Restricted Admin control center */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboardPage />} />
              </Route>
            </Route>

            {/* Error fallback routes */}
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
