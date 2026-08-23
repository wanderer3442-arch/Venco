/** VencoFit Essentials — calculations (src/lib/formulas.ts:1) */
export type Sex = "male" | "female";
export type Goal = "fat_loss" | "lean_bulk" | "maintenance";
export type ActivityFactor = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;

export function calcBMI(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export function calcBMR(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function calcTDEE(bmr: number, factor: ActivityFactor): number {
  return bmr * factor;
}

export function calcTargetCalories(tdee: number, goal: Goal): number {
  if (goal === "fat_loss") return Math.round(tdee - 400); // 300-500 midpoint
  if (goal === "lean_bulk") return Math.round(tdee + 350); // 300-400 midpoint
  return Math.round(tdee);
}

export type Macros = { proteinG: number; fatG: number; carbsG: number; calories: number };

export function calcMacros(
  weightKg: number,
  targetKcal: number,
  goal: Goal
): Macros {
  // protein 1.6-2.2 (2.0-2.4 cutting), fat 0.8-1.0 or 20-30%
  const proteinPerKg = goal === "fat_loss" ? 2.2 : 1.9;
  const proteinG = Math.round(weightKg * proteinPerKg);
  const fatG = Math.round(weightKg * 0.9);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbsKcal = Math.max(0, targetKcal - proteinKcal - fatKcal);
  const carbsG = Math.round(carbsKcal / 4);
  return { proteinG, fatG, carbsG, calories: targetKcal };
}

export function calcHydrationMl(weightKg: number): number {
  return Math.round(weightKg * 33); // 30-35 midpoint
}

/**
 * Weekly adjust: compare 7-day avg weight trend vs target rate.
 * fat_loss ~ -0.5 kg/wk, lean_bulk +0.25-0.5%/wk, maintenance ~0
 * If off, suggest ±100–150 kcal.
 */
export function adjustCalories(
  avgDeltaKgPerWeek: number,
  goal: Goal,
  weightKg: number,
  currentTarget: number
): { nextTarget: number; reason: string } {
  let expected = 0;
  if (goal === "fat_loss") expected = -0.5;
  else if (goal === "lean_bulk") expected = weightKg * 0.00375; // ~0.375%/wk midpoint
  const diff = avgDeltaKgPerWeek - expected;
  if (Math.abs(diff) < 0.15) return { nextTarget: currentTarget, reason: "On track — keep calories." };
  if (diff > 0) {
    // gaining too fast or losing too slow
    const delta = goal === "fat_loss" ? -125 : -125;
    return { nextTarget: currentTarget + delta, reason: `Trend ${avgDeltaKgPerWeek.toFixed(2)}kg/wk vs expected ${expected.toFixed(2)} — cut ~125 kcal.` };
  } else {
    return { nextTarget: currentTarget + 125, reason: `Trend ${avgDeltaKgPerWeek.toFixed(2)}kg/wk — add ~125 kcal.` };
  }
}

export const activityLabels: Record<ActivityFactor, string> = {
  1.2: "Sedentary (office, no exercise)",
  1.375: "Light (1–3 days/wk)",
  1.55: "Moderate (3–5 days/wk)",
  1.725: "Active (6–7 days/wk)",
  1.9: "Very active (hard labor + training)",
};
