import { forwardRef } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Button – Premium reusable button component.
 *
 * Variants: primary, secondary, ghost, danger, success
 * Sizes:    sm, md, lg
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    icon: Icon,
    iconRight: IconRight,
    fullWidth = false,
    className = "",
    ...props
  },
  ref,
) {
  const variants = {
    primary:
      "gradient-primary hover:gradient-primary-hover text-white shadow-glow hover:shadow-glow-lg",
    secondary:
      "bg-secondary hover:bg-secondary/80 text-text border border-border hover:border-border/80",
    ghost: "bg-transparent hover:bg-secondary/50 text-muted hover:text-text",
    danger:
      "bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 hover:border-danger/30",
    success:
      "bg-success/10 hover:bg-success/20 text-success border border-success/20 hover:border-success/30",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-xl
        transition-all duration-200 cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {!loading && Icon && (
        <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      )}
      {children}
      {IconRight && !loading && (
        <IconRight className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      )}
    </motion.button>
  );
});

export default Button;
