"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function MealRing() {
  const [kcal, setKcal] = useState(1820);
  const [protein, setProtein] = useState(88);
  const [carbs, setCarbs] = useState(220);
  const [fat, setFat] = useState(58);
  const [vit, setVit] = useState(72);

  const target = { kcal: 2200, protein: 120, carbs: 250, fat: 70, vit: 100 };

  return (
    <div className="rounded-2xl bg-paper border p-5 space-y-4">
      <h3 className="font-semibold text-foreground">Meal tracker — ring</h3>
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        {/* SVG ring */}
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160" className="rotate-[-90deg]">
            <circle cx="80" cy="80" r="60" stroke="#2a1430" strokeWidth="16" fill="none" />
            <circle cx="80" cy="80" r="60" stroke="#68097E" strokeWidth="16" fill="none" strokeDasharray={`${(kcal / target.kcal) * 376} 376`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-2xl font-display font-bold text-primary">{Math.round((kcal / target.kcal) * 100)}%</div>
              <div className="text-xs text-muted">Meal</div>
              <div className="text-xs">{kcal}/{target.kcal} kcal</div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 h-10 w-10 rounded-full bg-secondary text-white grid place-items-center text-xs font-bold">{Math.round((protein / target.protein) * 100)}%</div>
          <div className="absolute -bottom-1 -right-2 h-10 w-10 rounded-full bg-accent text-white grid place-items-center text-xs font-bold">{Math.round((carbs / target.carbs) * 100)}%</div>
          <div className="absolute -bottom-1 -left-1 h-10 w-10 rounded-full bg-primary/20 text-primary grid place-items-center text-xs font-bold">{Math.round((fat / target.fat) * 100)}%</div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
          <label> kcal <input type="number" value={kcal} onChange={(e) => setKcal(Number(e.target.value))} className="ml-1 w-20 rounded border px-2 py-1" /></label>
          <label> protein <input type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value))} className="ml-1 w-16 rounded border px-2 py-1" /></label>
          <label> carbs <input type="number" value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} className="ml-1 w-16 rounded border px-2 py-1" /></label>
          <label> fat <input type="number" value={fat} onChange={(e) => setFat(Number(e.target.value))} className="ml-1 w-16 rounded border px-2 py-1" /></label>
          <label> vitamins % <input type="range" min={0} max={100} value={vit} onChange={(e) => setVit(Number(e.target.value))} /> {vit}%</label>
        </div>
      </div>
      <div className="rounded-xl bg-paper border p-3">
        <div className="text-xs font-semibold">7-day intake — graph</div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[62, 78, 70, 84, 76, 60, 82].map((v, i) => ({ day: `D${i + 1}`, kcal: 1500 + v * 8 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3F194D20" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="kcal" stroke="#C91C7A" strokeWidth={3} dot={{ r: 3 }} name="kcal" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="text-xs text-foreground/50">Rings: center Meal, satellites calories/carbs/protein/vitamins. Graph shows trend — vit ring is illustrative.</p>
    </div>
  );
}
