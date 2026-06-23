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
            className={`flex flex-col items-center gap-2 rounded-2xl border p-5 transition-colors ${
              isActive
                ? "border-violet-500/50 bg-violet-500/10"
                : "border-zinc-800/50 hover:bg-zinc-900"
            }`}
          >
            <span className="text-2xl">
              {ICON_MAP[sound.icon] || "🎵"}
            </span>
            <span
              className={`text-sm font-medium ${
                isActive ? "text-violet-300" : "text-zinc-300"
              }`}
            >
              {sound.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
