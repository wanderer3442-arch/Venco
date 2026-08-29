"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reenter, setReenter] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (password !== reenter) { setMsg("Passwords do not match"); return; }
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, reenter }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = data.error ? (typeof data.error === "string" ? data.error : JSON.stringify(data.error)) : "Failed";
      setMsg(err);
    } else {
      setMsg("Created — please sign in.");
      setTimeout(() => router.push("/login"), 800);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Mail" type="email" required className="w-full rounded-full border px-4 py-3 text-sm bg-paper/60 focus:border-primary outline-none" />
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full rounded-full border px-4 py-3 text-sm bg-paper/60 focus:border-primary outline-none" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required className="w-full rounded-full border px-4 py-3 text-sm bg-paper/60 focus:border-primary outline-none" />
      <input value={reenter} onChange={(e) => setReenter(e.target.value)} placeholder="Reenter password" type="password" required className="w-full rounded-full border px-4 py-3 text-sm bg-paper/60 focus:border-primary outline-none" />
      <button type="submit" className="w-full rounded-full bg-primary text-white py-3 text-sm font-semibold">Sign up</button>
      {msg && <p className="text-xs text-center text-accent">{msg}</p>}
      <p className="text-xs text-center text-foreground/60">
        Have account? <Link href="/login" className="text-primary underline">Log in</Link>
      </p>
    </form>
  );
}
