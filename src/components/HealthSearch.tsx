"use client";

import { useEffect, useState } from "react";
import healthDb from "../../data/health-db.json";

type Entry = (typeof healthDb)[number];

export default function HealthSearch() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Entry | null>(null);
  const [tier, setTier] = useState<string>("free");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health").then(async (r) => {
      if (!r.ok) return;
      const j = await r.json();
      setTier(j.tier ?? "free");
      if (j.healthSlug) {
        const found = (healthDb as Entry[]).find((h) => h.slug === j.healthSlug);
        if (found) { setSelected(found); setQ(found.title); }
        localStorage.setItem("venco_health", j.healthSlug);
      } else {
        const local = localStorage.getItem("venco_health");
        if (local) {
          const found = (healthDb as Entry[]).find((h) => h.slug === local);
          if (found) { setSelected(found); setQ(found.title); }
        }
      }
    });
  }, []);

  const persist = async (entry: Entry) => {
    setSelected(entry); setQ(entry.title);
    const isPro = tier !== "free";
    if (isPro) {
      localStorage.setItem("venco_health", entry.slug);
      const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: entry.slug }) });
      const j = await res.json().catch(() => ({}));
      setMsg(res.ok ? "Saved for Pro — Meal & Exercise will show this." : j.error ?? "Failed");
    } else {
      // free: show but not persist
      localStorage.removeItem("venco_health");
      setMsg("Preview only — upgrade to Pro to persist and apply to Meal/Exercise.");
    }
  };

  const filtered = q.trim().length < 2 ? [] : (healthDb as Entry[]).filter((h) =>
    [h.slug, h.title].join(" ").toLowerCase().includes(q.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] bg-primary-dark border border-white/10 p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/20" />
        <h2 className="font-display text-2xl font-black tracking-tight text-white">What is your current health problem?</h2>
        <p className="text-xs text-white/60">Type diabetes, low muscle mass, hypertension… (WHO + Mayo curated, not AI, with sources).</p>
        <div className="relative mt-4">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setSelected(null); }}
            placeholder="e.g., diabetes, low muscle mass, hypertension"
            className="w-full rounded-full border border-white/20 bg-white text-primary-dark px-5 py-4 text-sm placeholder:text-foreground/40 focus:border-accent outline-none"
          />
          {filtered.length > 0 && !selected && (
            <div className="absolute z-10 mt-1 w-full rounded-2xl border bg-white shadow-xl overflow-hidden">
              {filtered.map((h) => (
                <button key={h.slug} onClick={() => persist(h)} className="w-full text-left px-4 py-2.5 hover:bg-paper text-sm">
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
          <h3 className="font-display font-bold text-primary-dark">{selected.title} {tier !== "free" && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Pro ✓</span>}</h3>
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
          {msg && <div className="text-xs bg-paper border px-3 py-2 rounded-lg">{msg}</div>}
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs">This will be suggested in your Meal and Exercise plans (Pro: both storages). Consult clinician — not diagnosis. <a href="/meal" className="underline text-primary">Go to Meal →</a> <a href="/exercises" className="ml-2 underline text-primary">Exercises →</a></div>
        </div>
      )}

      {!selected && (
        <div className="rounded-2xl bg-white border p-6">
          <h3 className="font-semibold text-primary-dark">Browse all (12)</h3>
          <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
            {(healthDb as Entry[]).map((h) => (
              <button key={h.slug} onClick={() => persist(h)} className="text-left rounded-lg border bg-paper px-3 py-2 hover:border-primary">
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
