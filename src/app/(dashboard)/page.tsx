import { Heart, Music, Timer } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCouple } from "@/actions/couple.actions";
import { CreateRoomForm } from "@/components/quiz/create-room-form";
import { JoinRoomForm } from "@/components/quiz/join-room-form";
import { getCurrentUserId } from "@/lib/supabase/server";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const { error } = await searchParams;

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const couple = await getCurrentCouple();

  if (!couple) {
    return (
      <div className="flex flex-col items-center justify-center gap-12 p-6 pt-20">
        {error && (
          <div className="w-full max-w-sm rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">
            {error}
          </div>
        )}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
            <Heart className="h-6 w-6 text-zinc-400" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Welcome, {profile?.display_name || "there"}
          </h1>
          <p className="text-sm text-zinc-400">
            Create a room or join your partner&apos;s
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="rounded-2xl border border-zinc-800/50 p-6">
            <CreateRoomForm />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-zinc-500">or</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/50 p-6">
            <h2 className="mb-4 text-center text-sm font-medium">
              Join existing room
            </h2>
            <JoinRoomForm />
          </div>
        </div>
      </div>
    );
  }

  const partner = couple.members.find(
    (m: { id: string }) => m.id !== userId
  );

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hey, {profile?.display_name || "there"}
          </h1>
          <p className="text-sm text-zinc-400">
            What would you like to do together today?
          </p>
        </div>
        <code className="hidden rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-xs font-mono text-zinc-500 sm:block">
          {couple.invite_code}
        </code>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/quiz"
          className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
            <GamepadIcon className="h-5 w-5 text-black" />
          </div>
          <h2 className="mb-1 text-sm font-semibold">Quiz</h2>
          <p className="text-xs text-zinc-500">
            Play games, answer questions, discover each other
          </p>
        </Link>

        <Link
          href="/listen"
          className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Music className="h-5 w-5 text-emerald-400" />
          </div>
          <h2 className="mb-1 text-sm font-semibold">Listen Together</h2>
          <p className="text-xs text-zinc-500">
            Share music and ambient sounds in real time
          </p>
        </Link>

        <Link
          href="/focus"
          className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <Timer className="h-5 w-5 text-violet-400" />
          </div>
          <h2 className="mb-1 text-sm font-semibold">Focus Together</h2>
          <p className="text-xs text-zinc-500">
            Study together with a shared Pomodoro timer
          </p>
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-800/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-900 text-xs font-medium text-zinc-300">
              {profile?.display_name?.[0]?.toUpperCase() || "U"}
            </div>
            {partner && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-900 text-xs font-medium text-zinc-300">
                {partner.display_name?.[0]?.toUpperCase() || "P"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500">
              {partner
                ? partner.display_name || "Your partner"
                : "Your partner"}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {partner ? "Online" : "Waiting for partner..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GamepadIcon({ className }: { className?: string }) {
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
        d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"
      />
    </svg>
  );
}
