import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import { auth } from "@/auth";
import DownloadPreview from "@/components/DownloadPreview";

export default async function DownloadPage() {
  const session = await auth();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-6 py-6 space-y-4">
        <div className="rounded-2xl bg-paper border border-white/10 p-6">
          <h1 className="font-display text-3xl font-black tracking-tighter text-foreground">DOWNLOAD <span className="text-secondary">— week pack</span></h1>
          <p className="text-sm text-foreground/60">Only meals for the week, exercise for the week, and habits — ready for hospital checkup. No extra stats.</p>
          <div className="mt-2 text-xs text-muted">Signed in as {(session?.user as { email?: string })?.email ?? "demo"} • tier {(session?.user as unknown as { tier?: string })?.tier ?? "free"}</div>
        </div>
        <div className="rounded-2xl bg-paper border border-white/10 p-6">
          <h2 className="font-bold text-foreground">Preview — week only</h2>
          <div className="mt-3">
            <DownloadPreview />
          </div>
          <a href="/api/download" className="mt-4 inline-block rounded-full bg-primary text-white px-6 py-2.5 text-sm font-bold">Download PDF</a>
          <p className="text-xs text-muted mt-2">Pro only — free users redirected to Pricing. PDF contains exactly these three sections.</p>
        </div>
      </main>
      <ChatV />
    </>
  );
}
