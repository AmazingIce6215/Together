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

export async function createFocusSession() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const couple = await getCoupleId(supabase);
  if (!couple) throw new Error("No couple found");

  const { data: session, error } = await supabase
    .from("focus_sessions")
    .insert({
      couple_id: couple,
      status: "focus",
      focus_duration: 25,
      break_duration: 5,
      long_break_duration: 15,
      sessions_before_long_break: 4,
      current_session: 1,
      started_at: new Date().toISOString(),
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  // Join the session
  await supabase.from("focus_participants").insert({
    session_id: session.id,
    user_id: user.id,
    status: "focusing",
  });

  revalidatePath("/focus");
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
    .from("focus_sessions")
    .select("*")
    .eq("couple_id", couple)
    .in("status", ["focus", "break"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!session) return null;

  const { data: participants } = await supabase
    .from("focus_participants")
    .select("*, profiles:user_id(display_name, avatar_url)")
    .eq("session_id", session.id);

  return { ...session, participants: participants || [] };
}

export async function updateFocusTask(task: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: participant } = await supabase
    .from("focus_participants")
    .select("id")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })
    .limit(1)
    .single();

  if (!participant) throw new Error("Not in a session");

  await supabase
    .from("focus_participants")
    .update({ task })
    .eq("id", participant.id);

  revalidatePath("/focus");
}

export async function updateFocusGoal(goal: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: participant } = await supabase
    .from("focus_participants")
    .select("id")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })
    .limit(1)
    .single();

  if (!participant) throw new Error("Not in a session");

  const { error } = await supabase
    .from("focus_participants")
    .update({ goal })
    .eq("id", participant.id);

  if (error) throw error;
  revalidatePath("/focus");
}
