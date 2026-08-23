"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) setMsg(data.error ?? "Failed");
    else {
      setMsg("Created — please sign in.");
      setTimeout(() => router.push("/login"), 800);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="full name" required className="w-full rounded-full border px-4 py-3 text-sm bg-paper/60 focus:border-primary outline-none" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" type="email" required className="w-full rounded-full border px-4 py-3 text-sm bg-paper/60 focus:border-primary outline-none" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password ≥6" type="password" required className="w-full rounded-full border px-4 py-3 text-sm bg-paper/60 focus:border-primary outline-none" />
      <button type="submit" className="w-full rounded-full bg-primary text-white py-3 text-sm font-semibold">Create account</button>
      {msg && <p className="text-xs text-center text-accent">{msg}</p>}
      <p className="text-xs text-center text-foreground/60">
        Have account? <Link href="/login" className="text-primary underline">Sign in</Link>
      </p>
    </form>
  );
}
