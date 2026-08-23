import Header from "@/components/Header";
import ChatV from "@/components/ChatV";

export default function SettingsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-foreground/60">Subscription, privacy export/delete, notifications.</p>
      </main>
      <ChatV />
    </>
  );
}
