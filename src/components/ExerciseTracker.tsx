"use client";

import { useState } from "react";

export default function ExerciseTracker() {
  const [doneDates, setDoneDates] = useState<string[]>(() => {
    const d = new Date(); const a: string[] = [];
    for (let i = 0; i < 4; i++) { const x = new Date(d); x.setDate(d.getDate() - i * 2); a.push(x.toISOString().slice(0, 10)); }
    return a;
  });

  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 27 + i);
    return d.toISOString().slice(0, 10);
  });

  const toggle = (date: string) => setDoneDates((a) => a.includes(date) ? a.filter((x) => x !== date) : [...a, date]);

  const last7 = days.slice(-7);
  return (
    <div className="rounded-2xl bg-white border p-5 space-y-3">
      <h3 className="font-semibold text-primary-dark">Exercise tracker — calendar</h3>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => (
          <button key={d} onClick={() => toggle(d)} className={`h-9 rounded-lg border text-xs ${doneDates.includes(d) ? "bg-primary text-white" : "bg-paper"}`}>
            {d.slice(8)}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-paper border p-3">
        <div className="text-xs font-semibold">Volume last 7d (sets)</div>
        <div className="flex items-end gap-1 h-12 mt-1">
          {last7.map((d) => {
            const sets = doneDates.includes(d) ? 12 + Math.round(Math.random() * 6) : 2;
            return <div key={d} className="flex-1 bg-accent rounded-t" style={{ height: `${sets * 5}%` }} />;
          })}
        </div>
      </div>
    </div>
  );
}
