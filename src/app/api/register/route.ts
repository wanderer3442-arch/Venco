import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Schema = z.object({
  name: z.string().min(2).max(40),
  email: z.string().email(),
  password: z.string().min(6).max(72),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { name, email, password } = parsed.data;
  const lower = email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email: lower } });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: lower, password: hash },
  });
  return NextResponse.json({ id: user.id });
}
