'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, ShieldAlert, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getLockoutRemainingSeconds } from '@/lib/rate-limiter';

export default function LoginPage() {
  const router = useRouter();
  const { signup, login, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [cameFromBack, setCameFromBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const lockoutRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');

  useEffect(() => {
    setMounted(true);
    setCameFromBack(sessionStorage.getItem('came_from_back') === '1');
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated && !cameFromBack) {
      router.push('/dashboard');
    }
  }, [mounted, isAuthenticated, cameFromBack, router]);

  // Countdown timer for lockout
  const startLockoutCountdown = (seconds: number, identifier: string) => {
    setLockoutSeconds(seconds);
    if (lockoutRef.current) clearInterval(lockoutRef.current);
    lockoutRef.current = setInterval(() => {
      const remaining = getLockoutRemainingSeconds(identifier);
      setLockoutSeconds(remaining);
      if (remaining <= 0) {
        if (lockoutRef.current) clearInterval(lockoutRef.current);
        setError('');
      }
    }, 1000);
  };

  useEffect(() => {
    return () => { if (lockoutRef.current) clearInterval(lockoutRef.current); };
  }, []);

  if (!mounted || (isAuthenticated && !cameFromBack)) {
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || lockoutSeconds > 0) return;
    setError('');
    setLoading(true);
    try {
      const result = await login(signInEmail, signInPassword);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
        if (result.lockoutSeconds) {
          startLockoutCountdown(result.lockoutSeconds, signInEmail);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (signUpPassword !== signUpConfirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await signup(signUpEmail, signUpUsername, signUpPassword);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <img src="/logo.png" alt="Gym at Home" className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
            <div>
              <h1 className="text-3xl font-bold">Gym at Home</h1>
              <p className="text-white/70 text-sm">Your Fitness Companion</p>
            </div>
          </div>

          {/* Hero text */}
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Transform Your Body,<br />
            Transform Your Life
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-md">
            Track workouts, monitor nutrition, and achieve your fitness goals with personalized insights.
          </p>

          {/* Features */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">💪</span>
              </div>
              <div>
                <p className="font-semibold">Smart Workout Plans</p>
                <p className="text-sm text-white/70">AI-generated routines based on your goals</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">🥗</span>
              </div>
              <div>
                <p className="font-semibold">Nutrition Tracking</p>
                <p className="text-sm text-white/70">Log meals and monitor your macros</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="font-semibold">Progress Analytics</p>
                <p className="text-sm text-white/70">Visualize your journey with detailed charts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile Logo — outside the auth box */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Gym at Home" className="w-12 h-12 rounded-xl object-cover shadow-md" />
            <span className="text-2xl font-bold text-on-surface">Gym at Home</span>
          </div>

          {/* Auth box */}
          <div className="bg-surface border border-outline-variant/60 rounded-2xl shadow-[0_4px_24px_-6px_rgba(15,23,42,0.10)] p-6 sm:p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-headline-lg font-bold text-on-surface mb-2">
              {activeTab === 'signin' ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="text-body-md text-on-surface-variant">
              {activeTab === 'signin'
                ? 'Sign in to continue your fitness journey'
                : 'Start your transformation today'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-surface-container p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('signin'); setError(''); }}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'signin'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); }}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-3 ${
              lockoutSeconds > 0
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400'
                : 'bg-error/10 border border-error/20 text-error'
            }`}>
              {lockoutSeconds > 0
                ? <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                : <span className="text-base flex-shrink-0">⚠️</span>
              }
              <div className="flex-1">
                <p>{error}</p>
                {lockoutSeconds > 0 && (
                  <p className="text-xs mt-1 flex items-center gap-1 opacity-80">
                    <Clock className="w-3 h-3" />
                    Unlocks in {Math.floor(lockoutSeconds / 60)}:{String(lockoutSeconds % 60).padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type="text"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="you@example.com or username"
                    className="w-full h-13 pl-12 pr-4 rounded-xl border-2 border-outline-variant bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-0 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-13 pl-12 pr-12 rounded-xl border-2 border-outline-variant bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-0 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || lockoutSeconds > 0}
                className="w-full h-13 bg-primary text-on-primary font-bold rounded-xl text-body-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing In...</>
                  : lockoutSeconds > 0
                  ? <><ShieldAlert className="w-5 h-5" /> Account Locked</>
                  : <>Sign In <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-13 pl-12 pr-4 rounded-xl border-2 border-outline-variant bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-0 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type="text"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full h-13 pl-12 pr-4 rounded-xl border-2 border-outline-variant bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-0 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Min 10 chars, uppercase, number, special"
                    className="w-full h-13 pl-12 pr-12 rounded-xl border-2 border-outline-variant bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-0 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpConfirm}
                    onChange={(e) => setSignUpConfirm(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full h-13 pl-12 pr-4 rounded-xl border-2 border-outline-variant bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-0 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 bg-primary text-on-primary font-bold rounded-xl text-body-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
                  : <>Create Account <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-on-surface-variant">
              {activeTab === 'signin' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => { setActiveTab('signup'); setError(''); }}
                    className="text-primary hover:text-primary/80 font-bold"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setActiveTab('signin'); setError(''); }}
                    className="text-primary hover:text-primary/80 font-bold"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
          </div>{/* /Auth box */}
        </div>
      </div>

      {/* Dev Settings Link - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <Link
          href="/dev-settings"
          className="fixed bottom-4 right-4 text-xs text-on-surface-variant/40 hover:text-on-surface-variant/70 transition-colors"
        >
          Dev
        </Link>
      )}
    </div>
  );
}
