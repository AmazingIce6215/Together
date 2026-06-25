"use client";

import { PageTransition } from "@/components/motion/page-transition";
import { type ReactNode } from "react";

/**
 * Client-side wrapper that swaps layout with PageTransition.
 * Root layout is a Server Component, so this thin client shell
 * is what actually animates route changes.
 */
export function LayoutMotion({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}