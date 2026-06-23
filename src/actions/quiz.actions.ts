"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quiz_categories")
    .select("*")
    .order("sort_order");
  return data || [];
}

export async function getQuestions(categoryId: string, mode: string) {
  const supabase = await createClient();

  const couple = await getCoupleId();
  if (!couple) return [];

  const { data } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("category_id", categoryId)
    .eq("mode", mode);

  return data || [];
}

export async function createQuizSession(categoryId: string, mode: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

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
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

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

async function getCoupleId() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = await createClient();

  const { data: member } = await supabase
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", userId)
    .maybeSingle();

  return member?.couple_id || null;
}
