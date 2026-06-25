import { Gamepad2, Music, Timer, Play, BookOpen, PenLine, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCouple } from "@/actions/couple.actions";
import { CreateRoomForm } from "@/components/quiz/create-room-form";
import { JoinRoomForm } from "@/components/quiz/join-room-form";
import { getCurrentUserId } from "@/lib/supabase/server";

const togetherFeatures = [
  {
    number: "01",
    title: "Quiz Together",
    description: "Play games, answer questions, discover each other",
    href: "/quiz",
    icon: Gamepad2,
  },
  {
    number: "02",
    title: "Listen Together",
    description: "Share music and ambient sounds in real time",
    href: "/listen",
    icon: Music,
  },
  {
    number: "03",
    title: "Focus Together",
    description: "Study together with a shared Pomodoro timer",
    href: "/focus",
    icon: Timer,
  },
];

const medResources = [
  {
    number: "01",
    title: "Watch",
    description: "Video lectures from top medical educators",
    href: "/watch",
    icon: Play,
    accent: "bg-primary",
    textAccent: "text-primary",
  },
  {
    number: "02",
    title: "Read",
    description: "Notes, textbooks, and radiology references",
    href: "/read",
    icon: BookOpen,
    accent: "bg-secondary",
    textAccent: "text-secondary",
  },
  {
    number: "03",
    title: "Practice",
    description: "Question banks and exam prep resources",
    href: "/practice",
    icon: PenLine,
    accent: "bg-tertiary",
    textAccent: "text-tertiary",
  },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center gap-12 py-20">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="gradient-border shadow-elevated">
            <div className="gradient-border-surface flex items-center justify-center rounded-[29px] px-5 py-2">
              <span className="text-xs font-medium tracking-widest uppercase text-primary">
                A space for two
              </span>
            </div>
          </div>

          <h1 className="text-[clamp(3.5rem,12vw,96px)] font-semibold leading-[0.9] tracking-[-0.05em] text-foreground">
            Together
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-zinc-500">
            Quiz each other. Share music. Focus side by side.
            <br />
            A private space for couples, wherever you are.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-[30px] bg-primary px-8 py-3.5 text-sm font-medium text-text-primary transition-all hover:brightness-110"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-[30px] border border-zinc-800 px-8 py-3.5 text-sm font-medium text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-300"
          >
            Create account
          </Link>
        </div>

        <div className="w-full max-w-4xl">
          <div className="mb-6 flex flex-col gap-1.5 text-center">
            <span className="text-xs font-medium tracking-widest uppercase text-zinc-600">
              Also explore
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Medical Study Resources
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {medResources.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={pillar.href}
                  href={pillar.href}
                  className="gradient-border shadow-elevated group transition-all duration-150 hover:brightness-110"
                >
                  <div className="gradient-border-surface flex flex-col rounded-[29px] p-6">
                    <div className="flex items-start justify-between">
                      <span className="text-[64px] font-semibold leading-[0.8] tracking-[-0.04em] text-zinc-800">
                        {pillar.number}
                      </span>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${pillar.accent} transition-transform duration-150 group-hover:scale-110`}>
                        <Icon className="h-5 w-5 text-text-primary" />
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col gap-2">
                      <h2 className={`text-lg font-semibold tracking-tight ${pillar.textAccent}`}>
                        {pillar.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-zinc-500">
                        {pillar.description}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-150 group-hover:gap-1.5">
                        Explore resources
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const { error } = await searchParams;

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const couple = await getCurrentCouple();

  if (!couple) {
    return (
      <div className="flex flex-col items-center justify-center gap-12 p-6 pt-20">
        {error && (
          <div className="w-full max-w-sm rounded-[30px] bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">
            {error}
          </div>
        )}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-medium tracking-widest uppercase text-primary">
            Get started
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Welcome, {profile?.display_name || "there"}
          </h1>
          <p className="text-sm text-zinc-500">
            Create a room or join your partner&apos;s
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="gradient-border shadow-elevated">
            <div className="gradient-border-surface rounded-[29px] p-6">
              <CreateRoomForm />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-zinc-600">or</span>
            </div>
          </div>

          <div className="gradient-border shadow-elevated">
            <div className="gradient-border-surface rounded-[29px] p-6">
              <h2 className="mb-4 text-center text-sm font-medium text-zinc-300">
                Join existing room
              </h2>
              <JoinRoomForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const partner = couple.members.find(
    (m: { id: string }) => m.id !== userId
  );

  return (
    <div className="flex flex-col gap-12 py-10">
      {/* ── Section header ───────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-widest uppercase text-primary">
          Dashboard
        </span>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Hey, {profile?.display_name || "there"}
          </h1>
          <code className="hidden shrink-0 rounded-[30px] border border-border bg-zinc-900/50 px-3 py-1.5 text-xs font-mono text-zinc-500 sm:block">
            {couple.invite_code}
          </code>
        </div>
        <p className="text-sm text-zinc-500">
          What would you like to do together today?
        </p>
      </div>

      {/* ── Together features ────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-3">
        {togetherFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="gradient-border shadow-elevated group transition-all duration-150 hover:brightness-110"
            >
              <div className="gradient-border-surface flex flex-col rounded-[29px] p-6">
                <div className="flex items-start justify-between">
                  <span className="text-[64px] font-semibold leading-[0.8] tracking-[-0.04em] text-zinc-800">
                    {feature.number}
                  </span>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary transition-transform duration-150 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-text-primary" />
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {feature.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-150 group-hover:gap-1.5">
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Partner status ────────────────────────────── */}
      <div className="gradient-border shadow-elevated">
        <div className="gradient-border-surface rounded-[29px] p-5">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-900 text-sm font-medium text-zinc-300">
                {profile?.display_name?.[0]?.toUpperCase() || "U"}
              </div>
              {partner && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-900 text-sm font-medium text-zinc-300">
                  {partner.display_name?.[0]?.toUpperCase() || "P"}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500">
                {partner
                  ? partner.display_name || "Your partner"
                  : "Your partner"}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                {partner ? "Online" : "Waiting for partner..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MedResources section ──────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium tracking-widest uppercase text-zinc-600">
            Medical Study Resources
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Three ways to make an impact
          </h2>
          <p className="text-sm text-zinc-500">
            Everything you need for medical school — video lectures, notes, textbooks, and question banks.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {medResources.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.href}
                href={pillar.href}
                className="gradient-border shadow-elevated group transition-all duration-150 hover:brightness-110"
              >
                <div className="gradient-border-surface flex flex-col rounded-[29px] p-6">
                  <div className="flex items-start justify-between">
                    <span className="text-[64px] font-semibold leading-[0.8] tracking-[-0.04em] text-zinc-800">
                      {pillar.number}
                    </span>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${pillar.accent} transition-transform duration-150 group-hover:scale-110`}>
                      <Icon className="h-5 w-5 text-text-primary" />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <h2 className={`text-lg font-semibold tracking-tight ${pillar.textAccent}`}>
                      {pillar.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-zinc-500">
                      {pillar.description}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-150 group-hover:gap-1.5">
                      Explore resources
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
