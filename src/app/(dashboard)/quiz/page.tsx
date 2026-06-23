import { getCategories, getCoupleId } from "@/actions/quiz.actions";
import { QuizClient } from "@/components/quiz/quiz-client";

export default async function QuizPage() {
  const [categories, coupleId] = await Promise.all([
    getCategories(),
    getCoupleId(),
  ]);

  return <QuizClient categories={categories} coupleId={coupleId} />;
}
