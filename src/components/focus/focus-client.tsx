"use client";

import { useEffect, useState, useCallback, useRef, useMemo, startTransition } from "react";
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
  const [user, setUser] = useState<{ id: string } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [me, setMe] = useState<Participant | null>(null);
  const [partner, setPartner] = useState<Participant | null>(null);

  useEffect(() => {
    if (!user || !initialSession) return;
    const myPart = initialSession.participants.find((p) => p.user_id === user.id);
    const partnerPart = initialSession.participants.find((p) => p.user_id !== user.id);
    startTransition(() => {
      if (myPart) setMe(myPart);
      if (partnerPart) setPartner(partnerPart);
    });
  }, [initialSession, user]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id } : null);
    });
  }, []);

  useEffect(() => {
    if (!initialSession) return;
    store.setSession(initialSession);
  }, [initialSession]);

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
          if (p.user_id === user?.id) {
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
  }, [user?.id]);

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

  if (!store.sessionId) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 p-6 pt-20">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-xs font-medium tracking-widest uppercase text-primary">
            Focus Together
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Start a session
            </h1>
            <p className="max-w-sm text-sm text-zinc-500">
              Start a shared Pomodoro session. Both you and your partner will see
              the same timer in real time.
            </p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="rounded-[30px] bg-primary px-8 py-3 text-sm font-medium text-text-primary transition-all duration-150 hover:brightness-110"
        >
          Start Focus Session
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-widest uppercase text-primary">
          Focus Together
        </span>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Session #{store.currentSession}
        </h1>
      </div>

      <TimerDisplay
        remainingSeconds={store.remainingSeconds}
        status={store.status}
        isRunning={store.isRunning}
        onStart={() => store.setRunning(true)}
        onPause={() => store.setRunning(false)}
        focusDuration={store.focusDuration}
        breakDuration={store.breakDuration}
      />

      <div className="grid gap-3 sm:grid-cols-2">
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

      {partner && <PartnerCard participant={partner} />}

      {me && <StatsPanel me={me} />}
    </div>
  );
}
