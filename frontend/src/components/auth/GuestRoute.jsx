import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.jsx";
import LoadingScreen from "../common/LoadingScreen";

/**
 * GuestRoute – Redirects authenticated users away from login/register pages.
 * If already logged in, sends them to their dashboard.
 */
export default function GuestRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen visible />;
  }

  if (isAuthenticated && user) {
    const dashboardMap = {
      passenger: "/passenger",
      driver: "/driver",
      admin: "/admin",
    };
    return <Navigate to={dashboardMap[user.role] || "/"} replace />;
  }

  return children;
}
