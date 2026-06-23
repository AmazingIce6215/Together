"use client";

import { useState } from "react";
import { CategoryPicker } from "@/components/quiz/category-picker";
import { ModeSelector } from "@/components/quiz/mode-selector";
import { GameBoard } from "@/components/quiz/game-board";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

interface QuizClientProps {
  categories: Category[];
}

type Screen = "categories" | "modes" | "game";

export function QuizClient({ categories }: QuizClientProps) {
  const [screen, setScreen] = useState<Screen>("categories");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  function handleCategorySelect(category: Category) {
    setSelectedCategory(category);
    setScreen("modes");
  }

  function handleModeSelect(mode: string) {
    setSelectedMode(mode);
    setScreen("game");
  }

  function handleSessionCreated(id: string) {
    setSessionId(id);
  }

  function handleBack() {
    if (screen === "modes") {
      setSelectedCategory(null);
      setScreen("categories");
    } else if (screen === "game") {
      setSelectedMode(null);
      setSessionId(null);
      setScreen("modes");
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {screen === "categories" && (
        <>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight">Quiz</h1>
            <p className="text-sm text-zinc-400">Choose a category</p>
          </div>
          <CategoryPicker
            categories={categories}
            onSelect={handleCategorySelect}
          />
        </>
      )}

      {screen === "modes" && selectedCategory && (
        <>
          <div className="flex flex-col gap-1">
            <button
              onClick={handleBack}
              className="self-start text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              &larr; Back to categories
            </button>
            <h1 className="text-xl font-semibold tracking-tight">
              {selectedCategory.name}
            </h1>
            <p className="text-sm text-zinc-400">
              {selectedCategory.description || "Choose a game mode"}
            </p>
          </div>
          <ModeSelector
            categoryId={selectedCategory.id}
            onSelect={handleModeSelect}
            onSessionCreated={handleSessionCreated}
          />
        </>
      )}

      {screen === "game" && selectedCategory && selectedMode && (
        <>
          <div className="flex flex-col gap-1">
            <button
              onClick={handleBack}
              className="self-start text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              &larr; Back to modes
            </button>
            <h1 className="text-xl font-semibold tracking-tight">
              {selectedCategory.name} &middot; {formatModeName(selectedMode)}
            </h1>
          </div>
          <GameBoard
            categoryId={selectedCategory.id}
            mode={selectedMode}
            sessionId={sessionId}
            onSessionCreated={handleSessionCreated}
          />
        </>
      )}
    </div>
  );
}

function formatModeName(mode: string): string {
  return mode
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
