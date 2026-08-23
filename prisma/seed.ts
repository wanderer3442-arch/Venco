import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  const foodPath = path.join(process.cwd(), "data", "food-db.json");
  const healthPath = path.join(process.cwd(), "data", "health-db.json");
  const foods = JSON.parse(fs.readFileSync(foodPath, "utf-8")) as Array<{
    id: string; name: string; region: string; kcal: number; protein: number; carbs: number; fat: number; allergens: string[];
  }>;
  const health = JSON.parse(fs.readFileSync(healthPath, "utf-8")) as Array<{
    slug: string; title: string; sourceUrl: string; mealGuidance: string; exerciseGuidance: string;
  }>;

  console.log(`Seeding ${foods.length} foods...`);
  // upsert by name (unique)
  for (const f of foods) {
    await prisma.foodItem.upsert({
      where: { name: f.name },
      create: {
        id: f.id,
        name: f.name,
        region: f.region,
        kcal: f.kcal,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        allergens: JSON.stringify(f.allergens),
      },
      update: {
        kcal: f.kcal,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        allergens: JSON.stringify(f.allergens),
      },
    });
  }
  console.log(`Seeding ${health.length} health conditions...`);
  for (const h of health) {
    await prisma.healthCondition.upsert({
      where: { slug: h.slug },
      create: h,
      update: h,
    });
  }
  console.log("Seed done");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
