import Link from "next/link";
import { Play, BookOpen, PenLine } from "lucide-react";

const pillars = [
  {
    number: "01",
    title: "Watch",
    description: "Video lectures from Lecturio, Dr. Najeeb, Osmosis, Sketchy, Pixorize, Boards & Beyond, and Kaplan.",
    href: "/watch",
    icon: Play,
    accent: "bg-primary",
    iconColor: "text-text-primary",
  },
  {
    number: "02",
    title: "Read",
    description: "Notes, textbooks, and radiology references — MedSchoolBro, history taking guides, and full textbook library.",
    href: "/read",
    icon: BookOpen,
    accent: "bg-secondary",
    iconColor: "text-text-primary",
  },
  {
    number: "03",
    title: "Practice",
    description: "Question banks for AMBOSS, UWorld, NBME, Pathoma, AnKing flashcards, and bundled USMLE prep resources.",
    href: "/practice",
    icon: PenLine,
    accent: "bg-tertiary",
    iconColor: "text-text-primary",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 py-10">
      <div className="flex flex-col gap-2 text-center">
        <span className="text-xs font-medium tracking-widest uppercase text-primary">
          Medical Study Resources
        </span>
        <h1 className="text-4xl font-semibold tracking-tight">
          Three ways to make an impact
        </h1>
        <p className="mx-auto max-w-lg text-sm text-zinc-500">
          Everything you need for medical school — video lectures, notes, textbooks, and question banks — curated in one place.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="gradient-border shadow-elevated group transition-all duration-150 hover:brightness-110"
            >
              <div className="gradient-border-surface flex flex-col rounded-[29px] p-6">
                <div className="flex items-start justify-between">
                  <span className="text-[64px] font-semibold leading-[0.8] tracking-[-0.04em] text-zinc-800">
                    {pillar.number}
                  </span>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${pillar.accent} transition-transform duration-150 group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${pillar.iconColor}`} />
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <h2 className={`text-lg font-semibold tracking-tight ${pillar.accent === "bg-primary" ? "text-primary" : pillar.accent === "bg-secondary" ? "text-secondary" : "text-tertiary"}`}>
                    {pillar.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {pillar.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-150 group-hover:gap-1.5">
                    Explore resources
                    <ArrowRightIcon />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}
