import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Daily Commuter",
    avatar: "SC",
    rating: 5,
    text: "RideChain completely changed my daily commute. The blockchain verification gives me peace of mind knowing every ride is transparent and secure.",
  },
  {
    name: "Marcus Johnson",
    role: "Driver Partner",
    avatar: "MJ",
    rating: 5,
    text: "As a driver, the instant payments and transparent earnings are incredible. I can verify every transaction on the blockchain. No more payment disputes.",
  },
  {
    name: "Priya Sharma",
    role: "Business Traveler",
    avatar: "PS",
    rating: 5,
    text: "The premium vehicles and verified drivers make RideChain my go-to for business travel. The rewards program is an excellent bonus.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mt-3 mb-4">
            Loved by riders{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hover">
              everywhere
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 relative group hover:shadow-glow hover:border-primary/20 transition-all duration-300"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/10" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted text-sm leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-hover flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
