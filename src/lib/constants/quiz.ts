import type { QuizMode } from "@/lib/types/app";

export const QUIZ_MODES: { slug: QuizMode; name: string; description: string }[] = [
  { slug: "classic", name: "Classic", description: "Answer questions and earn points" },
  { slug: "guess_partner", name: "Guess Your Partner", description: "Predict how your partner will answer" },
  { slug: "this_or_that", name: "This or That", description: "Choose between two options" },
  { slug: "speed_round", name: "Speed Round", description: "Answer as fast as you can" },
  { slug: "never_have_i_ever", name: "Never Have I Ever", description: "Confess what you've never done" },
  { slug: "would_you_rather", name: "Would You Rather", description: "Tough choices between two scenarios" },
  { slug: "truth", name: "Truth Questions", description: "Honest answers to personal questions" },
];
