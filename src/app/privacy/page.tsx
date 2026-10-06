'use client';

import { ShieldCheck, HardDrive, Sparkles, Mail, EyeOff } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const sections = [
  {
    icon: HardDrive,
    title: 'Your data stays on your device',
    body: 'Gym at Home stores everything locally — your account, workouts, meals, health metrics and preferences. There is no user database on our servers, and app backups to the cloud are disabled. Removing the app removes your data.',
  },
  {
    icon: EyeOff,
    title: 'No tracking, no ads, no selling',
    body: 'We do not use advertising, analytics or tracking SDKs, and we never sell or share your personal information. Your password is stored only on your device, hashed with PBKDF2.',
  },
  {
    icon: Sparkles,
    title: 'AI features (Google Gemini)',
    body: 'When you chat with the AI assistant, ask for photo-based food recognition or request a plan, the text (and any photo you choose to attach) is sent through our proxy to Google Gemini to generate a reply. That prompt may include health details you type. We do not store these conversations, and Google processes the request to generate the response.',
  },
  {
    icon: ShieldCheck,
    title: 'What we can see',
    body: 'We have no access to your account, your logs or your files. We cannot recover your data for you, so export reports matter if you want a backup.',
  },
];

export default function PrivacyPage() {
  return (
    <DashboardLayout title="Privacy Policy" subtitle="How your information is handled">
      <div className="max-w-3xl mx-auto pb-10 space-y-5">
        <div className="bg-surface rounded-2xl border border-outline-variant p-6">
          <div className="flex items-center gap-2 text-on-surface mb-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-headline-sm font-semibold">Privacy Policy</h2>
          </div>
          <p className="text-body-md text-on-surface-variant">
            Effective September 28, 2026 · Applies to the Gym at Home mobile app.
          </p>
        </div>

        {sections.map((s) => (
          <div key={s.title} className="bg-surface rounded-2xl border border-outline-variant p-6 space-y-2">
            <div className="flex items-center gap-2 text-on-surface">
              <s.icon className="w-5 h-5 text-primary" />
              <h3 className="text-body-lg font-semibold">{s.title}</h3>
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed">{s.body}</p>
          </div>
        ))}

        <div className="bg-surface rounded-2xl border border-outline-variant p-6 space-y-2">
          <div className="flex items-center gap-2 text-on-surface">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="text-body-lg font-semibold">Contact</h3>
          </div>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Questions about privacy or your data? Email{' '}
            <a href="mailto:gymathome.app@gmail.com" className="text-primary font-medium underline underline-offset-2">
              gymathome.app@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
