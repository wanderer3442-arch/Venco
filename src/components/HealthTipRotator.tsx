"use client";

import { useEffect, useState } from "react";

const TIPS = [
  "💤 8 hours sleep improves muscle recovery by 20%.",
  "📱 Keep mobile usage under 1 hour before bed.",
  "💧 Drink 30–35 ml water per kg bodyweight daily.",
  "🚶 7k–10k steps/day lowers heart risk.",
  "🥗 Protein 1.6–2.2 g/kg protects muscle when cutting.",
  "🧘 5 mins deep breathing lowers cortisol.",
  "☀️ Morning sunlight 10 mins regulates circadian rhythm.",
  "🏋️ Progressive overload — add 2.5% weekly, not daily.",
];

export default function HealthTipRotator() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl bg-white border border-black/5 px-4 py-3 flex items-center gap-3">
      <span className="text-xs font-bold tracking-widest text-accent uppercase">Health Tip</span>
      <span
        key={idx}
        className="text-sm text-foreground/80 animate-in fade-in duration-300"
        role="status"
        aria-live="polite"
      >
        {TIPS[idx]}
      </span>
      <span className="ml-auto text-xs text-muted">{idx + 1}/{TIPS.length}</span>
    </div>
  );
}
