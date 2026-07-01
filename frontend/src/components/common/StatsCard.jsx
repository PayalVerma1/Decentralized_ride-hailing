import { motion } from "framer-motion";

/**
 * StatsCard – Dashboard metric card with icon, label, value, and change indicator.
 */
export default function StatsCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = "neutral", // 'up' | 'down' | 'neutral'
  className = "",
}) {
  const changeColors = {
    up: "text-success bg-success/10",
    down: "text-danger bg-danger/10",
    neutral: "text-muted bg-secondary/50",
  };

  const changeArrows = {
    up: "↑",
    down: "↓",
    neutral: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-2xl p-5 group hover:shadow-glow hover:border-primary/15 transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${changeColors[changeType]}`}
          >
            {changeArrows[changeType]} {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-text tracking-tight">
        {value}
      </p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </motion.div>
  );
}
