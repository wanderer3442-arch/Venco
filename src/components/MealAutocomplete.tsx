"use client";

import { useEffect, useRef, useState } from "react";
import { searchFoods, type Food } from "@/lib/meal";

export default function MealAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  onPick,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onPick?: (food: Food) => void;
}) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Food[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      const last = value.split(",").pop()!.trim();
      if (last.length < 2) { setResults([]); return; }
      setResults(searchFoods(last, 10));
    }, 120);
    return () => clearTimeout(id);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block">
        <span className="text-xs font-semibold tracking-widest uppercase text-muted">{label}</span>
        <input
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60 focus:border-primary outline-none"
        />
      </label>
      {open && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-2xl border bg-paper shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {results.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                const hasComma = value.includes(",");
                if (hasComma) {
                  const parts = value.split(",");
                  parts[parts.length - 1] = f.name;
                  const next = parts.map((s) => s.trim()).filter(Boolean).join(", ") + ", ";
                  onChange(next);
                } else {
                  onChange(f.name);
                }
                onPick?.(f);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-paper flex items-center justify-between gap-2 text-sm"
            >
              <span className="font-medium text-foreground">{f.name}</span>
              <span className="text-xs text-foreground/60 whitespace-nowrap">
                {f.kcal} kcal • {f.protein}p • {f.region}
              </span>
            </button>
          ))}
          <div className="px-3 py-2 text-xs text-muted border-t bg-paper/30">Try typing “bre” → Bread, Bhel, Brown rice, etc.</div>
        </div>
      )}
    </div>
  );
}
