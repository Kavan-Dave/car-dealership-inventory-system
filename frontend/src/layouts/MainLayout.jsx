import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Car, Shield, User, LogOut, LogIn, UserPlus } from "lucide-react";

const MainLayout = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Dark header navigation bar */}
      <nav className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo area */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:text-blue-400 transition-all">
                <Car className="w-6 h-6 text-blue-500" />
                <span>Apex<span className="text-blue-500">Motors</span></span>
              </Link>
            </div>

            {/* Navigation links */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-blue-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                Dashboard
              </NavLink>
              
              {/* Only show Admin navigation tab if user has admin privileges */}
              {user && user.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                      isActive
                        ? "bg-slate-800 text-blue-400"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </NavLink>
              )}
            </div>

            {/* User profile / Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">
                      {user.email ? user.email.substring(0, 2) : "US"}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-100 max-w-[120px] truncate" title={user.email}>
                        {user.email || "Sales User"}
                      </span>
                      <span className="text-[10px] text-blue-400 font-medium capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm shadow-blue-900/20"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content viewport */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Modern minimal footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Apex Motors Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
