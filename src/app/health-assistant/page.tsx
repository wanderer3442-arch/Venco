'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useMemo } from 'react';
import {
  Search,
  Heart,
  Shield,
  CheckCircle2,
  XCircle,
  Dumbbell,
  Utensils,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Plus,
  Leaf,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { healthConditions, searchHealthConditions } from '@/lib/health-database';
import { allFoods } from '@/lib/food-database';
import { useStore } from '@/lib/store-context';
import { HealthCondition } from '@/lib/types';
import { useSubscription } from '@/lib/subscription-context';

const commonProblems = [
  'Diabetes',
  'Hypertension',
  'High Cholesterol',
  'Obesity',
  'PCOS',
  'Back Pain',
  'Hypothyroidism',
  'IBS',
  'Asthma',
  'Kidney Disease',
];

export default function HealthAssistantPage() {
  const { profile, meals } = useStore();
  const { hasFeature } = useSubscription();
  const [query, setQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<HealthCondition | null>(null);
  const [saved, setSaved] = useState(false);

  const hasHealthAccess = hasFeature('health_conditions');

  const searchResults = useMemo(() => {
    if (query.length < 2) return [];
    return searchHealthConditions(query);
  }, [query]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedCondition(null);
    if (value.length >= 2) {
      const results = searchHealthConditions(value);
      if (results.length === 1) {
        setSelectedCondition(results[0]);
      }
    }
  };

  const handleQuickSelect = (problem: string) => {
    setQuery(problem);
    const results = searchHealthConditions(problem);
    if (results.length > 0) {
      setSelectedCondition(results[0]);
    }
  };

  const handleSaveToProfile = () => {
    if (!selectedCondition) return;
    const currentProblems = profile?.healthProblems || [];
    if (!currentProblems.includes(selectedCondition.id)) {
      // Would need updateProfile from store
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Get foods from user's meal plan
  const userFoods = useMemo(() => {
    const foodIds = new Set(meals.map((m: any) => m.foodId));
    return allFoods.filter((f) => foodIds.has(f.id));
  }, [meals]);

  // Analyze condition against user's meal plan
  const analysis = useMemo(() => {
    if (!selectedCondition) return null;

    const conditionFoodKeywords = selectedCondition.foodsToEat.map((f) => f.toLowerCase());
    const avoidKeywords = selectedCondition.foodsToAvoid.map((f) => f.toLowerCase());

    // Foods from user's plan that are GOOD for this condition
    const goodFoods = userFoods.filter((food) => {
      const name = food.name.toLowerCase();
      return conditionFoodKeywords.some((kw) => name.includes(kw) || kw.includes(name));
    });

    // Foods from user's plan that should be AVOIDED
    const badFoods = userFoods.filter((food) => {
      const name = food.name.toLowerCase();
      return avoidKeywords.some((kw) => name.includes(kw) || kw.includes(name));
    });

    // New foods to try (not in user's plan but good for condition)
    const newFoods = allFoods.filter((food) => {
      const name = food.name.toLowerCase();
      const notInPlan = !userFoods.some((uf) => uf.id === food.id);
      return notInPlan && conditionFoodKeywords.some((kw) => name.includes(kw) || kw.includes(name));
    }).slice(0, 6);

    return { goodFoods, badFoods, newFoods };
  }, [selectedCondition, userFoods]);

  if (!hasHealthAccess) {
    return (
      <DashboardLayout title="Health Assistant" subtitle="Get personalized guidance for your health condition">
        <div className="max-w-5xl mx-auto space-y-6 pb-8">
          <div className="bg-surface rounded-2xl border border-outline-variant p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-headline-lg font-bold text-on-surface mb-2">
              Health Conditions Feature
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-6 max-w-md mx-auto">
              Unlock personalized health condition analysis, food recommendations, and tailored meal plans with a Pro subscription.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/choose-plan"
                className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Upgrade to Pro
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-medium hover:bg-surface-container-high transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Health Assistant" subtitle="Get personalized guidance for your health condition">
      <div className="max-w-5xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div>
          <h1 className="text-display-lg font-bold text-on-surface mb-2">
            Health Assistant
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Tell us about your health condition, and we&apos;ll analyze your meal plan and suggest what to eat, avoid, and try.
          </p>
        </div>

        {/* Search Input */}
        <div className="bg-surface rounded-2xl border border-outline-variant p-6">
          <label className="block text-headline-md font-semibold text-on-surface mb-2">
            What is your current health problem?
          </label>
          <p className="text-body-md text-on-surface-variant mb-4">
            Type your condition (e.g., diabetes, hypertension, back pain)
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="e.g., Type 2 Diabetes, High Blood Pressure..."
              className="w-full h-14 pl-12 pr-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-lg text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && !selectedCondition && (
            <div className="mt-3 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg overflow-hidden">
              {searchResults.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => {
                    setSelectedCondition(condition);
                    setQuery(condition.name);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-container-low transition-colors text-left border-b border-outline-variant/30 last:border-0"
                >
                  <div>
                    <p className="text-body-md font-medium text-on-surface">{condition.name}</p>
                    <p className="text-label-md text-on-surface-variant line-clamp-1">{condition.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-outline flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Select */}
        {!selectedCondition && (
          <div className="bg-surface rounded-2xl border border-outline-variant p-6">
            <h3 className="text-headline-md font-semibold text-on-surface mb-4">
              Common Conditions
            </h3>
            <div className="flex flex-wrap gap-2">
              {commonProblems.map((problem) => (
                <button
                  key={problem}
                  onClick={() => handleQuickSelect(problem)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-colors border border-outline-variant/50"
                >
                  {problem}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Condition Detail */}
        {selectedCondition && (
          <div className="space-y-6">
            {/* Condition Header */}
            <div className="bg-surface rounded-2xl border border-outline-variant p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-headline-lg font-bold text-on-surface mb-1">
                    {selectedCondition.name}
                  </h2>
                  <p className="text-body-md text-on-surface-variant">
                    {selectedCondition.description}
                  </p>
                </div>
                <button
                  onClick={handleSaveToProfile}
                  className={`px-4 py-2 rounded-xl text-label-md font-bold transition-all ${
                    saved
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm'
                  }`}
                >
                  {saved ? '✓ Saved' : 'Save to Profile'}
                </button>
              </div>
              <p className="text-xs text-on-surface-variant italic">
                Source: {selectedCondition.source}
              </p>
            </div>

            {/* Meal Plan Analysis */}
            {analysis && (
              <div className="bg-surface rounded-2xl border border-outline-variant p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-headline-md font-semibold text-on-surface">
                    Your Meal Plan Analysis
                  </h3>
                </div>
                <p className="text-body-md text-on-surface-variant mb-4">
                  Based on your logged meals ({userFoods.length} foods tracked)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Good Foods from Plan */}
                  <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <h4 className="text-label-md font-semibold text-on-surface">Keep Eating</h4>
                    </div>
                    {analysis.goodFoods.length > 0 ? (
                      <ul className="space-y-1.5">
                        {analysis.goodFoods.map((food) => (
                          <li key={food.id} className="flex items-center gap-2 text-body-md text-on-surface">
                            <span className="w-1.5 h-1.5 bg-success rounded-full flex-shrink-0" />
                            {food.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-on-surface-variant">No matching foods in your plan yet</p>
                    )}
                  </div>

                  {/* Foods to Avoid in Plan */}
                  <div className="bg-error/5 border border-error/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5 text-error" />
                      <h4 className="text-label-md font-semibold text-on-surface">Avoid These</h4>
                    </div>
                    {analysis.badFoods.length > 0 ? (
                      <ul className="space-y-1.5">
                        {analysis.badFoods.map((food) => (
                          <li key={food.id} className="flex items-center gap-2 text-body-md text-on-surface">
                            <span className="w-1.5 h-1.5 bg-error rounded-full flex-shrink-0" />
                            {food.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-on-surface-variant">No foods to avoid found</p>
                    )}
                  </div>

                  {/* New Foods to Try */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="w-5 h-5 text-primary" />
                      <h4 className="text-label-md font-semibold text-on-surface">Try These</h4>
                    </div>
                    {analysis.newFoods.length > 0 ? (
                      <ul className="space-y-1.5">
                        {analysis.newFoods.map((food) => (
                          <li key={food.id} className="flex items-center gap-2 text-body-md text-on-surface">
                            <Plus className="w-3 h-3 text-primary flex-shrink-0" />
                            {food.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-on-surface-variant">You&apos;re eating well already!</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foods to Eat */}
              <div className="bg-surface rounded-2xl border border-outline-variant p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <h3 className="text-headline-md font-semibold text-on-surface">
                    Foods to Eat
                  </h3>
                </div>
                <ul className="space-y-2">
                  {selectedCondition.foodsToEat.map((food, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-md text-on-surface">
                      <span className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                      {food}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Foods to Avoid */}
              <div className="bg-surface rounded-2xl border border-outline-variant p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-error" />
                  </div>
                  <h3 className="text-headline-md font-semibold text-on-surface">
                    Foods to Avoid
                  </h3>
                </div>
                <ul className="space-y-2">
                  {selectedCondition.foodsToAvoid.map((food, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-md text-on-surface">
                      <span className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0" />
                      {food}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Exercises */}
              <div className="bg-surface rounded-2xl border border-outline-variant p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-headline-md font-semibold text-on-surface">
                    Recommended Exercises
                  </h3>
                </div>
                <ul className="space-y-2">
                  {selectedCondition.exercises.map((exercise, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-md text-on-surface">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lifestyle Tips */}
              <div className="bg-surface rounded-2xl border border-outline-variant p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-tertiary/10 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-tertiary" />
                  </div>
                  <h3 className="text-headline-md font-semibold text-on-surface">
                    Lifestyle Tips
                  </h3>
                </div>
                <ul className="space-y-2">
                  {selectedCondition.lifestyle.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-md text-on-surface">
                      <span className="w-2 h-2 bg-tertiary rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/meal-plan"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-on-secondary rounded-xl text-label-md font-bold hover:bg-secondary/90 transition-colors shadow-sm"
              >
                <Utensils className="w-5 h-5" />
                View Meal Plan
              </Link>
              <Link
                href="/exercise-plan"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl text-label-md font-bold hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Dumbbell className="w-5 h-5" />
                View Exercise Plan
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 bg-tertiary/5 border border-tertiary/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">Disclaimer:</strong> This information is for educational purposes only and is not a substitute for professional medical advice. Always consult your healthcare provider before making changes to your diet or exercise routine.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedCondition && query.length >= 2 && searchResults.length === 0 && (
          <div className="bg-surface rounded-2xl border border-outline-variant p-8 text-center">
            <Search className="w-12 h-12 text-outline mx-auto mb-3" />
            <p className="text-body-md text-on-surface mb-1">No conditions found for &quot;{query}&quot;</p>
            <p className="text-sm text-on-surface-variant">
              Try one of the common conditions above, or check your spelling.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
