"use client";

import { useState } from "react";
import { createCouple } from "@/actions/couple.actions";
import { Copy, Check } from "lucide-react";

export function CreateRoomForm() {
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const result = await createCouple();
      setInviteCode(result.invite_code);
    } catch {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (inviteCode) {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (inviteCode) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
          <Check className="h-6 w-6 text-emerald-400" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Room created!</h2>
          <p className="text-sm text-zinc-400">
            Share this code with your partner:
          </p>
        </div>
        <div className="flex items-center gap-2">
          <code className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-lg font-mono tracking-widest text-zinc-100">
            {inviteCode}
          </code>
          <button
            onClick={copyCode}
            className="rounded-xl border border-zinc-700 p-3 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          Waiting for your partner to join...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <button
        onClick={handleCreate}
        disabled={loading}
        className="rounded-xl bg-zinc-100 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create a room"}
      </button>
      <p className="text-xs text-zinc-500">
        You'll get an invite code to share with your partner
      </p>
    </div>
  );
}
