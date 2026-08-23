import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import HabitTracker from "@/components/HabitTracker";
import MealRing from "@/components/MealRing";
import ExerciseTracker from "@/components/ExerciseTracker";
import BodyLogger from "@/components/BodyLogger";

export default function LoggerPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        <h1 className="font-display text-2xl font-bold text-primary-dark">Logger</h1>
        <p className="text-sm text-foreground/60">Habits • Meals • Exercise • Body — tick from To Do or here, all sync.</p>
        <div className="grid gap-6 lg:grid-cols-2">
          <HabitTracker />
          <MealRing />
          <ExerciseTracker />
          <BodyLogger />
        </div>
      </main>
      <ChatV />
    </>
  );
}
