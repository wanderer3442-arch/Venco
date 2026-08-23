import Header from "@/components/Header";
import ChatV from "@/components/ChatV";

export default function LoggerPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        <h1 className="font-display text-2xl font-bold text-primary-dark">Logger</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Habit tracker" desc="Graph + calendar boxes — tick from To Do or here. Add/delete habits like Walk." accent>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className={`h-9 rounded-lg border grid place-items-center ${i % 3 === 0 ? "bg-primary text-white" : "bg-paper"}`}>{i + 1}</div>
              ))}
            </div>
          </Section>
          <Section title="Meal tracker" desc="Graph + ring: center meal, satellites calories/carbs/protein/vitamins">
            <div className="h-32 rounded-xl bg-paper grid place-items-center text-sm text-foreground/60">Ring chart — center Meal + satellite macros</div>
          </Section>
          <Section title="Exercise tracker" desc="Graph + calendar">
            <div className="h-24 rounded-xl bg-paper grid place-items-center text-sm text-foreground/60">Volume graph + calendar</div>
          </Section>
          <Section title="Weight & Height" desc="Logged weekly → feeds Essentials weekly adjust">
            <div className="flex gap-2">
              <input placeholder="Weight kg" className="flex-1 rounded-full border px-4 py-2 text-sm" />
              <input placeholder="Height cm" className="flex-1 rounded-full border px-4 py-2 text-sm" />
              <button className="rounded-full bg-primary text-white px-5 text-sm">Save</button>
            </div>
          </Section>
        </div>
      </main>
      <ChatV />
    </>
  );
}

function Section({ title, desc, children, accent }: { title: string; desc: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "bg-white" : "bg-white"}`}>
      <div className="font-semibold text-primary-dark">{title}</div>
      <div className="text-xs text-foreground/60 mb-3">{desc}</div>
      {children}
    </div>
  );
}
