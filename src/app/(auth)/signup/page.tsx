import { signUp } from "@/actions/auth.actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
        <p className="text-sm text-zinc-500">
          We&apos;ve sent you a confirmation link. Click it to activate your account.
        </p>
        <a
          href="/login"
          className="mt-2 text-sm text-primary underline underline-offset-2 hover:brightness-110"
        >
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <form action={signUp} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-[30px] bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="displayName" className="text-xs font-medium text-zinc-500">
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          placeholder="Your name"
          className="rounded-[30px] border border-border bg-zinc-900/50 px-4 py-2.5 text-sm text-foreground placeholder-zinc-600 outline-none transition-all duration-150 focus:border-zinc-600"
        />
      </div>

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
          minLength={6}
          placeholder="At least 6 characters"
          className="rounded-[30px] border border-border bg-zinc-900/50 px-4 py-2.5 text-sm text-foreground placeholder-zinc-600 outline-none transition-all duration-150 focus:border-zinc-600"
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-[30px] bg-primary px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-150 hover:brightness-110"
      >
        Create account
      </button>

      <p className="text-center text-xs text-zinc-600">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:brightness-110 underline underline-offset-2">
          Sign in
        </a>
      </p>
    </form>
  );
}
