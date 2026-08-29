'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useMemo } from 'react';
import {
  Dumbbell,
  Home,
  Plus,
  ArrowLeftRight,
  Settings,
  Eye,
  TrendingUp,
  Calendar,
  Layers,
  AlertTriangle,
  Pencil,
  Trash2,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { exercises } from '@/lib/exercise-database';
import { generateWorkoutPlan, getWeeklyWorkoutSummary } from '@/lib/exercise-planner';
import { Equipment, WorkoutExercise } from '@/lib/types';
import WorkoutTimer from '@/components/WorkoutTimer';

type LocationFilter = 'gym' | 'home';

const muscleLabels: Record<string, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  legs: 'Legs',
  core: 'Core',
  full_body: 'Full Body',
};

const dayLabels: Record<string, string> = {
  Monday: 'Push',
  Tuesday: 'Pull',
  Wednesday: 'Legs',
  Thursday: 'Upper',
  Friday: 'Lower',
  Saturday: 'Full Body',
  Sunday: 'Rest',
};

export default function ExercisePlanPage() {
  const { profile, workoutPlan, setWorkoutPlan, exercises: loggedExercises } = useStore();
  const [location, setLocation] = useState<LocationFilter>('gym');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<string>(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  });

  const plan = workoutPlan;

  const planDays = useMemo(() => {
    if (!plan) return [];
    const grouped: Record<string, WorkoutExercise[]> = {};
    plan.exercises.forEach((ex) => {
      if (!grouped[ex.day]) grouped[ex.day] = [];
      grouped[ex.day].push(ex);
    });
    return Object.entries(grouped).map(([day, exercises]) => ({
      day,
      label: dayLabels[day] || day,
      exercises,
    }));
  }, [plan]);

  const weeklyVolume = useMemo(() => {
    if (!plan) {
      return [
        { muscle: 'Chest', sets: 0, pct: 0, color: 'bg-primary' },
        { muscle: 'Back', sets: 0, pct: 0, color: 'bg-primary' },
        { muscle: 'Legs', sets: 0, pct: 0, color: 'bg-secondary' },
      ];
    }
    const counts: Record<string, number> = {};
    plan.exercises.forEach((ex) => {
      const dbEx = exercises.find((e) => e.id === ex.exerciseId);
      if (dbEx) {
        const group = dbEx.muscleGroup;
        counts[group] = (counts[group] || 0) + ex.sets;
      }
    });
    const maxSets = Math.max(...Object.values(counts), 1);
    return ['chest', 'back', 'legs'].map((muscle) => ({
      muscle: muscleLabels[muscle] || muscle,
      sets: counts[muscle] || 0,
      pct: Math.round(((counts[muscle] || 0) / maxSets) * 100),
      color: muscle === 'legs' ? 'bg-secondary' : 'bg-primary',
    }));
  }, [plan]);

  const progressData = useMemo(() => {
    const now = new Date();
    const data = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - (i * 7));
      const weekStr = `W${4 - i}`;
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      let count = 0;
      for (let j = 0; j < 7; j++) {
        const dd = new Date(weekStart);
        dd.setDate(weekStart.getDate() + j);
        const dateStr = dd.toISOString().split('T')[0];
        const dayExercises = loggedExercises.filter((e) => e.loggedAt.startsWith(dateStr));
        count += dayExercises.length;
      }
      data.push({ week: weekStr, value: count * 50 + 150, height: `${Math.min(20 + count * 10, 100)}%` });
    }
    return data;
  }, [loggedExercises]);

  const generatePlan = () => {
    const newPlan = generateWorkoutPlan({
      profile,
      equipment: location as Equipment,
      daysPerWeek: 3,
    });
    setWorkoutPlan(newPlan);
  };

  const addExerciseToDay = (day: string, exerciseId: string) => {
    if (!plan) return;
    const dbEx = exercises.find((e) => e.id === exerciseId);
    if (!dbEx) return;
    const newExercise: WorkoutExercise = {
      exerciseId: dbEx.id,
      exerciseName: dbEx.name,
      sets: profile.goal === 'gain' ? 4 : 3,
      reps: profile.goal === 'lose' ? 12 : profile.goal === 'gain' ? 8 : 10,
      day,
    };
    setWorkoutPlan({
      ...plan,
      exercises: [...plan.exercises, newExercise],
    });
    setShowAddModal(false);
  };

  const removeExerciseFromDay = (day: string, exerciseId: string) => {
    if (!plan) return;
    setWorkoutPlan({
      ...plan,
      exercises: plan.exercises.filter(
        (e) => !(e.day === day && e.exerciseId === exerciseId)
      ),
    });
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter((e) => {
      if (location === 'gym') return e.equipment === 'gym' || e.equipment === 'none';
      return e.equipment === 'home' || e.equipment === 'none';
    });
  }, [location]);

  return (
    <DashboardLayout title="Weekly Plan" subtitle={plan ? plan.name : 'Generate a plan to get started'}>
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-display-lg font-bold text-on-surface mb-1">
              Weekly Plan
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              {plan ? plan.name : 'Generate a personalized plan based on your profile'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={generatePlan}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              {plan ? 'Regenerate' : 'Generate Plan'}
            </button>
            {plan && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-label-md font-medium hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Exercise
              </button>
            )}
          </div>
        </div>

        {/* Plan Overview Bar */}
        <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-headline-md text-lg text-on-surface">Plan Overview</h2>
                {plan && (
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-label-md text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Focus: {profile.goal === 'lose' ? 'Fat Loss' : profile.goal === 'gain' ? 'Muscle Growth' : 'General Fitness'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {plan?.daysPerWeek || 3} Days/Week
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  Split: {plan?.daysPerWeek === 3 ? 'Push/Pull/Legs' : `${plan?.daysPerWeek || 3}-Day Split`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-surface-container-highest rounded-lg p-1 mr-2">
              <button
                onClick={() => setLocation('gym')}
                className={`px-3 py-1 rounded-md text-label-md text-xs transition-all ${
                  location === 'gym'
                    ? 'bg-surface text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Gym
              </button>
              <button
                onClick={() => setLocation('home')}
                className={`px-3 py-1 rounded-md text-label-md text-xs transition-all ${
                  location === 'home'
                    ? 'bg-surface text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Home
              </button>
            </div>
          </div>
        </div>

        {!plan ? (
          <div className="bg-surface rounded-xl border border-outline-variant p-12 text-center">
            <Dumbbell className="w-16 h-16 mx-auto text-outline mb-4" />
            <h3 className="text-headline-md font-semibold text-on-surface mb-2">
              No Workout Plan Yet
            </h3>
            <p className="text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
              Generate a personalized workout plan based on your profile, goals, and available equipment.
            </p>
            <button
              onClick={generatePlan}
              className="px-6 py-3 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Generate Your Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Main Schedule */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
              {planDays.map((dayPlan) => {
                const isExpanded = expandedDay === dayPlan.day;
                return (
                  <div
                    key={dayPlan.day}
                    className={`bg-surface rounded-xl border border-outline-variant shadow-[0_4px_15px_-3px_rgba(15,23,42,0.04)] overflow-hidden transition-all ${
                      isExpanded ? 'p-4' : 'p-0'
                    }`}
                  >
                    {/* Day Header - Always visible */}
                    <button
                      onClick={() => setExpandedDay(isExpanded ? '' : dayPlan.day)}
                      className={`w-full flex justify-between items-center transition-colors ${
                        isExpanded ? 'pb-3 mb-4 border-b border-outline-variant/50' : 'p-4 hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isExpanded ? 'bg-primary' : 'bg-surface-container-high'}`} />
                        <h3 className="text-headline-md text-on-surface">{dayPlan.day}</h3>
                        <span className="bg-tertiary-container/20 text-tertiary-container px-2 py-1 rounded-full text-label-md text-xs">
                          {dayPlan.label}
                        </span>
                        <span className="text-label-md text-on-surface-variant">
                          {dayPlan.exercises.length} exercises
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpanded && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!plan) return;
                              setWorkoutPlan({
                                ...plan,
                                exercises: plan.exercises.filter((e) => e.day !== dayPlan.day),
                              });
                            }}
                            className="text-on-surface-variant hover:text-error transition-colors p-1"
                          >
                            <Trash2 className="w-5 h-5" />
                          </span>
                        )}
                        <svg
                          className={`w-5 h-5 text-on-surface-variant transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Exercise List - Only when expanded */}
                    {isExpanded && (
                      <div className="flex flex-col gap-2">
                        {dayPlan.exercises.map((exercise) => {
                          const dbEx = exercises.find((e) => e.id === exercise.exerciseId);
                          return (
                            <div
                              key={exercise.exerciseId}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-lowest border border-transparent hover:border-outline-variant transition-all group/item"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                                  <Dumbbell className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className="text-body-md font-semibold text-on-surface">
                                    {exercise.exerciseName}
                                  </h4>
                                  <p className="text-label-md text-on-surface-variant">
                                    {dbEx ? `${muscleLabels[dbEx.muscleGroup]} · ${dbEx.category}` : exercise.day}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-center">
                                  <div className="text-stat-value text-2xl text-on-surface">
                                    {exercise.sets}
                                  </div>
                                  <div className="text-label-md text-on-surface-variant text-xs">
                                    Sets
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-stat-value text-2xl text-on-surface">
                                    {exercise.reps}
                                  </div>
                                  <div className="text-label-md text-on-surface-variant text-xs">
                                    Reps
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => removeExerciseFromDay(dayPlan.day, exercise.exerciseId)}
                                    className="p-1 text-on-surface-variant hover:text-error"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Sidebar */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              {/* Weekly Volume Stats */}
              <div className="bg-surface rounded-xl border border-outline-variant shadow-sm p-4 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-headline-md text-on-surface mb-4 text-lg">Weekly Volume</h3>
                <div className="space-y-3">
                  {weeklyVolume.map((item) => (
                    <div key={item.muscle}>
                      <div className="flex justify-between text-label-md mb-1">
                        <span className="text-on-surface-variant">{item.muscle}</span>
                        <span className="text-on-surface font-semibold">{item.sets} Sets</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="bg-surface rounded-xl border border-outline-variant shadow-sm p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-headline-md text-on-surface text-lg">Progress Tracker</h3>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="h-32 flex items-end gap-2 pt-4">
                  {progressData.map((item, index) => (
                    <div
                      key={item.week}
                      className={`flex-1 rounded-t-sm relative group cursor-pointer transition-colors ${
                        index === progressData.length - 1
                          ? 'bg-primary/80 hover:bg-primary'
                          : 'bg-surface-container hover:bg-surface-container-high'
                      }`}
                      style={{ height: item.height }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-label-md text-on-surface opacity-0 group-hover:opacity-100 transition-opacity bg-surface px-2 py-1 rounded shadow-sm border border-outline-variant/50 text-xs">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-label-md text-on-surface-variant mt-2 text-xs px-2">
                  {progressData.map((item) => (
                    <span key={item.week}>{item.week}</span>
                  ))}
                </div>
                <div className="mt-3 text-center text-label-md text-on-surface-variant text-xs flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  Exercises Logged (total)
                </div>
              </div>

              {/* Workout Timer */}
              <WorkoutTimer />

              {/* Exercise Database Quick Access */}
              <div className="bg-surface rounded-xl border border-outline-variant shadow-sm p-4">
                <h3 className="text-headline-md text-on-surface mb-3 text-lg">Quick Add</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredExercises.slice(0, 8).map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => {
                        if (!plan || planDays.length === 0) return;
                        addExerciseToDay(planDays[0].day, ex.id);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors text-left"
                    >
                      <div>
                        <p className="text-body-sm font-medium text-on-surface">{ex.name}</p>
                        <p className="text-label-md text-on-surface-variant">{muscleLabels[ex.muscleGroup]} · {ex.difficulty}</p>
                      </div>
                      <Plus className="w-4 h-4 text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Exercise Modal */}
        {showAddModal && plan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-outline-variant">
                <h3 className="text-headline-md font-semibold text-on-surface">Add Exercise</h3>
                <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 border-b border-outline-variant">
                <input
                  type="text"
                  placeholder="Search exercises..."
                  onChange={(e) => {
                    const query = e.target.value.toLowerCase();
                    setSelectedExercise(query);
                  }}
                  className="w-full h-10 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md outline-none focus:border-primary"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredExercises
                  .filter((ex) => !selectedExercise || ex.name.toLowerCase().includes(selectedExercise.toLowerCase()))
                  .map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => {
                        if (planDays.length > 0) {
                          addExerciseToDay(planDays[0].day, ex.id);
                        }
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors text-left border border-outline-variant/30"
                    >
                      <div>
                        <p className="text-body-md font-medium text-on-surface">{ex.name}</p>
                        <p className="text-label-md text-on-surface-variant">
                          {muscleLabels[ex.muscleGroup]} · {ex.category} · {ex.difficulty} · {ex.equipment}
                        </p>
                      </div>
                      <Plus className="w-5 h-5 text-primary" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
