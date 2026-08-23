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

        {/* Insane bento — only stats + todo + eat, no nav cards */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rotate-[0.6deg]">
              <TodoList />
            </div>
            <div className="-rotate-[0.7deg]">
              <EatNew />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rotate-[0.4deg]">
              <StatRings />
            </div>
          </div>
        </div>
      </main>
      <ChatV />
      <footer className="mx-auto max-w-7xl w-full px-6 py-8 text-xs text-foreground/50 border-t border-white/10 mt-6">
        <div className="flex flex-wrap gap-4">
          <a href="/privacy" className="underline hover:text-primary">Privacy</a>
          <a href="/terms" className="underline hover:text-primary">Terms</a>
          <span>• Not medical advice. Consult clinician for health conditions.</span>
        </div>
      </footer>
    </>
  );
}
