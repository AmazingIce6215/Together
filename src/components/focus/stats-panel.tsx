"use client";

interface Participant {
  focus_minutes_today: number;
  daily_goal_minutes: number;
}

interface StatsPanelProps {
  me: Participant;
}

export function StatsPanel({ me }: StatsPanelProps) {
  const progress = Math.min(
    (me.focus_minutes_today / me.daily_goal_minutes) * 100,
    100
  );

  return (
    <div className="gradient-border">
      <div className="gradient-border-surface rounded-[29px] p-5">
        <h3 className="mb-4 text-sm font-medium text-foreground">Today&apos;s Progress</h3>

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Focus time</span>
          <span className="font-medium text-zinc-300">
            {me.focus_minutes_today} / {me.daily_goal_minutes} min
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-900">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-zinc-500">
          {progress >= 100
            ? "Daily goal reached! Great work!"
            : `${Math.round(progress)}% of daily goal`}
        </p>
      </div>
    </div>
  );
}
