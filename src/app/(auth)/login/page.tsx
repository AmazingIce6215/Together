import { signIn } from "@/actions/auth.actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <form action={signIn} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-[30px] bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium text-zinc-500">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-[30px] border border-border bg-zinc-900/50 px-4 py-2.5 text-sm text-foreground placeholder-zinc-600 outline-none transition-all duration-150 focus:border-zinc-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-medium text-zinc-500">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="rounded-[30px] border border-border bg-zinc-900/50 px-4 py-2.5 text-sm text-foreground placeholder-zinc-600 outline-none transition-all duration-150 focus:border-zinc-600"
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-[30px] bg-primary px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-150 hover:brightness-110"
      >
        Sign in
      </button>

      <p className="text-center text-xs text-zinc-600">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-primary hover:brightness-110 underline underline-offset-2">
          Create one
        </a>
      </p>
    </form>
  );
}
