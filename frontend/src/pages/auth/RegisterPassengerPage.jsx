import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Zap,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth.jsx";

export default function RegisterPassengerPage() {
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!agreed) e.agreed = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register("passenger", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      navigate("/passenger", { replace: true });
    } catch {
      // Error handled by auth context
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (authError) clearError();
  };

  const passwordStrength = (pw) => {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "bg-danger" };
    if (score <= 2) return { level: 2, label: "Fair", color: "bg-yellow-400" };
    if (score <= 3) return { level: 3, label: "Good", color: "bg-hover" };
    return { level: 4, label: "Strong", color: "bg-success" };
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-bg to-bg" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-success/8 rounded-full blur-[100px]" />
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
            Start your journey
          </h1>
          <p className="text-muted text-lg max-w-sm leading-relaxed">
            Create your account and experience secure, blockchain-verified rides
            in minutes.
          </p>
          <div className="mt-10 space-y-3">
            {[
              "Free to join",
              "Earn reward points",
              "Blockchain verified rides",
              "Secure payments",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-muted">{item}</span>
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
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-5"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
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
              Create Account
            </h2>
            <p className="text-sm text-muted mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-hover transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary/50">
            <Link
              to="/register/passenger"
              className="flex-1 py-2.5 text-sm font-medium text-center rounded-lg gradient-primary text-white shadow-sm"
            >
              Passenger
            </Link>
            <Link
              to="/register/driver"
              className="flex-1 py-2.5 text-sm font-medium text-center rounded-lg text-muted hover:text-text transition-colors"
            >
              Driver
            </Link>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                icon={User}
                placeholder="John"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                error={errors.firstName}
                autoComplete="given-name"
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                error={errors.lastName}
                autoComplete="family-name"
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
              autoComplete="email"
              required
            />
            <Input
              label="Phone"
              type="tel"
              icon={Phone}
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              error={errors.phone}
              autoComplete="tel"
              required
            />
            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="Min 8 characters"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                error={errors.password}
                autoComplete="new-password"
                required
              />
              {/* Password strength indicator */}
              {form.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength.level ? strength.color : "bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-[10px] font-medium ${
                      strength.level <= 1
                        ? "text-danger"
                        : strength.level <= 2
                          ? "text-yellow-400"
                          : strength.level <= 3
                            ? "text-hover"
                            : "text-success"
                    }`}
                  >
                    {strength.label}
                  </p>
                </div>
              )}
            </div>
            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
              required
            />

            <label className="flex items-start gap-2 text-xs text-muted cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded border-border bg-secondary/50 accent-primary"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (errors.agreed)
                    setErrors((prev) => ({ ...prev, agreed: "" }));
                }}
              />
              <span>
                I agree to RideChain's{" "}
                <Link to="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreed && (
              <p className="text-xs text-danger flex items-center gap-1 -mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.agreed}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              iconRight={ArrowRight}
              size="lg"
            >
              Create Account
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
