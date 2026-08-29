"use client";

import { useState } from "react";

type Todo = { id: string; label: string; sub: string; done: boolean };

const initial: Todo[] = [
  { id: "meal", label: "Meal", sub: "Log today's meals", done: false },
  { id: "habit", label: "Habit", sub: "Walk • Water • Sleep", done: true },
  { id: "exercise", label: "Exercise", sub: "Push day — 45 min", done: false },
];

export default function TodoList() {
  const [todos, setTodos] = useState(initial);
  const done = todos.filter((t) => t.done).length;

  return (
    <div className="rounded-2xl bg-paper border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-foreground">To Do</h3>
        <span className="text-xs bg-paper px-2.5 py-1 rounded-full font-medium">
          {done}/{todos.length} done
        </span>
      </div>
      <div className="space-y-2">
        {todos.map((t) => (
          <label
            key={t.id}
            className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
              t.done ? "bg-primary/5 border-primary/20" : "bg-paper border-white/10 hover:border-primary/20 hover:bg-paper"
            }`}
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => setTodos((v) => v.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
              className="h-5 w-5 rounded accent-primary"
            />
            <div>
              <div className={`text-sm font-semibold ${t.done ? "line-through text-foreground/50" : "text-foreground"}`}>{t.label}</div>
              <div className="text-xs text-foreground/60">{t.sub}</div>
            </div>
            <span className={`ml-auto text-xs ${t.done ? "text-primary" : "text-muted"}`}>{t.done ? "✓" : "○"}</span>
          </label>
        ))}
      </div>
      <p className="mt-3 text-xs text-foreground/50">Tick from here or Logger — both sync.</p>
    </div>
  );
}
