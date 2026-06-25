"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils/cn";

export function Topbar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <motion.header
      initial={false}
      animate={{ left: sidebarOpen ? 224 : 64 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}
      className="fixed right-0 top-0 z-30 flex h-14 items-center border-b border-border bg-zinc-950/40 backdrop-blur-xl"
    >
      <div className="flex w-full items-center justify-between px-4">
        <button
          onClick={toggleSidebar}
          className="hidden rounded-[30px] p-1.5 text-zinc-500 transition-all duration-300 hover:bg-zinc-900 hover:text-zinc-200 active:scale-95 md:block"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <button
          onClick={() => setMobileNavOpen(true)}
          className="rounded-[30px] p-1.5 text-zinc-500 transition-all duration-300 hover:bg-zinc-900 hover:text-zinc-200 active:scale-95 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-tertiary opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-tertiary" />
          </span>
          <span className="text-xs text-zinc-500">Online</span>
        </div>
      </div>
    </motion.header>
  );
}