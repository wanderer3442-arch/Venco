'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useMemo, useEffect } from 'react';
import {
  Lightbulb,
  Search,
  Plus,
  ArrowRight,
  Flame,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store-context';
import { allFoods } from '@/lib/food-database';
import { FoodItem } from '@/lib/types';

const healthTips = [
  "8 hours of sleep is vital for muscle recovery and hormonal balance.",
  "Drinking water before meals can boost metabolism by 24-30%.",
  "Protein helps repair tissues and build lean muscle mass.",
  "A 10-minute walk after meals improves digestion significantly.",
  "Consistency beats intensity - small daily habits drive results.",
  "Getting sunlight in the morning regulates your circadian rhythm.",
];

const heatmapColors = ['stroke-primary', 'stroke-primary/60', 'stroke-primary/20', 'stroke-primary', 'stroke-surface-container-high', 'stroke-primary/40', 'stroke-primary'];

export default function DashboardPage() {
  const { user } = useAuth();
  const { calculations, meals, exercises, getMealsForDate, getExercisesForDate } = useStore();
  const [tipIndex, setTipIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [goals, setGoals] = useState([
    { id: 1, label: 'Log Meals', completed: false, pct: 0 },
    { id: 2, label: 'Daily Habit: Hydration', completed: false, pct: 0 },
    { id: 3, label: 'Exercise Session', completed: false, pct: 0 },
  ]);

  useEffect(() => {
    setMounted(true);
    setTipIndex(Math.floor(Math.random() * healthTips.length));
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = useMemo(() => getMealsForDate(today), [meals, today]);

  useEffect(() => {
    setGoals(prev => prev.map(g => {
      if (g.id === 1) return { ...g, completed: todayMeals.length > 0, pct: todayMeals.length > 0 ? 100 : 0 };
      if (g.id === 2) return { ...g, completed: false, pct: 0 };
      if (g.id === 3) return { ...g, completed: getExercisesForDate(today).length > 0, pct: getExercisesForDate(today).length > 0 ? 100 : 0 };
      return g;
    }));
  }, [todayMeals, exercises, today]);

  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dateStr = d.toISOString().split('T')[0];
      if (getMealsForDate(dateStr).length > 0 || getExercisesForDate(dateStr).length > 0) {
        count++;
      } else if (i > 0) {
        break;
      }
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [meals, exercises]);

  const totalCalories = useMemo(() => {
    return todayMeals.reduce((sum, m) => {
      const food = allFoods.find((f) => f.id === m.foodId);
      return sum + (food ? food.nutrition.calories * m.quantity : 0);
    }, 0);
  }, [todayMeals]);

  const weeklyWorkouts = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      if (d > now) break;
      const dateStr = d.toISOString().split('T')[0];
      if (getExercisesForDate(dateStr).length > 0) count++;
    }
    return count;
  }, [exercises]);

  const nutritionPct = useMemo(() => {
    if (!calculations) return 0;
    const target = calculations.targetCalories;
    if (target === 0) return 0;
    return Math.min(Math.round((totalCalories / target) * 100), 100);
  }, [totalCalories, calculations]);

  // Compute heatmap from real daily activity
  const heatmapValues = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayMeals = getMealsForDate(dateStr);
      const dayExercises = getExercisesForDate(dateStr);
      let score = 0;
      if (dayMeals.length > 0) score += 40;
      if (dayExercises.length > 0) score += 40;
      if (dayMeals.length > 2) score += 20;
      return Math.min(score, 100);
    });
  }, [meals, exercises]);

  const handleFoodSearch = (query: string) => {
    setFoodSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = allFoods
      .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
    setSearchResults(results);
  };

  return (
    <DashboardLayout title="Dashboard" subtitle="">
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6">
          {/* Hero + Health Tip Row */}
          <div className="col-span-4 md:col-span-12 grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6">
            {/* Hero Section */}
            <section className="col-span-4 md:col-span-8 flex flex-col justify-center gap-3 rounded-xl">
              <h1 className="text-2xl md:text-display-lg font-bold text-on-background">
                Good morning, <span className="text-primary">{user?.username || 'User'}</span>.
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-2xl">
                {streak > 0
                  ? `You're on a ${streak}-day streak. Let's keep the momentum going.`
                  : 'Start your fitness journey today. Log your first meal or workout!'}
              </p>
            </section>

            {/* Health Tip Banner */}
            <section className="col-span-4 md:col-span-4 bg-surface rounded-xl border border-outline-variant shadow-[0_4px_15px_4px_rgba(15,23,42,0.04)] p-5 relative overflow-hidden flex flex-col justify-center">
              <div className="flex items-center gap-2 text-tertiary-container mb-2">
                <div className="w-8 h-8 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
                  <Lightbulb className="w-[18px] h-[18px]" />
                </div>
                <span className="text-label-md uppercase tracking-wider font-bold text-tertiary-container">
                  Health Tip
                </span>
              </div>
              <p className="text-body-md text-on-surface font-medium">
                &ldquo;{healthTips[tipIndex]}&rdquo;
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-high">
                <div
                  className="h-full bg-tertiary-container"
                  style={{
                    animation: 'shrink 5s linear infinite',
                    transformOrigin: 'left',
                  }}
                />
              </div>
            </section>
          </div>

          {/* Activity Pulse + Daily Goals Row */}
          <div className="col-span-4 md:col-span-12 grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6">
            {/* Activity Pulse */}
            <section className="col-span-4 md:col-span-8 bg-surface rounded-xl border border-outline-variant shadow-[0_4px_15px_4px_rgba(15,23,42,0.04)] p-5 flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-headline-md font-semibold text-on-background">Activity Pulse</h2>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                  <Flame className="w-[18px] h-[18px] text-primary" />
                  <span className="text-label-md font-bold text-primary">{streak} Day Streak</span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                {/* Heat Map */}
                <div className="flex flex-col gap-3">
                  <span className="text-label-md text-on-surface-variant font-medium">Last 7 Days Intensity</span>
                  <div className="flex gap-2">
                    {heatmapValues.map((val, i) => (
                      <div key={i} className="flex-1 aspect-square relative">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle className="stroke-surface-container-high" cx="18" cy="18" fill="none" r="14" strokeWidth="4" />
                          <circle
                            className={heatmapColors[i]}
                            cx="18"
                            cy="18"
                            fill="none"
                            r="14"
                            strokeDasharray={`${val}, 100`}
                            strokeLinecap="round"
                            strokeWidth="4"
                          />
                        </svg>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-outline uppercase tracking-tighter">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>

                {/* Streak Ring */}
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="40" stroke="#eff4ff" strokeWidth="8" />
                      <circle
                        className="transition-all duration-1000"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="40"
                        stroke="#2170e4"
                        strokeDasharray="251"
                        strokeDashoffset={251 - (251 * Math.min(nutritionPct, 100)) / 100}
                        strokeLinecap="round"
                        strokeWidth="8"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-headline-md font-bold text-secondary">{nutritionPct}%</span>
                      <span className="text-[10px] text-outline uppercase">Goal</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Daily Goals */}
            <section className="col-span-4 md:col-span-4 bg-surface rounded-xl border border-outline-variant shadow-[0_4px_15px_4px_rgba(15,23,42,0.04)] p-5 transition-shadow duration-300 hover:shadow-[0_8px_25px_8px_rgba(15,23,42,0.08)]">
              <h2 className="text-headline-md font-semibold text-on-background mb-5">Daily Goals</h2>
              <ul className="flex flex-col gap-3">
                {goals.map((goal) => (
                  <li
                    key={goal.id}
                    onClick={() => {
                      setGoals((prev) =>
                        prev.map((g) =>
                          g.id === goal.id
                            ? { ...g, completed: !g.completed, pct: g.completed ? 0 : 100 }
                            : g
                        )
                      );
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group"
                  >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle className="stroke-surface-container-high" cx="18" cy="18" fill="none" r="16" strokeWidth="3" />
                        <circle
                          className={goal.completed ? 'stroke-primary' : 'stroke-secondary'}
                          cx="18"
                          cy="18"
                          fill="none"
                          r="16"
                          strokeDasharray={`${goal.pct}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3"
                        />
                      </svg>
                      {goal.completed ? (
                        <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        goal.pct > 0 && (
                          <span className="text-[10px] font-bold text-secondary">{goal.pct}%</span>
                        )
                      )}
                    </div>
                    <span className="text-body-md text-on-surface">{goal.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Log Food + Weekly Progress Row */}
          <div className="col-span-4 md:col-span-12 grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6">
            {/* Log Food */}
            <section className="col-span-4 md:col-span-6 bg-surface rounded-xl border border-outline-variant shadow-[0_4px_15px_4px_rgba(15,23,42,0.04)] p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-headline-md font-semibold text-on-background mb-2">
                  Eat anything new today?
                </h2>
                <p className="text-label-md text-on-surface-variant mb-4">
                  Quick log for better tracking.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={foodSearch}
                    onChange={(e) => handleFoodSearch(e.target.value)}
                    placeholder="e.g. Avocado Toast"
                    className="w-full h-12 px-4 pr-12 rounded-lg border border-outline-variant bg-surface text-body-md text-on-surface focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 transition-all"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface rounded-lg border border-outline-variant shadow-lg z-10 max-h-60 overflow-y-auto">
                      {searchResults.map((food) => (
                        <Link
                          key={food.id}
                          href="/meal-plan"
                          className="w-full flex justify-between items-center px-4 py-3 hover:bg-surface-container-low transition-colors text-left"
                        >
                          <div>
                            <p className="text-body-md text-on-surface font-medium">{food.name}</p>
                            <p className="text-label-md text-on-surface-variant">{food.category} · {food.nutrition.calories} kcal</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-outline" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  href="/meal-plan"
                  className="w-full h-12 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:bg-primary/90 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Log Food
                </Link>
              </div>
            </section>

            {/* Weekly Progress */}
            <section className="col-span-4 md:col-span-6 bg-surface rounded-xl border border-outline-variant shadow-[0_4px_15px_4px_rgba(15,23,42,0.04)] p-5">
              <div className="flex justify-between items-start mb-5">
                <h2 className="text-headline-md font-semibold text-on-background">Weekly Progress</h2>
                <span className="bg-surface-container-high text-secondary text-label-md px-2 py-1 rounded-full font-bold">
                  {weeklyWorkouts >= 3 ? 'In Sync' : 'Get Started'}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {/* Ring Charts */}
                <div className="flex justify-around items-center py-3 gap-4">
                  {/* Activity Ring */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="45" stroke="#e5eeff" strokeWidth="8" />
                      <circle
                        className="transition-all duration-1000 ease-out"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="45"
                        stroke="#006c49"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * nutritionPct) / 100}
                        strokeLinecap="round"
                        strokeWidth="10"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-headline-md font-bold text-on-background">{nutritionPct}%</span>
                      <span className="text-[10px] uppercase text-on-surface-variant">Activity</span>
                    </div>
                  </div>

                  {/* Steps Ring */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="45" stroke="#e5eeff" strokeWidth="8" />
                      <circle
                        className="transition-all duration-1000 ease-out"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="45"
                        stroke="#2170e4"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        strokeLinecap="round"
                        strokeWidth="10"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-label-md font-bold text-on-background">--</span>
                      <span className="text-[8px] uppercase text-on-surface-variant">Steps</span>
                    </div>
                  </div>

                  {/* Sleep Ring */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="45" stroke="#e5eeff" strokeWidth="8" />
                      <circle
                        className="transition-all duration-1000 ease-out"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="45"
                        stroke="#855300"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        strokeLinecap="round"
                        strokeWidth="10"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-label-md font-bold text-on-background">--</span>
                      <span className="text-[8px] uppercase text-on-surface-variant">Sleep</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-label-md text-on-surface-variant">Workouts</span>
                    <span className="text-label-md font-bold">{weeklyWorkouts}/5</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${Math.min((weeklyWorkouts / 5) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-label-md text-on-surface-variant">Nutrition</span>
                    <span className="text-label-md font-bold">{nutritionPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-1000"
                      style={{ width: `${nutritionPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
