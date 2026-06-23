"use client";

import { useState, useCallback } from "react";
import { Check, Pencil } from "lucide-react";

interface GoalInputProps {
  label: string;
  value: string;
  placeholder: string;
  onSave: (value: string) => Promise<void>;
}

export function GoalInput({ label, value, placeholder, onSave }: GoalInputProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (text.trim() === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onSave(text.trim());
    setSaving(false);
    setEditing(false);
  }, [text, value, onSave]);

  if (!editing) {
    return (
      <div className="rounded-2xl border border-zinc-800/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500">{label}</span>
            <span className="text-sm">
              {value || <span className="text-zinc-600">{placeholder}</span>}
            </span>
          </div>
          <button
            onClick={() => {
              setText(value);
              setEditing(true);
            }}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800/50 p-4">
      <span className="mb-2 block text-xs text-zinc-500">{label}</span>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-zinc-600"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setEditing(false);
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
        >
          {saving ? "..." : <Check className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
