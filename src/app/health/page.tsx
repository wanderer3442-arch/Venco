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
      <main className="mx-auto max-w-3xl w-full px-6 py-6 space-y-4">
        <div className={`rounded-2xl border p-4 flex items-center justify-between ${isPro ? "bg-primary text-white border-primary" : "bg-accent/10 border-accent/20"}`}>
          <div>
            <div className="font-semibold text-sm">Health • WHO + Mayo • Pro {isPro ? "✓ unlocked" : "locked"}</div>
            <div className="text-xs opacity-80">{isPro ? "Full guidance integrates into Meal/Exercise." : "Demo shows search; integration requires Pro ₹500/mo."}</div>
          </div>
          {!isPro && <Link href="/pricing" className="rounded-full bg-accent text-white px-4 py-2 text-xs font-semibold">Unlock</Link>}
        </div>
        <HealthSearch />
        {!session && <div className="text-xs text-center text-muted">Sign in to save health preferences to your profile.</div>}
      </main>
      <ChatV />
    </>
  );
}
