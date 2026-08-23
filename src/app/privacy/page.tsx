import Header from "@/components/Header";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-6 py-10 prose prose-sm">
        <h1 className="font-display text-3xl font-bold text-primary-dark">Privacy Policy</h1>
        <p className="text-foreground/70">VencoFit (DPDP Act 2023 compliant) — we store essentials (BMI/BMR/TDEE), meal/exercise logs, habits locally + encrypted at rest. No sale of health data. Export/delete available. Consent required at onboarding.</p>
        <h2>Data we collect</h2>
        <ul><li>Profile: age, sex, weight, height, goal</li><li>Logs: meals, habits, workouts, weight</li><li>AI chats (rate-limited)</li></ul>
        <h2>Retention & rights</h2>
        <p>Export JSON/PDF, delete account, withdraw consent.</p>
        <p className="text-xs text-foreground/50">Last updated 23 Aug 2026. For legal review.</p>
      </main>
    </>
  );
}
