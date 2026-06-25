"use client";

import { motion } from "framer-motion";

interface TimerDisplayProps {
  remainingSeconds: number;
  status: string;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  focusDuration: number;
  breakDuration: number;
}

export function TimerDisplay({
  remainingSeconds,
  status,
  isRunning,
  onStart,
  onPause,
  focusDuration,
  breakDuration,
}: TimerDisplayProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const totalSeconds =
    status === "break" ? breakDuration * 60 : focusDuration * 60;
  const progress = 1 - remainingSeconds / totalSeconds;

  const circumference = 2 * Math.PI * 90;
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="gradient-border">
        <div className="gradient-border-surface flex flex-col items-center gap-6 rounded-[29px] p-8">
          <div className="relative flex h-56 w-56 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="90"
                fill="none"
                stroke="rgb(39 39 42)"
                strokeWidth="4"
              />
              <motion.circle
                cx="112"
                cy="112"
                r="90"
                fill="none"
                stroke={
                  status === "break" ? "rgb(183 255 118)" : "rgb(255 230 108)"
                }
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transition={{ duration: 0.5 }}
              />
            </svg>

            <div className="flex flex-col items-center">
              <span className="tabular-nums text-5xl font-light tracking-tight text-foreground">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                {status === "break" ? "Break" : "Focus"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isRunning ? (
              <button
                onClick={onPause}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-zinc-300 transition-colors duration-150 hover:bg-zinc-900"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={onStart}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-text-primary transition-all duration-150 hover:brightness-110"
              >
                <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
