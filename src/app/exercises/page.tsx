import Header from "@/components/Header";
import ChatV from "@/components/ChatV";

export default function ExercisesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="rounded-2xl bg-white border p-6">
          <h1 className="font-display text-2xl font-bold text-primary-dark">Exercises</h1>
          <p className="text-sm text-foreground/60">Auto-generated from TDEE & goal + templates. Edit: add/delete exercises — we recalibrate sets & warn if not recommended (with reason).</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-paper p-4">
              <div className="font-semibold text-sm">Auto Plan (Push • Pull • Legs)</div>
              <div className="text-xs text-foreground/60">3×/wk cut • 6× bulk • 4× maint</div>
              <div className="mt-2 text-xs">Bench Press 4×8, Overhead Press 3×10, ...</div>
              <div className="mt-2 text-xs text-accent">⚠ If you add 5× Overhead Press with shoulder flag → suggest Landmine Press (lower impingement).</div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <div className="font-semibold text-sm">Templates</div>
              <div className="text-xs text-foreground/60">Home Dumbbell • Gym Hypertrophy • Minimal • etc.</div>
              <button className="mt-3 rounded-full bg-primary text-white px-4 py-2 text-xs">Choose template</button>
            </div>
          </div>
        </div>
      </main>
      <ChatV />
    </>
  );
}
