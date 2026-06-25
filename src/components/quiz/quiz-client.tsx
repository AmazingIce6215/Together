"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/lib/store/quiz-store";
import { CATEGORIES } from "@/data/categories";
import { getQuestionsForCategory, type Question, type QuestionType } from "@/data/questions";
import { QuestionCard } from "@/components/quiz/question-card";
import { ScoreDisplay } from "@/components/quiz/score-display";
import { generateTrivia } from "@/actions/quiz-generation.actions";
import {
  Heart,
  Sparkles,
  Flame,
  Brain,
  User,
  Users,
  ArrowLeft,
} from "lucide-react";

const categoryIcons: Record<string, typeof Heart> = {
  romantic: Heart,
  funny: Sparkles,
  spicy: Flame,
  trivia: Brain,
};

export function QuizClient() {
  const store = useQuizStore();
  const questions = store.questions;
  const currentQuestion = questions[store.currentIndex] ?? null;
  const currentCategory = CATEGORIES.find((c) => c.slug === store.category);

  const handleCategorySelect = useCallback(
    (slug: string) => {
      store.setCategory(slug);
      store.setPhase("mode");
    },
    [store]
  );

  const handleModeSelect = useCallback(
    async (mode: "solo" | "versus") => {
      const slug = store.category;
      if (!slug) return;

      store.setMode(mode);

      if (mode === "solo") {
        if (slug === "trivia") {
          const result = await generateTrivia(8);
          if ("questions" in result) {
            store.setQuestions(result.questions as Question[]);
          } else {
            store.setQuestions(getQuestionsForCategory(slug, "solo"));
          }
        } else {
          store.setQuestions(getQuestionsForCategory(slug, "solo"));
        }
        store.setPhase("game");
      } else {
        store.setPhase("type");
      }
    },
    [store]
  );

  const handleTypeSelect = useCallback(
    async (type: QuestionType) => {
      const slug = store.category;
      if (!slug) return;

      store.setQuestionType(type);

      if (slug === "trivia") {
        const result = await generateTrivia(8);
        if ("questions" in result) {
          const typed = (result.questions as Question[]).filter(
            (q) => q.type === type
          );
          store.setQuestions(typed.length > 0 ? typed : result.questions as Question[]);
        } else {
          store.setQuestions(getQuestionsForCategory(slug, "versus").filter((q) => q.type === type));
        }
      } else {
        store.setQuestions(
          getQuestionsForCategory(slug, "versus").filter((q) => q.type === type)
        );
      }
    },
    [store]
  );

  const handleAnswer = useCallback(
    (answer: string) => {
      store.answerCurrent(answer);
    },
    [store]
  );

  const handleNext = useCallback(() => {
    store.nextQuestion();
  }, [store]);

  const handleRestart = useCallback(() => {
    store.reset();
  }, [store]);

  if (store.phase === "category") {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-widest uppercase text-primary">Quiz</span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Choose a category</h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((cat, i) => {
            const Icon = categoryIcons[cat.slug] || Heart;
            return (
              <motion.button
                key={cat.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 26,
                  delay: i * 0.04,
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategorySelect(cat.slug)}
                className="gradient-border-static shadow-elevated group text-left"
              >
                <div className="gradient-border-surface flex flex-col items-start gap-3 rounded-[29px] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    <span className="text-xs text-zinc-500">{cat.description}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (store.phase === "mode") {
    return (
      <div className="flex flex-col gap-6 p-6">
        <button
          onClick={() => store.setPhase("category")}
          className="flex items-center gap-1.5 self-start text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-widest uppercase text-primary">
            {currentCategory?.name ?? "Quiz"}
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">How do you want to play?</h1>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeSelect("solo")}
            className="gradient-border-static shadow-elevated group text-left"
          >
            <div className="gradient-border-surface flex flex-col items-start gap-3 rounded-[29px] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[15deg] group-hover:scale-110">
                <User className="h-5 w-5 text-zinc-300" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">Solo</span>
                <span className="text-xs text-zinc-500">
                  Answer questions and see how you score
                </span>
              </div>
            </div>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.05 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeSelect("versus")}
            className="gradient-border-static shadow-elevated group text-left"
          >
            <div className="gradient-border-surface flex flex-col items-start gap-3 rounded-[29px] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[15deg] group-hover:scale-110">
                <Users className="h-5 w-5 text-zinc-300" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">Versus</span>
                <span className="text-xs text-zinc-500">
                  Both partners answer, then compare
                </span>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  if (store.phase === "type") {
    const types: { slug: QuestionType; label: string; description: string }[] = [
      {
        slug: "multiple_choice",
        label: "Multiple Choice",
        description: "Pick the right answer from options",
      },
      {
        slug: "would_you_rather",
        label: "Would You Rather",
        description: "Two options — both partners pick one",
      },
      {
        slug: "open_ended",
        label: "Open Ended",
        description: "Free text answers for both partners",
      },
    ];

    return (
      <div className="flex flex-col gap-6 p-6">
        <button
          onClick={() => store.setPhase("mode")}
          className="flex items-center gap-1.5 self-start text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-widest uppercase text-primary">
            {currentCategory?.name ?? "Quiz"} &middot; Versus
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Choose a question type</h1>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {types.map((t, i) => (
            <motion.button
              key={t.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 26,
                delay: i * 0.04,
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelect(t.slug)}
              className="gradient-border-static shadow-elevated group text-left"
            >
              <div className="gradient-border-surface flex flex-col items-start gap-3 rounded-[29px] p-5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{t.label}</span>
                  <span className="text-xs text-zinc-500">{t.description}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (store.phase === "summary") {
    return (
      <div className="p-6">
        <ScoreDisplay
          category={store.category!}
          questions={store.questions}
          playerAAnswers={store.playerAAnswers}
          playerBAnswers={store.playerBAnswers}
          mode={store.mode!}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  const isPlayerATurn = store.isPlayerATurn;
  const isLastQuestion = store.currentIndex >= store.questions.length - 1;
  const totalQuestions = store.questions.length;
  const turnLabel =
    store.mode === "versus"
      ? isPlayerATurn
        ? "Your turn"
        : "Partner's turn"
      : null;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="h-1 overflow-hidden rounded-full bg-zinc-900">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{
                width: `${((store.currentIndex + 1) / totalQuestions) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        <span className="text-xs tabular-nums text-zinc-500">
          {store.currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {turnLabel && (
        <p className="text-center text-xs font-medium text-zinc-500">
          {turnLabel}
        </p>
      )}

      {currentQuestion && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentQuestion.id + (isPlayerATurn ? "-a" : "-b")}
            initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
            animate={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              transition: { type: "spring", stiffness: 240, damping: 28, mass: 0.7 },
            }}
            exit={{
              opacity: 0,
              x: -30,
              filter: "blur(4px)",
              transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {currentQuestion && (() => {
        const answered = store.isPlayerATurn
          ? !!store.playerAAnswers[currentQuestion.id]
          : !!store.playerBAnswers[currentQuestion.id];
        if (!answered) return null;

        const buttonLabel = isLastQuestion
          ? store.mode === "versus" && store.isPlayerATurn
            ? "Switch to partner"
            : "See results"
          : "Next question";

        return (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleNext}
            className="mx-auto rounded-[30px] bg-primary px-8 py-2.5 text-sm font-medium text-text-primary transition-shadow duration-300 hover:shadow-[0_0_28px_-6px_rgba(255,230,108,0.7)]"
          >
            {buttonLabel}
          </motion.button>
        );
      })()}
    </div>
  );
}
