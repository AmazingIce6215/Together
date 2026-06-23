"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createQuizSession } from "@/actions/quiz.actions";
import { QUIZ_MODES } from "@/lib/constants/quiz";
import {
  Target,
  HeartHandshake,
  Shuffle,
  Zap,
  Eye,
  Scale,
  MessageCircle,
} from "lucide-react";

const modeIcons: Record<string, typeof Target> = {
  classic: Target,
  guess_partner: HeartHandshake,
  this_or_that: Shuffle,
  speed_round: Zap,
  never_have_i_ever: Eye,
  would_you_rather: Scale,
  truth: MessageCircle,
};

interface ModeSelectorProps {
  categoryId: string;
  onSelect: (mode: string) => void;
  onSessionCreated: (id: string) => void;
}

export function ModeSelector({
  categoryId,
  onSelect,
  onSessionCreated,
}: ModeSelectorProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleModeSelect(mode: string) {
    setLoading(mode);
    setError(null);
    try {
      const sessionId = await createQuizSession(categoryId, mode);
      onSessionCreated(sessionId);
      onSelect(mode);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to start game. Add questions first."
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUIZ_MODES.map((mode, i) => {
          const Icon = modeIcons[mode.slug] || Target;
          const isLoading = loading === mode.slug;

          return (
            <motion.button
              key={mode.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => handleModeSelect(mode.slug)}
              disabled={!!loading}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-zinc-800/50 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/50 disabled:opacity-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/50">
                <Icon className="h-5 w-5 text-zinc-300" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {isLoading ? "Starting..." : mode.name}
                </span>
                <span className="text-xs text-zinc-500">
                  {mode.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
