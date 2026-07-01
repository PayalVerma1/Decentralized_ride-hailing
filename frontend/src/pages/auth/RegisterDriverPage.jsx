import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Car,
  FileText,
  Zap,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth.jsx";

export default function RegisterDriverPage() {
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    licenseExpiry: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleType: "economy",
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.licenseNumber.trim()) e.licenseNumber = "Required";
    if (!form.licenseExpiry) e.licenseExpiry = "Required";
    if (!form.vehicleMake.trim()) e.vehicleMake = "Required";
    if (!form.vehicleModel.trim()) e.vehicleModel = "Required";
    if (!form.vehicleYear.trim()) e.vehicleYear = "Required";
    if (!form.vehicleColor.trim()) e.vehicleColor = "Required";
    if (!form.vehiclePlate.trim()) e.vehiclePlate = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }
    if (!validateStep2()) return;

    setLoading(true);
    try {
      await register("driver", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        licenseNumber: form.licenseNumber.trim(),
        licenseExpiry: form.licenseExpiry,
        vehicleMake: form.vehicleMake.trim(),
        vehicleModel: form.vehicleModel.trim(),
        vehicleYear: form.vehicleYear,
        vehicleColor: form.vehicleColor.trim(),
        vehiclePlate: form.vehiclePlate.trim(),
        vehicleType: form.vehicleType,
      });
      navigate("/driver", { replace: true });
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

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg to-bg" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-primary/8 rounded-full blur-[100px]" />
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
            Drive with RideChain
          </h1>
          <p className="text-muted text-lg max-w-sm leading-relaxed">
            Earn on your schedule with transparent, blockchain-verified
            payments.
          </p>
          <div className="mt-10 space-y-3">
            {[
              "Flexible hours",
              "Instant payments",
              "Transparent earnings",
              "Blockchain verified",
              "Keep 85% of fare",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-5"
        >
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
              {step === 1 ? "Personal Information" : "Vehicle Details"}
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
              className="flex-1 py-2.5 text-sm font-medium text-center rounded-lg text-muted hover:text-text transition-colors"
            >
              Passenger
            </Link>
            <Link
              to="/register/driver"
              className="flex-1 py-2.5 text-sm font-medium text-center rounded-lg gradient-primary text-white shadow-sm"
            >
              Driver
            </Link>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3">
            {[1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (s < step) setStep(s);
                }}
                className={`flex items-center gap-2 flex-1 ${s <= step ? "cursor-pointer" : "cursor-default"}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    s < step
                      ? "bg-success text-bg"
                      : s === step
                        ? "bg-primary text-white"
                        : "bg-secondary text-muted"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                <div
                  className={`flex-1 h-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-secondary"}`}
                />
              </button>
            ))}
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
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="First Name"
                      icon={User}
                      placeholder="John"
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      error={errors.firstName}
                      required
                    />
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      error={errors.lastName}
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
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    icon={Lock}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    error={errors.password}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    icon={Lock}
                    placeholder="Repeat"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
                    error={errors.confirmPassword}
                    required
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3.5"
                >
                  <Input
                    label="License Number"
                    icon={FileText}
                    placeholder="DL-XXXX-XXXX"
                    value={form.licenseNumber}
                    onChange={(e) =>
                      updateField("licenseNumber", e.target.value)
                    }
                    error={errors.licenseNumber}
                    required
                  />
                  <Input
                    label="License Expiry"
                    type="date"
                    value={form.licenseExpiry}
                    onChange={(e) =>
                      updateField("licenseExpiry", e.target.value)
                    }
                    error={errors.licenseExpiry}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Vehicle Make"
                      icon={Car}
                      placeholder="Toyota"
                      value={form.vehicleMake}
                      onChange={(e) =>
                        updateField("vehicleMake", e.target.value)
                      }
                      error={errors.vehicleMake}
                      required
                    />
                    <Input
                      label="Vehicle Model"
                      placeholder="Camry"
                      value={form.vehicleModel}
                      onChange={(e) =>
                        updateField("vehicleModel", e.target.value)
                      }
                      error={errors.vehicleModel}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Year"
                      placeholder="2023"
                      value={form.vehicleYear}
                      onChange={(e) =>
                        updateField("vehicleYear", e.target.value)
                      }
                      error={errors.vehicleYear}
                      required
                    />
                    <Input
                      label="Color"
                      placeholder="Black"
                      value={form.vehicleColor}
                      onChange={(e) =>
                        updateField("vehicleColor", e.target.value)
                      }
                      error={errors.vehicleColor}
                      required
                    />
                  </div>
                  <Input
                    label="License Plate"
                    placeholder="ABC 1234"
                    value={form.vehiclePlate}
                    onChange={(e) =>
                      updateField("vehiclePlate", e.target.value)
                    }
                    error={errors.vehiclePlate}
                    required
                  />

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text/80">
                      Vehicle Type
                    </label>
                    <select
                      value={form.vehicleType}
                      onChange={(e) =>
                        updateField("vehicleType", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl text-sm bg-secondary/40 border border-border text-text outline-none focus:border-primary/40 focus:shadow-glow"
                    >
                      <option value="economy">Economy</option>
                      <option value="comfort">Comfort</option>
                      <option value="premium">Premium</option>
                      <option value="xl">XL</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <Button
                  type="button"
                  variant="secondary"
                  icon={ArrowLeft}
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                fullWidth
                loading={loading}
                iconRight={step === 2 ? ArrowRight : undefined}
                size="lg"
              >
                {step === 1 ? "Next: Vehicle Details" : "Create Driver Account"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
