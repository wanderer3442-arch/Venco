'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle, MessageSquareWarning, Mail } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const SUPPORT_EMAIL = 'gymathome.app@gmail.com';

const categories = [
  'Bug report',
  'Feature request',
  'AI chatbot issue',
  'Something else',
];

export default function ReportProblemPage() {
  const [category, setCategory] = useState(categories[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [links, setLinks] = useState<{ gmail: string; mailto: string; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    const sub = params.get('sub');
    if (cat && categories.includes(cat)) setCategory(cat);
    if (sub) setSubject(sub.slice(0, 120));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectLine = `[${category}] ${subject}`;
    const body = [
      message,
      '',
      '---',
      'App: Gym at Home',
      `Category: ${category}`,
      `Sent: ${new Date().toISOString()}`,
      `Reply to: ${email || 'not provided'}`,
    ].join('\n');
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    setLinks({ gmail, mailto, text: `${subjectLine}\n\n${body}` });

    // Desktop often has no default mail client (mailto: silently fails) — open
    // a Gmail compose tab instead. Mobile gets the native email app.
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = mailto;
    } else {
      window.open(gmail, '_blank', 'noopener,noreferrer');
    }
    setSent(true);
  };

  const handleCopy = async () => {
    if (!links) return;
    try {
      await navigator.clipboard.writeText(links.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (sent) {
    return (
      <DashboardLayout title="Report a Problem" subtitle="Help us improve">
        <div className="max-w-lg mx-auto mt-8 text-center space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-headline-lg font-bold text-on-surface">Report ready to send</h2>
          <p className="text-body-md text-on-surface-variant">
            Finish sending it in the draft we opened — or pick another way below.
          </p>
          <div className="flex flex-col gap-3 pt-1">
            <a
              href={links?.gmail}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 bg-primary text-on-primary rounded-xl text-label-md font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              Open Gmail draft
              <Send className="w-4 h-4" />
            </a>
            <a
              href={links?.mailto}
              className="w-full h-12 bg-surface-container border border-outline-variant text-on-surface rounded-xl text-label-md font-semibold hover:border-primary transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Open in email app
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="w-full h-12 bg-surface-container border border-outline-variant text-on-surface rounded-xl text-label-md font-semibold hover:border-primary transition-all flex items-center justify-center gap-2"
            >
              {copied ? 'Copied!' : 'Copy report text'}
            </button>
          </div>
          <p className="text-body-md text-on-surface-variant">
            Or write to us directly:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-medium underline underline-offset-2">
              {SUPPORT_EMAIL}
            </a>
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
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-primary text-on-primary rounded-xl text-label-md font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
        >
          Open email to send
          <Send className="w-4 h-4" />
        </button>

        <p className="text-center text-body-md text-on-surface-variant flex items-center justify-center gap-1.5">
          <Mail className="w-4 h-4" />
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </form>
    </DashboardLayout>
  );
}
