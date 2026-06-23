import { create } from "zustand";

interface Question {
  id: string;
  category_id: string;
  mode: string;
  question: string;
  options: string[] | null;
  correct_answer: string | null;
}

interface PlayerAnswer {
  user_id: string;
  answer: string;
}

interface QuizState {
  sessionId: string | null;
  questions: Question[];
  currentIndex: number;
  myAnswer: string | null;
  partnerAnswer: PlayerAnswer | null;
  scores: Record<string, number>;
  isRevealed: boolean;
  isComplete: boolean;

  setSessionId: (id: string) => void;
  setQuestions: (questions: Question[]) => void;
  setMyAnswer: (answer: string) => void;
  setPartnerAnswer: (answer: PlayerAnswer) => void;
  revealAnswers: () => void;
  nextQuestion: () => void;
  addScore: (userId: string, points: number) => void;
  setIsComplete: (complete: boolean) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  sessionId: null,
  questions: [],
  currentIndex: 0,
  myAnswer: null,
  partnerAnswer: null,
  scores: {},
  isRevealed: false,
  isComplete: false,

  setSessionId: (id) => set({ sessionId: id }),
  setQuestions: (questions) => set({ questions }),
  setMyAnswer: (answer) => set({ myAnswer: answer }),
  setPartnerAnswer: (answer) => set({ partnerAnswer: answer }),
  revealAnswers: () => set({ isRevealed: true }),
  nextQuestion: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      myAnswer: null,
      partnerAnswer: null,
      isRevealed: false,
    })),
  addScore: (userId, points) =>
    set((state) => ({
      scores: {
        ...state.scores,
        [userId]: (state.scores[userId] || 0) + points,
      },
    })),
  setIsComplete: (complete) => set({ isComplete: complete }),
  reset: () =>
    set({
      sessionId: null,
      questions: [],
      currentIndex: 0,
      myAnswer: null,
      partnerAnswer: null,
      scores: {},
      isRevealed: false,
      isComplete: false,
    }),
}));
