import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Schema = z
  .object({
    email: z.string().email(),
    username: z.string().min(1),
    password: z.string().min(6).max(72),
    reenter: z.string().min(6),
  })
  .refine((d) => d.password === d.reenter, { message: "Passwords do not match", path: ["reenter"] });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { email, username, password } = parsed.data;
  const lowerEmail = email.toLowerCase().trim();
  const lowerUsername = username.trim().toLowerCase();
  const existsEmail = await prisma.user.findUnique({ where: { email: lowerEmail } });
  if (existsEmail) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const existsUsername = await prisma.user.findFirst({ where: { username: lowerUsername } });
  if (existsUsername) return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: username.trim(), username: lowerUsername, email: lowerEmail, password: hash },
  });
  return NextResponse.json({ id: user.id });
}
