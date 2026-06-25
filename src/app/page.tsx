import { Gamepad2, Music, Timer, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCouple } from "@/actions/couple.actions";
import { CreateRoomForm } from "@/components/quiz/create-room-form";
import { JoinRoomForm } from "@/components/quiz/join-room-form";
import { getCurrentUserId } from "@/lib/supabase/server";
import { TextReveal, TextRevealLine } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";

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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div
            className="animate-fade-down rounded-full border border-border bg-zinc-950/60 px-5 py-2 backdrop-blur-md"
            style={{ animationDelay: "0ms" }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              A space for two
            </span>
          </div>

          <TextReveal
            as="h1"
            className="text-[clamp(3.5rem,12vw,96px)] font-semibold leading-[0.9] tracking-[-0.05em] text-foreground"
          >
            Together
          </TextReveal>

          <p className="max-w-md text-sm leading-relaxed text-zinc-500 animate-fade-up [animation-delay:600ms]">
            <TextRevealLine delay={0.6}>
              Quiz each other. Share music. Focus side by side.
            </TextRevealLine>
            <TextRevealLine delay={0.75}>
              <br />
              A private space for couples, wherever you are.
            </TextRevealLine>
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 animate-fade-up [animation-delay:900ms]">
          <Magnetic strength={0.4}>
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-[30px] bg-primary px-8 py-3.5 text-sm font-medium text-text-primary transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(255,230,108,0.6)]"
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">
                Sign in
              </span>
              <span className="absolute inset-y-0 right-4 flex items-center text-base opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                →
              </span>
            </Link>
          </Magnetic>
          <Magnetic strength={0.4}>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-[30px] border border-zinc-800 px-8 py-3.5 text-sm font-medium text-zinc-400 transition-all duration-300 hover:border-zinc-500 hover:text-zinc-200"
            >
              Create account
            </Link>
          </Magnetic>
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
      <div className="flex flex-col items-center justify-center gap-12 px-6 py-20">
        {error && (
          <div
            className="w-full max-w-sm animate-fade-down rounded-[30px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400"
          >
            {error}
          </div>
        )}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-medium tracking-widest uppercase text-primary animate-fade-down">
            Get started
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground animate-fade-up">
            Welcome, {profile?.display_name || "there"}
          </h1>
          <p className="text-sm text-zinc-500 animate-fade-up [animation-delay:120ms]">
            Create a room or join your partner&apos;s
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-8">
          <div
            className="gradient-border-static shadow-elevated animate-fade-up [animation-delay:200ms]"
          >
            <div className="gradient-border-surface rounded-[29px] p-6">
              <CreateRoomForm />
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:300ms]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-zinc-600">or</span>
            </div>
          </div>

          <div
            className="gradient-border-static shadow-elevated animate-fade-up [animation-delay:380ms]"
          >
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
      <div className="flex flex-col gap-1.5 animate-fade-up">
        <span className="text-xs font-medium tracking-widest uppercase text-primary">
          Dashboard
        </span>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Hey, {profile?.display_name || "there"}
          </h1>
          <code className="hidden shrink-0 rounded-[30px] border border-border bg-zinc-900/50 px-3 py-1.5 text-xs font-mono text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300 sm:block">
            {couple.invite_code}
          </code>
        </div>
        <p className="text-sm text-zinc-500">
          What would you like to do together today?
        </p>
      </div>

      {/* ── Together features ────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-3">
        {togetherFeatures.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="gradient-border-static shadow-elevated group animate-fade-up [animation-fill-mode:both]"
              style={{ animationDelay: `${150 + i * 80}ms` }}
            >
              <div className="gradient-border-surface relative flex flex-col overflow-hidden rounded-[29px] p-6 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                {/* Hover sweep */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 translate-x-[-110%] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[110%]"
                />
                <div className="relative flex items-start justify-between">
                  <span className="text-[64px] font-semibold leading-[0.8] tracking-[-0.04em] text-zinc-800 transition-colors duration-500 group-hover:text-zinc-700">
                    {feature.number}
                  </span>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[20deg] group-hover:scale-110">
                    <Icon className="h-5 w-5 text-text-primary" />
                  </div>
                </div>
                <div className="relative mt-2 flex flex-col gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {feature.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:gap-2">
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
      <div
        className="gradient-border-static shadow-elevated animate-fade-up [animation-delay:500ms] [animation-fill-mode:both]"
      >
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
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-tertiary opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-tertiary" />
                </span>
                {partner ? "Online" : "Waiting for partner..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}