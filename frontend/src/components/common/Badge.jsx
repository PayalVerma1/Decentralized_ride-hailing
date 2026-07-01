/**
 * Badge – Status / label badge with optional dot indicator.
 *
 * Variants: default, primary, success, danger, warning
 * Sizes:    xs, sm, md
 */
export default function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
}) {
  const variants = {
    default: "bg-secondary/60 text-muted border border-border/50",
    primary: "bg-primary/10 text-primary border border-primary/20",
    success: "bg-success/10 text-success border border-success/20",
    danger: "bg-danger/10 text-danger border border-danger/20",
    warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  };

  const dotColors = {
    default: "bg-muted",
    primary: "bg-primary",
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-yellow-400",
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-lg
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
