"use client";

// Suggested idea: Overall stats — 4-Ring + Streak Strip
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
          {/* sparkline mimic */}
          <div className="rounded-xl bg-paper p-3">
            <div className="text-xs font-semibold text-primary-dark mb-2">7-day weight & volume</div>
            <div className="flex items-end gap-1 h-16">
              {[42, 55, 48, 70, 62, 58, 72].map((h, i) => (
                <div key={i} className="flex-1 bg-primary rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-foreground/50 mt-1">
              <span>Mon</span><span>Sun</span>
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
