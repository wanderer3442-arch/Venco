import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import MealPlanner from "@/components/MealPlanner";

export default async function MealPage({ searchParams }: { searchParams: Promise<{ other?: string }> }) {
  const { other } = await searchParams;
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="rounded-[24px] bg-white border p-6 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-accent/10" />
          <h1 className="font-display text-5xl font-black tracking-tighter text-primary-dark leading-none">MEAL <span className="text-secondary">— 800</span></h1>
          <p className="text-sm text-foreground/60 mt-2 max-w-2xl">500 Indian + 300 Global • typeahead “bre → Bread, Bhel, Brown Rice, Breakfast” • comma-separated tokens • allergies → swaps • 1-week plan with qty/kcal/carbs • Other scored, quota adjusts.</p>
        </div>
        <MealPlanner otherInitial={other} />
      </main>
      <ChatV />
    </>
  );
}
