"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Heart,
  Gamepad2,
  Music,
  Timer,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/lib/store/ui-store";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "Quiz", href: "/quiz", icon: Gamepad2 },
  { label: "Listen Together", href: "/listen", icon: Music },
  { label: "Focus Together", href: "/focus", icon: Timer },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 224 : 64 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}
      className="fixed left-0 top-0 z-40 flex h-dvh flex-col overflow-hidden border-r border-border bg-zinc-950/40 backdrop-blur-xl"
    >
      <div className="flex h-14 items-center gap-3 border-b border-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
          <Heart className="h-3.5 w-3.5 text-text-primary" />
        </div>
        <motion.span
          initial={false}
          animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap text-sm font-semibold tracking-tight text-foreground"
        >
          Together
        </motion.span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-[30px] px-3 py-2 text-sm transition-colors duration-300",
                isActive
                  ? "text-text-primary"
                  : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-[30px] bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 h-4 w-4 shrink-0 transition-transform duration-300",
                  isActive && "scale-110"
                )}
              />
              <motion.span
                initial={false}
                animate={{
                  opacity: sidebarOpen ? 1 : 0,
                  x: sidebarOpen ? 0 : -8,
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative z-10 whitespace-nowrap",
                  isActive && "font-medium"
                )}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={handleSignOut}
          className="relative flex w-full items-center gap-3 rounded-[30px] px-3 py-2 text-sm text-zinc-600 transition-colors duration-300 hover:bg-zinc-900 hover:text-zinc-400"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <motion.span
            initial={false}
            animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-nowrap"
          >
            Sign out
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
}