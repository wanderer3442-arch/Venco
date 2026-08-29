"use client";

import { useEffect, useState } from "react";

export default function DownloadPreview() {
  const [meal, setMeal] = useState<string | null>(null);
  const [exercise, setExercise] = useState<string | null>(null);
  const [habits, setHabits] = useState<string | null>(null);

  useEffect(() => {
    try {
      const m = localStorage.getItem("venco_last_meal_plan");
      const e = localStorage.getItem("venco_last_exercise_plan");
      const h = localStorage.getItem("venco_habits");
      if (m) {
        const p = JSON.parse(m);
        const txt = (p.meals ?? []).map((mm: { label: string; items: { food: { name: string }; qtyG: number }[] }) => `${mm.label}: ${mm.items.map((i) => `${i.food.name} ${i.qtyG}g`).join(", ") || "—"}`).join(" | ");
        setMeal(txt || "No meal plan yet — generate at /meal");
      } else setMeal("No meal plan yet — generate at /meal");
      if (e) {
        const p = JSON.parse(e);
        const txt = (p.days ?? []).map((d: { day: string; title: string; exercises: { name: string }[] }) => `${d.day} ${d.title}: ${d.exercises.map((x) => x.name).join(", ")}`).join(" | ");
        setExercise(txt || "No exercise plan — pick at /exercises");
      } else setExercise("No exercise plan — pick at /exercises");
      if (h) {
        const arr = JSON.parse(h) as { name: string; dates: string[] }[];
        const txt = arr.map((x) => `${x.name} (${x.dates.length}d)`).join(", ") || "No habits";
        setHabits(txt);
      } else setHabits("No habits — add at /logger");
    } catch {}
  }, []);

  return (
    <div className="space-y-3 text-xs leading-relaxed">
      <div className="rounded-xl bg-paper border border-white/10 p-3">
        <div className="font-bold text-foreground">Meals for the week</div>
        <div className="text-foreground/70 mt-1">{meal ?? "Loading…"}</div>
      </div>
      <div className="rounded-xl bg-paper border border-white/10 p-3">
        <div className="font-bold text-foreground">Exercise — week</div>
        <div className="text-foreground/70 mt-1">{exercise ?? "Loading…"}</div>
      </div>
      <div className="rounded-xl bg-paper border border-white/10 p-3">
        <div className="font-bold text-foreground">Habits</div>
        <div className="text-foreground/70 mt-1">{habits ?? "Loading…"}</div>
      </div>
    </div>
  );
}
