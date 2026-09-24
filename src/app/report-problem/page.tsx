'use client';

import { useState } from 'react';
import { Send, CheckCircle, MessageSquareWarning } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const categories = [
  'Bug report',
  'Feature request',
  'Payment issue',
  'AI chatbot issue',
  'Something else',
];

export default function ReportProblemPage() {
  const [category, setCategory] = useState(categories[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          category,
          subject,
          message,
          email,
          page: 'Gym at Home app',
          time: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError('Could not send right now. Please try again later.');
      }
    } catch {
      setError('Could not send right now. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <DashboardLayout title="Report a Problem" subtitle="Help us improve">
        <div className="max-w-lg mx-auto mt-8 text-center space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-headline-lg font-bold text-on-surface">Thanks — report sent</h2>
          <p className="text-body-md text-on-surface-variant">
            We&apos;ll look into it. If you left an email, we may follow up.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Report a Problem"
      subtitle="Found a bug or have feedback? Let us know."
    >
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 pb-8">
        <div className="bg-surface rounded-2xl border border-outline-variant p-5 space-y-4">
          <div className="flex items-center gap-2 text-on-surface">
            <MessageSquareWarning className="w-5 h-5 text-primary" />
            <span className="text-headline-sm font-semibold">What&apos;s wrong?</span>
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface-variant mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container rounded-xl border border-outline-variant text-body-md text-on-surface focus:outline-none focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface-variant mb-1.5">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary"
              className="w-full h-11 px-3 bg-surface-container rounded-xl border border-outline-variant text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface-variant mb-1.5">Details</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What happened? What did you expect instead?"
              className="w-full px-3 py-2.5 bg-surface-container rounded-xl border border-outline-variant text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface-variant mb-1.5">Your email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="so we can follow up"
              className="w-full h-11 px-3 bg-surface-container rounded-xl border border-outline-variant text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full h-12 bg-primary text-on-primary rounded-xl text-label-md font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {sending ? (
            <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
          ) : (
            <>
              Send report
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </DashboardLayout>
  );
}
