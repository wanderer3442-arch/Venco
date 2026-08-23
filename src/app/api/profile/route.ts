import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, username: true, name: true, subscriptionTier: true, subscriptionExpiresAt: true } });
  const profile = await prisma.profile.findUnique({ where: { userId } });
  const calc = await prisma.calculationSnapshot.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  const calcs = await prisma.calculationSnapshot.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 20 });
  return NextResponse.json({ user, profile, calc, calcs });
}

const PatchSchema = z.object({ username: z.string().min(1).max(30) });

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const lower = parsed.data.username.trim().toLowerCase();
  const existing = await prisma.user.findFirst({ where: { username: lower, NOT: { id: userId } } });
  if (existing) return NextResponse.json({ error: "Username taken" }, { status: 409 });
  const updated = await prisma.user.update({ where: { id: userId }, data: { username: lower, name: parsed.data.username.trim() } });
  return NextResponse.json({ username: updated.username });
}
