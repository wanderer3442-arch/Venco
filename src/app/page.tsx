import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import HealthTipRotator from "@/components/HealthTipRotator";
import TodoList from "@/components/TodoList";
import StatRings from "@/components/StatRings";
import EatNew from "@/components/EatNew";

export default function Dashboard() {
  // demo user — replace with session
  const username = "Aarav";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Greeting */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-dark">
              Good morning, {username} <span className="text-accent">— let’s move.</span>
            </h1>
            <p className="text-sm text-foreground/60">VencoFit OS • track, tweak, repeat.</p>
          </div>
          <HealthTipRotator />
        </div>

        {/* Grid: todo + eat new + stats */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <TodoList />
            <EatNew />
          </div>
          <div className="lg:col-span-8">
            <StatRings />
          </div>
        </div>

        {/* quick nav cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card href="/essentials" title="Essentials" desc="BMI • BMR • TDEE → macros & hydration" accent />
          <Card href="/meal" title="Meal" desc="800 foods (500 Indian + 300 global) • allergies" />
          <Card href="/exercises" title="Exercises" desc="Auto plan + templates • calibrate on edit" />
          <Card href="/logger" title="Logger" desc="Habits • Rings • Calendar • Weight" />
          <Card href="/health" title="Health" desc="WHO + Mayo • subscription only" locked />
          <Card href="/download" title="Download" desc="PDF for checkups • Pro" locked />
        </div>
      </main>
      <ChatV />
      <footer className="mx-auto max-w-7xl w-full px-6 py-8 text-xs text-foreground/50 border-t border-black/5 mt-6">
        <div className="flex flex-wrap gap-4">
          <a href="/privacy" className="underline hover:text-primary">Privacy</a>
          <a href="/terms" className="underline hover:text-primary">Terms</a>
          <span>• Not medical advice. Consult clinician for health conditions.</span>
        </div>
      </footer>
    </>
  );
}

function Card({ href, title, desc, accent, locked }: { href: string; title: string; desc: string; accent?: boolean; locked?: boolean }) {
  return (
    <a
      href={href}
      className={`rounded-2xl border p-5 flex flex-col gap-1 hover:shadow-md transition ${
        accent ? "bg-primary text-white border-primary" : "bg-white border-black/5 hover:border-primary/20"
      }`}
    >
      <div className={`font-display font-bold flex items-center gap-2 ${accent ? "text-white" : "text-primary-dark"}`}>
        {title} {locked && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${accent ? "bg-white text-primary" : "bg-accent text-white"}`}>PRO</span>}
      </div>
      <div className={`text-sm ${accent ? "text-white/80" : "text-foreground/60"}`}>{desc}</div>
      <div className={`text-xs mt-2 font-semibold ${accent ? "text-white" : "text-primary"}`}>Open →</div>
    </a>
  );
}
