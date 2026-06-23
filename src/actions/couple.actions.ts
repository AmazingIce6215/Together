"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, requireUserId, getCurrentUserId } from "@/lib/supabase/server";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TOG-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createCouple() {
  const userId = await requireUserId();

  const supabase = await createClient();

  let inviteCode: string;
  let attempts = 0;

  do {
    inviteCode = generateInviteCode();
    const { data: existing } = await supabase
      .from("couples")
      .select("id")
      .eq("invite_code", inviteCode)
      .maybeSingle();
    if (!existing) break;
    attempts++;
  } while (attempts < 5);

  const { data: couple, error: coupleError } = await supabase
    .from("couples")
    .insert({ invite_code: inviteCode, created_by: userId })
    .select()
    .single();

  if (coupleError) throw coupleError;

  const { error: memberError } = await supabase
    .from("couple_members")
    .insert({ couple_id: couple.id, user_id: userId });

  if (memberError) throw memberError;

  revalidatePath("/", "layout");
  return { invite_code: inviteCode };
}

export async function joinCouple(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Not authenticated" };

  const supabase = await createClient();

  const inviteCode = formData.get("inviteCode") as string;
  if (!inviteCode) return { error: "Invite code is required" };

  const code = inviteCode.toUpperCase().trim();

  const { data: couple, error: coupleError } = await supabase
    .from("couples")
    .select("id")
    .eq("invite_code", code)
    .maybeSingle();

  if (coupleError || !couple) return { error: "Invalid invite code" };

  const { error: memberError } = await supabase
    .from("couple_members")
    .insert({ couple_id: couple.id, user_id: userId });

  if (memberError) {
    if (memberError.code === "23505") {
      return { error: "You're already in this room" };
    }
    return { error: "Failed to join room" };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function getCurrentCouple() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const supabase = await createClient();

  const { data: member } = await supabase
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!member) return null;

  const { data: couple } = await supabase
    .from("couples")
    .select("id, invite_code, created_by")
    .eq("id", member.couple_id)
    .single();

  if (!couple) return null;

  const { data: members } = await supabase
    .from("couple_members")
    .select("user_id")
    .eq("couple_id", couple.id);

  const memberIds = (members || []).map((m: { user_id: string }) => m.user_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", memberIds);

  return {
    id: couple.id,
    invite_code: couple.invite_code,
    members: profiles || [],
  };
}
