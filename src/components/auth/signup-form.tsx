"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const displayName = form.get("displayName") as string;

    if (!email || !password) {
      setError("Email and password are required");
      setPending(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setPending(false);
      return;
    }

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split("@")[0] },
      },
    });

    if (authError) {
      setError(authError.message);
      setPending(false);
      return;
    }

    if (data.user?.identities?.length === 0) {
      setError("An account with this email already exists");
      setPending(false);
      return;
    }

    if (data.user) {
      const name = displayName || email.split("@")[0];
      await supabase.from("profiles").upsert(
        { id: data.user.id, display_name: name },
        { onConflict: "id" }
      );
    }

    if (data.session) {
      window.location.href = "/";
      return;
    }

    setSuccess(true);
    setPending(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="text-sm text-zinc-400">
          We&apos;ve sent you a confirmation link. Click it to activate your account.
        </p>
        <a
          href="/login"
          className="mt-2 text-sm text-zinc-300 underline underline-offset-2 hover:text-zinc-100"
        >
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="displayName" className="text-xs font-medium text-zinc-400">
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          placeholder="Your name"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium text-zinc-400">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-medium text-zinc-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="At least 6 characters"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Already have an account?{" "}
        <a href="/login" className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2">
          Sign in
        </a>
      </p>
    </form>
  );
}
