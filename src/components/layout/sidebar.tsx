"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-dvh flex-col border-r border-zinc-800/50 bg-black transition-all duration-300",
        sidebarOpen ? "w-56" : "w-16"
      )}
    >
      <div className="flex h-14 items-center gap-3 border-b border-zinc-800/50 px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
          <Heart className="h-3.5 w-3.5 text-black" />
        </div>
        {sidebarOpen && (
          <span className="text-sm font-semibold tracking-tight">Together</span>
        )}
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-zinc-100 text-black"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800/50 p-2">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {sidebarOpen && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
