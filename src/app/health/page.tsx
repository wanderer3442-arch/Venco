import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import Link from "next/link";
import { auth } from "@/auth";
import HealthSearch from "@/components/HealthSearch";

export default async function HealthPage() {
  const session = await auth();
  const tier = (session?.user as unknown as { tier?: string })?.tier ?? "free";
  const isPro = tier !== "free";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="rounded-[24px] bg-white border p-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tighter text-primary-dark">HEALTH <span className="text-secondary">— WHO×Mayo</span></h1>
            <div className={`inline-flex mt-2 rounded-full px-3 py-1 text-xs font-bold ${isPro ? "bg-primary text-white" : "bg-accent text-white"}`}>Pro {isPro ? "✓ unlocked" : "locked — preview only"}</div>
            <div className="text-xs text-foreground/60 mt-1">{isPro ? "Full guidance integrates into Meal/Exercise (both storages)." : "Demo shows search; Pro persists to both."}</div>
          </div>
          {!isPro && <Link href="/pricing" className="rounded-full bg-accent text-white px-5 py-2.5 text-sm font-bold">Unlock ₹500</Link>}
        </div>
        <HealthSearch />
        {!session && <div className="text-xs text-center text-muted">Sign in to save health preferences to your profile.</div>}
      </main>
      <ChatV />
    </>
  );
}
