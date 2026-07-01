import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Car } from "lucide-react";
import Button from "../common/Button";

export default function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative glass rounded-3xl p-12 sm:p-16 text-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mb-4">
              Ready to ride the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hover">
                future
              </span>
              ?
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto mb-8">
              Join thousands of riders and drivers who trust RideChain for
              secure, transparent, and decentralized mobility.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register/passenger">
                <Button size="lg" iconRight={ArrowRight}>
                  Get Started Free
                </Button>
              </Link>
              <Link to="/register/driver">
                <Button variant="secondary" size="lg" icon={Car}>
                  Drive & Earn
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
