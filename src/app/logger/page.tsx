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
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h1 className="font-display text-5xl font-black tracking-tighter text-primary-dark">LOGGER <span className="text-accent">— 4-way</span></h1>
          <p className="text-sm text-foreground/60 max-w-md">Habits • Meals • Exercise • Body. Bars replaced by graphs — every comparison is a line.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-12 rotate-[0.2deg]"><HabitTracker /></div>
          <div className="lg:col-span-6 -rotate-[0.4deg]"><MealRing /></div>
          <div className="lg:col-span-6 rotate-[0.5deg]"><ExerciseTracker /></div>
          <div className="lg:col-span-12"><BodyLogger /></div>
        </div>
      </main>
      <ChatV />
    </>
  );
}
