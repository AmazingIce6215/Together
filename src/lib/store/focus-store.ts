import { create } from "zustand";

interface FocusState {
  sessionId: string | null;
  status: "idle" | "focus" | "break" | "completed";
  remainingSeconds: number;
  focusDuration: number;
  breakDuration: number;
  currentSession: number;
  isRunning: boolean;
  startedAt: string | null;

  setSession: (session: {
    id: string;
    status: string;
    focus_duration: number;
    break_duration: number;
    current_session: number;
    started_at: string | null;
  }) => void;
  setRemaining: (seconds: number) => void;
  setRunning: (running: boolean) => void;
  setStatus: (status: "idle" | "focus" | "break" | "completed") => void;
  tick: () => void;
  reset: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  sessionId: null,
  status: "idle",
  remainingSeconds: 25 * 60,
  focusDuration: 25,
  breakDuration: 5,
  currentSession: 1,
  isRunning: false,
  startedAt: null,

  setSession: (session) =>
    set({
      sessionId: session.id,
      status: session.status as FocusState["status"],
      focusDuration: session.focus_duration,
      breakDuration: session.break_duration,
      currentSession: session.current_session,
      remainingSeconds:
        session.status === "focus"
          ? session.focus_duration * 60
          : session.status === "break"
          ? session.break_duration * 60
          : session.focus_duration * 60,
      startedAt: session.started_at,
    }),

  setRemaining: (seconds) => set({ remainingSeconds: seconds }),
  setRunning: (running) => set({ isRunning: running }),
  setStatus: (status) => set({ status }),
  tick: () => {
    const { remainingSeconds, isRunning } = get();
    if (isRunning && remainingSeconds > 0) {
      set({ remainingSeconds: remainingSeconds - 1 });
    }
  },
  reset: () =>
    set({
      sessionId: null,
      status: "idle",
      remainingSeconds: 25 * 60,
      focusDuration: 25,
      breakDuration: 5,
      currentSession: 1,
      isRunning: false,
      startedAt: null,
    }),
}));
