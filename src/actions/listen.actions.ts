"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getCoupleId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return member?.couple_id || null;
}

export async function createListenSession() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const couple = await getCoupleId(supabase);
  if (!couple) throw new Error("No couple found");

  const { data: session, error } = await supabase
    .from("listen_sessions")
    .insert({
      couple_id: couple,
      status: "idle",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/listen");
  return session.id;
}

export async function getActiveSession() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const couple = await getCoupleId(supabase);
  if (!couple) return null;

  const { data: session } = await supabase
    .from("listen_sessions")
    .select("*")
    .eq("couple_id", couple)
    .in("status", ["idle", "playing", "paused"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return session || null;
}

export async function updatePlaybackState(playback: {
  sessionId: string;
  status: "playing" | "paused" | "idle";
  currentAmbientId?: string | null;
  progressMs?: number;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updates: Record<string, unknown> = {
    status: playback.status,
    updated_at: new Date().toISOString(),
  };
  if (playback.currentAmbientId !== undefined) updates.current_ambient_id = playback.currentAmbientId;
  if (playback.progressMs !== undefined) updates.progress_ms = playback.progressMs;

  const { error } = await supabase
    .from("listen_sessions")
    .update(updates)
    .eq("id", playback.sessionId);

  if (error) throw error;
}
