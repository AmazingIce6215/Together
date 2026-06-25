"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Music, Timer, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/lib/store/ui-store";

const links = [
  { href: "/quiz", label: "Quiz", icon: Gamepad2 },
  { href: "/listen", label: "Listen", icon: Music },
  { href: "/focus", label: "Focus", icon: Timer },
];

export function MobileNav() {
  const pathname = usePathname();
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 rounded-t-[30px] border-t border-border bg-black p-4 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Navigation</span>
          <button
            onClick={() => setOpen(false)}
            className="rounded-[30px] p-1 text-zinc-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-[30px] px-3 py-3 text-sm transition-all duration-150",
                  isActive
                    ? "bg-primary text-text-primary font-medium"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
