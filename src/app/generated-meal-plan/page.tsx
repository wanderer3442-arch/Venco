'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useMemo } from 'react';
import { useStore } from '@/lib/store-context';
import { allFoods } from '@/lib/food-database';
import { FoodSelection, DayFoodIntake } from '@/lib/types';
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Utensils,
  Sparkles,
  Shield,
  Scale,
} from 'lucide-react';

const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

export default function GeneratedMealPlanPage() {
  const { profile, calculations, foodPreferences, workoutPlan } = useStore();

  const targetCals = calculations?.targetCalories || 0;
  const targetProtein = calculations?.protein || 0;
  const targetCarbs = calculations?.carbs || 0;
  const targetFat = calculations?.fat || 0;

  // Analyze user's weekly food intake
  const analysis = useMemo(() => {
    const allFoods: FoodSelection[] = [];
    dayKeys.forEach((day) => {
      const dayData = foodPreferences[day];
      if (!dayData) return;
      mealTypes.forEach((meal) => {
        const items = dayData[meal] || [];
        allFoods.push(...items);
      });
    });

    if (allFoods.length === 0) {
      return {
        totalFoods: 0,
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        topFoods: [] as { name: string; count: number; calories: number }[],
        foodFrequency: {} as Record<string, number>,
      };
    }

    const totalCals = allFoods.reduce((sum, f) => sum + f.calories, 0);
    const totalProtein = allFoods.reduce((sum, f) => sum + f.protein, 0);
    const totalCarbs = allFoods.reduce((sum, f) => sum + f.carbs, 0);
    const totalFat = allFoods.reduce((sum, f) => sum + f.fat, 0);

    // Count food frequency
    const foodFrequency: Record<string, number> = {};
    allFoods.forEach((f) => {
      foodFrequency[f.foodName] = (foodFrequency[f.foodName] || 0) + 1;
    });

    const topFoods = Object.entries(foodFrequency)
      .map(([name, count]) => ({
        name,
        count,
        calories: allFoods.find((f) => f.foodName === name)?.calories || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalFoods: allFoods.length,
      avgCalories: Math.round(totalCals / 7),
      avgProtein: Math.round(totalProtein / 7),
      avgCarbs: Math.round(totalCarbs / 7),
      avgFat: Math.round(totalFat / 7),
      topFoods,
      foodFrequency,
    };
  }, [foodPreferences]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const eatMore: { name: string; reason: string; benefit: string }[] = [];
    const eatLess: { name: string; reason: string; impact: string }[] = [];
    const avoid: { name: string; reason: string }[] = [];
    const tryNew: { name: string; reason: string; calories: number; protein: number }[] = [];

    // Calorie analysis
    const calDiff = targetCals - analysis.avgCalories;
    if (calDiff > 200) {
      eatMore.push({
        name: 'Increase Portion Sizes',
        reason: `You need ${Math.abs(calDiff)} more calories daily`,
        benefit: 'Reach your calorie target for weight gain',
      });
    } else if (calDiff < -200) {
      eatLess.push({
        name: 'Reduce Overall Portions',
        reason: `You're eating ${Math.abs(calDiff)} calories over target`,
        impact: 'Helps with weight loss goals',
      });
    }

    // Protein analysis
    const proteinDiff = targetProtein - analysis.avgProtein;
    if (proteinDiff > 20) {
      eatMore.push({
        name: 'Add More Protein',
        reason: `Need ${Math.abs(proteinDiff)}g more protein daily`,
        benefit: 'Builds and repairs muscle tissue',
      });
    } else if (proteinDiff < -20) {
      eatLess.push({
        name: 'Reduce Protein Portions',
        reason: `Eating ${Math.abs(proteinDiff)}g more protein than needed`,
        impact: 'Excess protein may be stored as fat',
      });
    }

    // Carb analysis
    const carbDiff = targetCarbs - analysis.avgCarbs;
    if (carbDiff > 30) {
      eatMore.push({
        name: 'Add Complex Carbs',
        reason: `Need ${Math.abs(carbDiff)}g more carbs daily`,
        benefit: 'Provides energy for workouts',
      });
    } else if (carbDiff < -30) {
      eatLess.push({
        name: 'Cut Back on Carbs',
        reason: `Eating ${Math.abs(carbDiff)}g more carbs than needed`,
        impact: 'Excess carbs convert to fat',
      });
    }

    // High calorie foods to avoid
    const highCalFoods = analysis.topFoods.filter((f) => f.calories > 300);
    highCalFoods.forEach((f) => {
      avoid.push({
        name: f.name,
        reason: `${f.calories} kcal per serving - high calorie density`,
      });
    });

    // Foods to eat less (appears too frequently)
    analysis.topFoods.slice(0, 3).forEach((f) => {
      if (f.count >= 5) {
        eatLess.push({
          name: f.name,
          reason: `Eaten ${f.count} times this week - consider variety`,
          impact: 'Dietary diversity ensures balanced nutrition',
        });
      }
    });

    // Suggest new foods based on gaps
    const highProteinFoods = allFoods
      .filter((f) => f.nutrition.protein >= 20 && !f.allergens.some((a) => (foodPreferences.allergies || []).includes(a)))
      .sort((a, b) => b.nutrition.protein - a.nutrition.protein)
      .slice(0, 3);

    highProteinFoods.forEach((f) => {
      if (!analysis.foodFrequency[f.name]) {
        tryNew.push({
          name: f.name,
          reason: 'High protein source',
          calories: f.nutrition.calories,
          protein: f.nutrition.protein,
        });
      }
    });

    // Low calorie nutrient-dense foods
    const lowCalNutrient = allFoods
      .filter((f) => f.nutrition.calories < 100 && f.nutrition.protein > 5 && !analysis.foodFrequency[f.name])
      .sort((a, b) => a.nutrition.calories - b.nutrition.calories)
      .slice(0, 2);

    lowCalNutrient.forEach((f) => {
      if (!tryNew.find((t) => t.name === f.name)) {
        tryNew.push({
          name: f.name,
          reason: 'Low calorie, nutrient dense',
          calories: f.nutrition.calories,
          protein: f.nutrition.protein,
        });
      }
    });

    return { eatMore, eatLess, avoid, tryNew };
  }, [analysis, targetCals, targetProtein, targetCarbs, targetFat, foodPreferences.allergies]);

  // Generate meal plan based on analysis
  const mealPlan = useMemo(() => {
    return dayKeys.map((day) => {
      const dayData = foodPreferences[day] || { breakfast: [], lunch: [], dinner: [] };
      const dayCals = (['breakfast', 'lunch', 'dinner'] as const).reduce((sum, meal) => {
        const items = dayData[meal] || [];
        return sum + items.reduce((s: number, f: FoodSelection) => s + f.calories, 0);
      }, 0);

      const calDiff = targetCals - dayCals;
      let status: 'over' | 'under' | 'on-target' = 'on-target';
      if (calDiff > 200) status = 'under';
      else if (calDiff < -200) status = 'over';

      return {
        day,
        foods: dayData,
        totalCalories: dayCals,
        status,
        calDiff: Math.abs(calDiff),
      };
    });
  }, [foodPreferences, targetCals]);

  return (
    <DashboardLayout title="Your Personalized Meal Plan" subtitle="Based on your food intake and calculations">
      <div className="max-w-5xl mx-auto pb-8">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 mb-8 text-on-primary">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <div>
              <h1 className="text-headline-lg font-bold">Your Custom Plan</h1>
              <p className="text-on-primary/80">Analyzed {analysis.totalFoods} foods from your weekly log</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xs text-on-primary/70 mb-1">Daily Target</p>
              <p className="text-headline-md font-bold">{targetCals}</p>
              <p className="text-xs text-on-primary/70">kcal</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xs text-on-primary/70 mb-1">Your Avg</p>
              <p className="text-headline-md font-bold">{analysis.avgCalories}</p>
              <p className="text-xs text-on-primary/70">kcal/day</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xs text-on-primary/70 mb-1">Protein Goal</p>
              <p className="text-headline-md font-bold">{targetProtein}g</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xs text-on-primary/70 mb-1">Your Avg</p>
              <p className="text-headline-md font-bold">{analysis.avgProtein}g</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Macro Breakdown */}
          <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
            <h2 className="text-body-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Macro Breakdown
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Calories', current: analysis.avgCalories, target: targetCals, unit: 'kcal', color: 'bg-primary' },
                { label: 'Protein', current: analysis.avgProtein, target: targetProtein, unit: 'g', color: 'bg-secondary' },
                { label: 'Carbs', current: analysis.avgCarbs, target: targetCarbs, unit: 'g', color: 'bg-tertiary' },
                { label: 'Fats', current: analysis.avgFat, target: targetFat, unit: 'g', color: 'bg-error' },
              ].map((macro) => {
                const pct = macro.target > 0 ? Math.min((macro.current / macro.target) * 100, 150) : 0;
                const diff = macro.target - macro.current;
                return (
                  <div key={macro.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-on-surface">{macro.label}</span>
                      <span className="text-on-surface-variant">
                        {macro.current} / {macro.target} {macro.unit}
                        {diff > 0 && <span className="text-error ml-1">(-{diff})</span>}
                        {diff < 0 && <span className="text-green-600 ml-1">(+{Math.abs(diff)})</span>}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${macro.color} transition-all`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Status */}
          <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
            <h2 className="text-body-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Daily Status
            </h2>
            <div className="space-y-2">
              {mealPlan.map((day) => (
                <div key={day.day} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                  <span className="text-sm font-medium text-on-surface capitalize">{day.day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-on-surface-variant">{day.totalCalories} kcal</span>
                    {day.status === 'over' && (
                      <span className="text-xs px-2 py-0.5 bg-error/10 text-error rounded-full font-medium">
                        +{day.calDiff} over
                      </span>
                    )}
                    {day.status === 'under' && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                        -{day.calDiff} under
                      </span>
                    )}
                    {day.status === 'on-target' && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                        on target
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Eat More */}
          <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
            <h2 className="text-body-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Eat More
            </h2>
            {recommendations.eatMore.length > 0 ? (
              <div className="space-y-3">
                {recommendations.eatMore.map((rec, i) => (
                  <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-bold text-gray-900">{rec.name}</p>
                    <p className="text-xs text-gray-600">{rec.reason}</p>
                    <p className="text-xs text-green-600 mt-1">{rec.benefit}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-4">Your intake looks good!</p>
            )}
          </div>

          {/* Eat Less */}
          <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
            <h2 className="text-body-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-amber-600" />
              Eat Less
            </h2>
            {recommendations.eatLess.length > 0 ? (
              <div className="space-y-3">
                {recommendations.eatLess.map((rec, i) => (
                  <div key={i} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm font-bold text-gray-900">{rec.name}</p>
                    <p className="text-xs text-gray-600">{rec.reason}</p>
                    <p className="text-xs text-amber-600 mt-1">{rec.impact}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-4">No changes needed!</p>
            )}
          </div>
        </div>

        {/* Avoid */}
        <div className="bg-surface rounded-xl border border-outline-variant/30 p-6 mt-6">
          <h2 className="text-body-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Avoid
          </h2>
          {recommendations.avoid.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendations.avoid.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant text-center py-4">No foods to avoid!</p>
          )}
        </div>

        {/* Try New Foods */}
        <div className="bg-surface rounded-xl border border-outline-variant/30 p-6 mt-6">
          <h2 className="text-body-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Try These New Foods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.tryNew.map((food, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <div>
                  <p className="text-sm font-bold text-on-surface">{food.name}</p>
                  <p className="text-xs text-primary">{food.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-on-surface">{food.calories} kcal</p>
                  <p className="text-xs text-on-surface-variant">P: {food.protein}g</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="/food-intake"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-highest hover:bg-surface-container-high text-on-surface rounded-lg text-label-md font-bold transition-all"
          >
            Edit Food Log
          </a>
          <a
            href="/meal-plan"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-label-md font-bold transition-all shadow-md"
          >
            View Full Meal Plan
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
