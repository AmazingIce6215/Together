"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient, requireUserId, getCurrentUserId } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GeneratedQuestion {
  question: string;
  options?: string[];
  correctAnswer?: string;
}

function buildPrompt(category: string, mode: string, count: number): string {
  const modeInstructions: Record<string, string> = {
    classic:
      "Multiple choice trivia question with 4 options and one correct answer.",
    guess_partner:
      'A question that asks about personal preferences or opinions. Has 2-4 options. NO correct answer — the "correct" answer is whatever the person chooses. Format options as choices.',
    this_or_that:
      'A "This or That" question with exactly 2 compelling options. NO correct answer.',
    speed_round:
      "Multiple choice trivia question with 4 options and one correct answer. Make it relatively easy so it can be answered quickly.",
    never_have_i_ever:
      'A "Never Have I Ever" statement. Do NOT include options. The statement should start with "Never have I ever".',
    would_you_rather:
      'A "Would You Rather" question with exactly 2 equally challenging/unappealing options. NO correct answer.',
    truth:
      "An open-ended personal/romantic question. Do NOT include options. Should encourage honest answers.",
  };

  const modeInstruction = modeInstructions[mode] || modeInstructions.classic;

  return `You are a JSON generator for a couple's quiz app called "Together". Category: "${category}".

Each question must be appropriate for couples — romantic, fun, or interesting.

Mode: ${mode}
${modeInstruction}

Generate ${count} questions as a JSON array. Each object:
{
  "question": "string",
  "options": ["string", ...]  // 2-4 options; OMIT for truth/never_have_i_ever
  "correctAnswer": "string"   // OMIT for guess_partner/this_or_that/would_you_rather/never_have_i_ever/truth
}

Output ONLY a raw JSON array starting with [ and ending with ]. No markdown, no code fences, no backticks, no explanation, no extra text. Valid JSON only.`;
}

export async function generateQuestions(
  categoryId: string,
  mode: string,
  count: number = 15
): Promise<{ questions: { id: string }[] } | { error: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { error: "Not authenticated" };

    const supabase = await createClient();

    const { data: category } = await supabase
      .from("quiz_categories")
      .select("name")
      .eq("id", categoryId)
      .single();

    if (!category) return { error: "Category not found" };

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = buildPrompt(category.name, mode, count);

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Strip markdown code fences if present
    text = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    // Find the first [ and last ] to extract the JSON array
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) {
      return { error: "AI response was not valid JSON. Try again." };
    }
    text = text.slice(start, end + 1);

    let parsed: GeneratedQuestion[];
    try {
      parsed = JSON.parse(text);
    } catch {
      return {
        error: `AI returned invalid JSON. Response was: ${text.slice(0, 200)}...`,
      };
    }

    const inserted: { id: string }[] = [];

    for (const q of parsed) {
      const { data } = await supabase
        .from("quiz_questions")
        .insert({
          category_id: categoryId,
          mode,
          question: q.question,
          options: q.options || null,
          correct_answer: q.correctAnswer || null,
          created_by: userId,
        })
        .select("id")
        .single();

      if (data) inserted.push(data);
    }

    return { questions: inserted };
  } catch (e) {
    console.error("Quiz generation failed:", e);
    return {
      error:
        e instanceof Error ? e.message : "Failed to generate questions",
    };
  }
}
