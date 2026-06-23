import type { QuizMode } from "@/lib/types/app";

export const QUIZ_CATEGORIES = [
  { slug: "romantic", name: "Romantic", icon: "heart", color: "#FF6B9D" },
  { slug: "funny", name: "Funny", icon: "laugh", color: "#FFD93D" },
  { slug: "deep", name: "Deep", icon: "brain", color: "#6C5CE7" },
  { slug: "flirty", name: "Flirty", icon: "sparkles", color: "#FF6B9D" },
  { slug: "spicy", name: "Spicy", icon: "flame", color: "#FF4757" },
  { slug: "movies", name: "Movies", icon: "film", color: "#2ED573" },
  { slug: "gaming", name: "Gaming", icon: "gamepad-2", color: "#5352ED" },
  { slug: "cars", name: "Cars", icon: "car", color: "#FFA502" },
  { slug: "medicine", name: "Medicine", icon: "stethoscope", color: "#1E90FF" },
  { slug: "architecture", name: "Architecture", icon: "building-2", color: "#A3A3A3" },
  { slug: "random-knowledge", name: "Random Knowledge", icon: "globe", color: "#2ED573" },
  { slug: "ai-generated", name: "AI Generated", icon: "cpu", color: "#FF6B9D" },
  { slug: "custom", name: "Custom Quiz", icon: "edit", color: "#FFFFFF" },
] as const;

export const QUIZ_MODES: { slug: QuizMode; name: string; description: string }[] = [
  { slug: "classic", name: "Classic", description: "Answer questions and earn points" },
  { slug: "guess_partner", name: "Guess Your Partner", description: "Predict how your partner will answer" },
  { slug: "this_or_that", name: "This or That", description: "Choose between two options" },
  { slug: "speed_round", name: "Speed Round", description: "Answer as fast as you can" },
  { slug: "never_have_i_ever", name: "Never Have I Ever", description: "Confess what you've never done" },
  { slug: "would_you_rather", name: "Would You Rather", description: "Tough choices between two scenarios" },
  { slug: "truth", name: "Truth Questions", description: "Honest answers to personal questions" },
];
