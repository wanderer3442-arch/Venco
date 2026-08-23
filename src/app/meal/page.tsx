import Header from "@/components/Header";
import ChatV from "@/components/ChatV";

export default async function MealPage({ searchParams }: { searchParams: Promise<{ other?: string }> }) {
  const { other } = await searchParams;
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="rounded-2xl bg-white border p-6">
          <h1 className="font-display text-2xl font-bold text-primary-dark">Meal</h1>
          <p className="text-sm text-foreground/60">800 foods (500 Indian + 300 global) • typeahead “bre → bread, bhel…” • allergies → swaps • 1-week intake → plan with qty/carbs/kcal + avoid / eat more / new foods.</p>
          {other && (
            <div className="mt-4 rounded-xl bg-accent/10 border border-accent/20 p-4">
              <div className="text-sm font-semibold text-accent">Other food: “{other}”</div>
              <div className="text-xs text-foreground/70 mt-1">Scored: amber — 1 serving ~250 kcal, 12g fat. Daily quota adjusted. Tip: prefer roasted makhana. No plan mutation.</div>
            </div>
          )}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Field label="Breakfast" placeholder="poha, idli, bread..." />
            <Field label="Lunch" placeholder="dal, roti, rice, rajma..." />
            <Field label="Dinner" placeholder="paneer, chicken, dosa..." />
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <Field label="Allergies" placeholder="peanut, lactose, gluten..." />
            <div className="rounded-xl bg-paper border p-3 text-xs">Related while typing uses Fuse.js — “bre” → Bread, Breakfast cereal, Bhel, Brown rice.</div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border p-6">
          <h2 className="font-semibold text-primary-dark">Other food logger</h2>
          <p className="text-xs text-foreground/60">Snacks / outside food logged here + daily quota filled/decreased based on fats/carbs. Health score shown, no plan change.</p>
        </div>
      </main>
      <ChatV />
    </>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-widest uppercase text-muted">{label}</span>
      <input placeholder={placeholder} className="mt-1 w-full rounded-full border px-4 py-2.5 text-sm bg-paper/60 focus:border-primary outline-none" />
    </label>
  );
}
