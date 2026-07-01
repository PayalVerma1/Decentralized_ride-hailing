import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Zap } from "lucide-react";
import Button from "../../components/common/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-text">
            Ride<span className="text-primary">Chain</span>
          </span>
        </Link>

        <h1 className="text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-hover mb-4">
          404
        </h1>
        <h2 className="text-2xl font-display font-bold text-text mb-4">
          Page Not Found
        </h2>
        <p className="text-muted text-lg max-w-md mx-auto mb-8">
          Looks like you've taken a wrong turn. The page you're looking for
          doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button icon={Home}>Go Home</Button>
          </Link>
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
