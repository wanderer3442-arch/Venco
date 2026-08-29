import { FoodItem, FoodCategory, Allergen, Cuisine } from '../types';

export function searchFoods(query: string, foods: FoodItem[]): FoodItem[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return foods
    .filter(f => f.name.toLowerCase().includes(lower))
    .sort((a, b) => {
      const aStart = a.name.toLowerCase().startsWith(lower);
      const bStart = b.name.toLowerCase().startsWith(lower);
      if (aStart && !bStart) return -1;
      if (!aStart && bStart) return 1;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10);
}

export function filterFoods(
  foods: FoodItem[],
  options: {
    category?: FoodCategory;
    cuisine?: Cuisine;
    excludeAllergens?: Allergen[];
    maxCalories?: number;
  }
): FoodItem[] {
  return foods.filter(food => {
    if (options.category && food.category !== options.category) return false;
    if (options.cuisine && !food.cuisines.includes(options.cuisine)) return false;
    if (options.excludeAllergens) {
      if (food.allergens.some(a => options.excludeAllergens!.includes(a))) return false;
    }
    if (options.maxCalories && food.nutrition.calories > options.maxCalories) return false;
    return true;
  });
}

export function computeCalories(food: FoodItem, servingIndex: number, quantity: number): number {
  const serving = food.servingSizes[servingIndex] || food.servingSizes[0];
  if (!serving) return food.nutrition.calories * quantity;
  const baseGrams = serving.amount;
  return Math.round((food.nutrition.calories * quantity * baseGrams) / 100);
}

export function scaleNutrition(food: FoodItem, servingIndex: number, quantity: number) {
  const serving = food.servingSizes[servingIndex] || food.servingSizes[0];
  if (!serving) return food.nutrition;
  const scale = (quantity * serving.amount) / 100;
  return {
    calories: Math.round(food.nutrition.calories * scale),
    protein: Math.round(food.nutrition.protein * scale * 10) / 10,
    carbohydrates: Math.round(food.nutrition.carbohydrates * scale * 10) / 10,
    fat: Math.round(food.nutrition.fat * scale * 10) / 10,
    fiber: Math.round(food.nutrition.fiber * scale * 10) / 10,
    sugar: Math.round(food.nutrition.sugar * scale * 10) / 10,
    sodium: Math.round(food.nutrition.sodium * scale),
  };
}
