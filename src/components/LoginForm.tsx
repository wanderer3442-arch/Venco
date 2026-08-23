"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) setMsg(res.error);
    else if (res?.ok) router.push("/");
    else setMsg("Check credentials");
  }

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-paper flex items-center justify-center gap-2"
      >
        <span className="h-2 w-2 rounded-full bg-accent" /> Continue with Google (Gmail)
      </button>
      <div className="text-center text-xs text-muted">or</div>
      <form onSubmit={onLogin} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          type="email"
          required
          className="w-full rounded-full border px-4 py-3 text-sm bg-paper/60 focus:border-primary outline-none"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password (≥6 chars)"
          type="password"
          required
          className="w-full rounded-full border px-4 py-3 text-sm bg-paper/60 focus:border-primary outline-none"
        />
        <button type="submit" className="w-full rounded-full bg-primary text-white py-3 text-sm font-semibold hover:bg-primary-dark">
          Sign in
        </button>
      </form>
      {msg && <p className="text-xs text-accent">{msg}</p>}
      <p className="text-xs text-center text-foreground/60">
        No account? <Link href="/register" className="text-primary underline">Register</Link> • <Link href="/" className="underline">Home</Link>
      </p>
      <p className="text-xs text-foreground/50">Test without Google: register with any email → sign in with credentials.</p>
    </div>
  );
}
