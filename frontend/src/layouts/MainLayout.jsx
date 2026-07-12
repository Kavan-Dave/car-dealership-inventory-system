import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Car, Shield, User, LogOut, LogIn, UserPlus } from "lucide-react";

const MainLayout = () => {
  // Temporary auth state for layout demonstration and UI layout verification
  const user = null; 
  const handleLogout = () => {
    console.log("Logout triggered");
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
            </div>

            {/* User profile / Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
                    <User className="w-4 h-4" />
                    <span>{user.name || "User"}</span>
                    <span className="bg-blue-900/50 text-blue-300 border border-blue-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
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
