"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useQuizStore } from "@/lib/store/quiz-store";
import { getQuestions, getResponsesForQuestion, submitAnswer } from "@/actions/quiz.actions";
import { QuestionCard } from "@/components/quiz/question-card";
import { AnswerReveal } from "@/components/quiz/answer-reveal";
import { ScoreDisplay } from "@/components/quiz/score-display";

interface GameBoardProps {
  categoryId: string;
  mode: string;
  sessionId: string | null;
  onSessionCreated: (id: string) => void;
}

interface Question {
  id: string;
  category_id: string;
  mode: string;
  question: string;
  options: string[] | null;
  correct_answer: string | null;
}

export function GameBoard({
  categoryId,
  mode,
  sessionId,
  onSessionCreated,
}: GameBoardProps) {
  const store = useQuizStore();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Fetch current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id } : null);
    });
  }, []);

  // Load questions and set up real-time
  useEffect(() => {
    async function init() {
      try {
        const questions = await getQuestions(categoryId, mode);
        if (questions.length === 0) {
          setError("No questions available for this category and mode.");
          setLoading(false);
          return;
        }
        store.setQuestions(questions);
        setCurrentQuestion(questions[0]);

        // Create session if needed
        if (!sessionId) {
          const { createQuizSession } = await import(
            "@/actions/quiz.actions"
          );
          const id = await createQuizSession(categoryId, mode);
          onSessionCreated(id);
          store.setSessionId(id);
        } else {
          store.setSessionId(sessionId);
        }

        setLoading(false);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load quiz"
        );
        setLoading(false);
      }
    }

    init();
  }, [categoryId, mode]);

  // Subscribe to real-time responses
  useEffect(() => {
    if (!sessionId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`quiz-session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "quiz_responses",
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          const response = payload.new as {
            user_id: string;
            answer: string;
            question_id: string;
          };

          if (
            response.user_id !== user?.id &&
            response.question_id === currentQuestion?.id
          ) {
            store.setPartnerAnswer({
              user_id: response.user_id,
              answer: response.answer,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, currentQuestion?.id, user?.id]);

  // Detect when both answered
  useEffect(() => {
    if (store.myAnswer && store.partnerAnswer && !store.isRevealed) {
      const timer = setTimeout(() => {
        store.revealAnswers();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [store.myAnswer, store.partnerAnswer, store.isRevealed]);

  const handleAnswer = useCallback(
    async (answer: string) => {
      if (!sessionId || !currentQuestion || store.myAnswer) return;

      store.setMyAnswer(answer);

      try {
        await submitAnswer(sessionId, currentQuestion.id, answer);
      } catch {
        // If the submit fails, we still show the answer locally
      }
    },
    [sessionId, currentQuestion, store.myAnswer]
  );

  const handleNextQuestion = useCallback(() => {
    const nextIndex = store.currentIndex + 1;
    const questions = store.questions;

    if (nextIndex >= questions.length) {
      store.setIsComplete(true);
      return;
    }

    store.nextQuestion();
    setCurrentQuestion(questions[nextIndex]);
  }, [store.currentIndex, store.questions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-200" />
        <p className="text-sm text-zinc-500">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (store.isComplete) {
    return (
      <ScoreDisplay
        scores={store.scores}
        questions={store.questions}
        onRestart={() => {
          store.reset();
          window.location.reload();
        }}
      />
    );
  }

  if (!currentQuestion) return null;

  const partnerAnswered = !!store.partnerAnswer;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-zinc-100 transition-all duration-500"
              style={{
                width: `${
                  ((store.currentIndex + 1) / store.questions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
        <span className="text-xs text-zinc-500">
          {store.currentIndex + 1} / {store.questions.length}
        </span>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id + store.currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <QuestionCard
            question={currentQuestion}
            mode={mode}
            selectedAnswer={store.myAnswer}
            onAnswer={handleAnswer}
            disabled={!!store.myAnswer}
          />
        </motion.div>
      </AnimatePresence>

      {/* Partner status */}
      {store.myAnswer && !store.isRevealed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-zinc-500"
        >
          {partnerAnswered
            ? "Partner answered! Revealing..."
            : "Waiting for partner to answer..."}
          {!partnerAnswered && (
            <span className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-zinc-500" />
          )}
        </motion.p>
      )}

      {/* Answer reveal */}
      {store.isRevealed && (
        <AnswerReveal
          myAnswer={store.myAnswer!}
          partnerAnswer={store.partnerAnswer!.answer}
          question={currentQuestion}
          mode={mode}
          onNext={handleNextQuestion}
          isLastQuestion={
            store.currentIndex >= store.questions.length - 1
          }
        />
      )}
    </div>
  );
}
