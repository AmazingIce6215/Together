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
      <div className="gradient-border">
        <div className="gradient-border-surface flex items-center justify-center rounded-[29px] p-12">
          <p className="text-sm text-zinc-500">
            Select a track to start listening together
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-border">
      <div className="gradient-border-surface rounded-[29px] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-900">
            <span className="text-lg">{currentAmbient.icon}</span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {currentAmbient.name}
            </span>
            <span className="text-xs text-zinc-500">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          <button
            onClick={status === "playing" ? onPause : onPlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-text-primary transition-all duration-150 hover:brightness-110"
          >
            {status === "playing" ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
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
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
