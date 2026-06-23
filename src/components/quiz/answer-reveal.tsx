"use client";

import { motion } from "framer-motion";

interface Question {
  id: string;
  question: string;
  options: string[] | null;
  correct_answer: string | null;
  mode: string;
}

interface AnswerRevealProps {
  myAnswer: string;
  partnerAnswer: string;
  question: Question;
  mode: string;
  onNext: () => void;
  isLastQuestion: boolean;
}

export function AnswerReveal({
  myAnswer,
  partnerAnswer,
  question,
  mode,
  onNext,
  isLastQuestion,
}: AnswerRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {/* My answer */}
        <div className="rounded-2xl border border-zinc-800/50 p-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Your answer
          </p>
          <p className="text-sm">{myAnswer}</p>
        </div>

        {/* Partner answer */}
        <div className="rounded-2xl border border-zinc-800/50 p-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Partner&apos;s answer
          </p>
          <p className="text-sm">{partnerAnswer}</p>
        </div>
      </div>

      {/* Correct answer for classic mode */}
      {mode === "classic" && question.correct_answer && (
        <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/10 p-4 text-center">
          <p className="text-xs text-emerald-400">
            Correct answer: {question.correct_answer}
          </p>
        </div>
      )}

      <button
        onClick={onNext}
        className="self-center rounded-xl bg-zinc-100 px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
      >
        {isLastQuestion ? "See results" : "Next question"}
      </button>
    </motion.div>
  );
}
