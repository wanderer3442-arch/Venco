import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import { auth } from "@/auth";

export default async function DownloadPage() {
  const session = await auth();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-6 py-6 space-y-4">
        <div className="rounded-2xl bg-white border p-6">
          <h1 className="font-display text-2xl font-bold text-primary-dark">Download — Hospital Checkup Pack (Pro)</h1>
          <p className="text-sm text-foreground/60">Ready file with exercise + meal plan + stats for when they do any hospital checkup. Includes cover, Essentials snapshot, 7-day meal, exercise plan, 30-day logs, disclaimers.</p>
          <div className="mt-3 text-xs">Signed in as {(session?.user as { email?: string })?.email ?? "demo"} • tier {(session?.user as unknown as { tier?: string })?.tier ?? "free"}</div>
        </div>
        <div className="rounded-2xl bg-white border p-6">
          <h2 className="font-semibold text-primary-dark">Preview</h2>
          <div className="mt-2 rounded-xl bg-paper border p-4 text-xs leading-relaxed font-mono whitespace-pre-wrap">
{`VencoFit — Checkup Pack
Name: ${session?.user?.name ?? "Demo User"}  Date: ${new Date().toISOString().slice(0,10)}
— Essentials: BMI/BMR/TDEE → targetKcal + macros + hydration
— Meal plan (800 foods, 500 Indian) with qty/kcal/carbs, avoid/eat more, allergy swaps
— Exercise plan (auto/templated, calibrated)
— 30d logs: habits, meals (ring), exercise calendar, weight trend
— Sources: WHO + Mayo (health), IFCT/USDA (foods)
— Not medical advice • privacy DPDP Act • venco.fit/privacy
`}
          </div>
          <a href="/api/download" className="mt-3 inline-block rounded-full bg-primary text-white px-6 py-2.5 text-sm font-semibold">Download PDF (A4)</a>
          <p className="text-xs text-muted mt-2">Generated server-side from your profile + latest CalculationSnapshot. Free users are redirected to Pricing via middleware.</p>
        </div>
      </main>
      <ChatV />
    </>
  );
}
