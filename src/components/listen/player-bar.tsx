"use client";

import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import type { AmbientSound } from "@/lib/types/app";

interface PlayerBarProps {
  currentAmbient: AmbientSound | null;
  status: "idle" | "playing" | "paused";
  progressMs: number;
  volume: number;
  isMuted: boolean;
  onPlay: () => void;
  onPause: () => void;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}

export function PlayerBar({
  currentAmbient,
  status,
  progressMs,
  volume,
  isMuted,
  onPlay,
  onPause,
  onVolumeChange,
  onToggleMute,
}: PlayerBarProps) {
  const minutes = Math.floor(progressMs / 60000);
  const seconds = Math.floor((progressMs % 60000) / 1000);

  if (!currentAmbient) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-zinc-800/50 p-12">
        <p className="text-sm text-zinc-500">
          Select a track to start listening together
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800/50 p-5">
      <div className="flex items-center gap-4">
        {/* Thumbnail placeholder */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
          <span className="text-lg">{currentAmbient.icon}</span>
        </div>

        {/* Track info */}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">
            {currentAmbient.name}
          </span>
          <span className="text-xs text-zinc-500">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>

        {/* Play/Pause */}
        <button
          onClick={status === "playing" ? onPause : onPlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-black transition-colors hover:bg-zinc-200"
        >
          {status === "playing" ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" />
          )}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-zinc-100"
          />
        </div>
      </div>
    </div>
  );
}
