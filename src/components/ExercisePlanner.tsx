"use client";

import { useEffect, useState } from "react";
import { EXERCISES, TEMPLATES, generateAutoPlan, calibrateExercise, type Plan, type Goal } from "@/lib/exercises";

export default function ExercisePlanner() {
  const [goal, setGoal] = useState<Goal>("maintenance");
  const [plan, setPlan] = useState<Plan>(() => generateAutoPlan("maintenance"));
  const [bmi, setBmi] = useState<number | undefined>(undefined);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/onboarding").then(async (r) => {
      if (!r.ok) return;
      const j = await r.json();
      if (j?.calc?.bmi) setBmi(j.calc.bmi);
      if (j?.profile?.goal) {
        const g = j.profile.goal as Goal;
        setGoal(g);
        setPlan(generateAutoPlan(g));
      }
    });
  }, []);

  function applyTemplate(name: string) {
    const t = TEMPLATES.find((x) => x.name === name);
    if (t) { setPlan(t); setMsg(`Loaded "${name}" — calibrated to ${goal}. You can edit below.`); }
  }

  function deletePlan() {
    setPlan({ name: "Custom (empty)", goal, days: [] });
    setMsg("Plan cleared — add exercises per day.");
  }

  function addExercise(dayIdx: number, exId: string) {
    const cal = calibrateExercise(exId, goal, bmi);
    const def = EXERCISES.find((e) => e.id === exId)!;
    setPlan((p) => {
      const days = [...p.days];
      if (!days[dayIdx]) {
        days.push({ day: `Day ${days.length + 1}`, title: "Custom", exercises: [] });
      }
      days[dayIdx] = {
        ...days[dayIdx],
        exercises: [...days[dayIdx].exercises, { ...def, sets: cal.sets, reps: cal.reps }],
      };
      return { ...p, days };
    });
    if (cal.warning) setMsg(`Added ${def.name}: ${cal.sets}×${cal.reps}. ⚠ I don't recommend this without caution: ${cal.warning}`);
    else setMsg(`Added ${def.name}: ${cal.sets}×${cal.reps} (auto-calibrated to ${goal}).`);
  }

  function removeExercise(dayIdx: number, exIdx: number) {
    setPlan((p) => {
      const days = [...p.days];
      days[dayIdx] = { ...days[dayIdx], exercises: days[dayIdx].exercises.filter((_, i) => i !== exIdx) };
      return { ...p, days };
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border p-5 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-semibold text-primary-dark">Goal:</span>
        <select value={goal} onChange={(e) => { const g = e.target.value as Goal; setGoal(g); setPlan(generateAutoPlan(g)); }} className="rounded-full border px-4 py-2 text-sm bg-paper">
          <option value="fat_loss">Fat loss</option>
          <option value="lean_bulk">Lean bulk</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button onClick={() => setPlan(generateAutoPlan(goal))} className="rounded-full bg-primary text-white px-5 py-2 text-sm">Regenerate auto</button>
        <button onClick={deletePlan} className="rounded-full border border-accent text-accent px-5 py-2 text-sm">Delete plan</button>
        <span className="text-xs text-muted">Auto uses TDEE & goal • BMI {bmi ? bmi.toFixed(1) : "—"}</span>
      </div>

      <div className="rounded-2xl bg-white border p-5">
        <h3 className="font-semibold text-primary-dark">Templates</h3>
        <p className="text-xs text-foreground/60">Don’t like auto? Pick one — still calibrated.</p>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button key={t.name} onClick={() => applyTemplate(t.name)} className={`text-left rounded-xl border p-3 hover:border-primary ${plan.name === t.name ? "border-primary bg-paper" : "bg-white"}`}>
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-foreground/60">{t.days.length} days • {t.days[0]?.exercises.length ?? 0} ex/day</div>
            </button>
          ))}
        </div>
      </div>

      {msg && <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">{msg}</div>}

      <div className="rounded-2xl bg-white border p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-primary-dark">{plan.name}</h3>
          <span className="text-xs bg-paper border px-2.5 py-1 rounded-full">{plan.days.length} days</span>
        </div>
        {plan.note && <p className="text-xs text-foreground/60 mt-1">{plan.note}</p>}
        {plan.days.length === 0 ? <p className="text-sm text-muted mt-4">No days — add a day by adding an exercise below.</p> : (
          <div className="mt-4 grid gap-4">
            {plan.days.map((d, di) => (
              <div key={di} className="rounded-xl border bg-paper/60 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{d.day} — {d.title}</div>
                  <select
                    defaultValue=""
                    onChange={(e) => { if (e.target.value) { addExercise(di, e.target.value); e.target.value = ""; } }}
                    className="rounded-full border bg-white px-3 py-1.5 text-xs"
                  >
                    <option value="">+ Add exercise…</option>
                    {EXERCISES.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscle})</option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 space-y-1.5">
                  {d.exercises.map((ex, ei) => (
                    <div key={ei} className="flex items-center justify-between rounded-lg bg-white border px-3 py-2 text-xs">
                      <span><b>{ex.name}</b> — {ex.sets}×{ex.reps} • {ex.muscle} • {ex.equipment} {ex.contraindication && <span className="text-accent">⚠</span>}</span>
                      <button onClick={() => removeExercise(di, ei)} className="text-accent hover:underline">Delete</button>
                    </div>
                  ))}
                  {d.exercises.length === 0 && <div className="text-xs text-muted">No exercises — add one.</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <button onClick={() => setPlan((p) => ({ ...p, days: [...p.days, { day: `Day ${p.days.length + 1}`, title: "Custom", exercises: [] }] }))} className="rounded-full border px-4 py-2 text-xs">+ Add day</button>
          <button onClick={() => setPlan((p) => ({ ...p, days: p.days.slice(0, -1) }))} className="rounded-full border px-4 py-2 text-xs">− Remove last day</button>
        </div>
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-xs text-foreground/70">
        How calibration works: sets/reps are set from goal (fat loss 3×12-15, bulk 4×6-10). Adding a new exercise auto-suggests sets. If risky (e.g., Overhead Press with shoulder history, Burpee at high BMI) we show “I don’t recommend because …” with alternative.
      </div>
    </div>
  );
}
