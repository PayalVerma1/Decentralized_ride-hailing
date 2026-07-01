import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Navigation, CheckCircle2, Smile } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Choose Pickup",
    description:
      "Enter your pickup location or use GPS to auto-detect your current position.",
    color: "text-primary",
    bg: "bg-primary/10",
    dot: "bg-primary",
  },
  {
    number: "02",
    icon: Navigation,
    title: "Choose Destination",
    description:
      "Search and select your destination. See fare estimates instantly.",
    color: "text-hover",
    bg: "bg-hover/10",
    dot: "bg-hover",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Confirm Ride",
    description:
      "Review your ride details, choose your vehicle type, and confirm booking.",
    color: "text-success",
    bg: "bg-success/10",
    dot: "bg-success",
  },
  {
    number: "04",
    icon: Smile,
    title: "Enjoy Ride",
    description:
      "Track your driver in real-time, enjoy the ride, and pay seamlessly.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    dot: "bg-yellow-400",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="how-it-works" className="py-24 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 uppercase tracking-widest mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mt-3 mb-4">
            Four simple steps to your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hover">
              destination
            </span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Getting a ride has never been easier. Here's how RideChain works.
          </p>
        </motion.div>

        {/* Steps with timeline */}
        <div className="relative" ref={ref}>
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%]">
            <div className="h-px bg-border relative">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 bg-gradient-to-r from-primary via-hover to-success origin-left"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.2 + index * 0.15,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative text-center group"
              >
                {/* Step Circle */}
                <div className="relative mx-auto mb-6">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className={`w-20 h-20 rounded-2xl ${step.bg} flex items-center justify-center mx-auto transition-all duration-300 group-hover:shadow-glow relative z-10`}
                  >
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </motion.div>
                  {/* Number badge */}
                  <div
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-lg ${step.dot} flex items-center justify-center text-xs font-bold text-bg shadow-lg z-20`}
                  >
                    {step.number}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-text mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
