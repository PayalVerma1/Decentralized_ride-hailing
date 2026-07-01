import axios from "axios";

/**
 * Axios instance configured for the RideChain backend API.
 * Base URL comes from env or defaults to /api (proxied by Vite in dev).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ridechain_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ridechain_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
