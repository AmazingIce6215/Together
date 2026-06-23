"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { createQuizSession, countAvailableQuestions } from "@/actions/quiz.actions";
import { generateQuestions } from "@/actions/quiz-generation.actions";
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
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadCounts() {
      const results: Record<string, number> = {};
      for (const mode of QUIZ_MODES) {
        results[mode.slug] = await countAvailableQuestions(categoryId, mode.slug);
      }
      setCounts(results);
    }
    loadCounts();
  }, [categoryId, refreshKey]);

  async function handleModeSelect(mode: string) {
    if ((counts[mode] ?? 0) < 5) return;

    setLoading(mode);
    setError(null);
    try {
      const sessionId = await createQuizSession(categoryId, mode);
      onSessionCreated(sessionId);
      onSelect(mode);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to start game"
      );
    } finally {
      setLoading(null);
    }
  }

  async function handleGenerate(mode: string) {
    setGenerating(mode);
    setError(null);

    const result = await generateQuestions(categoryId, mode, 15);

    if ("error" in result) {
      setError(result.error);
      setGenerating(null);
      return;
    }

    setGenerating(null);
    setRefreshKey((k) => k + 1);

    const sessionId = await createQuizSession(categoryId, mode);
    onSessionCreated(sessionId);
    onSelect(mode);
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
          const isGenerating = generating === mode.slug;
          const available = counts[mode.slug] ?? 0;
          const needsGenerate = available < 5;

          return (
            <motion.button
              key={mode.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() =>
                needsGenerate ? handleGenerate(mode.slug) : handleModeSelect(mode.slug)
              }
              disabled={!!loading || !!generating}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-zinc-800/50 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/50 disabled:opacity-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/50">
                <Icon className="h-5 w-5 text-zinc-300" />
              </div>
              <div className="flex flex-col gap-0.5">
                {isGenerating ? (
                  <>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                      Generating...
                    </span>
                    <span className="text-xs text-zinc-500">
                      Creating questions with AI
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium">
                      {isLoading ? "Starting..." : mode.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {needsGenerate
                        ? "No questions — tap to generate"
                        : mode.description}
                    </span>
                    {!needsGenerate && (
                      <span className="mt-1 text-xs text-zinc-600">
                        {available} available
                      </span>
                    )}
                  </>
                )}
              </div>
              {needsGenerate && !isGenerating && (
                <div className="mt-1 flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400">
                  <Sparkles className="h-3 w-3" />
                  Generate
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
