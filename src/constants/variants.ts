import { Variants } from "framer-motion";

// ===================================================================================================

export const hoverAnimation = {
  whileHover: { scale: 1.1 },
  transition: { type: "spring", stiffness: 400, damping: 10 },
  whileTap: { scale: 0.9 },
};

// ===================================================================================================

export const updateScrollStateHeaderVariants: Variants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: "-4rem" },
};

// ===================================================================================================

export const updateScrollStateSidebarsVariants: Variants = {
  visible: { y: 0 },
  hidden: { y: "-4rem" },
};
