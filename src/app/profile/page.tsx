import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import ProfileClient from "@/components/ProfileClient";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-6">
        <div className="rounded-[28px] bg-gradient-to-br from-primary-dark via-primary to-secondary p-[1.5px]">
          <div className="rounded-[26px] bg-background p-5">
            <h1 className="font-display text-3xl font-black tracking-tighter text-foreground">Profile — <span className="text-secondary">You</span></h1>
            <p className="text-sm text-foreground/60">Change username, see monthly, track progress. {session ? `Signed as ${(session.user as { email?: string })?.email}` : "Not signed — sign in to sync."}</p>
          </div>
        </div>
        <ProfileClient />
      </main>
      <ChatV />
    </>
  );
}
