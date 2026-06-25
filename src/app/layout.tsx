import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
      <body className="min-h-dvh bg-background text-foreground">
        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-6">
          <header className="flex h-16 items-center justify-between border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                <span className="text-xs font-bold text-text-primary">T</span>
              </div>
              <span className="text-sm font-semibold tracking-tight">Together</span>
            </Link>
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-[30px] px-3.5 py-1.5 text-sm text-zinc-500 transition-all duration-150 hover:text-zinc-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-4 text-center text-xs text-zinc-600">
            Together &mdash; A private space for two
          </footer>
        </div>
      </body>
    </html>
  );
}
