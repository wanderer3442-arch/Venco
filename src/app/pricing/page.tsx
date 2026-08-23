import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-primary-dark">Subscription</h1>
          <p className="text-sm text-foreground/60 mt-1">Privacy-first. Health data never sold.</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Tier
            name="Free"
            price="₹0"
            period=""
            features={["Essentials + auto plans", "Logger (all trackers)", "V: 5 msgs/day", "Health 🔒", "Download 🔒"]}
            cta="Current"
            highlight={false}
          />
          <Tier
            name="Pro"
            price="₹500"
            period="/month"
            features={["Unlimited V (OpenRouter)", "Health (WHO+Mayo)", "Download PDF for checkups", "Priority calibration", "Cancel anytime"]}
            cta="Upgrade — Razorpay"
            highlight
            badge="Most popular"
          />
          <Tier
            name="Annual"
            price="₹3000"
            period="/year"
            save="Save ₹3000 vs monthly"
            features={["Everything in Pro", "2 months free", "Annual health summary", "Early features"]}
            cta="Go Annual"
            highlight={false}
          />
        </div>
        <div className="mt-8 rounded-2xl bg-white border p-6 text-sm">
          <h2 className="font-semibold text-primary-dark">Why color3?</h2>
          <p className="text-foreground/60">Palette #146466 / #c92f1c / #5aaba9 / #e2e2c4 — deep teal trust + vermilion energy — used across Stitch system (ROUND_EIGHT, Inter/Manrope).</p>
          <div className="mt-3 flex gap-2">
            <span className="h-6 w-12 rounded bg-primary" title="#146466" />
            <span className="h-6 w-12 rounded bg-accent" title="#c92f1c" />
            <span className="h-6 w-12 rounded bg-secondary" title="#5aaba9" />
            <span className="h-6 w-12 rounded bg-paper border" title="#e2e2c4" />
          </div>
          <p className="text-xs text-foreground/50 mt-3">Payments via Razorpay test mode (₹0 setup) → live 2% fee. Free mock gate during dev.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-primary text-white px-6 py-2.5 text-sm">Back to app</Link>
        </div>
      </main>
      <ChatV />
    </>
  );
}

function Tier({ name, price, period, save, features, cta, highlight, badge }: { name: string; price: string; period: string; save?: string; features: string[]; cta: string; highlight?: boolean; badge?: string }) {
  return (
    <div className={`rounded-2xl border p-6 flex flex-col ${highlight ? "bg-primary text-white border-primary shadow-xl scale-[1.02]" : "bg-white border-black/5"}`}>
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
      <button className={`mt-6 rounded-full px-5 py-2.5 text-sm font-semibold ${highlight ? "bg-white text-primary" : "bg-primary text-white"}`}>{cta}</button>
    </div>
  );
}
