import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Zap,
  LayoutDashboard,
  MapPin,
  History,
  Wallet,
  Gift,
  Bell,
  User,
  Car,
  DollarSign,
  FileText,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth.jsx";

/** Navigation config per role */
const navConfig = {
  passenger: {
    label: "Passenger",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, to: "/passenger" },
      { name: "Book Ride", icon: MapPin, to: "/passenger/book" },
      { name: "Ride History", icon: History, to: "/passenger/history" },
      { name: "Wallet", icon: Wallet, to: "/passenger/wallet" },
      { name: "Rewards", icon: Gift, to: "/passenger/rewards" },
      { name: "Notifications", icon: Bell, to: "/passenger/notifications" },
      { name: "Profile", icon: User, to: "/passenger/profile" },
    ],
  },
  driver: {
    label: "Driver",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, to: "/driver" },
      { name: "My Rides", icon: Car, to: "/driver/rides" },
      { name: "Earnings", icon: DollarSign, to: "/driver/earnings" },
      { name: "Documents", icon: FileText, to: "/driver/documents" },
      { name: "Notifications", icon: Bell, to: "/driver/notifications" },
      { name: "Profile", icon: User, to: "/driver/profile" },
    ],
  },
  admin: {
    label: "Admin",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, to: "/admin" },
      { name: "Users", icon: Users, to: "/admin/users" },
      { name: "Drivers", icon: Car, to: "/admin/drivers" },
      { name: "Rides", icon: MapPin, to: "/admin/rides" },
      { name: "Analytics", icon: BarChart3, to: "/admin/analytics" },
      { name: "Notifications", icon: Bell, to: "/admin/notifications" },
    ],
  },
};

export default function Sidebar({
  role = "passenger",
  mobileOpen,
  setMobileOpen,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const config = navConfig[role] || navConfig.passenger;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-50 h-full
          flex flex-col
          bg-card/95 backdrop-blur-xl lg:bg-card lg:backdrop-blur-none
          border-r border-border
          transition-[width] duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center h-16 px-4 border-b border-border shrink-0 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <Link to={`/${role}`} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold text-text">
                Ride<span className="text-primary">Chain</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Link
              to={`/${role}`}
              className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center"
            >
              <Zap className="w-4 h-4 text-white" />
            </Link>
          )}

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => {
              if (mobileOpen) setMobileOpen(false);
              else setCollapsed(!collapsed);
            }}
            className="hidden lg:flex p-1.5 rounded-lg text-muted hover:text-text hover:bg-secondary/50 transition-all"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-muted hover:text-text hover:bg-secondary/50 transition-all"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className="px-4 py-3 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              {config.label} Panel
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-thin">
          {config.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${role}`}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-text hover:bg-secondary/50"
                } ${collapsed ? "justify-center" : ""}`
              }
              title={collapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div className="px-3 py-4 border-t border-border space-y-2 shrink-0">
          {/* Mini user card */}
          {!collapsed && user && (
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-secondary/30 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-hover flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-muted truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
