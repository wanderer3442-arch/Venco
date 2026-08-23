import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import MealPlanner from "@/components/MealPlanner";

export default async function MealPage({ searchParams }: { searchParams: Promise<{ other?: string }> }) {
  const { other } = await searchParams;
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="rounded-2xl bg-white border p-6">
          <h1 className="font-display text-2xl font-bold text-primary-dark">Meal</h1>
          <p className="text-sm text-foreground/60">800 foods (500 Indian + 300 global) • typeahead “bre → bread, bhel…” • allergies → swaps • 1-week intake → plan with qty/carbs/kcal + avoid / eat more / new foods. Local DB, no AI — quota adjusts, plan unchanged for Other.</p>
        </div>
        <MealPlanner otherInitial={other} />
      </main>
      <ChatV />
    </>
  );
}
