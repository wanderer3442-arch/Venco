"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Habit = { id: string; name: string; dates: string[] }; // dates as YYYY-MM-DD where done

function todayStr(d = new Date()) { return d.toISOString().slice(0, 10); }
function lastNDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(() => [
    { id: "1", name: "Walk", dates: [todayStr()] },
    { id: "2", name: "Water 2L", dates: [] },
  ]);
  const [newName, setNewName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("venco_habits");
    if (saved) try { setHabits(JSON.parse(saved)); } catch {}
    setMounted(true);
  }, []);
  useEffect(() => { if (mounted) localStorage.setItem("venco_habits", JSON.stringify(habits)); }, [habits, mounted]);

  const days = lastNDays(28);
  const toggle = (hid: string, date: string) => {
    setHabits((hs) => hs.map((h) => h.id === hid ? { ...h, dates: h.dates.includes(date) ? h.dates.filter((d) => d !== date) : [...h.dates, date] } : h));
  };

  const add = () => {
    const n = newName.trim(); if (!n) return;
    if (habits.some((h) => h.name.toLowerCase() === n.toLowerCase())) return;
    setHabits((hs) => [...hs, { id: String(Date.now()), name: n, dates: [] }]);
    setNewName("");
  };
  const del = (id: string) => setHabits((hs) => hs.filter((h) => h.id !== id));

  // completion % last 7 days
  const last7 = lastNDays(7);
  const completion = habits.length ? Math.round((habits.flatMap((h) => last7.filter((d) => h.dates.includes(d))).length / (habits.length * 7)) * 100) : 0;

  return (
    <div className="rounded-2xl bg-paper border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Habit tracker — tick from To Do or here</h3>
        <span className="text-xs bg-paper border px-2.5 py-1 rounded-full">{completion}% last 7d</span>
      </div>

      <div className="flex gap-2">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Add habit: Walk, Sleep 8h..." className="flex-1 rounded-full border px-4 py-2 text-sm bg-paper/60" />
        <button onClick={add} className="rounded-full bg-primary text-white px-5 text-sm">Add</button>
      </div>

      {/* graph — 7 day line */}
      <div className="rounded-xl bg-paper border p-3">
        <div className="text-xs font-semibold mb-2">7-day completion — graph</div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7.map((d) => {
              const done = habits.filter((h) => h.dates.includes(d)).length;
              const pct = habits.length ? Math.round((done / habits.length) * 100) : 0;
              return { date: d.slice(5), pct };
            })}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3F194D20" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="pct" stroke="#68097E" strokeWidth={3} dot={{ r: 3 }} name="%" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* calendar — new timeline strip style */}
      <div className="space-y-3">
        {habits.map((h) => (
          <div key={h.id} className="rounded-xl border border-white/10 bg-paper p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold tracking-tight text-foreground">{h.name}</span>
              <button onClick={() => del(h.id)} className="text-xs text-accent hover:underline">Delete</button>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] tracking-widest uppercase text-muted mb-1">
                <span>4 weeks ago</span><span>Today</span>
              </div>
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />
                <div className="relative flex justify-between gap-1 overflow-x-auto py-2">
                  {days.map((d) => {
                    const done = h.dates.includes(d);
                    const isToday = d === todayStr();
                    return (
                      <button
                        key={d}
                        onClick={() => toggle(h.id, d)}
                        title={`${d} — ${done ? "done" : "missed"}`}
                        className={`relative flex flex-col items-center gap-1 shrink-0 ${isToday ? "scale-110" : ""}`}
                      >
                        <span className={`grid place-items-center h-8 w-8 rounded-full border text-xs font-bold transition ${done ? "bg-primary text-white border-primary shadow" : "bg-background border-white/10 text-foreground/60 hover:border-white/20"}`}>
                          {done ? "✓" : d.slice(8)}
                        </span>
                        <span className="text-[9px] text-muted">{new Date(d).toLocaleDateString("en-US", { weekday: "narrow" })}</span>
                        {isToday && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {habits.length === 0 && <div className="text-sm text-muted">No habits — add one above.</div>}
      </div>
    </div>
  );
}
