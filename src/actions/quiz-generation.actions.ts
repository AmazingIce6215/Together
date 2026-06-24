"use server";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateTrivia(count: number = 8) {
  try {
    const prompt = `You are a trivia question generator for a couple's quiz app.

Generate ${count} multiple choice trivia questions as a JSON array. Each object:
{
  "question": "string",
  "options": ["A", "B", "C", "D"],
  "correct_answer": "string" // must match one of the options exactly
}

Make questions fun, interesting, and varied (history, science, geography, pop culture, etc.).
Each must have exactly 4 options with exactly one correct answer.

Output ONLY a raw JSON array starting with [ and ending with ]. No markdown, no code fences, no backticks, no explanation. Valid JSON only.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    let text = completion.choices[0]?.message?.content || "";
    text = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) {
      return { error: "AI response was not valid JSON. Try again." };
    }
    text = text.slice(start, end + 1);

    let parsed: { question: string; options: string[]; correct_answer: string }[];
    try {
      parsed = JSON.parse(text);
    } catch {
      return { error: `AI returned invalid JSON. Response was: ${text.slice(0, 200)}...` };
    }

    const questions = parsed.map((q, i) => ({
      id: `ai-trivia-${Date.now()}-${i}`,
      category: "trivia",
      type: "multiple_choice" as const,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
    }));

    return { questions };
  } catch (e) {
    console.error("Trivia generation failed:", e);
    return {
      error: e instanceof Error ? e.message : "Failed to generate trivia questions",
    };
  }
}
