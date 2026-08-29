import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
        <div className="text-center">
          <h1 className="font-display text-5xl font-black tracking-tighter text-foreground">SUBSCRIPTION <span className="text-secondary">— pick your pace</span></h1>
          <p className="text-sm text-foreground/60 mt-1">Privacy-first. Health data never sold. Dark insane, no yellow.</p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3 rotate-[-0.6deg]"><Tier name="Free" price="₹0" period="" features={["Essentials + auto plans", "Logger (all trackers)", "V: 5 msgs/day", "Health 🔒", "Download 🔒"]} cta="Current" highlight={false} /></div>
          <div className="lg:col-span-6 rotate-[0.7deg]"><Tier name="Pro" price="₹500" period="/month" features={["Unlimited V (OpenRouter)", "Health (WHO+Mayo)", "Download PDF for checkups", "Priority calibration", "Cancel anytime"]} cta="Upgrade — Razorpay" highlight badge="Most popular" /></div>
          <div className="lg:col-span-3 rotate-[0.4deg]"><Tier name="Annual" price="₹3000" period="/year" save="Save ₹3000 vs monthly" features={["Everything in Pro", "2 months free", "Annual health summary", "Early features"]} cta="Go Annual" highlight={false} /></div>
        </div>
        <div className="mt-8 rounded-2xl bg-paper border p-6 text-sm">
          <p className="text-xs text-foreground/60">Payments via Razorpay test mode (₹0 setup) → live 2% fee. Free mock gate during dev. Cancel anytime.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-primary text-white px-6 py-2.5 text-sm">Back to app</Link>
        </div>
      </main>
      <ChatV />
    </>
  );
}

function Tier({ name, price, period, save, features, cta, highlight, badge }: { name: string; price: string; period: string; save?: string; features: string[]; cta: string; highlight?: boolean; badge?: string }) {
  return (
    <div className={`rounded-2xl border p-6 flex flex-col ${highlight ? "bg-primary text-white border-primary shadow-xl scale-[1.02]" : "bg-paper border-white/10"}`}>
      <div className={`text-xs tracking-widest uppercase font-bold ${highlight ? "text-white/70" : "text-muted"}`}>{name} {badge && <span className="ml-2 bg-accent text-white px-2 py-0.5 rounded-full text-[10px]">{badge}</span>}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-display font-bold">{price}</span>
        <span className={`text-sm ${highlight ? "text-white/70" : "text-foreground/60"}`}>{period}</span>
      </div>
      {save && <div className={`text-xs mt-1 ${highlight ? "text-white/80" : "text-accent font-semibold"}`}>{save}</div>}
      <ul className="mt-4 space-y-2 text-sm flex-1">
        {features.map((f) => (
          <li key={f} className="flex gap-2"><span>{f.includes("🔒") ? "🔒" : "✓"}</span><span className={highlight ? "text-white/90" : "text-foreground/80"}>{f}</span></li>
        ))}
      </ul>
      <button className={`mt-6 rounded-full px-5 py-2.5 text-sm font-semibold ${highlight ? "bg-paper text-primary" : "bg-primary text-white"}`}>{cta}</button>
    </div>
  );
}
