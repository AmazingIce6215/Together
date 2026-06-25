import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ParticleField } from "@/components/effects/particle-field";
import { GrainOverlay } from "@/components/effects/grain-overlay";
import { LayoutMotion } from "@/components/layout/layout-motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Together — A space for two",
  description:
    "A private online space for long-distance couples to spend quality time together.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/quiz", label: "Quiz" },
  { href: "/listen", label: "Listen" },
  { href: "/focus", label: "Focus" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Full-bleed ambient layers (z-0, z-1) — sit behind everything */}
        <ParticleField />
        <GrainOverlay />

        {/* Subtle vignette to anchor content above the bg */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-6">
          <header className="flex h-16 items-center justify-between border-b border-border backdrop-blur-sm">
            <Link href="/" className="group flex items-center gap-2">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[20deg]">
                <span className="text-xs font-bold text-text-primary">T</span>
              </div>
              <span className="text-sm font-semibold tracking-tight">
                Together
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative rounded-[30px] px-3.5 py-1.5 text-sm text-zinc-500 transition-colors duration-300 hover:text-zinc-200"
                >
                  {link.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-px h-px scale-x-0 bg-primary opacity-0 transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </nav>
          </header>

          <main className="flex-1">
            <LayoutMotion>{children}</LayoutMotion>
          </main>

          <footer className="border-t border-border py-4 text-center text-xs text-zinc-600">
            Together &mdash; A private space for two
          </footer>
        </div>
      </body>
    </html>
  );
}