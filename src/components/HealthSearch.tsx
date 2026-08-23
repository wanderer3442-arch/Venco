"use client";

import { useState } from "react";
import healthDb from "../../data/health-db.json";

type Entry = (typeof healthDb)[number];

export default function HealthSearch() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Entry | null>(null);

  const filtered = q.trim().length < 2 ? [] : (healthDb as Entry[]).filter((h) =>
    [h.slug, h.title].join(" ").toLowerCase().includes(q.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border p-6">
        <h2 className="font-semibold text-primary-dark">What is your current health problem?</h2>
        <p className="text-xs text-foreground/60">Type diabetes, low muscle mass, hypertension… (WHO + Mayo curated, not AI, with sources).</p>
        <div className="relative mt-3">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setSelected(null); }}
            placeholder="e.g., diabetes, low muscle mass, hypertension"
            className="w-full rounded-full border px-5 py-3 text-sm bg-paper/60 focus:border-primary outline-none"
          />
          {filtered.length > 0 && !selected && (
            <div className="absolute z-10 mt-1 w-full rounded-2xl border bg-white shadow-xl overflow-hidden">
              {filtered.map((h) => (
                <button key={h.slug} onClick={() => { setSelected(h); setQ(h.title); }} className="w-full text-left px-4 py-2.5 hover:bg-paper text-sm">
                  <div className="font-medium">{h.title}</div>
                  <div className="text-xs text-foreground/60 truncate">{h.slug}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted mt-2">Try: diabetes, hypertension, low muscle mass, obesity, anemia</p>
      </div>

      {selected && (
        <div className="rounded-2xl bg-white border p-6 space-y-3">
          <h3 className="font-display font-bold text-primary-dark">{selected.title}</h3>
          <a href={selected.sourceUrl.split(" + ")[0]} target="_blank" className="text-xs text-primary underline break-all">{selected.sourceUrl}</a>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-paper border p-3">
              <div className="font-semibold text-primary-dark">Meal guidance</div>
              <div className="text-foreground/70 mt-1">{selected.mealGuidance}</div>
            </div>
            <div className="rounded-xl bg-primary text-white p-3">
              <div className="font-semibold">Exercise guidance</div>
              <div className="text-white/90 mt-1">{selected.exerciseGuidance}</div>
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs">This will be suggested in your Meal and Exercise plans (Pro). Consult clinician — not diagnosis. <a href="/meal" className="underline text-primary">Go to Meal →</a> <a href="/exercises" className="ml-2 underline text-primary">Exercises →</a></div>
        </div>
      )}

      {!selected && (
        <div className="rounded-2xl bg-white border p-6">
          <h3 className="font-semibold text-primary-dark">Browse all (12)</h3>
          <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
            {(healthDb as Entry[]).map((h) => (
              <button key={h.slug} onClick={() => { setSelected(h); setQ(h.title); }} className="text-left rounded-lg border bg-paper px-3 py-2 hover:border-primary">
                <div className="font-medium">{h.title}</div>
                <div className="text-muted truncate">{h.slug}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
