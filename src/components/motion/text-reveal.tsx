"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const lineVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: EASE },
  },
};

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

/**
 * Wraps text in a clip-path mask and slides each line up from below.
 * Use the canonical <TextReveal> for headings; <TextRevealLine> for sub copy.
 */
export function TextReveal({
  children,
  className,
  as = "h1",
}: TextRevealProps) {
  const MotionTag = motion[as] as React.ComponentType<HTMLMotionProps<typeof as>>;
  return (
    <MotionTag
      className={className}
      style={{ overflow: "hidden", display: "inline-block", lineHeight: 0.9 }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
        <motion.span style={{ display: "inline-block" }} variants={lineVariants}>
          {children}
        </motion.span>
      </span>
    </MotionTag>
  );
}

export function TextRevealLine({
  children,
  className,
  delay = 0,
}: Omit<TextRevealProps, "as">) {
  return (
    <span
      className={className}
      style={{ display: "block", overflow: "hidden", lineHeight: "inherit" }}
    >
      <motion.span
        style={{ display: "inline-block" }}
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
