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
    focusing: { label: "Focusing", color: "bg-primary" },
    on_break: { label: "On Break", color: "bg-tertiary" },
    idle: { label: "Idle", color: "bg-zinc-600" },
    completed: { label: "Completed", color: "bg-tertiary" },
  };

  const statusInfo = statusConfig[participant.status as keyof typeof statusConfig] || statusConfig.idle;

  return (
    <div className="gradient-border">
      <div className="gradient-border-surface rounded-[29px] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-zinc-300">
            {initial}
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{name}</span>
              <span className={`h-2 w-2 rounded-full ${statusInfo.color}`} />
            </div>
            <span className="text-xs text-zinc-500">
              {statusInfo.label}
            </span>
          </div>
        </div>

        {participant.task && (
          <div className="mt-3 rounded-[30px] bg-zinc-900/50 px-3 py-2">
            <p className="text-xs text-zinc-500">Working on</p>
            <p className="text-sm text-zinc-300">{participant.task}</p>
          </div>
        )}
      </div>
    </div>
  );
}
