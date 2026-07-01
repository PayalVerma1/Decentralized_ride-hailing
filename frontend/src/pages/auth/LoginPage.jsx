import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Zap,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    error: authError,
    clearError,
    isAuthenticated,
    user,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState(location.state?.message || "");

  // Clear any previous auth errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardMap = {
        passenger: "/passenger",
        driver: "/driver",
        admin: "/admin",
      };
      navigate(dashboardMap[user.role] || "/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  /** Client-side validation */
  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle form submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      const dashboardMap = {
        passenger: "/passenger",
        driver: "/driver",
        admin: "/admin",
      };
      navigate(dashboardMap[data.user.role] || "/", { replace: true });
    } catch (err) {
      // Error is already set in auth context
    } finally {
      setLoading(false);
    }
  };

  /** Update form field and clear its error */
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (authError) clearError();
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left Panel – Visual */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg to-bg" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-text">
              Ride<span className="text-primary">Chain</span>
            </span>
          </Link>
          <h1 className="text-4xl font-display font-bold text-text mb-4 leading-tight">
            Welcome back
          </h1>
          <p className="text-muted text-lg max-w-sm leading-relaxed">
            Sign in to access your dashboard, book rides, and manage your
            account.
          </p>

          {/* Trust indicators */}
          <div className="mt-10 space-y-4">
            {[
              { label: "Blockchain verified transactions", icon: "🔗" },
              { label: "End-to-end encrypted data", icon: "🔒" },
              { label: "Trusted by 50,000+ riders", icon: "⭐" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md space-y-6"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden">
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-text">
                Ride<span className="text-primary">Chain</span>
              </span>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold text-text">
              Sign In
            </h2>
            <p className="text-sm text-muted mt-2">
              Don't have an account?{" "}
              <Link
                to="/register/passenger"
                className="text-primary hover:text-hover transition-colors font-medium"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Success message (e.g. after registration) */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-sm text-success"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth error */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
              autoComplete="email"
              required
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-text/80">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs text-primary hover:text-hover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  autoComplete="current-password"
                  required
                  className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-secondary/40 border text-text placeholder:text-muted/40 outline-none transition-all duration-200 focus:bg-secondary/60 focus:border-primary/40 focus:shadow-glow hover:bg-secondary/50 ${
                    errors.password ? "border-danger/40" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-secondary/50 accent-primary"
              />
              Remember me
            </label>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              iconRight={ArrowRight}
              size="lg"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted">
              <span className="bg-bg px-4">or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" fullWidth>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button variant="secondary" fullWidth>
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Apple
            </Button>
          </div>

          {/* Demo accounts */}
          <div className="glass rounded-xl p-4 space-y-2">
            <p className="text-xs font-medium text-muted mb-2">Demo Accounts</p>
            {[
              {
                role: "Passenger",
                email: "passenger@demo.com",
                pass: "demo1234",
              },
              { role: "Driver", email: "driver@demo.com", pass: "demo1234" },
              { role: "Admin", email: "admin@demo.com", pass: "demo1234" },
            ].map((demo) => (
              <button
                key={demo.role}
                type="button"
                onClick={() =>
                  setForm({ email: demo.email, password: demo.pass })
                }
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-secondary/30 transition-colors text-left"
              >
                <span className="text-muted">
                  <span className="text-text font-medium">{demo.role}</span> —{" "}
                  {demo.email}
                </span>
                <span className="text-muted/50 font-mono">{demo.pass}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
