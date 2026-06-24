import { create } from "zustand";
import type { Question } from "@/data/questions";

export interface PlayerAnswer {
  answer: string;
  rating?: number;
}

export type QuizPhase = "category" | "game" | "summary";
export type QuizMode = "solo" | "versus";

interface QuizState {
  phase: QuizPhase;
  mode: QuizMode | null;
  category: string | null;
  questions: Question[];
  currentIndex: number;
  playerAAnswers: Record<string, PlayerAnswer>;
  playerBAnswers: Record<string, PlayerAnswer>;
  isPlayerATurn: boolean;

  setPhase: (phase: QuizPhase) => void;
  setCategory: (category: string) => void;
  setMode: (mode: QuizMode) => void;
  setQuestions: (questions: Question[]) => void;
  answerCurrent: (text: string, rating?: number) => void;
  nextQuestion: () => void;
  endPlayerATurn: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  phase: "category",
  mode: null,
  category: null,
  questions: [],
  currentIndex: 0,
  playerAAnswers: {},
  playerBAnswers: {},
  isPlayerATurn: true,

  setPhase: (phase) => set({ phase }),
  setCategory: (category) => set({ category }),
  setMode: (mode) => set({ mode, phase: "game" }),
  setQuestions: (questions) => set({ questions }),

  answerCurrent: (text, rating) => {
    const state = get();
    const question = state.questions[state.currentIndex];
    if (!question) return;

    const answer: PlayerAnswer = { answer: text, rating };

    if (state.mode === "versus" && !state.isPlayerATurn) {
      set({
        playerBAnswers: { ...state.playerBAnswers, [question.id]: answer },
      });
    } else {
      set({
        playerAAnswers: { ...state.playerAAnswers, [question.id]: answer },
      });
    }
  },

  nextQuestion: () => {
    const state = get();
    const nextIdx = state.currentIndex + 1;

    if (nextIdx >= state.questions.length) {
      if (state.mode === "versus") {
        // If it was Player A's turn, switch to Player B
        if (state.isPlayerATurn) {
          set({ isPlayerATurn: false, currentIndex: 0 });
        } else {
          set({ phase: "summary", currentIndex: nextIdx });
        }
      } else {
        set({ phase: "summary", currentIndex: nextIdx });
      }
    } else {
      set({ currentIndex: nextIdx });
    }
  },

  endPlayerATurn: () => {
    set({ isPlayerATurn: false, currentIndex: 0 });
  },

  reset: () =>
    set({
      phase: "category",
      mode: null,
      category: null,
      questions: [],
      currentIndex: 0,
      playerAAnswers: {},
      playerBAnswers: {},
      isPlayerATurn: true,
    }),
}));
