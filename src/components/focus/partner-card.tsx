"use client";

interface Participant {
  user_id: string;
  status: string;
  task: string | null;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

interface PartnerCardProps {
  participant: Participant;
}

export function PartnerCard({ participant }: PartnerCardProps) {
  const name = participant.profiles?.display_name || "Partner";
  const initial = name[0]?.toUpperCase() || "P";

  const statusConfig = {
    focusing: { label: "Focusing", color: "bg-violet-500" },
    on_break: { label: "On Break", color: "bg-emerald-500" },
    idle: { label: "Idle", color: "bg-zinc-500" },
    completed: { label: "Completed", color: "bg-emerald-500" },
  };

  const statusInfo = statusConfig[participant.status as keyof typeof statusConfig] || statusConfig.idle;

  return (
    <div className="rounded-2xl border border-zinc-800/50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-300">
          {initial}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{name}</span>
            <span className={`h-2 w-2 rounded-full ${statusInfo.color}`} />
          </div>
          <span className="text-xs text-zinc-500">
            {statusInfo.label}
          </span>
        </div>
      </div>

      {participant.task && (
        <div className="mt-3 rounded-xl bg-zinc-900/50 px-3 py-2">
          <p className="text-xs text-zinc-400">Working on</p>
          <p className="text-sm">{participant.task}</p>
        </div>
      )}
    </div>
  );
}
