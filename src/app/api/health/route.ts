import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import healthDb from "../../../../data/health-db.json";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  const tier = (session?.user as unknown as { tier?: string })?.tier ?? "free";
  if (!userId) return NextResponse.json({ healthSlug: null, tier });
  const profile = await prisma.profile.findUnique({ where: { userId }, select: { healthSlug: true } });
  return NextResponse.json({ healthSlug: profile?.healthSlug ?? null, tier });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  const tier = (session?.user as unknown as { tier?: string })?.tier ?? "free";
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (tier === "free") return NextResponse.json({ error: "Pro required to persist health choice" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const slug = body?.slug as string | undefined;
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const exists = (healthDb as { slug: string }[]).some((h) => h.slug === slug);
  if (!exists) return NextResponse.json({ error: "Unknown condition" }, { status: 400 });
  await prisma.profile.upsert({
    where: { userId },
    update: { healthSlug: slug },
    create: {
      userId,
      sex: "male",
      age: 25,
      weightKg: 70,
      heightCm: 170,
      activityFactor: 1.55,
      goal: "maintenance",
      allergies: "[]",
      healthSlug: slug,
    },
  });
  return NextResponse.json({ ok: true, healthSlug: slug });
}
