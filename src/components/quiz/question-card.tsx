"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");

  const handleSelect = (value: string) => {
    if (disabled || selected) return;
    setSelected(value);
    onAnswer(value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (disabled || !textInput.trim()) return;
    onAnswer(textInput.trim());
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="gradient-border-static shadow-elevated"
      >
        <div className="gradient-border-surface rounded-[29px] p-6">
          <p className="text-center text-lg leading-relaxed text-foreground">
            {question.question}
          </p>
          {question.type === "would_you_rather" && (
            <p className="mt-2 text-center text-xs text-zinc-500">
              Pick the option that fits you best
            </p>
          )}
        </div>
      </motion.div>

      {question.type !== "open_ended" && question.options && (
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option, i) => {
            const isSelected = selected === option;
            return (
              <motion.button
                key={`${question.id}-${i}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.06 }}
                whileHover={
                  disabled || selected
                    ? undefined
                    : { y: -2, transition: { duration: 0.2 } }
                }
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option)}
                disabled={!!disabled || !!selected}
                className={`group relative overflow-hidden rounded-[30px] border p-4 text-left text-sm transition-colors duration-300 ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                } ${disabled || (selected && !isSelected) ? "opacity-40" : ""}`}
              >
                {isSelected && (
                  <motion.span
                    layoutId={`option-glow-${question.id}`}
                    className="absolute inset-0 rounded-[30px] bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{option}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {question.type === "open_ended" && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your answer..."
            disabled={disabled}
            className="flex-1 rounded-[30px] border border-border bg-zinc-900/50 px-4 py-2.5 text-sm text-foreground placeholder-zinc-600 outline-none transition-all duration-300 focus:border-primary/60 focus:bg-zinc-900/80"
            autoFocus
          />
          <motion.button
            type="submit"
            disabled={disabled || !textInput.trim()}
            whileTap={{ scale: 0.96 }}
            className="rounded-[30px] bg-primary px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-300 hover:shadow-[0_0_24px_-6px_rgba(255,230,108,0.7)] disabled:opacity-40 disabled:shadow-none"
          >
            Submit
          </motion.button>
        </motion.form>
      )}
    </div>
  );
}