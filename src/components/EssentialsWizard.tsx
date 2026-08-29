"use client";

import { useState } from "react";
import { calcBMI, calcBMR, calcTDEE, calcTargetCalories, calcMacros, calcHydrationMl, activityLabels, type ActivityFactor, type Goal, type Sex } from "@/lib/formulas";

export default function EssentialsWizard() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(72);
  const [height, setHeight] = useState(175);
  const [factor, setFactor] = useState<ActivityFactor>(1.55);
  const [goal, setGoal] = useState<Goal>("maintenance");
  const [allergies, setAllergies] = useState("");
  const [result, setResult] = useState<null | { bmi: number; bmr: number; tdee: number; kcal: number; macros: ReturnType<typeof calcMacros>; hydration: number }>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function compute() {
    const bmi = calcBMI(weight, height);
    const bmr = calcBMR(sex, weight, height, age);
    const tdee = calcTDEE(bmr, factor);
    const kcal = calcTargetCalories(tdee, goal);
    const macros = calcMacros(weight, kcal, goal);
    const hydration = calcHydrationMl(weight);
    setResult({ bmi, bmr, tdee, kcal, macros, hydration });
  }

  async function save() {
    if (!result) return;
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sex, age, weightKg: weight, heightCm: height, activityFactor: factor, goal, allergies: allergies.split(",").map((s) => s.trim()).filter(Boolean) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) setMsg(data.error ?? "Save failed — sign in first.");
    else setMsg("Saved — plans will generate. Go to Exercises / Meal.");
    setSaving(false);
  }

  return (
    <div className="rounded-2xl bg-paper border p-6 space-y-4">
      <h2 className="font-display font-bold text-foreground">Onboarding — Essentials</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">Sex</span>
          <select value={sex} onChange={(e) => setSex(e.target.value as Sex)} className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">Goal</span>
          <select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60">
            <option value="fat_loss">Fat loss (−400)</option>
            <option value="lean_bulk">Lean bulk (+350)</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
        <label><span className="text-xs font-semibold uppercase tracking-widest text-muted">Age</span><input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60" /></label>
        <label><span className="text-xs font-semibold uppercase tracking-widest text-muted">Weight kg</span><input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60" /></label>
        <label><span className="text-xs font-semibold uppercase tracking-widest text-muted">Height cm</span><input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60" /></label>
        <label className="sm:col-span-2"><span className="text-xs font-semibold uppercase tracking-widest text-muted">Activity</span>
          <select value={factor} onChange={(e) => setFactor(Number(e.target.value) as ActivityFactor)} className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60">
            {(Object.entries(activityLabels) as [string, string][]).map(([k, v]) => <option key={k} value={k}>{k} — {v}</option>)}
          </select>
        </label>
        <label className="sm:col-span-2"><span className="text-xs font-semibold uppercase tracking-widest text-muted">Allergies (comma)</span><input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="peanut, gluten" className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60" /></label>
      </div>
      <div className="flex gap-2">
        <button onClick={compute} className="rounded-full bg-primary text-white px-6 py-2.5 text-sm font-semibold">Calculate</button>
        {result && <button onClick={save} disabled={saving} className="rounded-full border border-primary text-primary px-6 py-2.5 text-sm font-semibold disabled:opacity-50">{saving ? "..." : "Save to profile"}</button>}
      </div>
      {result && (
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl bg-paper border p-3"><div className="font-semibold">BMI {result.bmi.toFixed(1)}</div><div className="text-xs text-foreground/60">BMR {Math.round(result.bmr)} • TDEE {Math.round(result.tdee)}</div></div>
          <div className="rounded-xl bg-primary text-white p-3"><div className="font-semibold">Target {result.kcal} kcal</div><div className="text-xs opacity-80">P {result.macros.proteinG}g • F {result.macros.fatG}g • C {result.macros.carbsG}g</div></div>
          <div className="rounded-xl bg-paper border p-3"><div className="font-semibold">Hydration {result.hydration} ml</div><div className="text-xs text-foreground/60">~{Math.round(result.hydration/1000)} L</div></div>
        </div>
      )}
      {msg && <p className="text-xs text-accent">{msg}</p>}
      <p className="text-xs text-foreground/50">Formulas: <code>src/lib/formulas.ts</code> • weekly adjust ±100–150 via 7-day avg.</p>
    </div>
  );
}
