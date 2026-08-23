import Header from "@/components/Header";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-6 py-10 prose prose-sm prose-headings:font-display prose-headings:text-foreground">
        <h1 className="text-3xl font-bold">Privacy Policy — VencoFit</h1>
        <p className="lead text-foreground/70">Effective 23 Aug 2026 • DPDP Act 2023 • GDPR-informed • Health data is sensitive — we treat it as such.</p>

        <h2>1. Who we are</h2>
        <p>VencoFit Health OS, operated by Venco. Contact: privacy@venco.fit. Grievance Officer (India DPDP): dpo@venco.fit.</p>

        <h2>2. Data we collect</h2>
        <ul>
          <li><b>Profile & Essentials:</b> sex, age, weight kg, height cm, activity factor, goal, allergies, BMI/BMR/TDEE/macros/hydration snapshots</li>
          <li><b>Content:</b> meal logs (800 foods), Other food entries, exercise plans, habit ticks, body weight/height weekly, Health condition queries</li>
          <li><b>Account:</b> name, email (Gmail OAuth or password bcrypt), subscription tier</li>
          <li><b>AI V chats:</b> messages, count per day (free 5/day, Pro unlimited), not used for training</li>
          <li><b>Technical:</b> IP, device, logs for security</li>
        </ul>

        <h2>3. Why & legal basis</h2>
        <p>Provide fitness/meal plans, logger, health guidance (WHO/Mayo cited, not diagnosis), PDF checkup pack, subscription. Consent at onboarding (explicit for health data), contract, legitimate interest (security).</p>

        <h2>4. Sharing</h2>
        <p>We <b>do not sell</b> health data. Processors: Vercel (hosting, EU/US), Neon/Supabase Postgres (encrypted at rest), Razorpay (payments, test mode free), OpenRouter (V chat — only message, no profile). All DPAs signed. Health DB is local (WHO+Mayo), never sent to AI without consent.</p>

        <h2>5. Storage & security</h2>
        <p>Encrypted at rest & in transit, bcrypt passwords, RLS-ready Postgres, backups 7d. Retention: account + 30d after deletion. You can export JSON/PDF or delete at Settings → Delete account.</p>

        <h2>6. Your rights</h2>
        <p>DPDP: access, correction, erasure, grievance. Withdraw consent → features limited to Essentials. Contact dpo@venco.fit, 30-day response.</p>

        <h2>7. Cookies & tracking</h2>
        <p>Essential only (auth, preferences). No ad trackers.</p>

        <h2>8. Children & health disclaimer</h2>
        <p>13+, not a medical device. Health guidance is general wellness, not diagnosis — consult clinician.</p>

        <h2>9. Changes</h2>
        <p>Material changes via email + in-app banner. Continued use = acceptance.</p>

        <p className="text-xs text-foreground/50">For legal counsel review before public launch. • <a href="/terms">Terms</a> • <a href="/download">Download pack includes this</a></p>
      </main>
    </>
  );
}
