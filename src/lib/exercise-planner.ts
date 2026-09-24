import { Profile, WorkoutPlan, WorkoutExercise, Exercise, Equipment, Goal } from './types';
import { exercises, getExercisesByMuscleGroup, getExercisesByEquipment, getExercisesByCategory } from './exercise-database';
import { calculateBMI, calculateBMR, calculateTDEE } from './calculations';

export interface ExercisePlanInput {
  profile: Profile;
  equipment: Equipment;
  daysPerWeek: number;
  customSplit?: string[][];
}

export function generateWorkoutPlan(input: ExercisePlanInput): WorkoutPlan {
  const { profile, equipment, daysPerWeek, customSplit } = input;
  const split =
    customSplit && customSplit.length > 0 ? customSplit : getDefaultSplit(daysPerWeek);
  const effectiveDays = split.length;

  if (!profile.weight || !profile.height || !profile.activityLevel || !profile.goal) {
    return {
      id: `plan-${Date.now()}`,
      name: 'Incomplete Profile',
      goal: 'maintain',
      equipment,
      daysPerWeek: effectiveDays,
      exercises: [],
      isGenerated: true,
      split,
    };
  }

  const bmi = calculateBMI(profile.weight, profile.height);
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  const difficulty = getDifficultyLevel(profile, bmi);
  const exercisesForPlan = getExercisesForPlan(equipment, difficulty);

  const workoutExercises: WorkoutExercise[] = [];

  split.forEach((muscleGroups, dayIndex) => {
    const dayName = getDayName(dayIndex);
    muscleGroups.forEach(muscleGroup => {
      const muscleExercises = exercisesForPlan.filter(e => e.muscleGroup === muscleGroup);
      const selected = selectExercises(muscleExercises, getExercisesPerMuscle(effectiveDays));

      selected.forEach(exercise => {
        const { sets, reps, duration } = getSetsReps(exercise, profile.goal!, difficulty);
        const weight = getDefaultWeight(exercise);
        workoutExercises.push({
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          sets,
          reps,
          duration,
          ...(weight !== undefined ? { weight } : {}),
          day: dayName,
        });
      });
    });
  });

  return {
    id: `plan-${Date.now()}`,
    name: getPlanName(profile.goal, effectiveDays),
    goal: profile.goal,
    equipment,
    daysPerWeek: effectiveDays,
    exercises: workoutExercises,
    isGenerated: true,
    split,
  };
}

function getDifficultyLevel(profile: Profile, bmi: { value: number; category: string }): 'beginner' | 'intermediate' | 'advanced' {
  if (profile.activityLevel === 'sedentary' || bmi.value > 30) return 'beginner';
  if (profile.activityLevel === 'very_active' || profile.activityLevel === 'extra_active') return 'advanced';
  return 'intermediate';
}

export const PLAN_DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const MUSCLE_GROUP_OPTIONS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'legs',
  'core',
  'full_body',
] as const;

export function getDefaultSplit(daysPerWeek: number): string[][] {
  const splits: Record<number, string[][]> = {
    2: [
      ['chest', 'back', 'core'],
      ['legs', 'shoulders', 'core'],
    ],
    3: [
      ['chest', 'triceps'],
      ['back', 'biceps'],
      ['legs', 'shoulders', 'core'],
    ],
    4: [
      ['chest', 'back'],
      ['legs', 'core'],
      ['shoulders', 'biceps', 'triceps'],
      ['legs', 'core'],
    ],
    5: [
      ['chest', 'triceps'],
      ['back', 'biceps'],
      ['legs'],
      ['shoulders', 'core'],
      ['full_body'],
    ],
    6: [
      ['chest'],
      ['back'],
      ['legs'],
      ['shoulders'],
      ['biceps', 'triceps'],
      ['core', 'full_body'],
    ],
  };
  return (splits[Math.min(daysPerWeek, 6)] || splits[3]).map((day) => [...day]);
}

function getDayName(dayIndex: number): string {
  return PLAN_DAY_NAMES[dayIndex] || `Day ${dayIndex + 1}`;
}

const BODYWEIGHT_RE = /push-up|pull-up|chin-up|dip|plank|crunch|lunge|bridge|wall sit|superman|bird|dead bug|leg raise|hold|step-up|mountain|burpee|pike|inverted|chair dip|sit-up|twist|rollout|hanging/i;

export function getDefaultWeight(exercise: Exercise): number | undefined {
  if (exercise.category !== 'strength') return undefined;
  const n = exercise.name.toLowerCase();
  if (BODYWEIGHT_RE.test(n)) return undefined;
  if (n.includes('barbell') || n.includes('deadlift') || n.includes('leg press')) return 40;
  if (n.includes('dumbbell')) return 10;
  if (exercise.equipment === 'gym') return 20;
  return undefined;
}

function getExercisesPerMuscle(daysPerWeek: number): number {
  if (daysPerWeek <= 3) return 4;
  if (daysPerWeek <= 5) return 3;
  return 2;
}

function getExercisesForPlan(equipment: Equipment, difficulty: string): Exercise[] {
  let filtered = getExercisesByEquipment(equipment);

  if (equipment === 'home') {
    filtered = [...filtered, ...getExercisesByEquipment('none')];
  }

  filtered = filtered.filter(e => {
    if (difficulty === 'beginner') return e.difficulty === 'beginner' || e.difficulty === 'intermediate';
    if (difficulty === 'intermediate') return true;
    return true;
  });

  return filtered;
}

function selectExercises(exercises: Exercise[], count: number): Exercise[] {
  const shuffled = [...exercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function getSetsReps(exercise: Exercise, goal: Goal, difficulty: string): { sets: number; reps: number; duration?: number } {
  if (exercise.category === 'cardio' || exercise.category === 'hiit') {
    const duration = goal === 'lose' ? 30 : goal === 'gain' ? 20 : 25;
    return { sets: 1, reps: 1, duration };
  }

  if (exercise.category === 'flexibility') {
    return { sets: 1, reps: 1, duration: 10 };
  }

  switch (goal) {
    case 'lose':
      return { sets: 3, reps: 12 };
    case 'gain':
      return { sets: 4, reps: 8 };
    default:
      return { sets: 3, reps: 10 };
  }
}

function getPlanName(goal: Goal, daysPerWeek: number): string {
  const goalNames: Record<Goal, string> = {
    lose: 'Fat Loss',
    maintain: 'General Fitness',
    gain: 'Muscle Building',
  };
  return `${goalNames[goal]} - ${daysPerWeek} Day Split`;
}

export function calculateWorkoutCalories(plan: WorkoutPlan, weight: number): number {
  let totalCalories = 0;

  plan.exercises.forEach(exercise => {
    const dbExercise = exercises.find(e => e.id === exercise.exerciseId);
    if (dbExercise) {
      const minutes = exercise.duration || (exercise.sets * exercise.reps * 0.1);
      totalCalories += dbExercise.caloriesPerMinute * minutes;
    }
  });

  return Math.round(totalCalories * (weight / 70));
}

export function getWeeklyWorkoutSummary(plan: WorkoutPlan): { day: string; exercises: number; estimatedCalories: number }[] {
  const days = [...new Set(plan.exercises.map(e => e.day))];

  return days.map(day => {
    const dayExercises = plan.exercises.filter(e => e.day === day);
    const estimatedCalories = dayExercises.reduce((total, ex) => {
      const dbExercise = exercises.find(e => e.id === ex.exerciseId);
      if (dbExercise) {
        const minutes = ex.duration || (ex.sets * ex.reps * 0.1);
        return total + (dbExercise.caloriesPerMinute * minutes);
      }
      return total;
    }, 0);

    return {
      day,
      exercises: dayExercises.length,
      estimatedCalories: Math.round(estimatedCalories),
    };
  });
}
