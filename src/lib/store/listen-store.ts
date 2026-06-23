import { create } from "zustand";
import type { AmbientSound } from "@/lib/types/app";

interface ListenState {
  sessionId: string | null;
  status: "idle" | "playing" | "paused";
  currentAmbient: AmbientSound | null;
  progressMs: number;
  volume: number;
  isMuted: boolean;

  setSession: (session: {
    id: string;
    status: string;
    current_ambient_id: string | null;
    progress_ms: number;
  }) => void;
  setStatus: (status: "idle" | "playing" | "paused") => void;
  setCurrentAmbient: (ambient: AmbientSound | null) => void;
  setProgress: (ms: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  reset: () => void;
}

export const useListenStore = create<ListenState>((set) => ({
  sessionId: null,
  status: "idle",
  currentAmbient: null,
  progressMs: 0,
  volume: 0.5,
  isMuted: false,

  setSession: (session) =>
    set({
      sessionId: session.id,
      status: session.status as ListenState["status"],
      progressMs: session.progress_ms || 0,
    }),

  setStatus: (status) => set({ status }),
  setCurrentAmbient: (ambient) => set({ currentAmbient: ambient }),
  setProgress: (ms) => set({ progressMs: ms }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  reset: () =>
    set({
      sessionId: null,
      status: "idle",
      currentAmbient: null,
      progressMs: 0,
    }),
}));
