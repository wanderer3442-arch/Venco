import foods from "../../data/food-db.json";

export type Food = (typeof foods)[number];

export function searchFoods(q: string, limit = 8): Food[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  // prefix + substring rank
  const scored = (foods as Food[])
    .map((f) => {
      const name = f.name.toLowerCase();
      let score = -1;
      if (name.startsWith(s)) score = 2;
      else if (name.includes(s)) score = 1;
      else if (f.region.toLowerCase().includes(s)) score = 0.5;
      return { f, score };
    })
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || a.f.name.localeCompare(b.f.name));
  return scored.slice(0, limit).map((x) => x.f);
}

export function findExact(name: string): Food | undefined {
  const low = name.trim().toLowerCase();
  return (foods as Food[]).find((f) => f.name.toLowerCase() === low);
}

export function scoreOtherFood(name: string): { food?: Food; score: "green" | "amber" | "red"; kcal: number; tip: string } {
  const f = (foods as Food[]).find((x) => x.name.toLowerCase().includes(name.toLowerCase()));
  const kcal = f?.kcal ?? 250;
  const fat = f?.fat ?? 12;
  let score: "green" | "amber" | "red" = "amber";
  if (kcal < 150 && fat < 6) score = "green";
  else if (kcal > 400 || fat > 18) score = "red";
  const tip = score === "green" ? "Great choice — counts toward quota." : score === "red" ? "High kcal/fat — enjoy small portion; try roasted makhana / fruit." : "Okay in moderation — keep portion 100g; balance with dal + salad.";
  return { food: f, score, kcal, tip };
}

export type PlanInput = {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  allergies: string[];
  targetKcal: number | null;
  targetMacros?: { proteinG: number; fatG: number; carbsG: number } | null;
};

export type PlanOutput = {
  total: { kcal: number; protein: number; carbs: number; fat: number };
  meals: { label: string; items: { food: Food; qtyG: number; kcal: number; protein: number; carbs: number; fat: number }[] }[];
  avoid: string[];
  eatLess: string[];
  eatMore: string[];
  tryNew: Food[];
};

function qtyFor(food: Food, meal: string): number {
  // heuristics: breakfast lighter, lunch/dinner heavier; high-kcal dense → smaller qty
  if (food.kcal > 450) return meal === "Breakfast" ? 80 : 120;
  if (food.kcal < 150) return meal === "Breakfast" ? 150 : 180;
  return 130;
}

export function generatePlan(input: PlanInput): PlanOutput {
  const allFoods = foods as Food[];
  const allergySet = new Set(input.allergies.map((a) => a.toLowerCase()));

  const pick = (names: string[], label: string) => {
    const items: PlanOutput["meals"][number]["items"] = [];
    const total = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    for (const n of names) {
      let f = findExact(n);
      if (!f) {
        // fuzzy
        const results = searchFoods(n, 3);
        f = results[0];
      }
      if (!f) continue;
      // allergy filter
      const hasAllergy = f.allergens.some((al) => allergySet.has(al.toLowerCase()));
      if (hasAllergy) continue; // skip allergic, will be in avoid
      const qty = qtyFor(f, label);
      const factor = qty / 100;
      const entry = {
        food: f,
        qtyG: qty,
        kcal: Math.round(f.kcal * factor),
        protein: Math.round(f.protein * factor * 10) / 10,
        carbs: Math.round(f.carbs * factor * 10) / 10,
        fat: Math.round(f.fat * factor * 10) / 10,
      };
      items.push(entry);
      total.kcal += entry.kcal;
      total.protein += entry.protein;
      total.carbs += entry.carbs;
      total.fat += entry.fat;
    }
    return { items, total };
  };

  const b = pick(input.breakfast, "Breakfast");
  const l = pick(input.lunch, "Lunch");
  const d = pick(input.dinner, "Dinner");

  const total = {
    kcal: b.total.kcal + l.total.kcal + d.total.kcal,
    protein: Math.round((b.total.protein + l.total.protein + d.total.protein) * 10) / 10,
    carbs: Math.round((b.total.carbs + l.total.carbs + d.total.carbs) * 10) / 10,
    fat: Math.round((b.total.fat + l.total.fat + d.total.fat) * 10) / 10,
  };

  // Avoid / alternatives
  const avoid: string[] = [];
  const allergenHits = allFoods.filter((f) =>
    input.breakfast.concat(input.lunch, input.dinner).some((n) => f.name.toLowerCase() === n.toLowerCase()) &&
    f.allergens.some((al) => allergySet.has(al.toLowerCase()))
  );
  for (const f of allergenHits) {
    const al = f.allergens.filter((a) => allergySet.has(a.toLowerCase())).join(", ");
    avoid.push(`${f.name} — contains ${al} → try ${suggestSwap(f.name)}`);
  }

  const eatLess: string[] = [];
  const eatMore: string[] = [];
  if (input.targetKcal) {
    if (total.kcal > input.targetKcal + 150) eatLess.push(`Calories ${total.kcal} > target ${input.targetKcal} — reduce fried items, use 80g portions, add salad.`);
    else if (total.kcal < input.targetKcal - 150) eatMore.push(`Calories ${total.kcal} < target ${input.targetKcal} — add 30g nuts or 1 extra roti / millet.`);
  }
  if (input.targetMacros) {
    if (total.protein < input.targetMacros.proteinG * 0.8) eatMore.push(`Protein ${total.protein}g low vs ${input.targetMacros.proteinG}g — eat more dal, paneer, chicken, sprouts.`);
    if (total.fat > input.targetMacros.fatG * 1.3) eatLess.push(`Fat ${total.fat}g high vs ${input.targetMacros.fatG}g — use less oil, avoid deep-fried.`);
    if (total.carbs > input.targetMacros.carbsG * 1.3) eatLess.push(`Carbs ${total.carbs}g high — swap white rice → millets / brown rice.`);
  }

  // generic
  if (eatLess.length === 0 && eatMore.length === 0) {
    eatMore.push("Balanced — keep portions as suggested; walk 10 min post-meal.");
  }

  const hadNames = new Set(input.breakfast.concat(input.lunch, input.dinner).map((s) => s.toLowerCase()));
  const tryNew = allFoods
    .filter((f) => !hadNames.has(f.name.toLowerCase()) && !f.allergens.some((al) => allergySet.has(al.toLowerCase())))
    .sort((a, b) => {
      // prefer moderate kcal, higher protein, Indian first
      const score = (f: Food) => (f.region === "Indian" ? 0.5 : 0) + f.protein * 0.1 - Math.abs(f.kcal - 250) * 0.005;
      return score(b) - score(a);
    })
    .slice(0, 4);

  return {
    total,
    meals: [
      { label: "Breakfast", items: b.items },
      { label: "Lunch", items: l.items },
      { label: "Dinner", items: d.items },
    ],
    avoid,
    eatLess,
    eatMore,
    tryNew,
  };
}

function suggestSwap(name: string): string {
  const low = name.toLowerCase();
  if (low.includes("peanut")) return "roasted chana / sunflower";
  if (low.includes("milk") || low.includes("paneer") || low.includes("dahi") || low.includes("curd")) return "soy curd / almond milk (if not nut-allergic)";
  if (low.includes("gluten") || low.includes("roti") || low.includes("paratha") || low.includes("naan")) return "jowar roti / ragi mudde";
  return "millet khichdi / sprouts";
}
