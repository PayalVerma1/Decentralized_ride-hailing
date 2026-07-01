import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  { value: 50000, suffix: "+", label: "Active Riders" },
  { value: 10000, suffix: "+", label: "Verified Drivers" },
  { value: 2500000, suffix: "+", label: "Rides Completed" },
  { value: 4.9, suffix: "★", label: "Average Rating", decimals: 1 },
];

function AnimatedNumber({ value, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const end = value;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = 1 - Math.pow(2, -10 * progress);
      setDisplay(end * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.floor(display).toLocaleString();

  return (
    <span
      ref={ref}
      className="text-4xl sm:text-5xl font-display font-bold text-text tabular-nums"
    >
      {formatted}
      <span className="text-primary">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Background accent */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/3 rounded-full blur-[80px]" />

          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                />
                <p className="text-sm text-muted mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
