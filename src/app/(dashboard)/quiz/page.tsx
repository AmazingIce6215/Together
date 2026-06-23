import { getCategories } from "@/actions/quiz.actions";
import { QuizClient } from "@/components/quiz/quiz-client";

export default async function QuizPage() {
  const categories = await getCategories();

  return <QuizClient categories={categories} />;
}
