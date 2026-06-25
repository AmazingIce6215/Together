import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { resources } from "@/data/resources";

export default function ReadPage() {
  const categories = resources.filter((r) => r.pillar === "read");

  return (
    <div className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-[30px] p-1.5 text-zinc-500 transition-colors duration-150 hover:text-zinc-300">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-xs font-medium tracking-widest uppercase text-secondary">
            Read
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Notes &amp; Textbooks</h1>
        <p className="text-sm text-zinc-500">
          Comprehensive notes, reference materials, and radiology learning resources.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="gradient-border shadow-elevated group">
            <div className="gradient-border-surface flex flex-col gap-4 rounded-[29px] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                  <BookOpen className="h-4 w-4 text-secondary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">{cat.title}</h2>
              </div>
              <p className="text-xs leading-relaxed text-zinc-500">{cat.description}</p>
              <div className="flex flex-col gap-1.5">
                {cat.items.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[30px] border border-border px-3 py-2 text-xs text-zinc-400 transition-all duration-150 hover:border-zinc-600 hover:text-zinc-200"
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="ml-1 text-zinc-600">→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
