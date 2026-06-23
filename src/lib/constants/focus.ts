import type { FocusSettings } from "@/lib/types/app";

export const DEFAULT_FOCUS_SETTINGS: FocusSettings = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

export const FOCUS_STATUS_LABELS: Record<string, string> = {
  idle: "Idle",
  focusing: "Focusing",
  on_break: "On Break",
  completed: "Completed",
};
