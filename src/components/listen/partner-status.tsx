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
    <div className="gradient-border">
      <div className="gradient-border-surface rounded-[29px] p-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 ${
              isPlaying ? "bg-primary/20 text-primary" : "bg-zinc-900 text-zinc-500"
            }`}
          >
            <Headphones className="h-4 w-4" />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{partnerName}</span>
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
    </div>
  );
}
