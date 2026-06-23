"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { CategoryPicker } from "@/components/quiz/category-picker";
import { ModeSelector } from "@/components/quiz/mode-selector";
import { GameBoard } from "@/components/quiz/game-board";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, X } from "lucide-react";

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
  coupleId: string | null;
}

interface PartnerSession {
  id: string;
  category_id: string;
  mode: string;
}

type Screen = "categories" | "modes" | "game";

export function QuizClient({ categories, coupleId }: QuizClientProps) {
  const [screen, setScreen] = useState<Screen>("categories");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [partnerSession, setPartnerSession] = useState<PartnerSession | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [categoryMap, setCategoryMap] = useState<Map<string, Category>>(new Map());

  // Build category lookup map
  useEffect(() => {
    const map = new Map<string, Category>();
    for (const c of categories) map.set(c.id, c);
    setCategoryMap(map);
  }, [categories]);

  // Check for existing active session on mount + subscribe
  useEffect(() => {
    if (!coupleId) return;

    const supabase = createClient();

    // Check for existing active session
    supabase
      .from("quiz_sessions")
      .select("id, category_id, mode, created_by")
      .eq("couple_id", coupleId)
      .eq("status", "in_progress")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setPartnerSession({
            id: data.id,
            category_id: data.category_id,
            mode: data.mode,
          });
        }
      });

    // Subscribe to new sessions
    const channel = supabase
      .channel("quiz-partner-sessions")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "quiz_sessions",
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload) => {
          const s = payload.new as {
            id: string;
            category_id: string;
            mode: string;
            status: string;
          };
          if (s.status === "in_progress") {
            setPartnerSession({
              id: s.id,
              category_id: s.category_id,
              mode: s.mode,
            });
            setDismissed(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const handleJoinSession = useCallback(() => {
    if (!partnerSession) return;

    // Look up category from the map or find by id
    const cat = categoryMap.get(partnerSession.category_id);
    if (cat) {
      setSelectedCategory(cat);
      setSelectedMode(partnerSession.mode);
      setSessionId(partnerSession.id);
      setScreen("game");
    }
  }, [partnerSession, categoryMap]);

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

  const catName = partnerSession
    ? categoryMap.get(partnerSession.category_id)?.name ?? "a quiz"
    : "";

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Partner session banner */}
      <AnimatePresence>
        {partnerSession && !dismissed && screen === "categories" && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-800/30 bg-emerald-950/20 p-4"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-3 top-3 text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Gamepad2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-emerald-300">
                  Partner started a game!
                </p>
                <p className="text-xs text-zinc-400">
                  {catName} &middot; {formatModeName(partnerSession.mode)}
                </p>
              </div>
              <button
                onClick={handleJoinSession}
                className="rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                Join
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
