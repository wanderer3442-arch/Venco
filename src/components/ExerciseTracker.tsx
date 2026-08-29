"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

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
    <div className="rounded-2xl bg-paper border p-5 space-y-3">
      <h3 className="font-semibold text-foreground">Exercise tracker — calendar (heat streak)</h3>
      <div className="rounded-xl bg-background border border-white/5 p-3">
        <div className="flex justify-between text-[10px] tracking-widest uppercase text-muted mb-2">
          <span>4 weeks</span><span>tap to toggle</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
            <div key={w} className="text-center text-[10px] text-muted">{w}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const done = doneDates.includes(d);
            const isToday = d === new Date().toISOString().slice(0, 10);
            return (
              <button
                key={d}
                onClick={() => toggle(d)}
                title={d}
                className={`relative h-9 rounded-xl border text-xs font-bold transition ${done ? "bg-accent text-white border-accent shadow" : "bg-paper border-white/10 text-foreground/60 hover:border-white/20"} ${isToday ? "ring-2 ring-secondary ring-offset-1 ring-offset-background" : ""}`}
              >
                {d.slice(8)}
                {done && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white border border-accent" />}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-1.5 items-center text-[10px] text-muted">
          <span>Less</span>
          <span className="h-3 w-3 rounded bg-paper border border-white/10" />
          <span className="h-3 w-3 rounded bg-accent" />
          <span>More</span>
        </div>
      </div>
      <div className="rounded-xl bg-paper border p-3">
        <div className="text-xs font-semibold">Volume last 7d (sets) — graph</div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7.map((d) => ({ date: d.slice(5), sets: doneDates.includes(d) ? 12 + Math.round(Math.random() * 6) : 2 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3F194D20" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sets" stroke="#E8675C" strokeWidth={3} dot={{ r: 3 }} name="sets" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
