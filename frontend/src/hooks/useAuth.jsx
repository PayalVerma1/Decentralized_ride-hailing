import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import authService from "../services/authService";

/**
 * AuthContext – provides auth state and methods throughout the app.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Load user from token on mount */
  useEffect(() => {
    const token = localStorage.getItem("ridechain_token");
    if (token) {
      authService
        .getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem("ridechain_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /** Login */
  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const res = await authService.login(credentials);
      localStorage.setItem("ridechain_token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      throw new Error(message);
    }
  }, []);

  /** Register (passenger or driver) */
  const register = useCallback(async (role, data) => {
    setError(null);
    try {
      const fn =
        role === "driver"
          ? authService.registerDriver
          : authService.registerPassenger;
      const res = await fn(data);
      localStorage.setItem("ridechain_token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      throw new Error(message);
    }
  }, []);

  /** Logout */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem("ridechain_token");
    setUser(null);
  }, []);

  /** Update local user state (after profile edit, etc.) */
  const updateUser = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  /** Clear error */
  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        clearError,
        isAuthenticated: !!user,
        isPassenger: user?.role === "passenger",
        isDriver: user?.role === "driver",
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
