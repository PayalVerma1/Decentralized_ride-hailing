import { motion } from "framer-motion";
import { Check, Car, Sparkles, Crown } from "lucide-react";
import Button from "../common/Button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Economy",
    icon: Car,
    price: "2.50",
    perKm: "1.20",
    description: "Affordable everyday rides",
    features: [
      "Standard vehicles",
      "Up to 4 passengers",
      "Basic insurance",
      "Standard support",
      "Blockchain verified",
    ],
    popular: false,
  },
  {
    name: "Comfort",
    icon: Sparkles,
    price: "3.50",
    perKm: "1.70",
    description: "Newer cars with extra comfort",
    features: [
      "Newer vehicle models",
      "Up to 4 passengers",
      "Premium insurance",
      "Priority support",
      "Blockchain verified",
      "Extra legroom",
    ],
    popular: true,
  },
  {
    name: "Premium",
    icon: Crown,
    price: "5.00",
    perKm: "2.50",
    description: "Luxury vehicles, top-rated drivers",
    features: [
      "Luxury vehicles",
      "Up to 4 passengers",
      "Full insurance coverage",
      "24/7 VIP support",
      "Blockchain verified",
      "Premium amenities",
      "Top-rated drivers only",
    ],
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mt-3 mb-4">
            Transparent{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-hover">
              pricing
            </span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            No hidden fees. No surge surprises. See exactly what you pay before
            every ride.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className={`glass rounded-3xl p-8 relative transition-all duration-300 ${
                plan.popular
                  ? "border-primary/30 shadow-glow scale-[1.02]"
                  : "hover:border-primary/20 hover:shadow-glow"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full gradient-primary text-xs font-bold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <plan.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-xl font-display font-bold text-text mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-muted mb-6">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-sm text-muted">$</span>
                <span className="text-4xl font-display font-bold text-text">
                  {plan.price}
                </span>
                <span className="text-sm text-muted ml-1">base fare</span>
              </div>

              <p className="text-xs text-muted mb-6">+ ${plan.perKm}/km</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <Check className="w-4 h-4 text-success shrink-0" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register/passenger">
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  fullWidth
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
