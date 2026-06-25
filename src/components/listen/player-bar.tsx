"use client";

import { motion, AnimatePresence } from "framer-motion";
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
      <div className="gradient-border-static shadow-elevated">
        <div className="gradient-border-surface flex items-center justify-center rounded-[29px] p-12">
          <p className="text-sm text-zinc-500">
            Select a track to start listening together
          </p>
        </div>
      </div>
    );
  }

  const isPlaying = status === "playing";

  return (
    <div className="gradient-border-static shadow-elevated">
      <div className="gradient-border-surface relative overflow-hidden rounded-[29px] p-5">
        {/* Soft pulsing background when playing */}
        {isPlaying && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle at left center, rgba(169,200,255,0.18), transparent 60%)",
            }}
          />
        )}

        <div className="relative flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-900"
          >
            {isPlaying && (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full ring-1 ring-secondary/60"
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <span className="text-lg">{currentAmbient.icon}</span>
          </motion.div>

          <div className="flex min-w-0 flex-1 flex-col">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={currentAmbient.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="truncate text-sm font-medium text-foreground"
              >
                {currentAmbient.name}
              </motion.span>
            </AnimatePresence>
            <span className="text-xs tabular-nums text-zinc-500">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          <motion.button
            onClick={isPlaying ? onPause : onPlay}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-text-primary transition-shadow duration-300 hover:shadow-[0_0_22px_-4px_rgba(255,230,108,0.6)]"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" />
            )}
          </motion.button>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="text-zinc-500 transition-colors duration-300 hover:text-zinc-200 active:scale-90"
              aria-label={isMuted ? "Unmute" : "Mute"}
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
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-primary transition-colors duration-300 hover:bg-zinc-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}