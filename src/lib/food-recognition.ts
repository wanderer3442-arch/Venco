import { detectFoodFromPhoto, detectWeeklyMealPlan, FoodSuggestion, DayMealPlan, hasGeminiKey } from './ai-service';

export type { FoodSuggestion, DayMealPlan };

export function hasApiKey(): boolean {
  if (typeof window === 'undefined') return false;
  return hasGeminiKey();
}

export async function detectFoodFromImage(
  imageSource: string
): Promise<FoodSuggestion[]> {
  if (!hasApiKey()) {
    throw new Error('API key not configured.');
  }
  return await detectFoodFromPhoto(imageSource);
}

export async function detectWeeklyPlanFromImage(
  imageSource: string
): Promise<DayMealPlan[]> {
  if (!hasApiKey()) {
    throw new Error('API key not configured.');
  }
  return await detectWeeklyMealPlan(imageSource);
}
