import Header from "@/components/Header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-6 py-10 prose prose-sm prose-headings:font-display prose-headings:text-primary-dark">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="lead text-foreground/70">Last updated 23 Aug 2026 — please read. Using VencoFit means you accept these.</p>

        <h2>1. Service</h2>
        <p>VencoFit provides BMI/BMR/TDEE/macros, auto exercise + meal plans (800 foods: 500 Indian +300 Global), logger, AI V coach (OpenRouter), Health (WHO+Mayo) and Download PDF. Wellness information only — not medical diagnosis. Always consult a clinician.</p>

        <h2>2. Accounts</h2>
        <p>Gmail (Google OAuth) or email + password (bcrypt). You are responsible for credentials. 13+.</p>

        <h2>3. Subscriptions</h2>
        <ul>
          <li><b>Free:</b> Essentials, plans, logger, V 5 msgs/day, Health/Download locked.</li>
          <li><b>Pro ₹500/mo:</b> unlimited V, Health, Download, priority calibration. Razorpay, UPI/cards, test mode while developing (₹0 setup).</li>
          <li><b>Annual ₹3000/yr:</b> same as Pro, ~50% off. Auto-renew, cancel anytime in Settings → no refund for partial period (India law). 7-day refund for first purchase on request.</li>
        </ul>

        <h2>4. Acceptable use</h2>
        <p>No scraping, no medical advice misrepresentation, no uploading harmful data. We may suspend for abuse.</p>

        <h2>5. AI V</h2>
        <p>Free agent via OpenRouter (you supply key for live). Limit enforced server-side via ChatUsage. Pro unlimited. Outputs may be inaccurate — verify.</p>

        <h2>6. Liability</h2>
        <p>Provided “as is” without warranties. To extent permitted by law, liability capped to fees paid in last 3 months. Not liable for health decisions.</p>

        <h2>7. Termination</h2>
        <p>You may delete account (erases profile + logs within 30d). We may terminate for breach.</p>

        <h2>8. Governing law</h2>
        <p>India, DPDP Act 2023. Disputes: Bangalore courts. Contact legal@venco.fit.</p>

        <p className="text-xs text-foreground/50"><a href="/privacy">Privacy</a> • Pricing color3 #146466 • Stitch design system 10369891614704217499</p>
      </main>
    </>
  );
}
