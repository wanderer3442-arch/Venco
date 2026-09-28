'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Terminal,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  HardDrive,
  RefreshCw,
  Sparkles,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const DEV_PASSPHRASE = 'venco-dev-2026';
const UNLOCK_KEY = 'gymathome_dev_unlock';

interface UserRow {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  storeBytes: number;
  meals: number;
  exercises: number;
  habits: number;
  waterLogs: number;
  sleepLogs: number;
  lastActivity: string | null;
  role: string;
  loggedIn: boolean;
}

interface Check {
  label: string;
  status: 'ok' | 'warn' | 'error';
  detail: string;
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function parseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function todayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function DevConsolePage() {
  const { user, promoteToAdmin } = useAuth();
  const [access, setAccess] = useState<'loading' | 'granted' | 'locked'>('loading');
  const [passphrase, setPassphrase] = useState('');
  const [passError, setPassError] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [checks, setChecks] = useState<Check[]>([]);
  const [storage, setStorage] = useState<{ key: string; bytes: number }[]>([]);
  const [storageTotal, setStorageTotal] = useState(0);
  const [session, setSession] = useState<{
    user: string | null;
    role: string;
    chatToday: number;
    gemini: boolean;
    formspree: boolean;
    theme: string;
    sessionExpires: string | null;
    sessionValid: boolean;
  }>({
    user: null,
    role: '—',
    chatToday: 0,
    gemini: false,
    formspree: false,
    theme: 'light',
    sessionExpires: null,
    sessionValid: false,
  });
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const load = useCallback(() => {
    const foundChecks: Check[] = [];

    const geminiRaw = localStorage.getItem('gemini_api_key');
    const gemini = !!geminiRaw && geminiRaw.length > 10;
    foundChecks.push({
      label: 'Gemini API key',
      status: gemini ? 'ok' : 'warn',
      detail: gemini ? `configured (${geminiRaw!.substring(0, 6)}…)` : 'missing — AI chatbot & photo recognition will fall back / fail',
    });

    const authRaw = localStorage.getItem('gymathome_auth');
    const auth = parseJSON<{
      user?: { id?: string; username?: string; role?: string };
      expiresAt?: number;
    }>(authRaw);
    const sessionValid = !!auth?.expiresAt && Date.now() < auth.expiresAt;
    const sessionUserId = sessionValid ? (auth?.user?.id ?? null) : null;
    const sessionUser = sessionValid ? (auth?.user?.username ?? null) : null;
    const sessionRole = sessionValid ? (auth?.user?.role ?? 'user') : '—';
    const sessionExpires = auth?.expiresAt ? new Date(auth.expiresAt).toLocaleString() : null;
    if (authRaw && !sessionValid) {
      foundChecks.push({
        label: 'Session',
        status: 'warn',
        detail: 'session expired or malformed — user appears logged out',
      });
    }

    const chatKey = `gymathome_chat_count_${todayKey()}`;
    const chatToday = Number(localStorage.getItem(chatKey) || '0');

    foundChecks.push({
      label: 'Feedback form (Formspree)',
      status: 'warn',
      detail: 'endpoint still YOUR_FORM_ID — reports will fail until configured',
    });

    const usersRaw = localStorage.getItem('gymathome_users');
    const userAccounts = parseJSON<
      { id: string; username: string; email: string; createdAt: string; role?: string }[]
    >(usersRaw);
    if (usersRaw && !userAccounts) {
      foundChecks.push({
        label: 'gymathome_users',
        status: 'error',
        detail: 'corrupt JSON — account list unreadable',
      });
    }

    const rows: UserRow[] = (userAccounts || []).map((u) => {
      const storeRaw = localStorage.getItem(`gymathome_store_${u.id}`);
      const store = parseJSON<Record<string, unknown>>(storeRaw);
      const meals = Array.isArray(store?.meals) ? store.meals.length : 0;
      const exercises = Array.isArray(store?.exercises) ? store.exercises.length : 0;
      const habits = Array.isArray(store?.habits) ? store.habits.length : 0;
      const waterLogs = Array.isArray(store?.waterLogs) ? store.waterLogs.length : 0;
      const sleepLogs = Array.isArray(store?.sleepLogs) ? store.sleepLogs.length : 0;
      let lastActivity: string | null = null;
      const candidates: string[] = [];
      for (const list of [store?.meals, store?.exercises, store?.waterLogs, store?.sleepLogs]) {
        if (Array.isArray(list)) {
          for (const item of list) {
            const t = item?.loggedAt;
            if (typeof t === 'string') candidates.push(t);
          }
        }
      }
      if (candidates.length > 0) {
        candidates.sort();
        lastActivity = candidates[candidates.length - 1];
      }
      if (!storeRaw) {
        foundChecks.push({
          label: `Store for ${u.username}`,
          status: 'warn',
          detail: 'account exists but no data store found',
        });
      }
      return {
        id: u.id,
        username: u.username,
        email: u.email,
        createdAt: u.createdAt,
        storeBytes: storeRaw ? storeRaw.length : 0,
        meals,
        exercises,
        habits,
        waterLogs,
        sleepLogs,
        lastActivity,
        role: u.role ?? 'user',
        loggedIn: !!sessionUserId && u.id === sessionUserId,
      };
    });
    rows.sort((a, b) => Number(b.loggedIn) - Number(a.loggedIn));

    if (userAccounts && userAccounts.length === 0) {
      foundChecks.push({ label: 'Accounts', status: 'warn', detail: 'no users registered on this device' });
    }

    const entries: { key: string; bytes: number }[] = [];
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      const v = localStorage.getItem(k) || '';
      const b = v.length;
      total += b;
      entries.push({ key: k, bytes: b });
    }
    entries.sort((a, b) => b.bytes - a.bytes);
    setStorage(entries);
    setStorageTotal(total);

    const quota = 5 * 1024 * 1024;
    foundChecks.push({
      label: 'Storage usage',
      status: total > quota * 0.8 ? 'warn' : 'ok',
      detail: `${fmtBytes(total)} of ~${fmtBytes(quota)} localStorage quota (${Math.round((total / quota) * 100)}%)`,
    });

    const theme = localStorage.getItem('gymathome_theme') || 'light';

    setUsers(rows);
    setChecks(foundChecks);
    setSession({
      user: sessionUser,
      role: sessionRole,
      chatToday,
      gemini,
      formspree: false,
      theme,
      sessionExpires,
      sessionValid,
    });
  }, []);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const unlocked = localStorage.getItem(UNLOCK_KEY) === '1';
    const isAdmin = user?.role === 'admin';
    if (isDev || unlocked || isAdmin) {
      setAccess('granted');
      load();
    } else {
      setAccess('locked');
    }
  }, [load, user]);

  const handleUnlock = () => {
    if (passphrase.trim() === DEV_PASSPHRASE) {
      localStorage.setItem(UNLOCK_KEY, '1');
      if (user) promoteToAdmin();
      setPassError(false);
      setAccess('granted');
      load();
    } else {
      setPassError(true);
    }
  };

  if (access === 'loading') {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (access === 'locked') {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-surface rounded-2xl shadow-elevated border border-outline-variant/30 p-8 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-headline-md font-bold text-on-surface mb-1">Developer Access</h1>
          <p className="text-sm text-on-surface-variant mb-5">
            Enter the developer passphrase to open the console.
          </p>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => {
              setPassphrase(e.target.value);
              setPassError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="Passphrase"
            className={`w-full h-11 px-4 rounded-xl border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              passError ? 'border-error' : 'border-outline-variant focus:border-primary'
            }`}
          />
          {passError && <p className="text-xs text-error mt-2">Wrong passphrase</p>}
          <button
            onClick={handleUnlock}
            className="w-full mt-4 py-3 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            Unlock Console
          </button>
          <Link href="/login" className="block mt-4 text-xs text-on-surface-variant hover:text-on-surface">
            Back to app
          </Link>
        </div>
      </div>
    );
  }

  const statusIcon = (s: Check['status']) =>
    s === 'ok' ? (
      <CheckCircle className="w-4 h-4 text-success shrink-0" />
    ) : s === 'warn' ? (
      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-error shrink-0" />
    );

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/dev-settings" className="p-2 hover:bg-surface-container rounded-lg">
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </Link>
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-headline-md font-bold text-on-surface">Dev Console</h1>
              <p className="text-xs text-on-surface-variant">
                This device only — sessions &amp; users live in localStorage
              </p>
            </div>
          </div>
          <button
            onClick={load}
            className="px-3 py-2 rounded-lg bg-surface-container text-on-surface text-label-md font-medium hover:bg-surface-container-high transition-colors border border-outline-variant flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-surface rounded-xl border border-outline-variant p-4">
            <div className="flex items-center gap-2 text-on-surface-variant mb-1">
              <Users className="w-4 h-4" />
              <span className="text-label-md">Users (device)</span>
            </div>
            <div className="text-stat-value text-2xl font-bold text-on-surface">{users.length}</div>
            <div className="text-xs text-success font-medium mt-0.5">
              {users.filter((u) => u.loggedIn).length} signed in
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-outline-variant p-4">
            <div className="flex items-center gap-2 text-on-surface-variant mb-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-label-md">Chats today</span>
            </div>
            <div className="text-stat-value text-2xl font-bold text-on-surface">{session.chatToday}</div>
          </div>
          <div className="bg-surface rounded-xl border border-outline-variant p-4">
            <div className="flex items-center gap-2 text-on-surface-variant mb-1">
              <HardDrive className="w-4 h-4" />
              <span className="text-label-md">Storage used</span>
            </div>
            <div className="text-stat-value text-2xl font-bold text-on-surface">{fmtBytes(storageTotal)}</div>
          </div>
        </div>

        {/* Health checks */}
        <div className="bg-surface rounded-xl border border-outline-variant p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-headline-md font-semibold text-on-surface">Health Checks</h2>
          </div>
          <div className="space-y-2">
            {checks.map((c) => (
              <div
                key={c.label}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40"
              >
                <div className="mt-0.5">{statusIcon(c.status)}</div>
                <div className="min-w-0">
                  <p className="text-body-md font-medium text-on-surface">{c.label}</p>
                  <p className="text-label-md text-on-surface-variant break-words">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users table */}
        <div className="bg-surface rounded-xl border border-outline-variant p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-headline-md font-semibold text-on-surface">
              Registered Users
            </h2>
            <span className="text-label-md text-on-surface-variant">(this device)</span>
          </div>
          {users.length === 0 ? (
            <p className="text-body-md text-on-surface-variant p-3">No accounts on this device yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-label-md text-on-surface-variant border-b border-outline-variant/50">
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">User</th>
                    <th className="py-2 pr-3 font-medium">Email</th>
                    <th className="py-2 pr-3 font-medium">Joined</th>
                    <th className="py-2 pr-3 font-medium">Meals</th>
                    <th className="py-2 pr-3 font-medium">Exercises</th>
                    <th className="py-2 pr-3 font-medium">Last activity</th>
                    <th className="py-2 pr-3 font-medium">Store size</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className={`border-b border-outline-variant/30 cursor-pointer hover:bg-surface-container-low ${
                        u.loggedIn ? 'bg-success/5' : ''
                      }`}
                      onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                    >
                      <td className="py-2.5 pr-3">
                        {u.loggedIn ? (
                          <span className="inline-flex items-center gap-1.5 text-success text-label-md font-semibold whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-success inline-block animate-pulse" />
                            Signed in
                          </span>
                        ) : (
                          <span className="text-label-md text-on-surface-variant/60">Offline</span>
                        )}
                        {u.role === 'admin' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary align-middle">
                            admin
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-body-md font-medium text-on-surface">{u.username}</td>
                      <td className="py-2.5 pr-3 text-label-md text-on-surface-variant">{u.email}</td>
                      <td className="py-2.5 pr-3 text-label-md text-on-surface-variant">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-2.5 pr-3 text-label-md text-on-surface">{u.meals}</td>
                      <td className="py-2.5 pr-3 text-label-md text-on-surface">{u.exercises}</td>
                      <td className="py-2.5 pr-3 text-label-md text-on-surface-variant">
                        {u.lastActivity ? new Date(u.lastActivity).toLocaleString() : '—'}
                      </td>
                      <td className="py-2.5 pr-3 text-label-md text-on-surface-variant">{fmtBytes(u.storeBytes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {expandedUser && (() => {
                const u = users.find((x) => x.id === expandedUser);
                if (!u) return null;
                return (
                  <div className="mt-3 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-label-md text-on-surface-variant space-y-1">
                    <p className="text-body-md font-semibold text-on-surface mb-1">{u.username} — details</p>
                    <p>ID: <span className="font-mono">{u.id}</span></p>
                    <p>Role: <span className="text-on-surface font-medium capitalize">{u.role}</span> · Status: {u.loggedIn ? <span className="text-success font-medium">signed in (active session)</span> : 'offline'}</p>
                    <p>Water logs: {u.waterLogs} · Sleep logs: {u.sleepLogs} · Habits: {u.habits}</p>
                    <p>Store key: <span className="font-mono">gymathome_store_{u.id}</span></p>
                  </div>
                );
              })()}
            </div>
          )}
          <p className="text-xs text-on-surface-variant/60 mt-2">
            Click a row for details. With no backend, global user counts are only visible after Play Console / hosting analytics.
          </p>
        </div>

        {/* Session info */}
        <div className="bg-surface rounded-xl border border-outline-variant p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-headline-md font-semibold text-on-surface">Current Session</h2>
            {session.sessionValid ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-success/10 text-success">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-container-high text-on-surface-variant">
                No session
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-md">
            <p className="text-on-surface-variant">
              Signed in as:{' '}
              <span className="text-on-surface font-medium">{session.user || 'nobody'}</span>
            </p>
            <p className="text-on-surface-variant">
              Role:{' '}
              <span className={`font-medium capitalize ${session.role === 'admin' ? 'text-primary' : 'text-on-surface'}`}>
                {session.role}
              </span>
            </p>
            <p className="text-on-surface-variant">
              Session expires:{' '}
              <span className="text-on-surface font-medium">{session.sessionExpires || '—'}</span>
            </p>
            <p className="text-on-surface-variant">
              Gemini key:{' '}
              <span className={session.gemini ? 'text-success font-medium' : 'text-amber-500 font-medium'}>
                {session.gemini ? 'set' : 'missing'}
              </span>
            </p>
            <p className="text-on-surface-variant">
              Theme: <span className="text-on-surface font-medium capitalize">{session.theme}</span>
            </p>
            <p className="text-on-surface-variant">
              Node env: <span className="text-on-surface font-medium">development</span>
            </p>
          </div>
        </div>

        {/* Storage inspector */}
        <div className="bg-surface rounded-xl border border-outline-variant p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-primary" />
              <h2 className="text-headline-md font-semibold text-on-surface">localStorage Inspector</h2>
            </div>
            <span className="text-label-md text-on-surface-variant">{storage.length} keys</span>
          </div>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {storage.map((e) => (
              <div
                key={e.key}
                className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-surface-container-low text-body-sm"
              >
                <span className="font-mono text-on-surface truncate pr-3">{e.key}</span>
                <span className="text-label-md text-on-surface-variant shrink-0">{fmtBytes(e.bytes)}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-on-surface-variant/60 text-center pb-6">
          Dev Console · shows data for this browser/device only · not linked from sidebar for regular users ·
          dev builds open automatically, production builds need passphrase or admin account
        </p>
      </div>
    </div>
  );
}
