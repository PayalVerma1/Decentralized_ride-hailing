import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

/**
 * LoadingScreen – Full-screen branded loading overlay.
 * Used for initial app load and auth state resolution.
 */
export default function LoadingScreen({ visible = true }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center"
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-6"
          >
            {/* Logo */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-2xl border-2 border-primary/20 border-t-primary"
              />
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-glow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Brand name */}
            <div className="text-center">
              <h1 className="text-xl font-display font-bold text-text">
                Ride<span className="text-primary">Chain</span>
              </h1>
              <p className="text-xs text-muted mt-1">
                Loading your experience...
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
