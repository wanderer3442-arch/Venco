'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Profile,
  Calculations,
  MealEntry,
  ExerciseEntry,
  Habit,
  WorkoutPlan,
  BodyMetric,
  Subscription,
  WeeklyFoodPreference,
  WaterLog,
  SleepLog,
  Badge,
} from './types';
import { calculateAll } from './calculations';
import { useAuth } from './auth-context';
import { allFoods } from './food-database';

interface StoreContextType {
  profile: Profile;
  updateProfile: (profile: Partial<Profile>) => void;
  calculations: Calculations | null;
  recalculate: () => void;

  meals: MealEntry[];
  addMeal: (meal: MealEntry) => void;
  removeMeal: (id: string) => void;
  getMealsForDate: (date: string) => MealEntry[];

  exercises: ExerciseEntry[];
  addExercise: (entry: ExerciseEntry) => void;
  removeExercise: (id: string) => void;
  getExercisesForDate: (date: string) => ExerciseEntry[];

  habits: Habit[];
  addHabit: (habit: Habit) => void;
  removeHabit: (id: string) => void;
  toggleHabitDate: (habitId: string, date: string) => void;

  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan) => void;

  bodyMetrics: BodyMetric[];
  addBodyMetric: (metric: BodyMetric) => void;

  subscription: Subscription;
  setSubscription: (sub: Subscription) => void;

  foodPreferences: WeeklyFoodPreference;
  setFoodPreferences: (prefs: WeeklyFoodPreference) => void;

  waterLogs: WaterLog[];
  addWater: (amount: number) => void;
  getWaterForDate: (date: string) => number;

  sleepLogs: SleepLog[];
  addSleep: (hours: number) => void;
  getSleepForDate: (date: string) => number;

  badges: Badge[];
  checkBadges: () => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  isProfileSet: boolean;
  setIsProfileSet: (val: boolean) => void;
}

const defaultProfile: Profile = {
  gender: null,
  age: null,
  height: null,
  weight: null,
  activityLevel: null,
  goal: null,
  healthProblems: [],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [calculations, setCalculations] = useState<Calculations | null>(null);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetric[]>([]);
  const [subscription, setSubscription] = useState<Subscription>({ plan: 'premium', expiresAt: null });
  const [foodPreferences, setFoodPreferences] = useState<WeeklyFoodPreference>({
    monday: { breakfast: [], lunch: [], dinner: [] },
    tuesday: { breakfast: [], lunch: [], dinner: [] },
    wednesday: { breakfast: [], lunch: [], dinner: [] },
    thursday: { breakfast: [], lunch: [], dinner: [] },
    friday: { breakfast: [], lunch: [], dinner: [] },
    saturday: { breakfast: [], lunch: [], dinner: [] },
    sunday: { breakfast: [], lunch: [], dinner: [] },
    allergies: [],
  });
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isProfileSet, setIsProfileSet] = useState(false);

  // Load data when user changes (login/logout)
  useEffect(() => {
    if (!user?.id) {
      // No user logged in - reset to defaults
      setProfile(defaultProfile);
      setMeals([]);
      setExercises([]);
      setHabits([]);
      setWorkoutPlan(null);
      setBodyMetrics([]);
      setSubscription({ plan: 'free', expiresAt: null });
      setFoodPreferences({
        monday: { breakfast: [], lunch: [], dinner: [] },
        tuesday: { breakfast: [], lunch: [], dinner: [] },
        wednesday: { breakfast: [], lunch: [], dinner: [] },
        thursday: { breakfast: [], lunch: [], dinner: [] },
        friday: { breakfast: [], lunch: [], dinner: [] },
        saturday: { breakfast: [], lunch: [], dinner: [] },
        sunday: { breakfast: [], lunch: [], dinner: [] },
        allergies: [],
      });
      setWaterLogs([]);
      setSleepLogs([]);
      setBadges([]);
      setIsProfileSet(false);
      return;
    }

    // Load user-specific data
    const storageKey = `gymathome_store_${user.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.meals) setMeals(parsed.meals);
        if (parsed.exercises) setExercises(parsed.exercises);
        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.workoutPlan) setWorkoutPlan(parsed.workoutPlan);
        if (parsed.bodyMetrics) setBodyMetrics(parsed.bodyMetrics);
        if (parsed.subscription) setSubscription(parsed.subscription);
        if (parsed.foodPreferences) setFoodPreferences(parsed.foodPreferences);
        if (parsed.waterLogs) setWaterLogs(parsed.waterLogs);
        if (parsed.sleepLogs) setSleepLogs(parsed.sleepLogs);
        if (parsed.badges) setBadges(parsed.badges);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.isProfileSet) setIsProfileSet(parsed.isProfileSet);
      } catch {
        localStorage.removeItem(storageKey);
      }
    } else {
      // First time user - reset to defaults
      setProfile(defaultProfile);
      setMeals([]);
      setExercises([]);
      setHabits([]);
      setWorkoutPlan(null);
      setBodyMetrics([]);
      setSubscription({ plan: 'free', expiresAt: null });
      setFoodPreferences({
        monday: { breakfast: [], lunch: [], dinner: [] },
        tuesday: { breakfast: [], lunch: [], dinner: [] },
        wednesday: { breakfast: [], lunch: [], dinner: [] },
        thursday: { breakfast: [], lunch: [], dinner: [] },
        friday: { breakfast: [], lunch: [], dinner: [] },
        saturday: { breakfast: [], lunch: [], dinner: [] },
        sunday: { breakfast: [], lunch: [], dinner: [] },
        allergies: [],
      });
      setWaterLogs([]);
      setSleepLogs([]);
      setBadges([]);
      setIsProfileSet(false);
    }
  }, [user?.id]);

  // Save data to user-specific localStorage
  useEffect(() => {
    if (!user?.id) return;
    const storageKey = `gymathome_store_${user.id}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        profile,
        meals,
        exercises,
        habits,
        workoutPlan,
        bodyMetrics,
        subscription,
        foodPreferences,
        waterLogs,
        sleepLogs,
        badges,
        theme,
        isProfileSet,
      })
    );
  }, [user?.id, profile, meals, exercises, habits, workoutPlan, bodyMetrics, subscription, foodPreferences, waterLogs, sleepLogs, badges, theme, isProfileSet]);

  const recalculate = () => {
    const calc = calculateAll(profile);
    setCalculations(calc);
  };

  useEffect(() => {
    if (isProfileSet && profile.age && profile.height && profile.weight && profile.gender && profile.activityLevel && profile.goal) {
      const calc = calculateAll(profile);
      setCalculations(calc);
    } else {
      setCalculations(null);
    }
  }, [profile, isProfileSet]);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addMeal = (meal: MealEntry) => {
    setMeals(prev => [...prev, meal]);
  };

  const removeMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const getMealsForDate = (date: string) => {
    return meals.filter(m => m.loggedAt.startsWith(date));
  };

  const addExercise = (entry: ExerciseEntry) => {
    setExercises(prev => [...prev, entry]);
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const getExercisesForDate = (date: string) => {
    return exercises.filter(e => e.loggedAt.startsWith(date));
  };

  const addHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };

  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleHabitDate = (habitId: string, date: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        const completed = h.completedDates.includes(date);
        return {
          ...h,
          completedDates: completed
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date],
        };
      })
    );
  };

  const addBodyMetric = (metric: BodyMetric) => {
    setBodyMetrics(prev => [...prev.filter(m => m.date !== metric.date), metric]);
  };

  const addWater = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setWaterLogs(prev => [...prev, { date: today, amount, loggedAt: new Date().toISOString() }]);
  };

  const getWaterForDate = (date: string) => {
    return waterLogs.filter(w => w.date === date).reduce((sum, w) => sum + w.amount, 0);
  };

  const addSleep = (hours: number) => {
    const today = new Date().toISOString().split('T')[0];
    setSleepLogs(prev => [...prev, { date: today, hours, loggedAt: new Date().toISOString() }]);
  };

  const getSleepForDate = (date: string) => {
    return sleepLogs.filter(s => s.date === date).reduce((sum, s) => sum + s.hours, 0);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const checkBadges = () => {
    const today = new Date().toISOString().split('T')[0];
    const newBadges: Badge[] = [];

    const hasBadge = (id: string) => badges.some(b => b.id === id);

    // 7-day streak
    if (!hasBadge('streak_7')) {
      let streak = 0;
      const d = new Date();
      for (let i = 0; i < 30; i++) {
        const dateStr = d.toISOString().split('T')[0];
        if (getMealsForDate(dateStr).length > 0 || getExercisesForDate(dateStr).length > 0) {
          streak++;
        } else if (i > 0) {
          break;
        }
        d.setDate(d.getDate() - 1);
      }
      if (streak >= 7) {
        newBadges.push({ id: 'streak_7', name: '7-Day Streak', description: 'Logged meals or exercises for 7 consecutive days', icon: '\uD83D\uDD25', unlockedAt: today, condition: 'streak_7' });
      }
    }

    // 100 meals logged
    if (!hasBadge('meals_100') && meals.length >= 100) {
      newBadges.push({ id: 'meals_100', name: 'Meal Master', description: 'Logged 100 meals', icon: '\uD83C\uDF7D\uFE0F', unlockedAt: today, condition: 'meals_100' });
    }

    // 10 workouts
    if (!hasBadge('workouts_10') && exercises.length >= 10) {
      newBadges.push({ id: 'workouts_10', name: 'Gym Warrior', description: 'Completed 10 workouts', icon: '\uD83C\uDFCB\uFE0F', unlockedAt: today, condition: 'workouts_10' });
    }

    // 50 workouts
    if (!hasBadge('workouts_50') && exercises.length >= 50) {
      newBadges.push({ id: 'workouts_50', name: 'Iron Legend', description: 'Completed 50 workouts', icon: '\uD83D\uDCAA', unlockedAt: today, condition: 'workouts_50' });
    }

    // 7-day water tracking
    if (!hasBadge('water_7')) {
      let waterDays = 0;
      const d = new Date();
      for (let i = 0; i < 7; i++) {
        const dateStr = d.toISOString().split('T')[0];
        if (getWaterForDate(dateStr) > 0) waterDays++;
        d.setDate(d.getDate() - 1);
      }
      if (waterDays >= 7) {
        newBadges.push({ id: 'water_7', name: 'Hydration Hero', description: 'Tracked water intake for 7 days', icon: '\uD83D\uDCA7', unlockedAt: today, condition: 'water_7' });
      }
    }

    // Hit protein target 5 days
    if (!hasBadge('protein_5') && calculations) {
      let proteinDays = 0;
      const d = new Date();
      for (let i = 0; i < 30; i++) {
        const dateStr = d.toISOString().split('T')[0];
        const dayMeals = getMealsForDate(dateStr);
        let totalProtein = 0;
        dayMeals.forEach(m => {
          const food = allFoods.find((f: any) => f.id === m.foodId);
          if (food) totalProtein += food.nutrition.protein * m.quantity;
        });
        if (totalProtein >= calculations.protein * 0.9) proteinDays++;
        d.setDate(d.getDate() - 1);
      }
      if (proteinDays >= 5) {
        newBadges.push({ id: 'protein_5', name: 'Protein Pro', description: 'Hit protein target 5 days in 30', icon: '\uD83E\uDD69', unlockedAt: today, condition: 'protein_5' });
      }
    }

    // First meal logged
    if (!hasBadge('first_meal') && meals.length >= 1) {
      newBadges.push({ id: 'first_meal', name: 'First Bite', description: 'Logged your first meal', icon: '\uD83C\uDF1F', unlockedAt: today, condition: 'first_meal' });
    }

    // First workout
    if (!hasBadge('first_workout') && exercises.length >= 1) {
      newBadges.push({ id: 'first_workout', name: 'First Rep', description: 'Completed your first workout', icon: '\u26A1', unlockedAt: today, condition: 'first_workout' });
    }

    if (newBadges.length > 0) {
      setBadges(prev => [...prev, ...newBadges]);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        profile,
        updateProfile,
        calculations,
        recalculate,
        meals,
        addMeal,
        removeMeal,
        getMealsForDate,
        exercises,
        addExercise,
        removeExercise,
        getExercisesForDate,
        habits,
        addHabit,
        removeHabit,
        toggleHabitDate,
        workoutPlan,
        setWorkoutPlan,
        bodyMetrics,
        addBodyMetric,
        subscription,
        setSubscription,
        foodPreferences,
        setFoodPreferences,
        waterLogs,
        addWater,
        getWaterForDate,
        sleepLogs,
        addSleep,
        getSleepForDate,
        badges,
        checkBadges,
        theme,
        toggleTheme,
        isProfileSet,
        setIsProfileSet,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
