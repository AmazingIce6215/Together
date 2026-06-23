"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireUserId, getCurrentUserId } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quiz_categories")
    .select("*")
    .order("sort_order");
  return data || [];
}

async function getUsedQuestionIds(coupleId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from("quiz_sessions")
    .select("questions")
    .eq("couple_id", coupleId)
    .not("questions", "is", null);

  if (!sessions) return [];

  const ids = new Set<string>();
  for (const s of sessions) {
    if (Array.isArray(s.questions)) {
      for (const id of s.questions) {
        if (id) ids.add(id);
      }
    }
  }
  return Array.from(ids);
}

export async function countAvailableQuestions(
  categoryId: string,
  mode: string
): Promise<number> {
  const supabase = await createClient();
  const couple = await getCoupleId();
  if (!couple) return 0;

  const usedIds = await getUsedQuestionIds(couple);

  let query = supabase
    .from("quiz_questions")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId)
    .eq("mode", mode);

  if (usedIds.length > 0) {
    query = query.not("id", "in", `(${usedIds.join(",")})`);
  }

  const { count } = await query;
  return count ?? 0;
}

export async function getQuestions(categoryId: string, mode: string) {
  const supabase = await createClient();

  const couple = await getCoupleId();
  if (!couple) return [];

  const usedIds = await getUsedQuestionIds(couple);

  let query = supabase
    .from("quiz_questions")
    .select("*")
    .eq("category_id", categoryId)
    .eq("mode", mode);

  if (usedIds.length > 0) {
    query = query.not("id", "in", `(${usedIds.join(",")})`);
  }

  const { data } = await query;
  return data || [];
}

export async function createQuizSession(categoryId: string, mode: string) {
  const userId = await requireUserId();

  const supabase = await createClient();

  const couple = await getCoupleId();
  if (!couple) throw new Error("No couple found");

  const questions = await getQuestions(categoryId, mode);
  if (questions.length === 0) throw new Error("No questions available");

  const questionIds = questions.map((q: { id: string }) => q.id);
  const { data: session, error } = await supabase
    .from("quiz_sessions")
    .insert({
      couple_id: couple,
      category_id: categoryId,
      mode,
      status: "in_progress",
      questions: questionIds,
      scores: {},
      created_by: userId,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/quiz");
  return session.id;
}

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  answer: string
) {
  const userId = await requireUserId();

  const supabase = await createClient();

  const { error } = await supabase.from("quiz_responses").upsert(
    {
      session_id: sessionId,
      question_id: questionId,
      user_id: userId,
      answer,
    },
    { onConflict: "session_id,question_id,user_id" }
  );

  if (error) throw error;

  return { success: true };
}

export async function getSession(sessionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();
  return data;
}

export async function getResponsesForQuestion(
  sessionId: string,
  questionId: string
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quiz_responses")
    .select("user_id, answer")
    .eq("session_id", sessionId)
    .eq("question_id", questionId);
  return data || [];
}

export async function getSessionQuestions(sessionId: string) {
  const supabase = await createClient();
  const session = await getSession(sessionId);
  if (!session || !session.questions || session.questions.length === 0) return [];

  const { data } = await supabase
    .from("quiz_questions")
    .select("*")
    .in("id", session.questions);

  // Preserve the order from the session's questions array
  const questionMap = new Map((data || []).map((q: { id: string }) => [q.id, q]));
  return session.questions
    .map((id: string) => questionMap.get(id))
    .filter(Boolean);
}

export async function getActiveSession() {
  const coupleId = await getCoupleId();
  if (!coupleId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("quiz_sessions")
    .select("id, category_id, mode, status, created_by")
    .eq("couple_id", coupleId)
    .eq("status", "in_progress")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}

export async function getCoupleId() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const supabase = await createClient();

  const { data: member } = await supabase
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", userId)
    .maybeSingle();

  return member?.couple_id || null;
}
