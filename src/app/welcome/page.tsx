import Link from "next/link";
import { TextReveal, TextRevealLine } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";

export default function WelcomePage() {
  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center">
      <main className="flex w-full max-w-6xl flex-col items-center gap-16">
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
            className="text-[clamp(4rem,15vw,128px)] font-semibold leading-[0.9] tracking-[-0.05em] text-foreground"
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
      </main>
    </div>
  );
}