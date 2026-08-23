import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  let calc = null, profile = null;
  if (userId) {
    calc = await prisma.calculationSnapshot.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
    profile = await prisma.profile.findUnique({ where: { userId } });
  }
  const lines = [
    `%PDF-1.4`,
    `1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj`,
    `2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj`,
    `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >> endobj`,
    `4 0 obj << /Length 0 >> stream`,
    `BT /F1 12 Tf 50 800 Td (VencoFit — Hospital Checkup Pack) Tj`,
    `50 780 Td (${new Date().toISOString().slice(0,10)} — ${session?.user?.name ?? "Demo"} — ${session?.user?.email ?? "demo@venco.fit"}) Tj`,
    profile ? `50 760 Td (Profile: ${profile.sex}, ${profile.age}y, ${profile.weightKg}kg, ${profile.heightCm}cm, goal ${profile.goal}) Tj` : `50 760 Td (No Essentials yet — calculate at /essentials) Tj`,
    calc ? `50 740 Td (Essentials: BMI ${calc.bmi.toFixed(1)}  BMR ${Math.round(calc.bmr)}  TDEE ${Math.round(calc.tdee)}  Target ${calc.targetKcal} kcal) Tj` : `50 740 Td (No calc snapshot) Tj`,
    calc ? `50 720 Td (Macros: P ${calc.proteinG}g  F ${calc.fatG}g  C ${calc.carbsG}g  Hydration ${calc.hydrationMl} ml) Tj` : ``,
    `50 680 Td (Meal plan: 800 foods (500 Indian +300 Global) with qty/kcal/carbs — see /meal) Tj`,
    `50 660 Td (Exercise plan: auto/templated, calibrated — see /exercises) Tj`,
    `50 640 Td (Logs: habits, meals (ring), exercise calendar, weight trend — see /logger) Tj`,
    `50 620 Td (Sources: WHO + Mayo, IFCT/USDA — not medical advice) Tj`,
    `ET`,
    `endstream endobj`,
    `xref 0 5 0000000000 65535 f 0000000009 00000 n 0000000056 00000 n 0000000111 00000 n 0000000212 00000 n trailer << /Size 5 /Root 1 0 R >> startxref 0 %%EOF`,
  ].join("\n");
  return new NextResponse(lines, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=VencoFit-checkup-${new Date().toISOString().slice(0,10)}.pdf`,
    },
  });
}
