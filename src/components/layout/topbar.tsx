"use client";

import { Menu } from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils/cn";

export function Topbar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-14 items-center border-b border-zinc-800/50 bg-black/50 backdrop-blur-xl transition-all duration-300",
        sidebarOpen ? "left-56" : "left-16"
      )}
    >
      <div className="flex w-full items-center justify-between px-4">
        <button
          onClick={toggleSidebar}
          className="hidden rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-300 md:block"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <button
          onClick={() => setMobileNavOpen(true)}
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-300 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-zinc-500">Online</span>
        </div>
      </div>
    </header>
  );
}
