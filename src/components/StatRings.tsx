"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Suggested idea: Overall stats — 4-Ring + Streak Strip — now with graph
export default function StatRings() {
  return (
    <div className="rounded-2xl bg-white border border-black/5 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-primary-dark">Overall stats</h3>
        <span className="text-xs bg-accent text-white px-2 py-1 rounded-full">Active plans: 2</span>
      </div>

      {/* Rings row */}
      <div className="grid place-items-center gap-6 sm:grid-cols-[auto_1fr] mb-6">
        {/* main ring mimic */}
        <div className="relative">
          <div className="h-36 w-36 rounded-full border-[10px] border-primary flex items-center justify-center bg-paper">
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-primary">82%</div>
              <div className="text-xs text-foreground/60 -mt-1">Calorie goal</div>
            </div>
          </div>
          {/* satellites */}
          <div className="absolute -top-2 -right-2 h-14 w-14 rounded-full border-4 border-secondary bg-white grid place-items-center text-xs font-bold">P 88%</div>
          <div className="absolute -bottom-2 -right-1 h-14 w-14 rounded-full border-4 border-white bg-accent text-white grid place-items-center text-xs font-bold">C 74%</div>
          <div className="absolute -bottom-2 -left-1 h-14 w-14 rounded-full border-4 border-primary/20 bg-white grid place-items-center text-xs font-bold">F 91%</div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Kpi label="Weekly Δ" value="-0.4 kg" sub="7-day avg" trend="down" />
            <Kpi label="Streak" value="6 days" sub="Habits" trend="up" />
            <Kpi label="Workouts" value="4/5" sub="This week" trend="neutral" />
            <Kpi label="Habits done" value="18/21" sub="7 days" trend="up" />
          </div>
          <div className="rounded-xl bg-paper p-3">
            <div className="text-xs font-semibold text-primary-dark mb-2">7-day weight & volume — graph</div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{ d: "Mon", w: 72.8, v: 42 }, { d: "Tue", w: 72.6, v: 55 }, { d: "Wed", w: 72.4, v: 48 }, { d: "Thu", w: 72.2, v: 70 }, { d: "Fri", w: 72, v: 62 }, { d: "Sat", w: 71.8, v: 58 }, { d: "Sun", w: 71.6, v: 72 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3F194D20" />
                  <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="w" stroke="#68097E" strokeWidth={3} dot={{ r: 3 }} name="kg" />
                  <Line yAxisId="right" type="monotone" dataKey="v" stroke="#C91C7A" strokeWidth={2} dot={false} name="volume" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-2 text-xs text-foreground/70">
        💡 Idea: rings = macros at a glance; streak strip motivates daily ticks. Pro users see “Projected goal: 12 Mar 2027”.
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, trend }: { label: string; value: string; sub: string; trend: "up" | "down" | "neutral" }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-3">
      <div className="text-[11px] tracking-widest uppercase text-muted font-semibold">{label}</div>
      <div className="text-lg font-bold text-primary-dark flex items-center gap-1">
        {value} <span className={trend === "up" ? "text-primary" : trend === "down" ? "text-accent" : "text-muted"}>{trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}</span>
      </div>
      <div className="text-xs text-foreground/60">{sub}</div>
    </div>
  );
}
