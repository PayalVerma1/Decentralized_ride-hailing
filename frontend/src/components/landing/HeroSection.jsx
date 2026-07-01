import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  MapPin,
  Star,
  Users,
  Car,
} from "lucide-react";
import Button from "../common/Button";

const floatingCards = [
  {
    icon: Shield,
    label: "Verified",
    sublabel: "On-Chain",
    color: "text-success",
    delay: 0.8,
  },
  {
    icon: Star,
    label: "4.9 Rating",
    sublabel: "12K reviews",
    color: "text-yellow-400",
    delay: 1.2,
  },
  {
    icon: Users,
    label: "50K+ Riders",
    sublabel: "Growing daily",
    color: "text-primary",
    delay: 1.6,
  },
];

export default function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated Background Orbs */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-[15%] w-[500px] h-[500px] bg-primary/4 rounded-full blur-[150px] animate-pulse-soft" />
        <div
          className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px]"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/[0.02] rounded-full blur-[180px]" />
      </motion.div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-glass-border text-sm text-muted"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              Powered by Blockchain Technology
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.08] tracking-tight text-balance"
            >
              The Future of{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-hover to-primary bg-[length:200%] animate-[gradient_3s_ease-in-out_infinite]">
                  Mobility
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: 1,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-1 left-0 h-[3px] bg-gradient-to-r from-primary to-hover rounded-full"
                />
              </span>{" "}
              is Here
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted max-w-lg leading-relaxed mx-auto lg:mx-0"
            >
              Secure. Fast. Decentralized. Book rides with confidence knowing
              every transaction is verified on the blockchain.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/register/passenger">
                <Button
                  size="lg"
                  iconRight={ArrowRight}
                  className="w-full sm:w-auto"
                >
                  Book a Ride
                </Button>
              </Link>
              <Link to="/register/driver">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Car}
                  className="w-full sm:w-auto"
                >
                  Become a Driver
                </Button>
              </Link>
            </motion.div>

            {/* Trust Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex items-center gap-6 justify-center lg:justify-start pt-4"
            >
              <div className="flex -space-x-2">
                {[
                  "bg-gradient-to-br from-primary to-hover",
                  "bg-gradient-to-br from-success to-emerald-400",
                  "bg-gradient-to-br from-yellow-400 to-orange-400",
                  "bg-gradient-to-br from-violet-500 to-purple-400",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${bg} border-2 border-bg flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  <span className="text-sm font-semibold text-text ml-1">
                    4.9
                  </span>
                </div>
                <p className="text-xs text-muted">from 12,000+ reviews</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Main Visual Card */}
            <div className="relative w-full max-w-md">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-xl" />

              {/* Map Card */}
              <div className="relative glass rounded-3xl p-5 shadow-card">
                {/* Map area */}
                <div className="w-full h-64 rounded-2xl bg-secondary/40 relative overflow-hidden">
                  {/* Grid lines */}
                  <div className="absolute inset-0 opacity-[0.06]">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute w-full h-px bg-white"
                        style={{ top: `${(i + 1) * 12.5}%` }}
                      />
                    ))}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute h-full w-px bg-white"
                        style={{ left: `${(i + 1) * 16.66}%` }}
                      />
                    ))}
                  </div>

                  {/* Animated route line */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 256"
                  >
                    <motion.path
                      d="M60 200 Q 140 120 200 140 T 340 50"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="8,8"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                    />
                    {/* Route glow */}
                    <motion.path
                      d="M60 200 Q 140 120 200 140 T 340 50"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="8"
                      strokeLinecap="round"
                      opacity="0.15"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                    />
                  </svg>

                  {/* Pickup pin */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.4 }}
                    className="absolute bottom-10 left-12 flex flex-col items-center"
                  >
                    <div className="w-4 h-4 rounded-full bg-primary shadow-glow ring-4 ring-primary/20" />
                    <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      Pickup
                    </span>
                  </motion.div>

                  {/* Destination pin */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.4 }}
                    className="absolute top-6 right-12 flex flex-col items-center"
                  >
                    <span className="text-[10px] font-semibold text-success bg-success/10 px-2.5 py-1 rounded-lg backdrop-blur-sm mb-1">
                      Destination
                    </span>
                    <div className="w-px h-8 bg-gradient-to-b from-success/60 to-transparent" />
                    <MapPin className="w-5 h-5 text-success drop-shadow-lg" />
                  </motion.div>

                  {/* Moving car indicator */}
                  <motion.div
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{
                      delay: 1.2,
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                    }}
                    className="absolute w-3 h-3 rounded-full bg-white shadow-lg"
                    style={{
                      offsetPath: "path('M60 200 Q 140 120 200 140 T 340 50')",
                    }}
                  />
                </div>

                {/* Ride info bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                  className="mt-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <Car className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">Economy</p>
                      <p className="text-xs text-muted">3 min away</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-display font-bold text-text">
                      $12.50
                    </p>
                    <p className="text-[10px] text-success font-medium">
                      Blockchain verified ✓
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Floating Cards */}
              {floatingCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: card.delay,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="absolute glass rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-card animate-float"
                  style={{
                    top: i === 0 ? "8%" : i === 1 ? "-5%" : "72%",
                    right: i === 0 ? "-8%" : i === 1 ? "55%" : "-12%",
                    animationDelay: `${i * 2}s`,
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${card.color === "text-success" ? "bg-success/10" : card.color === "text-yellow-400" ? "bg-yellow-400/10" : "bg-primary/10"} flex items-center justify-center`}
                  >
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text">
                      {card.label}
                    </p>
                    <p className="text-[10px] text-muted">{card.sublabel}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </section>
  );
}
