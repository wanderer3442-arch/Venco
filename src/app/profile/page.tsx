import Header from "@/components/Header";
import ChatV from "@/components/ChatV";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-primary-dark">Profile</h1>
        <p className="text-sm text-foreground/60">Gmail + password auth via NextAuth. Edit name, avatar, allergies, goals here.</p>
        <div className="mt-6 rounded-2xl bg-white border p-6 text-sm text-foreground/60">TODO: NextAuth session + Prisma profile.</div>
      </main>
      <ChatV />
    </>
  );
}
