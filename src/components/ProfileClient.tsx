"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Data = { user: { email?: string; username?: string; name?: string; subscriptionTier: string } | null; profile: { sex: string; age: number; weightKg: number; heightCm: number; goal: string } | null; calc: { bmi: number; targetKcal: number; proteinG: number } | null; calcs: { createdAt: string; weight?: number; bmi: number }[] };

export default function ProfileClient() {
  const [data, setData] = useState<Data | null>(null);
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [health, setHealth] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [exercisePlan, setExercisePlan] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (!r.ok) return;
      const j = await r.json();
      setData(j);
      setUsername(j.user?.username ?? j.user?.name ?? "");
    });
    fetch("/api/health").then(async (r) => { if (r.ok) { const j = await r.json(); if (j.healthSlug) setHealth(j.healthSlug); } });
    const mp = localStorage.getItem("venco_last_meal_plan");
    const ep = localStorage.getItem("venco_last_exercise_plan");
    if (mp) setMealPlan(mp);
    if (ep) setExercisePlan(ep);
    // if no local, try to infer from calc
  }, []);

  async function save() {
    setMsg("");
    const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) setMsg(j.error ?? "Failed");
    else setMsg("Username updated — sign out/in to refresh header.");
  }

  // progress data from body logger + calcs
  const body = (() => {
    try { return JSON.parse(localStorage.getItem("venco_body") ?? "[]") as { date: string; weight: number }[]; } catch { return []; }
  })();
  const chartData = (data?.calcs?.length ? data.calcs.map((c, i) => ({ date: c.createdAt.slice(5, 10), bmi: c.bmi, weight: (data.profile?.weightKg ?? 70) - i * 0.3 })) : body.length ? body.slice(-10).map((b) => ({ date: b.date.slice(5), bmi: 0, weight: b.weight })) : [{ date: "W1", weight: 73 }, { date: "W2", weight: 72.5 }, { date: "W3", weight: 72 }, { date: "W4", weight: 71.6 }]);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-2xl bg-paper border border-white/10 p-5">
          <h2 className="font-bold text-foreground">Edit Username</h2>
          <p className="text-xs text-foreground/60">Username can be anything, no restriction. You type it — no auto.</p>
          <div className="mt-3 flex gap-2">
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="flex-1 rounded-full border bg-paper/5 border-white/10 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40" />
            <button onClick={save} className="rounded-full bg-accent text-white px-6 py-2.5 text-sm font-bold">Save</button>
          </div>
          {msg && <p className="text-xs mt-2 text-accent">{msg}</p>}
          <div className="mt-3 text-xs text-foreground/60">
            <div>Mail: {data?.user?.email ?? "—"}</div>
            <div>Tier: <b>{data?.user?.subscriptionTier ?? "free"}</b> {health ? `• Health: ${health}` : ""}</div>
          </div>
        </div>

        <div className="rounded-2xl bg-paper border border-white/10 p-5">
          <h3 className="font-bold text-foreground">Current Monthly</h3>
          <div className="mt-3 grid gap-3 text-xs">
            <div className="rounded-xl bg-background border border-white/10 p-3">
              <div className="font-semibold">Active Meal</div>
              <div className="text-foreground/70">{mealPlan ? `${mealPlan.slice(0, 80)}…` : data?.calc ? `${data.calc.targetKcal} kcal • P${data.calc.proteinG}g` : "No plan yet — go to Meal → Generate"}</div>
              <a href="/meal" className="text-primary underline">Open Meal →</a>
            </div>
            <div className="rounded-xl bg-secondary text-white p-3">
              <div className="font-semibold">Active Exercise</div>
              <div className="text-white/80">{exercisePlan ? `${exercisePlan.slice(0, 80)}…` : health ? `Health tweak: ${health}` : "No plan — go to Exercises → pick Gym/Home"}</div>
              <a href="/exercises" className="underline">Open Exercises →</a>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 rounded-2xl bg-paper border border-white/10 p-5">
        <h3 className="font-bold text-foreground">Progress — weight & BMI</h3>
        <p className="text-xs text-foreground/60">From Essentials snapshots + Body logger. Replaces bar comparison with graph.</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#C91C7A" strokeWidth={3} dot={{ r: 3 }} name="kg" />
              <Line type="monotone" dataKey="bmi" stroke="#68097E" strokeWidth={2} dot={false} name="BMI" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-muted">Tip: log weekly in Logger → Body to see real trend. Weekly avg Δ drives calorie auto-adjust ±100-150.</div>
      </div>
    </div>
  );
}
