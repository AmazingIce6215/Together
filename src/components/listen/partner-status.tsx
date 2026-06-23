"use client";

import { Headphones } from "lucide-react";
import type { AmbientSound } from "@/lib/types/app";

interface PartnerStatusProps {
  partnerName: string;
  currentAmbient: AmbientSound | null;
  status: string;
}

export function PartnerStatus({
  partnerName,
  currentAmbient,
  status,
}: PartnerStatusProps) {
  const isPlaying = status === "playing";
  const isPaused = status === "paused";

  return (
    <div className="rounded-2xl border border-zinc-800/50 p-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            isPlaying ? "bg-violet-500/20 text-violet-400" : "bg-zinc-800 text-zinc-500"
          }`}
        >
          <Headphones className="h-4 w-4" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{partnerName}</span>
          </div>
          <span className="text-xs text-zinc-500">
            {isPlaying && currentAmbient
              ? `Listening to ${currentAmbient.name}`
              : isPaused && currentAmbient
              ? `Paused — ${currentAmbient.name}`
              : "Idle"}
          </span>
        </div>
      </div>
    </div>
  );
}
