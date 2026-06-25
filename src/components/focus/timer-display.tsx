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

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const isBreak = status === "break";

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="gradient-border-static shadow-elevated"
      >
        <div className="gradient-border-surface relative flex flex-col items-center gap-6 overflow-hidden rounded-[29px] p-8">
          {/* Breathing radial glow behind the dial */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            animate={{
              opacity: isRunning ? [0.25, 0.55, 0.25] : 0.25,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: isBreak
                ? "radial-gradient(circle at center, rgba(183,255,118,0.25), transparent 60%)"
                : "radial-gradient(circle at center, rgba(255,230,108,0.25), transparent 60%)",
            }}
          />

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
                stroke={isBreak ? "rgb(183 255 118)" : "rgb(255 230 108)"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: offset }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
                style={{ filter: "drop-shadow(0 0 6px currentColor)" }}
              />
            </svg>

            <div className="relative flex flex-col items-center">
              <motion.span
                key={remainingSeconds}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="tabular-nums text-5xl font-light tracking-tight text-foreground"
              >
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </motion.span>
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500"
              >
                {isBreak ? "Break" : "Focus"}
              </motion.span>
            </div>
          </div>

          <div className="relative flex items-center gap-4">
            {isRunning ? (
              <motion.button
                onClick={onPause}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-zinc-300 transition-colors duration-300 hover:border-zinc-500 hover:bg-zinc-900"
                aria-label="Pause"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                onClick={onStart}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-text-primary transition-shadow duration-300 hover:shadow-[0_0_28px_-4px_rgba(255,230,108,0.7)]"
                aria-label="Start"
              >
                <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}