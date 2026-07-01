import api from "./api";

const authService = {
  /** Register a new passenger */
  registerPassenger: (data) => api.post("/auth/register/passenger", data),

  /** Register a new driver */
  registerDriver: (data) => api.post("/auth/register/driver", data),

  /** Login (email + password) */
  login: (credentials) => api.post("/auth/login", credentials),

  /** Logout current session */
  logout: () => api.post("/auth/logout"),

  /** Refresh JWT token */
  refreshToken: () => api.post("/auth/refresh-token"),

  /** Get current authenticated user */
  getMe: () => api.get("/auth/me"),

  /** Update password */
  updatePassword: (data) => api.put("/auth/password", data),

  /** Request password reset */
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  /** Reset password with token */
  resetPassword: (token, password) =>
    api.put(`/auth/reset-password/${token}`, { password }),
};

export default authService;
