import Header from "@/components/Header";
import ChatV from "@/components/ChatV";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-6 py-12">
        <div className="rounded-2xl bg-white border p-8">
          <h1 className="font-display text-2xl font-bold text-primary-dark">Download</h1>
          <p className="text-sm text-foreground/60">Ready file with exercise + meal plan + stats for hospital checkup. Pro only.</p>
          <div className="mt-6 rounded-xl bg-paper border p-4 text-sm">
            <div className="font-semibold">Preview</div>
            <div className="text-xs text-foreground/60">A4 PDF: cover → plans → 30-day logs → disclaimers.</div>
            <Link href="/api/download" className="mt-3 inline-block rounded-full bg-primary text-white px-5 py-2 text-sm">Download PDF</Link>
          </div>
        </div>
      </main>
      <ChatV />
    </>
  );
}
