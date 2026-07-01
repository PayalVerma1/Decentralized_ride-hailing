import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth.jsx";
import LoadingScreen from "../common/LoadingScreen";

/**
 * ProtectedRoute – Guards routes based on authentication and role.
 *
 * Props:
 *   children    – The component to render
 *   roles       – Array of allowed roles (optional, defaults to any authenticated user)
 *   redirectTo  – Where to redirect if not authenticated (default: /login)
 */
export default function ProtectedRoute({
  children,
  roles = [],
  redirectTo = "/login",
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return <LoadingScreen visible />;
  }

  // Not authenticated → redirect to login with return path
  if (!isAuthenticated) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  // Authenticated but wrong role → redirect to their own dashboard
  if (roles.length > 0 && !roles.includes(user.role)) {
    const dashboardMap = {
      passenger: "/passenger",
      driver: "/driver",
      admin: "/admin",
    };
    return <Navigate to={dashboardMap[user.role] || "/"} replace />;
  }

  return children;
}
