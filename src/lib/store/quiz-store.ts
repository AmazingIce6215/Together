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
  answersByQuestion: Record<string, PlayerAnswer[]>;
  scores: Record<string, number>;
  isRevealed: boolean;
  isComplete: boolean;

  setSessionId: (id: string) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentIndex: (index: number) => void;
  addAnswer: (questionId: string, answer: PlayerAnswer) => void;
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
  answersByQuestion: {},
  scores: {},
  isRevealed: false,
  isComplete: false,

  setSessionId: (id) => set({ sessionId: id }),
  setQuestions: (questions) => set({ questions }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  addAnswer: (questionId, answer) =>
    set((state) => {
      const existing = state.answersByQuestion[questionId] || [];
      const idx = existing.findIndex((a) => a.user_id === answer.user_id);
      if (idx >= 0) {
        const updated = [...existing];
        updated[idx] = answer;
        return { answersByQuestion: { ...state.answersByQuestion, [questionId]: updated } };
      }
      return {
        answersByQuestion: {
          ...state.answersByQuestion,
          [questionId]: [...existing, answer],
        },
      };
    }),
  revealAnswers: () => set({ isRevealed: true }),
  nextQuestion: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
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
      answersByQuestion: {},
      scores: {},
      isRevealed: false,
      isComplete: false,
    }),
}));
