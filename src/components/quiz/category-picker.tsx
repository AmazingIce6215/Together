"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Laugh,
  Brain,
  Sparkles,
  Flame,
  Film,
  Gamepad2,
  Car,
  Stethoscope,
  Building2,
  Globe,
  Cpu,
  Edit,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  laugh: Laugh,
  brain: Brain,
  sparkles: Sparkles,
  flame: Flame,
  film: Film,
  "gamepad-2": Gamepad2,
  car: Car,
  stethoscope: Stethoscope,
  "building-2": Building2,
  globe: Globe,
  cpu: Cpu,
  edit: Edit,
};

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

interface CategoryPickerProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export function CategoryPicker({ categories, onSelect }: CategoryPickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category, i) => {
        const Icon = category.icon ? iconMap[category.icon] : Globe;
        const color = category.color || "#fff";

        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSelect(category)}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-zinc-800/50 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-xs text-zinc-500">
                {category.description}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
