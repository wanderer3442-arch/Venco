import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { message, history } = await req.json().catch(() => ({ message: "" }));
  if (!message?.trim()) return NextResponse.json({ error: "message required" }, { status: 400 });

  // subscription + rate limit
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const tier = (session?.user as unknown as { tier?: string })?.tier ?? "free";
  const isFree = tier === "free";
  if (userId && isFree) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let usage = await prisma.chatUsage.findUnique({ where: { userId_date: { userId, date: today } } });
    if (!usage) usage = await prisma.chatUsage.create({ data: { userId, date: today, count: 0 } });
    if (usage.count >= 5) {
      return NextResponse.json({ error: "Free limit: 5 msgs/day. Upgrade to Pro ₹500/mo for unlimited V.", code: "LIMIT" }, { status: 429 });
    }
    await prisma.chatUsage.update({ where: { id: usage.id }, data: { count: usage.count + 1 } });
  }

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return NextResponse.json({
      reply:
        `V (demo, no key): You asked “${message}”. Add OPENROUTER_API_KEY in Vercel env to enable live OpenRouter (${process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini"}). Free 5/day, Pro unlimited. This is general wellness info, not medical advice. ${isFree ? "(free demo counts toward limit)" : "(Pro)"}`,
      demo: true,
      tier,
    });
  }
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://venco.fit",
      "X-Title": "VencoFit V",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are V, VencoFit's health coach. Give general wellness info only, not diagnosis. Be concise, cite WHO/Mayo style when relevant, suggest 1 actionable tweak." },
        ...(Array.isArray(history) ? history : []),
        { role: "user", content: message },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }
  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content ?? "No reply";
  return NextResponse.json({ reply });
}
