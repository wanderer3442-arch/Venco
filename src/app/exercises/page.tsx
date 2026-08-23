import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import ExercisePlanner from "@/components/ExercisePlanner";

export default function ExercisesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="rounded-[24px] bg-white border p-6 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/10 rotate-12" />
          <h1 className="font-display text-5xl font-black tracking-tighter text-primary-dark leading-none">EXERCISE <span className="text-accent">— Gym × Home</span></h1>
          <p className="text-sm text-foreground/60 mt-1">Auto from TDEE/goal • Templates • Home bodyweight/band/dumbbell • Calibrated sets + “I don’t recommend because …”</p>
        </div>
        <ExercisePlanner />
      </main>
      <ChatV />
    </>
  );
}
