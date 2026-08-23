"use client";

import { useEffect, useState } from "react";
import MealAutocomplete from "./MealAutocomplete";
import { generatePlan, scoreOtherFood, type PlanOutput } from "@/lib/meal";

function splitList(v: string): string[] {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function MealPlanner({ otherInitial }: { otherInitial?: string }) {
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [allergies, setAllergies] = useState("");
  const [other, setOther] = useState(otherInitial ?? "");
  const [plan, setPlan] = useState<PlanOutput | null>(null);
  const [otherScore, setOtherScore] = useState<ReturnType<typeof scoreOtherFood> | null>(() =>
    otherInitial ? scoreOtherFood(otherInitial) : null,
  );
  const [calc, setCalc] = useState<{ targetKcal: number; proteinG: number; fatG: number; carbsG: number } | null>(null);

  useEffect(() => {
    fetch("/api/onboarding").then(async (r) => {
      if (!r.ok) return;
      const data = await r.json();
      if (data?.calc) setCalc({ targetKcal: data.calc.targetKcal, proteinG: data.calc.proteinG, fatG: data.calc.fatG, carbsG: data.calc.carbsG });
    });
  }, []);

  function onGenerate() {
    const p = generatePlan({
      breakfast: splitList(breakfast),
      lunch: splitList(lunch),
      dinner: splitList(dinner),
      allergies: splitList(allergies),
      targetKcal: calc?.targetKcal ?? null,
      targetMacros: calc ? { proteinG: calc.proteinG, fatG: calc.fatG, carbsG: calc.carbsG } : null,
    });
    setPlan(p);
    if (other.trim()) setOtherScore(scoreOtherFood(other));
    else setOtherScore(null);
  }

  function handleOtherScore() {
    if (!other.trim()) { setOtherScore(null); return; }
    setOtherScore(scoreOtherFood(other));
  }

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-2xl bg-white border p-6">
        <p className="text-sm font-semibold text-primary-dark mb-3">What do you eat daily? (separate with commas — type “bre” to see suggestions)</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <MealAutocomplete label="Breakfast" placeholder="poha, idli, bread..." value={breakfast} onChange={setBreakfast} />
          <MealAutocomplete label="Lunch" placeholder="dal, roti, rice, rajma..." value={lunch} onChange={setLunch} />
          <MealAutocomplete label="Dinner" placeholder="paneer, chicken, dosa..." value={dinner} onChange={setDinner} />
        </div>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          <div className="block">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted">Allergies (comma)</span>
            <input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="peanut, gluten, dairy..." className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60 focus:border-primary outline-none" />
            <span className="text-xs text-foreground/50">Allergic foods will be removed → swap shown in “Avoid”.</span>
          </div>
          <div className="rounded-xl bg-paper border p-3 text-xs flex flex-col justify-center">
            <div className="font-semibold text-primary-dark">Tip</div>
            <div className="text-foreground/60">Enter 1–3 items per meal (e.g., “Poha, Idli”). System builds 1-week plan with qty, kCal, carbs etc.</div>
            {calc && <div className="mt-2 text-xs">Target: <b>{calc.targetKcal} kcal</b> • P {calc.proteinG}g F {calc.fatG}g C {calc.carbsG}g (from Essentials)</div>}
            {!calc && <div className="mt-2 text-xs text-muted">No Essentials yet — <a href="/essentials" className="underline text-primary">calculate first</a> for personalized targets.</div>}
          </div>
        </div>
        <button onClick={onGenerate} className="mt-4 rounded-full bg-primary text-white px-8 py-3 text-sm font-semibold hover:bg-primary-dark">
          Generate my plan (1 week)
        </button>
      </div>

      {/* Plan */}
      {plan && (
        <div className="rounded-2xl bg-white border p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-display font-bold text-primary-dark">Your meal plan</h2>
            <span className="text-xs bg-paper border px-3 py-1.5 rounded-full">Daily total: <b>{plan.total.kcal} kcal</b> • P {plan.total.protein}g • C {plan.total.carbs}g • F {plan.total.fat}g</span>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {plan.meals.map((m) => (
              <div key={m.label} className="rounded-xl border bg-paper/60 p-3">
                <div className="text-sm font-bold text-primary-dark">{m.label}</div>
                {m.items.length === 0 ? <div className="text-xs text-muted mt-1">No items (allergic or not found) — try different food.</div> : m.items.map((it) => (
                  <div key={it.food.id} className="mt-2 rounded-lg bg-white border p-2.5 text-xs">
                    <div className="font-semibold">{it.food.name} <span className="text-muted font-normal">— {it.qtyG}g</span></div>
                    <div className="text-foreground/60">{it.kcal} kcal • P {it.protein}g • C {it.carbs}g • F {it.fat}g</div>
                    <div className="text-xs text-muted">{it.food.region} • allergens: {it.food.allergens.join(", ") || "none"}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <Card title="Avoid" items={plan.avoid} color="accent" />
            <Card title="Eat less" items={plan.eatLess} color="muted" />
            <Card title="Eat more" items={plan.eatMore} color="primary" />
          </div>
          <div>
            <div className="text-sm font-semibold text-primary-dark">Try new foods (not in your list, allergy-safe)</div>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              {plan.tryNew.map((f) => (
                <div key={f.id} className="rounded-lg border bg-white p-2.5 text-xs flex justify-between">
                  <span className="font-medium">{f.name}</span> <span className="text-foreground/60">{f.kcal} kcal • {f.region}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other food */}
      <div className="rounded-2xl bg-white border p-6">
        <h2 className="font-semibold text-primary-dark">Other food (snacks / outside)</h2>
        <p className="text-xs text-foreground/60">Logs here, adjusts daily quota, health score shown — no plan mutation.</p>
        <div className="mt-3 flex gap-2">
          <input value={other} onChange={(e) => setOther(e.target.value)} placeholder="ice cream, samosa, fried rice..." className="flex-1 rounded-full border px-4 py-2.5 text-sm bg-paper/60 focus:border-primary outline-none" />
          <button onClick={handleOtherScore} className="rounded-full bg-accent text-white px-6 py-2.5 text-sm font-semibold">Score</button>
        </div>
        {otherScore && (
          <div className={`mt-3 rounded-xl border p-3 text-sm flex items-start gap-2 ${otherScore.score === "green" ? "bg-green-50 border-green-200" : otherScore.score === "red" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
            <span className={`mt-0.5 h-2 w-2 rounded-full ${otherScore.score === "green" ? "bg-green-500" : otherScore.score === "red" ? "bg-red-500" : "bg-amber-500"}`} />
            <div>
              <div className="font-semibold">Other: “{other}” — {otherScore.score} • ~{otherScore.kcal} kcal/100g {otherScore.food ? `• matched ${otherScore.food.name}` : ""}</div>
              <div className="text-xs text-foreground/70 mt-0.5">{otherScore.tip} {calc && (() => {
                const rem = calc.targetKcal - (plan?.total.kcal ?? 0) - otherScore.kcal;
                return rem > 0 ? `Quota remaining ~${rem} kcal.` : `Over target by ~${Math.abs(rem)} kcal — walk 15 min.`;
              })()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, items, color }: { title: string; items: string[]; color: "accent" | "primary" | "muted" }) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <div className={`text-xs font-bold tracking-widest uppercase ${color === "accent" ? "text-accent" : color === "primary" ? "text-primary" : "text-muted"}`}>{title}</div>
      {items.length === 0 ? <div className="text-xs text-muted mt-1">—</div> : <ul className="mt-1 space-y-1 list-disc list-inside">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>}
    </div>
  );
}
