"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useQuizStore } from "@/lib/store/quiz-store";
import {
  getQuestions,
  getSessionQuestions,
  getResponsesForQuestion,
  submitAnswer,
  completeQuizSession,
  abandonQuizSession,
} from "@/actions/quiz.actions";
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
  const [fetchedSessionResponses, setFetchedSessionResponses] = useState(false);

  const userIdRef = useRef<string | null>(null);

  // Derive myAnswer and partnerAnswer from per-question store
  const currentQuestionId = currentQuestion?.id;
  const answersForCurrent = currentQuestionId
    ? store.answersByQuestion[currentQuestionId] || []
    : [];
  const myAnswer = useMemo(() => {
    if (!userIdRef.current) return null;
    const mine = answersForCurrent.find(
      (a) => a.user_id === userIdRef.current
    );
    return mine?.answer ?? null;
  }, [answersForCurrent]);
  const partnerAnswer = useMemo(() => {
    if (!userIdRef.current) return null;
    const partner = answersForCurrent.find(
      (a) => a.user_id !== userIdRef.current
    );
    return partner ?? null;
  }, [answersForCurrent]);

  // Fetch current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user ? { id: data.user.id } : null;
      setUser(u);
      userIdRef.current = u?.id ?? null;
    });
  }, []);

  // Load questions and set up real-time
  useEffect(() => {
    async function init() {
      try {
        let questions: Question[];

        if (sessionId) {
          questions = await getSessionQuestions(sessionId);
        } else {
          questions = await getQuestions(categoryId, mode);
        }

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
  }, [categoryId, mode, sessionId]);

  // Load existing responses for session (catches answers submitted while partner was on a different question)
  useEffect(() => {
    if (!sessionId || fetchedSessionResponses) return;

    const supabase = createClient();
    const fetchExisting = async () => {
      const { data } = await supabase
        .from("quiz_responses")
        .select("user_id, answer, question_id")
        .eq("session_id", sessionId);
      if (data) {
        for (const r of data) {
          store.addAnswer(r.question_id, {
            user_id: r.user_id,
            answer: r.answer,
          });
        }
      }
    };
    fetchExisting();
    setFetchedSessionResponses(true);
  }, [sessionId, fetchedSessionResponses]);

  // Subscribe to real-time responses — collect ALL answers by question_id
  useEffect(() => {
    if (!sessionId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`quiz-session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
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
          if (!response?.user_id) return;

          store.addAnswer(response.question_id, {
            user_id: response.user_id,
            answer: response.answer,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Detect when both answered
  useEffect(() => {
    if (myAnswer && partnerAnswer && !store.isRevealed) {
      const timer = setTimeout(() => {
        store.revealAnswers();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [myAnswer, partnerAnswer, store.isRevealed]);

  // Session lifecycle cleanup — best-effort abandon on tab close / unmount
  const abandonRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (!sessionId) return;

    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        "/api/abandon-session",
        JSON.stringify({ sessionId })
      );
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // On React unmount (navigating away within the app)
    abandonRef.current = () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      fetch("/api/abandon-session", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
        keepalive: true,
      }).catch(() => {});
    };

    return () => {
      abandonRef.current?.();
    };
  }, [sessionId]);

  const handleAnswer = useCallback(
    async (answer: string) => {
      if (!sessionId || !currentQuestion || !userIdRef.current) return;
      if (myAnswer) return;

      store.addAnswer(currentQuestion.id, {
        user_id: userIdRef.current,
        answer,
      });

      try {
        await submitAnswer(sessionId, currentQuestion.id, answer);
      } catch {
        // If the submit fails, we still show the answer locally
      }
    },
    [sessionId, currentQuestion, myAnswer]
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
          if (store.sessionId) {
            completeQuizSession(store.sessionId);
          }
          store.reset();
          window.location.reload();
        }}
      />
    );
  }

  if (!currentQuestion) return null;

  const partnerAnswered = !!partnerAnswer;

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
            selectedAnswer={myAnswer}
            onAnswer={handleAnswer}
            disabled={!!myAnswer}
          />
        </motion.div>
      </AnimatePresence>

      {/* Partner status */}
      {myAnswer && !store.isRevealed && (
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
          myAnswer={myAnswer!}
          partnerAnswer={partnerAnswer!.answer}
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
