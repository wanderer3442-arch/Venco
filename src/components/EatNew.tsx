"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EatNew() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function go() {
    const v = q.trim();
    if (!v) return;
    router.push(`/meal?other=${encodeURIComponent(v)}`);
  }

  return (
    <div className="rounded-2xl bg-white border border-black/5 p-4">
      <h3 className="font-display font-bold text-primary-dark">Eat anything new today?</h3>
      <p className="text-xs text-foreground/60 mb-3">Ice cream, snacks, outside food — we’ll score it & update your daily quota.</p>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="e.g., ice cream, samosa, fried rice"
          className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary bg-paper/60"
        />
        <button onClick={go} className="rounded-full bg-accent text-white px-6 py-2.5 text-sm font-semibold hover:opacity-90">
          Score →
        </button>
      </div>
      <p className="mt-2 text-xs text-foreground/50">Takes you to Meal → Other food. No plan change, just guidance.</p>
    </div>
  );
}
