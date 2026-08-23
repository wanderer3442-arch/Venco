import Header from "@/components/Header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-6 py-10 prose prose-sm">
        <h1 className="font-display text-3xl font-bold text-primary-dark">Terms of Service</h1>
        <p className="text-foreground/70">VencoFit provides general wellness information, not medical diagnosis. Health DB is curated from WHO/Mayo with citations. Subscription: Free (limited AI, Health/Download locked), Pro ₹500/mo, Annual ₹3000/yr via Razorpay. Auto-renew, cancel anytime.</p>
        <p className="text-xs text-foreground/50">Not a medical device. Consult clinician for diabetes, cardiac etc.</p>
      </main>
    </>
  );
}
