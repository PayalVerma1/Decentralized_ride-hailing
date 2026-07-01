import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth.jsx";

const roleLabels = {
  passenger: "Passenger",
  driver: "Driver",
  admin: "Administrator",
};

/** Generate breadcrumb from pathname */
function useBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    path: "/" + segments.slice(0, i + 1).join("/"),
  }));
}

export default function DashboardHeader({ role = "passenger", onMenuClick }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const breadcrumbs = useBreadcrumbs();
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 bg-card/60 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-muted hover:text-text hover:bg-secondary/50 transition-all"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm min-w-0">
          <Link
            to={`/${role}`}
            className="text-muted hover:text-text transition-colors truncate"
          >
            {roleLabels[role]}
          </Link>
          {breadcrumbs.slice(1).map((crumb, i) => (
            <span
              key={crumb.path}
              className="flex items-center gap-1.5 min-w-0"
            >
              <span className="text-muted/40">/</span>
              <span
                className={`${i === breadcrumbs.length - 2 ? "text-text font-medium" : "text-muted"} truncate`}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-4 hidden sm:block">
        <div
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-200 ${
            searchFocused
              ? "bg-secondary/70 border-primary/40 shadow-glow"
              : "bg-secondary/40 border-transparent hover:bg-secondary/50"
          }`}
        >
          <Search className="w-4 h-4 text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search rides, locations..."
            className="bg-transparent text-sm text-text placeholder:text-muted/50 outline-none w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden lg:inline-flex px-2 py-0.5 text-[10px] font-mono text-muted/50 bg-bg/50 rounded-md border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2" ref={menuRef}>
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserMenuOpen(false);
            }}
            className="relative p-2 rounded-xl text-muted hover:text-text hover:bg-secondary/50 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse-soft" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-2xl shadow-card border border-border overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <p className="text-sm font-semibold text-text">
                    Notifications
                  </p>
                  <button className="text-xs text-primary hover:text-hover transition-colors">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[
                    {
                      title: "Ride Completed",
                      desc: "Your ride to Airport was completed.",
                      time: "2h ago",
                    },
                    {
                      title: "Payment Received",
                      desc: "$24.50 has been credited.",
                      time: "3h ago",
                    },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer border-b border-border/50 last:border-0"
                    >
                      <p className="text-sm font-medium text-text">{n.title}</p>
                      <p className="text-xs text-muted mt-0.5">{n.desc}</p>
                      <p className="text-[10px] text-muted/60 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/${role}/notifications`}
                  className="block px-4 py-2.5 text-xs text-center text-primary hover:bg-secondary/20 transition-colors border-t border-border"
                  onClick={() => setNotifOpen(false)}
                >
                  View all notifications
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border hidden sm:block" />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-secondary/50 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-hover flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.firstName?.[0] || "R"}
              {user?.lastName?.[0] || ""}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-text leading-none">
                {user ? `${user.firstName}` : "User"}
              </p>
              <p className="text-[11px] text-muted mt-0.5">
                {roleLabels[role]}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted hidden sm:block transition-transform duration-200 ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-2xl shadow-card border border-border overflow-hidden z-50"
              >
                <div className="py-1">
                  {[
                    { label: "Your Profile", to: `/${role}/profile` },
                    { label: "Settings", to: `/${role}/profile` },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-muted hover:text-text hover:bg-secondary/30 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
