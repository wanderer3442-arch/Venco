import { NextRequest, NextResponse } from "next/server";

// POST /api/chat — proxies to OpenRouter (V). Rate-limit by tier; needs OPENROUTER_API_KEY
export async function POST(req: NextRequest) {
  const { message, history } = await req.json().catch(() => ({ message: "" }));
  if (!message?.trim()) return NextResponse.json({ error: "message required" }, { status: 400 });

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    // free demo fallback — echo with disclaimer until key added
    return NextResponse.json({
      reply:
        `V (demo, no key): You asked “${message}”. Add OPENROUTER_API_KEY in Vercel env to enable live AI. Free tier is 5 msgs/day, Pro unlimited. This is general wellness info, not medical advice.`,
      demo: true,
    });
  }

  // TODO: add real rate-limit + subscription check here
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
