"use client";

import { useState } from "react";
import Link from "next/link";

export default function ChatV() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi! I’m V — your VencoFit coach. Ask about meals, workouts, or recovery. (Free: 5 msgs/day)" },
  ]);
  const remaining = 5 - messages.filter((m) => m.role === "user").length;

  async function send() {
    if (!q.trim()) return;
    if (remaining <= 0) {
      setMessages((m) => [...m, { role: "assistant", text: "Free limit: 5/day. Upgrade to Pro ₹500/mo (₹3000/yr) for unlimited V + Health/Download." }]);
      return;
    }
    const userQ = q.trim();
    setQ("");
    setMessages((m) => [...m, { role: "user", text: userQ }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQ, history: messages.slice(-6).map((x) => ({ role: x.role, content: x.text })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = data?.error ?? "Error";
        setMessages((m) => [...m, { role: "assistant", text: err }]);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", text: data.reply ?? "No reply" }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: `V (offline demo): For "${userQ}" — try swap rice → millets, add 10 min walk post-meal. Add OPENROUTER_API_KEY to get live answers.` }]);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-[92vw] max-w-[380px] rounded-2xl border bg-white shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-primary font-bold">V</span>
              <div>
                <div className="font-semibold text-sm">V • AI coach</div>
                <div className="text-xs opacity-80">{remaining > 0 ? `${remaining} free left today` : "Free limit reached"}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          <div className="flex-1 max-h-[320px] overflow-auto p-3 space-y-2 bg-paper/50">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-primary text-white" : "bg-white border"}`}>
                {m.text}
              </div>
            ))}
          </div>
          {remaining <= 0 && (
            <div className="mx-3 mb-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 text-xs">
              <Link href="/pricing" className="text-accent font-semibold underline">Upgrade to Pro</Link> for unlimited V + Health/Download.
            </div>
          )}
          <div className="p-3 flex gap-2 border-t bg-white">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask V: is poha healthy?"
              className="flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button onClick={send} className="rounded-full bg-primary text-white px-5 py-2 text-sm font-semibold hover:bg-primary-dark">
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-14 w-14 rounded-full bg-primary text-white shadow-xl grid place-items-center text-xl hover:bg-primary-dark border-2 border-white"
        aria-label="Open V chatbot"
      >
        V
      </button>
    </div>
  );
}
