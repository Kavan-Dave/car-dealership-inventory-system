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
            <Route index element={<DashboardPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="404" element={<NotFoundPage />} />
            {/* Fallback all unmatched routes to 404 handler */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
