import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  Zap,
  MapPin,
  Link2,
  DollarSign,
  Gift,
  Star,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Every transaction is encrypted and verified on the blockchain for maximum security.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "group-hover:border-primary/20",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description:
      "Book your ride in seconds with our intelligent matching algorithm.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "group-hover:border-yellow-400/20",
  },
  {
    icon: MapPin,
    title: "Live Ride Tracking",
    description:
      "Track your driver in real-time with precise GPS location updates.",
    color: "text-success",
    bg: "bg-success/10",
    border: "group-hover:border-success/20",
  },
  {
    icon: Link2,
    title: "Blockchain Verification",
    description:
      "Every ride is recorded on the blockchain ensuring complete transparency.",
    color: "text-hover",
    bg: "bg-hover/10",
    border: "group-hover:border-hover/20",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description:
      "No hidden fees. See the exact fare breakdown before you ride.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "group-hover:border-emerald-400/20",
  },
  {
    icon: Gift,
    title: "Rewards Program",
    description:
      "Earn points on every ride. Redeem for discounts and exclusive perks.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "group-hover:border-pink-400/20",
  },
  {
    icon: Star,
    title: "Driver Ratings",
    description:
      "Rate your driver and view verified reviews from other riders.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "group-hover:border-amber-400/20",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Our support team is always available to help with any issues.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "group-hover:border-violet-400/20",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24 relative" ref={sectionRef}>
      {/* Section divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

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
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mt-3 mb-4 text-balance">
            Everything you need for a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hover">
              premium ride
            </span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Built with cutting-edge technology and blockchain verification for
            the safest, most transparent ride-hailing experience.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`glass rounded-2xl p-6 group hover:shadow-glow ${feature.border} transition-all duration-300 cursor-default`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-base font-semibold text-text mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
