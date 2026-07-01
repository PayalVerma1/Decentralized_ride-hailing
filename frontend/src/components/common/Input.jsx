import { forwardRef, useState, useId } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Input – Premium form input component.
 * Supports password toggle, icons, error states, and floating label option.
 */
const Input = forwardRef(function Input(
  {
    label,
    type = "text",
    icon: Icon,
    error,
    helperText,
    className = "",
    containerClass = "",
    ...props
  },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const id = useId();
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`space-y-1.5 ${containerClass}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text/80">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
              focused ? "text-primary" : "text-muted"
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={inputType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 rounded-xl text-sm
            bg-secondary/40 border
            text-text placeholder:text-muted/40
            outline-none transition-all duration-200
            focus:bg-secondary/60 focus:border-primary/40 focus:shadow-glow
            hover:bg-secondary/50 hover:border-border/80
            ${Icon ? "pl-10" : ""}
            ${isPassword ? "pr-10" : ""}
            ${error ? "border-danger/40 focus:border-danger focus:shadow-none" : "border-border"}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors p-0.5"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <p
          className={`text-xs flex items-center gap-1 ${error ? "text-danger" : "text-muted"}`}
        >
          {error && <AlertCircle className="w-3 h-3 shrink-0" />}
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
