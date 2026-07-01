import { motion } from "framer-motion";

/**
 * Card – Glass-morphism card component.
 *
 * Props:
 *   hover     – Enable hover lift + glow
 *   padding   – Tailwind padding class
 *   animate   – Enable entry animation
 *   className – Additional classes
 */
export default function Card({
  children,
  hover = false,
  padding = "p-5 md:p-6",
  animate = false,
  delay = 0,
  className = "",
  onClick,
  ...props
}) {
  const Wrapper = animate || hover ? motion.div : "div";

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
      }
    : {};

  const hoverProps = hover
    ? {
        whileHover: { y: -3, scale: 1.005 },
        transition: { duration: 0.2, ease: "easeOut" },
      }
    : {};

  return (
    <Wrapper
      onClick={onClick}
      className={`
        glass rounded-2xl ${padding}
        ${hover ? "cursor-pointer hover:shadow-glow hover:border-primary/15" : ""}
        transition-all duration-300
        ${className}
      `}
      {...animationProps}
      {...hoverProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
}
