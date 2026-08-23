import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import Link from "next/link";
import EssentialsWizard from "@/components/EssentialsWizard";

export default function EssentialsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="rounded-2xl bg-white border border-black/5 p-6">
          <h1 className="font-display text-2xl font-bold text-primary-dark">Essentials</h1>
          <p className="text-sm text-foreground/60">BMI • Mifflin-St Jeor BMR → TDEE → target calories → macros → hydration. Weekly 7-day avg adjust ±100–150.</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-paper p-4 border"><div className="font-semibold">BMI = kg / m²</div><div className="text-foreground/60 text-xs">Screening only.</div></div>
            <div className="rounded-xl bg-paper p-4 border"><div className="font-semibold">BMR men: 10×kg + 6.25×cm −5×age +5</div><div className="text-foreground/60 text-xs">women: −161</div></div>
            <div className="rounded-xl bg-paper p-4 border"><div className="font-semibold">TDEE = BMR × 1.2–1.9</div><div className="text-foreground/60 text-xs">Sedentary → very active</div></div>
            <div className="rounded-xl bg-paper p-4 border"><div className="font-semibold">Macros: P 1.6–2.2, F 0.8–1.0 g/kg</div><div className="text-foreground/60 text-xs">Carbs remainder (4/4/9 kcal/g)</div></div>
          </div>
        </div>
        <EssentialsWizard />
        <div className="flex gap-2">
          <Link href="/" className="rounded-full border px-5 py-2 text-sm">Back to Dashboard</Link>
          <Link href="/meal" className="rounded-full bg-secondary text-primary-dark px-5 py-2 text-sm font-semibold">Continue to Meal →</Link>
        </div>
      </main>
      <ChatV />
    </>
  );
}
