export type QuizMode =
  | "classic"
  | "guess_partner"
  | "this_or_that"
  | "speed_round"
  | "never_have_i_ever"
  | "would_you_rather"
  | "truth";

export type QuizSessionStatus = "waiting" | "in_progress" | "completed";
export type ListenSessionStatus = "idle" | "playing" | "paused";
export type FocusSessionStatus = "idle" | "focus" | "break" | "completed";
export type FocusParticipantStatus = "idle" | "focusing" | "on_break" | "completed";

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface CoupleWithMembers {
  id: string;
  invite_code: string;
  members: UserProfile[];
}

export interface QuizQuestion {
  id: string;
  category_id: string;
  mode: QuizMode;
  question: string;
  options: string[] | null;
  correct_answer: string | null;
  difficulty: string;
}

export interface AmbientSound {
  id: string;
  name: string;
  file: string;
  icon: string;
}

export interface FocusSettings {
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}
