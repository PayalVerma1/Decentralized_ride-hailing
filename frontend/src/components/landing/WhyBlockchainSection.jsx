import { motion } from "framer-motion";
import { Link2, Shield, Eye, Lock, Database, Fingerprint } from "lucide-react";

const benefits = [
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "Every ride, payment, and rating is permanently recorded on the blockchain — no hidden manipulation.",
  },
  {
    icon: Lock,
    title: "Tamper-Proof Records",
    description:
      "Once data is written to the blockchain, it cannot be altered or deleted by anyone.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Smart contract-based payments ensure drivers are paid fairly and passengers are protected.",
  },
  {
    icon: Database,
    title: "Decentralized Data",
    description:
      "No single entity controls your data. Your ride history belongs to you.",
  },
  {
    icon: Fingerprint,
    title: "Verified Identity",
    description:
      "Blockchain-based identity verification ensures every driver and passenger is authentic.",
  },
  {
    icon: Link2,
    title: "Interoperable",
    description:
      "Your reputation and ride history can be used across multiple mobility platforms.",
  },
];

export default function WhyBlockchainSection() {
  return (
    <section id="why-blockchain" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">
              Why Blockchain
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mt-3 mb-6">
              Trust built on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hover">
                technology
              </span>
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-8">
              Traditional ride-hailing platforms are centralized black boxes.
              RideChain uses blockchain to create a transparent, fair, and
              secure ecosystem for everyone.
            </p>

            {/* Visual */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-muted">Ride recorded on chain</span>
                <span className="text-success ml-auto font-mono text-xs">
                  0x7a9f...3b2e
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-muted">Payment verified</span>
                <span className="text-success ml-auto font-mono text-xs">
                  Confirmed
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
                <span className="text-muted">Driver rating stored</span>
                <span className="text-primary ml-auto font-mono text-xs">
                  Pending...
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-5 group hover:shadow-glow hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-text mb-1">
                  {benefit.title}
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
