"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useFocusStore } from "@/lib/store/focus-store";
import { createFocusSession, updateFocusTask, updateFocusGoal } from "@/actions/focus.actions";
import { TimerDisplay } from "@/components/focus/timer-display";
import { PartnerCard } from "@/components/focus/partner-card";
import { GoalInput } from "@/components/focus/goal-input";
import { StatsPanel } from "@/components/focus/stats-panel";

interface Participant {
  id: string;
  user_id: string;
  status: string;
  task: string | null;
  goal: string | null;
  daily_goal_minutes: number;
  focus_minutes_today: number;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

interface SessionData {
  id: string;
  status: string;
  focus_duration: number;
  break_duration: number;
  current_session: number;
  started_at: string | null;
  participants: Participant[];
}

interface FocusClientProps {
  initialSession: SessionData | null;
}

export function FocusClient({ initialSession }: FocusClientProps) {
  const store = useFocusStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [partner, setPartner] = useState<Participant | null>(null);
  const [me, setMe] = useState<Participant | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize from server data
  useEffect(() => {
    if (initialSession) {
      store.setSession(initialSession);
    }
  }, [initialSession]);

  // Get current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        if (initialSession) {
          const myPart = initialSession.participants.find(
            (p) => p.user_id === user.id
          );
          const partnerPart = initialSession.participants.find(
            (p) => p.user_id !== user.id
          );
          if (myPart) setMe(myPart);
          if (partnerPart) setPartner(partnerPart);
        }
      }
    });
  }, [initialSession]);

  // Tick every second when running
  useEffect(() => {
    if (store.isRunning) {
      intervalRef.current = setInterval(() => {
        store.tick();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [store.isRunning, store.tick]);

  // Subscribe to real-time focus updates
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("focus-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "focus_sessions",
        },
        (payload) => {
          const session = payload.new as {
            id: string;
            status: string;
            focus_duration: number;
            break_duration: number;
            current_session: number;
            started_at: string | null;
          };
          store.setSession(session);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "focus_participants",
        },
        (payload) => {
          const p = payload.new as Participant;
          if (p.user_id === userId) {
            setMe(p);
          } else {
            setPartner(p);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleStart = useCallback(async () => {
    try {
      const id = await createFocusSession();
      store.setSession({
        id,
        status: "focus",
        focus_duration: 25,
        break_duration: 5,
        current_session: 1,
        started_at: new Date().toISOString(),
      });
      store.setRunning(true);
    } catch (e) {
      console.error("Failed to start focus session", e);
    }
  }, []);

  const handleTaskUpdate = useCallback(async (task: string) => {
    await updateFocusTask(task);
    if (me) setMe({ ...me, task });
  }, [me]);

  const handleGoalUpdate = useCallback(async (goal: string) => {
    await updateFocusGoal(goal);
    if (me) setMe({ ...me, goal });
  }, [me]);

  // No active session — show start screen
  if (!store.sessionId) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 p-6 pt-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
            <TimerIcon className="h-7 w-7 text-violet-400" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Focus Together
          </h1>
          <p className="max-w-sm text-sm text-zinc-400">
            Start a shared Pomodoro session. Both you and your partner will see
            the same timer in real time.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="rounded-xl bg-violet-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-400"
        >
          Start Focus Session
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Focus Together
        </h1>
        <p className="text-sm text-zinc-400">
          Session #{store.currentSession}
        </p>
      </div>

      {/* Timer */}
      <TimerDisplay
        remainingSeconds={store.remainingSeconds}
        status={store.status}
        isRunning={store.isRunning}
        onStart={() => store.setRunning(true)}
        onPause={() => store.setRunning(false)}
        focusDuration={store.focusDuration}
        breakDuration={store.breakDuration}
      />

      {/* Partner status */}
      <div className="grid gap-4 sm:grid-cols-2">
        {me && (
          <GoalInput
            label="Your task"
            value={me.task || ""}
            placeholder="e.g. Studying Medicine"
            onSave={handleTaskUpdate}
          />
        )}
        {me && (
          <GoalInput
            label="Today's goal"
            value={me.goal || ""}
            placeholder="e.g. Study 2 hours"
            onSave={handleGoalUpdate}
          />
        )}
      </div>

      {/* Partner card */}
      {partner && <PartnerCard participant={partner} />}

      {/* Stats */}
      {me && <StatsPanel me={me} />}
    </div>
  );
}

function TimerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
