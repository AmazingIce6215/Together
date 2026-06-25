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
      {sounds.map((sound, i) => {
        const isActive = activeId === sound.id;
        return (
          <motion.button
            key={sound.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 26,
              delay: i * 0.04,
            }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(sound)}
            className={`group relative overflow-hidden rounded-[30px] border p-5 transition-colors duration-300 ${
              isActive
                ? "border-primary"
                : "border-border hover:border-zinc-600"
            }`}
          >
            {isActive && (
              <>
                <motion.span
                  layoutId="track-glow"
                  className="absolute inset-0 rounded-[30px] bg-primary/10"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-[30px] ring-1 ring-primary/40"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}
            <div className="relative flex flex-col items-center gap-2">
              <span className="text-2xl transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
                {ICON_MAP[sound.icon] || "🎵"}
              </span>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-zinc-400 group-hover:text-zinc-200"
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