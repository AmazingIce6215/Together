"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface Question {
  id: string;
}

interface ScoreDisplayProps {
  scores: Record<string, number>;
  questions: Question[];
  onRestart: () => void;
}

export function ScoreDisplay({
  scores,
  questions,
  onRestart,
}: ScoreDisplayProps) {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const entries = Object.entries(scores).sort(([, a], [, b]) => b - a);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-6 py-10"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/10">
        <Trophy className="h-8 w-8 text-yellow-400" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold">Quiz Complete!</h2>
        <p className="mt-1 text-sm text-zinc-400">
          {questions.length} questions answered
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {entries.map(([userId, score], i) => (
          <div
            key={userId}
            className="flex items-center justify-between rounded-2xl border border-zinc-800/50 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500">#{i + 1}</span>
              <span className="text-sm font-medium">
                Player {userId.slice(0, 8)}
              </span>
            </div>
            <span className="text-sm font-semibold">{score} pts</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800/50 p-4 text-center">
        <p className="text-2xl font-bold">{total}</p>
        <p className="text-xs text-zinc-500">Total score</p>
      </div>

      <button
        onClick={onRestart}
        className="rounded-xl bg-zinc-100 px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
      >
        Play again
      </button>
    </motion.div>
  );
}
