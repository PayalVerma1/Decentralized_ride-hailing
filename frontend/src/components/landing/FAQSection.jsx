import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does blockchain verify my rides?",
    a: "Every ride completed on RideChain is automatically recorded on the blockchain. This creates an immutable record of the trip details, fare, and payment — ensuring complete transparency for both riders and drivers.",
  },
  {
    q: "Is my payment information secure?",
    a: "Absolutely. We use industry-standard encryption for all payment data. Blockchain verification adds an extra layer of security by creating a tamper-proof record of every transaction.",
  },
  {
    q: "How do I become a driver?",
    a: "Simply click \"Become a Driver\" and complete the registration process. You'll need a valid driver's license, vehicle registration, and insurance. Once approved, you can start accepting rides immediately.",
  },
  {
    q: "What payment methods are accepted?",
    a: "RideChain accepts credit/debit cards, digital wallets, and in-app wallet payments. You can also pay with cryptocurrency through our blockchain integration (coming soon).",
  },
  {
    q: "How are drivers rated?",
    a: "After each ride, both riders and drivers can rate each other from 1-5 stars. These ratings are stored on the blockchain for transparency and help maintain service quality.",
  },
  {
    q: "What happens if I need to cancel a ride?",
    a: "You can cancel a ride at any time before the driver arrives. Cancellations within 2 minutes of booking are free. After that, a small cancellation fee may apply to compensate the driver.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text mt-3 mb-4">
            Frequently asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hover">
              questions
            </span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/20 transition-colors"
              >
                <span className="text-sm font-medium text-text pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-muted leading-relaxed border-t border-border pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
