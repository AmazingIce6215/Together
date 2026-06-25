"use client";

import { useState } from "react";
import { joinCouple } from "@/actions/couple.actions";

export function JoinRoomForm() {
  const [code, setCode] = useState("");

  return (
    <form action={joinCouple} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="inviteCode"
          className="text-sm font-medium text-zinc-400"
        >
          Invite code
        </label>
        <input
          id="inviteCode"
          name="inviteCode"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="TOG-XXXX"
          className="rounded-[30px] border border-border bg-zinc-900/50 px-4 py-2.5 text-center text-lg font-mono tracking-widest text-foreground placeholder-zinc-600 outline-none transition-all duration-150 focus:border-zinc-600"
        />
      </div>

      <button
        type="submit"
        disabled={code.length < 8}
        className="rounded-[30px] bg-primary px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-150 hover:brightness-110 disabled:opacity-50"
      >
        Join room
      </button>
    </form>
  );
}
