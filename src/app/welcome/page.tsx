import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <main className="flex w-full max-w-6xl flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="gradient-border shadow-elevated">
            <div className="gradient-border-surface flex items-center justify-center rounded-[29px] px-5 py-2">
              <span className="text-xs font-medium tracking-widest uppercase text-primary">
                A space for two
              </span>
            </div>
          </div>

          <h1 className="text-[clamp(4rem,15vw,128px)] font-semibold leading-[0.9] tracking-[-0.05em] text-foreground">
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
      </main>
    </div>
  );
}
