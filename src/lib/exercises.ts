export type Muscle = "chest" | "back" | "legs" | "shoulders" | "arms" | "core" | "full";
export type Equipment = "bodyweight" | "dumbbell" | "barbell" | "cable" | "machine" | "band";
export type Goal = "fat_loss" | "lean_bulk" | "maintenance";

export type ExerciseDef = {
  id: string;
  name: string;
  muscle: Muscle;
  equipment: Equipment;
  description: string;
  contraindication?: string; // reason to warn
};

export const EXERCISES: ExerciseDef[] = [
  { id: "pushup", name: "Push-up", muscle: "chest", equipment: "bodyweight", description: "Chest + triceps" },
  { id: "bench", name: "Barbell Bench Press", muscle: "chest", equipment: "barbell", description: "Compound chest" },
  { id: "incline_db", name: "Incline Dumbbell Press", muscle: "chest", equipment: "dumbbell", description: "Upper chest" },
  { id: "fly", name: "Cable Fly", muscle: "chest", equipment: "cable", description: "Isolation" },
  { id: "pullup", name: "Pull-up", muscle: "back", equipment: "bodyweight", description: "Lats" },
  { id: "row_bb", name: "Barbell Row", muscle: "back", equipment: "barbell", description: "Compound back" },
  { id: "lat_pulldown", name: "Lat Pulldown", muscle: "back", equipment: "machine", description: "Lats, beginner friendly" },
  { id: "deadlift", name: "Deadlift", muscle: "back", equipment: "barbell", description: "Posterior chain", contraindication: "Avoid if low back pain or poor form; start with hip hinge" },
  { id: "squat", name: "Barbell Squat", muscle: "legs", equipment: "barbell", description: "Quads/glutes" },
  { id: "lunge", name: "Walking Lunge", muscle: "legs", equipment: "dumbbell", description: "Unilateral" },
  { id: "leg_press", name: "Leg Press", muscle: "legs", equipment: "machine", description: "Machine squat alternative" },
  { id: "rdl", name: "Romanian Deadlift", muscle: "legs", equipment: "dumbbell", description: "Hamstrings" },
  { id: "ohp", name: "Overhead Press", muscle: "shoulders", equipment: "barbell", description: "Shoulders", contraindication: "Shoulder impingement → try Landmine Press" },
  { id: "lateral", name: "Lateral Raise", muscle: "shoulders", equipment: "dumbbell", description: "Side delts" },
  { id: "face_pull", name: "Face Pull", muscle: "shoulders", equipment: "cable", description: "Rear delts, posture" },
  { id: "bicep_curl", name: "Dumbbell Curl", muscle: "arms", equipment: "dumbbell", description: "Biceps" },
  { id: "tricep_push", name: "Triceps Pushdown", muscle: "arms", equipment: "cable", description: "Triceps" },
  { id: "plank", name: "Plank", muscle: "core", equipment: "bodyweight", description: "Core stability" },
  { id: "crunch", name: "Crunch", muscle: "core", equipment: "bodyweight", description: "Abs" },
  { id: "russian", name: "Russian Twist", muscle: "core", equipment: "bodyweight", description: "Obliques" },
  { id: "burpee", name: "Burpee", muscle: "full", equipment: "bodyweight", description: "Full body HIIT", contraindication: "High impact — avoid if BMI>32 or knee pain; try Step-up" },
  { id: "mountain", name: "Mountain Climber", muscle: "full", equipment: "bodyweight", description: "Cardio core" },
  { id: "stepup", name: "Step-up", muscle: "legs", equipment: "bodyweight", description: "Low impact leg" },
  { id: "hip_thrust", name: "Hip Thrust", muscle: "legs", equipment: "barbell", description: "Glutes" },
  { id: "leg_curl", name: "Leg Curl", muscle: "legs", equipment: "machine", description: "Hamstrings isolation" },
  { id: "chest_press_m", name: "Machine Chest Press", muscle: "chest", equipment: "machine", description: "Beginner chest" },
  { id: "seated_row", name: "Seated Cable Row", muscle: "back", equipment: "cable", description: "Back" },
  { id: "arnold", name: "Arnold Press", muscle: "shoulders", equipment: "dumbbell", description: "Shoulders" },
  { id: "hammer", name: "Hammer Curl", muscle: "arms", equipment: "dumbbell", description: "Brachialis" },
  { id: "dip", name: "Dip", muscle: "chest", equipment: "bodyweight", description: "Chest/triceps", contraindication: "Shoulder strain → do Bench Dip" },
  // Home-specific (no gym) — bodyweight/band/dumbbell only
  { id: "bw_squat", name: "Bodyweight Squat", muscle: "legs", equipment: "bodyweight", description: "Home legs, no equipment" },
  { id: "glute_bridge", name: "Glute Bridge", muscle: "legs", equipment: "bodyweight", description: "Glutes, floor" },
  { id: "pike_pushup", name: "Pike Push-up", muscle: "shoulders", equipment: "bodyweight", description: "Home shoulders" },
  { id: "band_row", name: "Band Row", muscle: "back", equipment: "band", description: "Back with resistance band" },
  { id: "band_pullapart", name: "Band Pull-apart", muscle: "shoulders", equipment: "band", description: "Rear delts, band" },
  { id: "goblet_squat", name: "Goblet Squat", muscle: "legs", equipment: "dumbbell", description: "Dumbbell front squat, home friendly" },
  { id: "jumping_jack", name: "Jumping Jack", muscle: "full", equipment: "bodyweight", description: "Cardio warm-up", contraindication: "High impact — knee pain → March in place" },
  { id: "door_row", name: "Doorframe Row", muscle: "back", equipment: "bodyweight", description: "Back, use sturdy door" },
  { id: "floor_press", name: "Floor Press", muscle: "chest", equipment: "dumbbell", description: "Chest, floor dumbbells" },
  { id: "bird_dog", name: "Bird Dog", muscle: "core", equipment: "bodyweight", description: "Core stability, home" },
];

export type PlannedExercise = ExerciseDef & { sets: number; reps: string; rpe?: number };
export type DayPlan = { day: string; title: string; exercises: PlannedExercise[] };
export type Plan = { name: string; goal: Goal; days: DayPlan[]; note?: string };

function setsFor(goal: Goal, muscle: Muscle): { sets: number; reps: string } {
  if (goal === "fat_loss") {
    if (muscle === "full") return { sets: 3, reps: "30s on/15s off x3" };
    return { sets: 3, reps: "12-15" };
  }
  if (goal === "lean_bulk") {
    if (["chest", "back", "legs"].includes(muscle)) return { sets: 4, reps: "6-10" };
    return { sets: 3, reps: "8-12" };
  }
  // maintenance
  return { sets: 3, reps: "8-12" };
}

export function generateAutoPlan(goal: Goal): Plan {
  if (goal === "fat_loss") {
    return {
      name: "Auto — Fat Loss (Full Body 3× + HIIT)",
      goal,
      note: "Deficit 300-500 kcal: 3 full-body + daily 8k steps. Adjust ±100 kcal if weekly Δ off.",
      days: [
        { day: "Mon", title: "Full Body A", exercises: ["squat", "pushup", "row_bb", "plank", "burpee"].map((id) => withSets(id, goal)) },
        { day: "Wed", title: "Full Body B", exercises: ["lunge", "bench", "lat_pulldown", "russian", "mountain"].map((id) => withSets(id, goal)) },
        { day: "Fri", title: "Full Body C + Core", exercises: ["deadlift", "incline_db", "seated_row", "hip_thrust", "plank"].map((id) => withSets(id, goal)) },
      ],
    };
  }
  if (goal === "lean_bulk") {
    return {
      name: "Auto — Lean Bulk (PPL 6×)",
      goal,
      note: "Surplus 350 kcal, protein 1.9 g/kg. Progressive overload 2.5%/wk.",
      days: [
        { day: "Mon", title: "Push", exercises: ["bench", "ohp", "incline_db", "tricep_push", "lateral"].map((id) => withSets(id, goal)) },
        { day: "Tue", title: "Pull", exercises: ["pullup", "row_bb", "lat_pulldown", "bicep_curl", "face_pull"].map((id) => withSets(id, goal)) },
        { day: "Wed", title: "Legs", exercises: ["squat", "rdl", "hip_thrust", "leg_curl", "plank"].map((id) => withSets(id, goal)) },
        { day: "Thu", title: "Push", exercises: ["incline_db", "arnold", "fly", "dip", "lateral"].map((id) => withSets(id, goal)) },
        { day: "Fri", title: "Pull", exercises: ["deadlift", "seated_row", "hammer", "face_pull", "crunch"].map((id) => withSets(id, goal)) },
        { day: "Sat", title: "Legs", exercises: ["leg_press", "lunge", "rdl", "stepup", "plank"].map((id) => withSets(id, goal)) },
      ],
    };
  }
  return {
    name: "Auto — Maintenance (Upper/Lower 4×)",
    goal,
    note: "At TDEE. 4 days, moderate volume.",
    days: [
      { day: "Mon", title: "Upper", exercises: ["bench", "row_bb", "ohp", "bicep_curl", "tricep_push"].map((id) => withSets(id, goal)) },
      { day: "Tue", title: "Lower", exercises: ["squat", "rdl", "lunge", "leg_curl", "plank"].map((id) => withSets(id, goal)) },
      { day: "Thu", title: "Upper", exercises: ["incline_db", "lat_pulldown", "lateral", "hammer", "face_pull"].map((id) => withSets(id, goal)) },
      { day: "Fri", title: "Lower", exercises: ["leg_press", "hip_thrust", "stepup", "russian", "plank"].map((id) => withSets(id, goal)) },
    ],
  };
}

function withSets(id: string, goal: Goal): PlannedExercise {
  const def = EXERCISES.find((e) => e.id === id)!;
  const { sets, reps } = setsFor(goal, def.muscle);
  return { ...def, sets, reps };
}

export const TEMPLATES: Plan[] = [
  generateAutoPlan("fat_loss"),
  generateAutoPlan("lean_bulk"),
  generateAutoPlan("maintenance"),
  {
    name: "Template — Home Dumbbell (3×)",
    goal: "maintenance",
    days: [
      { day: "Mon", title: "Home A", exercises: ["pushup", "band_row", "goblet_squat", "plank"].map((id) => withSets(id, "maintenance")) },
      { day: "Wed", title: "Home B", exercises: ["floor_press", "rdl", "lateral", "russian"].map((id) => withSets(id, "maintenance")) },
      { day: "Fri", title: "Home C", exercises: ["glute_bridge", "bicep_curl", "pike_pushup", "stepup"].map((id) => withSets(id, "maintenance")) },
    ],
  },
  {
    name: "Template — Home Bodyweight Only (No Gym) 3×",
    goal: "fat_loss",
    days: [
      { day: "Mon", title: "Home Full A", exercises: ["bw_squat", "pushup", "door_row", "plank"].map((id) => withSets(id, "fat_loss")) },
      { day: "Wed", title: "Home Full B", exercises: ["glute_bridge", "pike_pushup", "bird_dog", "mountain"].map((id) => withSets(id, "fat_loss")) },
      { day: "Fri", title: "Home Full C", exercises: ["stepup", "band_pullapart", "jumping_jack", "crunch"].map((id) => withSets(id, "fat_loss")) },
    ],
  },
  {
    name: "Template — Home Band+Dumbbell 4×",
    goal: "maintenance",
    days: [
      { day: "Mon", title: "Upper Home", exercises: ["floor_press", "band_row", "pike_pushup", "hammer"].map((id) => withSets(id, "maintenance")) },
      { day: "Tue", title: "Lower Home", exercises: ["goblet_squat", "rdl", "glute_bridge", "plank"].map((id) => withSets(id, "maintenance")) },
      { day: "Thu", title: "Upper Home", exercises: ["pushup", "door_row", "lateral", "bird_dog"].map((id) => withSets(id, "maintenance")) },
      { day: "Fri", title: "Lower Home", exercises: ["bw_squat", "hip_thrust", "stepup", "russian"].map((id) => withSets(id, "maintenance")) },
    ],
  },
  {
    name: "Template — Minimal (2×, busy)",
    goal: "fat_loss",
    days: [
      { day: "Mon", title: "Full", exercises: ["bw_squat", "pushup", "band_row", "plank"].map((id) => withSets(id, "fat_loss")) },
      { day: "Thu", title: "Full", exercises: ["glute_bridge", "floor_press", "door_row", "mountain"].map((id) => withSets(id, "fat_loss")) },
    ],
  },
];

export function calibrateExercise(exerciseId: string, goal: Goal, bmi?: number): { sets: number; reps: string; warning?: string } {
  const def = EXERCISES.find((e) => e.id === exerciseId);
  if (!def) return { sets: 3, reps: "10" };
  const { sets, reps } = setsFor(goal, def.muscle);
  let warning: string | undefined;
  if (def.contraindication) warning = def.contraindication;
  if (bmi && bmi > 30 && ["burpee", "mountain", "lunge"].includes(exerciseId)) {
    warning = (warning ? warning + " • " : "") + "BMI >30: prefer low-impact (Step-up, Leg Press).";
  }
  if (def.equipment === "barbell" && goal === "fat_loss") {
    warning = (warning ? warning + " • " : "") + "Fat loss: consider dumbbell for higher rep control.";
  }
  return { sets, reps, warning };
}
