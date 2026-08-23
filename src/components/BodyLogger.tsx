"use client";
/* eslint-disable react-hooks/purity */

import { useEffect, useState } from "react";

type Entry = { date: string; weight: number; height: number };

export default function BodyLogger() {
  // eslint-disable-next-line react-hooks/purity
  const [entries, setEntries] = useState<Entry[]>(() => [
    { date: new Date(Date.now() - 21 * 86400000).toISOString().slice(0, 10), weight: 73.2, height: 175 },
    { date: new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10), weight: 72.8, height: 175 },
    { date: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10), weight: 72.4, height: 175 },
  ]);
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("venco_body");
    if (s) try { setEntries(JSON.parse(s)); } catch {}
    setMounted(true);
  }, []);
  useEffect(() => { if (mounted) localStorage.setItem("venco_body", JSON.stringify(entries)); }, [entries, mounted]);

  const add = () => {
    const weight = Number(w), height = Number(h);
    if (!weight || !height) return;
    const date = new Date().toISOString().slice(0, 10);
    setEntries((e) => [...e.filter((x) => x.date !== date), { date, weight, height }].sort((a, b) => a.date.localeCompare(b.date)));
    setW(""); setH("");
  };

  const avgDelta = entries.length >= 2 ? (entries[entries.length - 1].weight - entries[0].weight) / (entries.length - 1) : 0;
  const suggestion = Math.abs(avgDelta) < 0.15 ? "On track" : avgDelta > 0 ? "Gaining ~" + avgDelta.toFixed(2) + " kg/wk → cut 100-150 kcal" : "Losing ~" + Math.abs(avgDelta).toFixed(2) + " kg/wk → add 100-150 kcal if needed";

  return (
    <div className="rounded-2xl bg-white border p-5 space-y-3">
      <h3 className="font-semibold text-primary-dark">Weight & Height (weekly)</h3>
      <div className="flex gap-2">
        <input value={w} onChange={(e) => setW(e.target.value)} placeholder="Weight kg" type="number" className="flex-1 rounded-full border px-4 py-2 text-sm" />
        <input value={h} onChange={(e) => setH(e.target.value)} placeholder="Height cm" type="number" className="flex-1 rounded-full border px-4 py-2 text-sm" />
        <button onClick={add} className="rounded-full bg-primary text-white px-5 text-sm">Log today</button>
      </div>
      <div className="rounded-xl bg-paper border p-3">
        <div className="text-xs font-semibold">Trend (weekly)</div>
        <div className="flex items-end gap-1 h-16 mt-1">
          {entries.map((e) => {
            const min = Math.min(...entries.map((x) => x.weight));
            const max = Math.max(...entries.map((x) => x.weight));
            const range = max - min || 1;
            const hgt = ((e.weight - min) / range) * 80 + 10;
            return <div key={e.date} title={`${e.date} ${e.weight}kg`} className="flex-1 bg-primary rounded-t" style={{ height: `${hgt}%` }} />;
          })}
        </div>
        <div className="flex justify-between text-xs text-muted mt-1"><span>{entries[0]?.date}</span><span>{entries[entries.length - 1]?.date}</span></div>
      </div>
      <div className="text-xs bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">7-day avg Δ: <b>{avgDelta.toFixed(2)} kg/wk</b> • {suggestion} (from Essentials weekly adjust ±100-150).</div>
      <div className="text-xs space-y-1">
        {entries.slice(-5).reverse().map((e) => (
          <div key={e.date} className="flex justify-between border-b py-1"><span>{e.date}</span><span>{e.weight} kg • {e.height} cm</span></div>
        ))}
      </div>
    </div>
  );
}
