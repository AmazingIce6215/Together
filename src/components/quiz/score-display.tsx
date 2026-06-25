"use client";

import { motion } from "framer-motion";
import { Trophy, Heart, Sparkles, Brain, Star } from "lucide-react";
import type { Question } from "@/data/questions";
import type { PlayerAnswer } from "@/lib/store/quiz-store";

interface SummaryProps {
  category: string;
  questions: Question[];
  playerAAnswers: Record<string, PlayerAnswer>;
  playerBAnswers: Record<string, PlayerAnswer>;
  mode: "solo" | "versus";
  onRestart: () => void;
}

const categoryIcons: Record<string, typeof Heart> = {
  romantic: Heart,
  funny: Sparkles,
  spicy: Star,
  trivia: Brain,
};

export function ScoreDisplay({
  category,
  questions,
  playerAAnswers,
  playerBAnswers,
  mode,
  onRestart,
}: SummaryProps) {
  const Icon = categoryIcons[category] || Trophy;
  const isTrivia = category === "trivia";
  const isVersus = mode === "versus";

  let triviaScore = 0;
  let triviaTotal = 0;
  if (isTrivia) {
    for (const q of questions) {
      const answer = playerAAnswers[q.id]?.answer;
      if (q.correct_answer && answer === q.correct_answer) {
        triviaScore++;
      }
      triviaTotal++;
    }
  }

  const ratedQuestions = questions.filter((q) => {
    const a = playerAAnswers[q.id];
    return a && typeof a.rating === "number";
  });
  const avgRating =
    ratedQuestions.length > 0
      ? (
          ratedQuestions.reduce((sum, q) => sum + (playerAAnswers[q.id]?.rating ?? 0), 0) /
          ratedQuestions.length
        ).toFixed(1)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-6"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Quiz Complete!</h2>
          <p className="mt-1 text-sm text-zinc-500">{questions.length} questions answered</p>
        </div>
      </div>

      <div className="gradient-border shadow-elevated">
        <div className="gradient-border-surface rounded-[29px] p-6 text-center">
          {isTrivia ? (
            <div>
              <p className="text-4xl font-bold text-foreground">{triviaScore}/{triviaTotal}</p>
              <p className="mt-1 text-sm text-zinc-500">Correct answers</p>
            </div>
          ) : avgRating !== null ? (
            <div>
              <p className="text-4xl font-bold text-foreground">{avgRating} / 3</p>
              <p className="mt-1 text-sm text-zinc-500">Average rating</p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              {isVersus ? "Compare your answers below" : "Review your answers below"}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-zinc-400">Your answers</h3>
        {questions.map((q, i) => {
          const a = playerAAnswers[q.id];
          const b = isVersus ? playerBAnswers[q.id] : null;
          const isCorrect = isTrivia && q.correct_answer && a?.answer === q.correct_answer;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="gradient-border shadow-elevated"
            >
              <div className="gradient-border-surface rounded-[29px] p-4">
                <p className="mb-2 text-sm font-medium leading-relaxed">
                  <span className="text-zinc-500">Q{i + 1}. </span>
                  <span className="text-foreground">{q.question}</span>
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">You:</span>
                    <span
                      className={`rounded-[30px] px-2.5 py-1 text-sm ${
                        isCorrect
                          ? "bg-tertiary/20 text-tertiary"
                          : "bg-zinc-900 text-zinc-300"
                      }`}
                    >
                      {a?.answer ?? "—"}
                    </span>
                    {isCorrect && <Trophy className="h-3.5 w-3.5 text-tertiary" />}
                  </div>
                  {isVersus && b && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Partner:</span>
                      <span className="rounded-[30px] bg-zinc-900 px-2.5 py-1 text-sm text-zinc-300">
                        {b.answer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={onRestart}
        className="mx-auto mt-2 rounded-[30px] bg-primary px-8 py-2.5 text-sm font-medium text-text-primary transition-all duration-150 hover:brightness-110"
      >
        Play again
      </button>
    </motion.div>
  );
}
