"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

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
      {/* Question text */}
      <div className="rounded-2xl border border-zinc-800/50 p-6">
        <p className="text-center text-lg leading-relaxed">{question.question}</p>
        {question.type === "would_you_rather" && (
          <p className="mt-2 text-center text-xs text-zinc-500">
            Pick the option that fits you best
          </p>
        )}
      </div>

      {/* multiple_choice / would_you_rather — option buttons */}
      {question.type !== "open_ended" && question.options && (
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option, i) => {
            const isSelected = selected === option;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(option)}
                disabled={!!disabled || !!selected}
                className={`rounded-2xl border p-4 text-left text-sm transition-all ${
                  isSelected
                    ? "border-zinc-500 bg-zinc-800/50"
                    : "border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/50"
                } ${disabled || (selected && !isSelected) ? "opacity-40" : ""}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* open_ended — text input */}
      {question.type === "open_ended" && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your answer..."
            disabled={disabled}
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
            autoFocus
          />
          <button
            type="submit"
            disabled={disabled || !textInput.trim()}
            className="rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-40"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
