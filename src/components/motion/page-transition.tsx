"use client";

import { motion, type Variants, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const variants: Variants = {
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(6px)",
    transition: { duration: 0.35, ease: EASE },
  },
};

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps route content in an exit/enter transition keyed on pathname.
 * The actual motion happens on the child div so layout shifts don't fight with it.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ willChange: "transform, opacity, filter" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
