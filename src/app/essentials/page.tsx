import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import Link from "next/link";
import EssentialsWizard from "@/components/EssentialsWizard";

export default function EssentialsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-6 space-y-6">
        {/* insane timeline */}
        <div className="rounded-[24px] bg-paper border border-white/10 p-6 relative overflow-hidden">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-secondary/20 hidden sm:block" />
          <h1 className="font-display text-4xl font-black tracking-tighter text-foreground">Essentials <span className="text-secondary">— 4 steps</span></h1>
          <p className="text-sm text-foreground/60">BMI → BMR → TDEE → macros. Weekly 7-day avg adjust ±100-150.</p>
          <div className="mt-6 grid gap-4 sm:pl-10">
            {[
              { n: "01", t: "BMI = kg / m²", d: "Screening only" },
              { n: "02", t: "BMR men: 10×kg + 6.25×cm −5×age +5", d: "women: −161" },
              { n: "03", t: "TDEE = BMR × 1.2–1.9", d: "Sedentary → very active" },
              { n: "04", t: "Macros: P 1.6–2.2, F 0.8–1.0 g/kg", d: "Carbs remainder (4/4/9 kcal/g)" },
            ].map((x) => (
              <div key={x.n} className="relative rounded-2xl bg-paper border p-4 flex gap-4 items-center rotate-[0.3deg] first:rotate-[-0.4deg]">
                <div className="hidden sm:grid place-items-center h-10 w-10 rounded-full bg-secondary text-white font-black text-sm shrink-0 -ml-14 border-4 border-white">{x.n}</div>
                <div><div className="font-bold text-foreground">{x.t}</div><div className="text-xs text-foreground/60">{x.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EssentialsWizard />
          </div>
          <div className="lg:col-span-4 space-y-3">
            <div className="rounded-2xl bg-primary text-white p-5 rotate-1">
              <div className="font-bold">How it works</div><div className="text-sm text-white/80">We screen → burn → need → target → build. Your Essentials drive Meal + Exercise.</div>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1 text-center rounded-full border bg-paper px-5 py-2.5 text-sm">Back</Link>
              <Link href="/meal" className="flex-1 text-center rounded-full bg-accent text-white px-5 py-2.5 text-sm font-bold">Meal →</Link>
            </div>
          </div>
        </div>
      </main>
      <ChatV />
    </>
  );
}
