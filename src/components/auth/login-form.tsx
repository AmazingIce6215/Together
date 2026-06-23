"use client";

import { useActionState } from "react";
import { signIn } from "@/actions/auth.actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

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
          placeholder="••••••••"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2">
          Create one
        </a>
      </p>
    </form>
  );
}
