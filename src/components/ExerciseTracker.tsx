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
