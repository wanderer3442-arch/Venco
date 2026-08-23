import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import ExercisePlanner from "@/components/ExercisePlanner";

export default function ExercisesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="rounded-2xl bg-white border p-6">
          <h1 className="font-display text-2xl font-bold text-primary-dark">Exercises</h1>
          <p className="text-sm text-foreground/60">Auto from TDEE/goal + templates + editable + calibrated. Delete plan, add/delete exercises — sets auto-tuned, warnings with reason if not recommended.</p>
        </div>
        <ExercisePlanner />
      </main>
      <ChatV />
    </>
  );
}
