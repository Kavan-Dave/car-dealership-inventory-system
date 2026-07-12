import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Car, Shield, LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";

const MainLayout = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close drawer whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navLinkBase = "px-3 py-2 rounded-lg text-sm font-medium transition-all";
  const navLinkActive = "bg-slate-800 text-blue-400";
  const navLinkInactive = "text-slate-300 hover:bg-slate-800 hover:text-white";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* ── Top Navigation Bar ─────────────────────────────────────── */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-white hover:text-blue-400 transition-all"
            >
              <Car className="w-6 h-6 text-blue-500" />
              <span>Apex<span className="text-blue-500">Motors</span></span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {user && (
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
                  }
                >
                  Dashboard
                </NavLink>
              )}

              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `${navLinkBase} flex items-center gap-1.5 ${isActive ? navLinkActive : navLinkInactive}`
                  }
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </NavLink>
              )}
            </div>

            {/* Desktop User / Auth Controls */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Avatar + email */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs uppercase shrink-0">
                      {user.email ? user.email.substring(0, 2) : "US"}
                    </div>
                    <div className="hidden lg:flex flex-col">
                      <span
                        className="text-xs font-semibold text-slate-100 max-w-[140px] truncate leading-tight"
                        title={user.email}
                      >
                        {user.email}
                      </span>
                      <span className="text-[10px] text-blue-400 font-semibold capitalize leading-tight">
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
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 animate-fade-in">
            <div className="max-w-[1600px] w-full mx-auto px-4 py-4 space-y-1">
              {user && (
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `block ${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
                  }
                >
                  Dashboard
                </NavLink>
              )}

              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
                  }
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </NavLink>
              )}

              {/* Divider */}
              <div className="border-t border-slate-800 my-2" />

              {user ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs uppercase shrink-0">
                      {user.email ? user.email.substring(0, 2) : "US"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-100 truncate" title={user.email}>
                        {user.email}
                      </span>
                      <span className="text-[10px] text-blue-400 font-semibold capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-500 border-t border-slate-800 py-5 text-center text-xs">
        <div className="max-w-[1600px] w-full mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <Car className="w-4 h-4 text-blue-500" />
              <span>ApexMotors</span>
            </div>
            <p>© {new Date().getFullYear()} Apex Motors Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
