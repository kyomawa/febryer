"use client";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";

export function InViewParagraph({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-justify text-base md:text-lg"
    >
      {children}
    </motion.div>
  );
}
