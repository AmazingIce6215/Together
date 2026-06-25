"use client";

import { motion } from "framer-motion";
import type { AmbientSound } from "@/lib/types/app";

interface TrackListProps {
  sounds: AmbientSound[];
  activeId: string | null;
  onSelect: (sound: AmbientSound) => void;
}

const ICON_MAP: Record<string, string> = {
  "cloud-rain": "🌧",
  trees: "🌲",
  coffee: "☕",
  waves: "🌊",
  flame: "🔥",
  radio: "📻",
};

export function TrackList({ sounds, activeId, onSelect }: TrackListProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {sounds.map((sound) => {
        const isActive = activeId === sound.id;
        return (
          <motion.button
            key={sound.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(sound)}
            className={`rounded-[30px] border p-5 transition-all duration-150 ${
              isActive
                ? "border-primary bg-primary/10"
                : "border-border hover:border-zinc-600 hover:bg-zinc-900/50"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">
                {ICON_MAP[sound.icon] || "🎵"}
              </span>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-primary" : "text-zinc-400"
                }`}
              >
                {sound.name}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
