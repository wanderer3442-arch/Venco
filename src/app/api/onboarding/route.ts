import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calcBMI, calcBMR, calcTDEE, calcTargetCalories, calcMacros, calcHydrationMl } from "@/lib/formulas";

const Body = z.object({
  sex: z.enum(["male", "female"]),
  age: z.number().int().min(10).max(100),
  weightKg: z.number().min(20).max(300),
  heightCm: z.number().min(100).max(250),
  activityFactor: z.number().min(1.2).max(1.9),
  goal: z.enum(["fat_loss", "lean_bulk", "maintenance"]),
  allergies: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as unknown as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { sex, age, weightKg, heightCm, activityFactor, goal, allergies } = parsed.data;

  const bmi = calcBMI(weightKg, heightCm);
  const bmr = calcBMR(sex, weightKg, heightCm, age);
  const tdee = calcTDEE(bmr, activityFactor as 1.2 | 1.375 | 1.55 | 1.725 | 1.9);
  const targetKcal = calcTargetCalories(tdee, goal);
  const macros = calcMacros(weightKg, targetKcal, goal);
  const hydration = calcHydrationMl(weightKg);

  await prisma.profile.upsert({
    where: { userId },
    create: { userId, sex, age, weightKg, heightCm, activityFactor, goal, allergies: JSON.stringify(allergies) },
    update: { sex, age, weightKg, heightCm, activityFactor, goal, allergies: JSON.stringify(allergies) },
  });

  await prisma.calculationSnapshot.create({
    data: { userId, bmi, bmr, tdee, targetKcal, proteinG: macros.proteinG, fatG: macros.fatG, carbsG: macros.carbsG, hydrationMl: hydration },
  });

  return NextResponse.json({ bmi, bmr, tdee, targetKcal, macros, hydration });
}

export async function GET() {
  const session = await auth();
  const userId = (session?.user as unknown as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const profile = await prisma.profile.findUnique({ where: { userId } });
  const calc = await prisma.calculationSnapshot.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ profile, calc });
}
