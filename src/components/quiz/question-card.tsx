"use client";

import { motion } from "framer-motion";

interface Question {
  id: string;
  question: string;
  options: string[] | null;
  mode: string;
}

interface QuestionCardProps {
  question: Question;
  mode: string;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

export function QuestionCard({
  question,
  mode,
  selectedAnswer,
  onAnswer,
  disabled,
}: QuestionCardProps) {
  const isTruthMode = mode === "truth" || mode === "never_have_i_ever";
  const isGuessPartner = mode === "guess_partner";

  return (
    <div className="flex flex-col gap-6">
      {/* Question text */}
      <div className="rounded-2xl border border-zinc-800/50 p-6">
        <p className="text-center text-lg leading-relaxed">
          {question.question}
        </p>
        {isGuessPartner && (
          <p className="mt-2 text-center text-xs text-zinc-500">
            Guess how your partner will answer
          </p>
        )}
      </div>

      {/* Options */}
      {question.options && question.options.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option, i) => {
            const isSelected = selectedAnswer === option;

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onAnswer(option)}
                disabled={disabled}
                className={`rounded-2xl border p-4 text-left text-sm transition-all ${
                  isSelected
                    ? "border-zinc-500 bg-zinc-800/50"
                    : "border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/50"
                } ${disabled && !isSelected ? "opacity-40" : ""}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      ) : (
        /* Text input for truth modes */
        !selectedAnswer && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.elements[0] as HTMLInputElement;
              if (input.value.trim()) {
                onAnswer(input.value.trim());
              }
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              placeholder={
                mode === "truth"
                  ? "Type your honest answer..."
                  : mode === "never_have_i_ever"
                  ? "Something you've never done..."
                  : "Type your answer..."
              }
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
            >
              Submit
            </button>
          </form>
        )
      )}
    </div>
  );
}
