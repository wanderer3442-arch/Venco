import foods from "../../data/food-db.json";

export type Food = (typeof foods)[number];

export function searchFoods(q: string, limit = 10): Food[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const scored = (foods as Food[])
    .map((f) => {
      const name = f.name.toLowerCase();
      const tokens = name.split(/[\s\-\/]+/);
      let score = -1;
      if (name.startsWith(s)) score = 3;
      else if (tokens.some((t) => t === s)) score = 3; // exact word: bread → Brown Bread (token bread)
      else if (tokens.some((t) => t.startsWith(s))) score = 2.2;
      else if (name.includes(s)) score = 1.2;
      else if (f.region.toLowerCase().includes(s)) score = 0.5;
      if (score >= 0) {
        if (f.region === "Indian") score += 0.05;
        if (/\d{2,}/.test(f.name)) score -= 0.6;
        if (f.name === "Brown Bread" || f.name === "Whole Wheat Bread" || f.name === "White Bread" || f.name === "Multigrain Bread" || f.name === "Brown Rice" || f.name === "Breakfast Cereal" || f.name === "Bhel Puri") score += 0.45;
        if (f.name.length < 18 && !/\d/.test(f.name)) score += 0.05;
      }
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
  healthSlug?: string | null;
};

export type PlanOutput = {
  total: { kcal: number; protein: number; carbs: number; fat: number };
  meals: { label: string; items: { food: Food; qtyG: number; kcal: number; protein: number; carbs: number; fat: number; healthNote?: string }[] }[];
  avoid: string[];
  eatLess: string[];
  eatMore: string[];
  tryNew: Food[];
  healthNote?: string | null;
};

function qtyFor(food: Food, meal: string): number {
  if (food.kcal > 450) return meal === "Breakfast" ? 80 : 120;
  if (food.kcal < 150) return meal === "Breakfast" ? 150 : 180;
  return 130;
}

function healthRules(slug?: string | null) {
  if (!slug) return null;
  const s = slug.toLowerCase();
  if (s.includes("diabetes") || s.includes("pre-diabetes"))
    return {
      avoid: ["white rice", "sugar", "jalebi", "gulab", "biscuit", "maida", "sweet", "cola"],
      limit: ["rice", "potato"],
      prefer: ["millet", "oats", "dal", "sprouts", "brown rice", "bhel"],
      note: "Diabetes: avoid added sugar & white rice, prefer low-GI millets/oats/dal — small frequent meals.",
    };
  if (s.includes("hypertension"))
    return {
      avoid: ["pickle", "papad", "namkeen", "samosa", "fried", "namkeen", "mixture"],
      limit: ["salt", "papad"],
      prefer: ["banana", "curd", "oats", "dal"],
      note: "Hypertension: keep sodium <2000mg — avoid pickle/papad/namkeen, choose banana/curd.",
    };
  if (s.includes("low-muscle"))
    return {
      avoid: ["low protein"],
      limit: [],
      prefer: ["paneer", "chicken", "egg", "dal", "sprouts", "milk"],
      note: "Low muscle: need protein 2.0g/kg — add paneer/chicken/egg/dal each meal.",
    };
  if (s.includes("obesity"))
    return {
      avoid: ["fried", "samosa", "namkeen", "sugar", "cola"],
      limit: ["rice", "oil"],
      prefer: ["salad", "millet", "dal", "sprouts"],
      note: "Obesity: keep deficit, high satiety protein+fiber — avoid fried/sugar.",
    };
  if (s.includes("hyperlipidemia") || s.includes("cholesterol"))
    return {
      avoid: ["fried", "ghee", "butter"],
      limit: ["oil", "fried"],
      prefer: ["oats", "dal", "nuts", "olive"],
      note: "Cholesterol: limit saturated fat — avoid fried/ghee, prefer oats/nuts.",
    };
  if (s.includes("anemia"))
    return {
      avoid: ["tea"],
      limit: [],
      prefer: ["millet", "leafy", "spinach", "dal"],
      note: "Anemia: pair iron foods with vitamin C, avoid tea with meals.",
    };
  return { avoid: [], limit: [], prefer: [], note: null as string | null };
}

export function generatePlan(input: PlanInput): PlanOutput {
  const allFoods = foods as Food[];
  const allergySet = new Set(input.allergies.map((a) => a.toLowerCase()));
  const hr = healthRules(input.healthSlug);

  const pick = (names: string[], label: string) => {
    const items: PlanOutput["meals"][number]["items"] = [];
    const total = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    for (const n of names) {
      let f = findExact(n);
      if (!f) {
        const results = searchFoods(n, 3);
        f = results[0];
      }
      if (!f) continue;
      const hasAllergy = f.allergens.some((al) => allergySet.has(al.toLowerCase()));
      if (hasAllergy) continue;
      const qty = qtyFor(f, label);
      const factor = qty / 100;
      let healthNote: string | undefined;
      if (hr) {
        const low = f.name.toLowerCase();
        if (hr.avoid.some((t) => low.includes(t))) healthNote = `Avoid for ${input.healthSlug}: try ${hr.prefer[0] ?? "millet"}`;
        else if (hr.limit.some((t) => low.includes(t))) healthNote = `Eat less for ${input.healthSlug}`;
      }
      const entry = {
        food: f,
        qtyG: qty,
        kcal: Math.round(f.kcal * factor),
        protein: Math.round(f.protein * factor * 10) / 10,
        carbs: Math.round(f.carbs * factor * 10) / 10,
        fat: Math.round(f.fat * factor * 10) / 10,
        healthNote,
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

  // Avoid / alternatives (allergies)
  const avoid: string[] = [];
  const allergenHits = allFoods.filter((f) =>
    input.breakfast.concat(input.lunch, input.dinner).some((n) => f.name.toLowerCase() === n.toLowerCase()) &&
    f.allergens.some((al) => allergySet.has(al.toLowerCase()))
  );
  for (const f of allergenHits) {
    const al = f.allergens.filter((a) => allergySet.has(a.toLowerCase())).join(", ");
    avoid.push(`${f.name} — contains ${al} → try ${suggestSwap(f.name)}`);
  }

  // Health-aware avoid/limit
  let healthNote: string | null = null;
  if (hr) {
    healthNote = hr.note;
    const allTyped = input.breakfast.concat(input.lunch, input.dinner).map((n) => n.toLowerCase());
    for (const name of allTyped) {
      if (hr.avoid.some((t) => name.includes(t))) avoid.push(`${name} — avoid for ${input.healthSlug}: ${hr.note} → try ${hr.prefer[0] ?? "millet"}`);
      else if (hr.limit.some((t) => name.includes(t))) {
        // will be handled in eatLess
      }
    }
  }

  const eatLess: string[] = [];
  const eatMore: string[] = [];
  if (hr) {
    // health-specific eats
    for (const name of input.breakfast.concat(input.lunch, input.dinner).map((n) => n.toLowerCase())) {
      if (hr.limit.some((t) => name.includes(t))) eatLess.push(`${name} — eat less for ${input.healthSlug}`);
    }
    eatMore.push(`For ${input.healthSlug}: ${hr.note} Prefer: ${hr.prefer.join(", ")}`);
  }
  if (input.targetKcal) {
    if (total.kcal > input.targetKcal + 150) eatLess.push(`Calories ${total.kcal} > target ${input.targetKcal} — reduce fried items, use 80g portions, add salad.`);
    else if (total.kcal < input.targetKcal - 150) eatMore.push(`Calories ${total.kcal} < target ${input.targetKcal} — add 30g nuts or 1 extra roti / millet.`);
  }
  if (input.targetMacros) {
    if (total.protein < input.targetMacros.proteinG * 0.8) eatMore.push(`Protein ${total.protein}g low vs ${input.targetMacros.proteinG}g — eat more dal, paneer, chicken, sprouts.`);
    if (total.fat > input.targetMacros.fatG * 1.3) eatLess.push(`Fat ${total.fat}g high vs ${input.targetMacros.fatG}g — use less oil, avoid deep-fried.`);
    if (total.carbs > input.targetMacros.carbsG * 1.3) eatLess.push(`Carbs ${total.carbs}g high — swap white rice → millets / brown rice.`);
  }
  if (eatLess.length === 0 && eatMore.length === 0) {
    eatMore.push("Balanced — keep portions as suggested; walk 10 min post-meal.");
  }

  const hadNames = new Set(input.breakfast.concat(input.lunch, input.dinner).map((s) => s.toLowerCase()));
  const tryNew = allFoods
    .filter((f) => !hadNames.has(f.name.toLowerCase()) && !f.allergens.some((al) => allergySet.has(al.toLowerCase())))
    .sort((a, b) => {
      const score = (f: Food) => {
        let s = (f.region === "Indian" ? 0.5 : 0) + f.protein * 0.1 - Math.abs(f.kcal - 250) * 0.005;
        if (hr && hr.prefer.some((t) => f.name.toLowerCase().includes(t))) s += 1.2;
        if (hr && hr.avoid.some((t) => f.name.toLowerCase().includes(t))) s -= 1.5;
        return s;
      };
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
    healthNote,
  };
}

function suggestSwap(name: string): string {
  const low = name.toLowerCase();
  if (low.includes("peanut")) return "roasted chana / sunflower";
  if (low.includes("milk") || low.includes("paneer") || low.includes("dahi") || low.includes("curd")) return "soy curd / almond milk (if not nut-allergic)";
  if (low.includes("gluten") || low.includes("roti") || low.includes("paratha") || low.includes("naan")) return "jowar roti / ragi mudde";
  return "millet khichdi / sprouts";
}
