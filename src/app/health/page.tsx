import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import Link from "next/link";

export default function HealthPage() {
  const isPro = false; // gate with subscription later
  if (!isPro) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl w-full px-6 py-12">
          <div className="rounded-2xl bg-white border p-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-white text-xl">◆</div>
            <h1 className="mt-3 font-display text-2xl font-bold text-primary-dark">Health — Pro only</h1>
            <p className="text-sm text-foreground/60 mt-2">WHO + Mayo curated, not AI-generated. Type your condition (diabetes, low muscle mass...) → meal + exercise tweaks.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/pricing" className="rounded-full bg-primary text-white px-6 py-2.5 text-sm font-semibold">Unlock ₹500/mo</Link>
              <Link href="/" className="rounded-full border px-6 py-2.5 text-sm">Back</Link>
            </div>
            <p className="text-xs text-foreground/50 mt-4">Yearly ₹3000 • 7-day refund • DPDP compliant</p>
          </div>
        </main>
        <ChatV />
      </>
    );
  }
  return <div>pro content</div>;
}
