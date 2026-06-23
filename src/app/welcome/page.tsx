export default function WelcomePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <main className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-zinc-100" />
          <h1 className="text-2xl font-semibold tracking-tight">Together</h1>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-zinc-400">
          A private space for two.
        </p>
        <div className="flex gap-3">
          <a
            href="/login"
            className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
          >
            Create account
          </a>
        </div>
      </main>
    </div>
  );
}
