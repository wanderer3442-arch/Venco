import { Exercise } from './types';

export const exercises: Exercise[] = [
  // ─── Strength - Chest ────────────────────────────────────────────────────────
  { id: 'bench-press', name: 'Barbell Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 7, instructions: 'Lie on bench, grip bar wider than shoulders, lower to chest, press up.' },
  { id: 'incline-bench', name: 'Incline Bench Press', category: 'strength', muscleGroup: 'chest', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 7, instructions: 'Set bench to 30-45 degrees, press barbell from upper chest.' },
  { id: 'dumbbell-press', name: 'Dumbbell Chest Press', category: 'strength', muscleGroup: 'chest', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 6, instructions: 'Lie on bench, press dumbbells up from chest level.' },
  { id: 'chest-fly', name: 'Cable Chest Fly', category: 'strength', muscleGroup: 'chest', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 5, instructions: 'Stand between cables, arms extended, bring hands together in front.' },
  { id: 'push-ups', name: 'Push-Ups', category: 'strength', muscleGroup: 'chest', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 8, instructions: 'Plank position, lower body to ground, push back up.' },
  { id: 'diamond-push-ups', name: 'Diamond Push-Ups', category: 'strength', muscleGroup: 'chest', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 9, instructions: 'Hands together forming diamond shape, perform push-up.' },
  { id: 'decline-push-ups', name: 'Decline Push-Ups', category: 'strength', muscleGroup: 'chest', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 9, instructions: 'Feet elevated on surface, perform push-up.' },

  // ─── Strength - Back ─────────────────────────────────────────────────────────
  { id: 'deadlift', name: 'Barbell Deadlift', category: 'strength', muscleGroup: 'back', equipment: 'gym', difficulty: 'advanced', caloriesPerMinute: 10, instructions: 'Stand with feet hip-width, grip bar, lift by extending hips and knees.' },
  { id: 'barbell-row', name: 'Barbell Bent-Over Row', category: 'strength', muscleGroup: 'back', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 7, instructions: 'Hinge at hips, pull barbell to lower chest.' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'strength', muscleGroup: 'back', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 6, instructions: 'Pull bar down to upper chest, squeeze lats.' },
  { id: 'seated-row', name: 'Seated Cable Row', category: 'strength', muscleGroup: 'back', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 6, instructions: 'Pull handle to waist, squeeze shoulder blades together.' },
  { id: 'pull-ups', name: 'Pull-Ups', category: 'strength', muscleGroup: 'back', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 9, instructions: 'Hang from bar, pull chin over bar.' },
  { id: 'chin-ups', name: 'Chin-Ups', category: 'strength', muscleGroup: 'back', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 9, instructions: 'Hang from bar with underhand grip, pull chin over bar.' },
  { id: 'superman', name: 'Superman Hold', category: 'strength', muscleGroup: 'back', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Lie face down, lift arms and legs off ground, hold.' },
  { id: 'inverted-row', name: 'Inverted Row', category: 'strength', muscleGroup: 'back', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 6, instructions: 'Lie under bar, pull chest to bar.' },

  // ─── Strength - Shoulders ────────────────────────────────────────────────────
  { id: 'overhead-press', name: 'Barbell Overhead Press', category: 'strength', muscleGroup: 'shoulders', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 7, instructions: 'Press barbell from shoulders to overhead.' },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', category: 'strength', muscleGroup: 'shoulders', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 6, instructions: 'Press dumbbells from shoulder level to overhead.' },
  { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', category: 'strength', muscleGroup: 'shoulders', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Raise dumbbells out to sides until parallel with floor.' },
  { id: 'front-raise', name: 'Dumbbell Front Raise', category: 'strength', muscleGroup: 'shoulders', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Raise dumbbells to front until parallel with floor.' },
  { id: 'reverse-fly', name: 'Reverse Fly', category: 'strength', muscleGroup: 'shoulders', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Bend forward, raise dumbbells out to sides.' },
  { id: 'pike-push-ups', name: 'Pike Push-Ups', category: 'strength', muscleGroup: 'shoulders', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 8, instructions: 'Inverted V position, lower head toward ground, push back up.' },

  // ─── Strength - Biceps ───────────────────────────────────────────────────────
  { id: 'barbell-curl', name: 'Barbell Bicep Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Curl barbell from thighs to shoulders.' },
  { id: 'dumbbell-curl', name: 'Dumbbell Bicep Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Curl dumbbells alternating or together.' },
  { id: 'hammer-curl', name: 'Hammer Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Curl dumbbells with neutral grip.' },
  { id: 'preacher-curl', name: 'Preacher Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 5, instructions: 'Curl barbell on preacher bench.' },
  { id: 'concentration-curl', name: 'Concentration Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 4, instructions: 'Seated, curl dumbbell with arm resting on thigh.' },
  { id: 'curl-ups', name: 'Resistance Band Curl', category: 'strength', muscleGroup: 'biceps', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 4, instructions: 'Stand on band, curl handles to shoulders.' },

  // ─── Strength - Triceps ──────────────────────────────────────────────────────
  { id: 'tricep-pushdown', name: 'Cable Tricep Pushdown', category: 'strength', muscleGroup: 'triceps', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Push cable down until arms are fully extended.' },
  { id: 'skull-crushers', name: 'Skull Crushers', category: 'strength', muscleGroup: 'triceps', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 6, instructions: 'Lower barbell to forehead, extend arms.' },
  { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', category: 'strength', muscleGroup: 'triceps', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Hold dumbbell overhead, lower behind head, extend.' },
  { id: 'dips', name: 'Tricep Dips', category: 'strength', muscleGroup: 'triceps', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 8, instructions: 'Lower body on parallel bars, push back up.' },
  { id: 'tricep-pushdown-home', name: 'Chair Dips', category: 'strength', muscleGroup: 'triceps', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 6, instructions: 'Hands on chair edge, lower body, push back up.' },
  { id: 'diamond-pushups-tri', name: 'Close-Grip Push-Ups', category: 'strength', muscleGroup: 'triceps', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 8, instructions: 'Hands close together, perform push-up focusing on triceps.' },

  // ─── Strength - Legs ─────────────────────────────────────────────────────────
  { id: 'squat', name: 'Barbell Back Squat', category: 'strength', muscleGroup: 'legs', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 9, instructions: 'Bar on back, squat down until thighs parallel, stand up.' },
  { id: 'front-squat', name: 'Front Squat', category: 'strength', muscleGroup: 'legs', equipment: 'gym', difficulty: 'advanced', caloriesPerMinute: 9, instructions: 'Bar on front of shoulders, squat down, stand up.' },
  { id: 'leg-press', name: 'Leg Press', category: 'strength', muscleGroup: 'legs', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 7, instructions: 'Push platform away with legs, lower with control.' },
  { id: 'leg-curl', name: 'Leg Curl', category: 'strength', muscleGroup: 'legs', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Curl weight up with hamstrings.' },
  { id: 'leg-extension', name: 'Leg Extension', category: 'strength', muscleGroup: 'legs', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Extend legs to lift weight.' },
  { id: 'calf-raise', name: 'Calf Raise', category: 'strength', muscleGroup: 'legs', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 4, instructions: 'Rise up on toes, lower with control.' },
  { id: 'lunges', name: 'Walking Lunges', category: 'strength', muscleGroup: 'legs', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 8, instructions: 'Step forward, lower back knee toward ground, alternate.' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'strength', muscleGroup: 'legs', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 8, instructions: 'Rear foot elevated, squat down on front leg.' },
  { id: 'glute-bridge', name: 'Glute Bridge', category: 'strength', muscleGroup: 'legs', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Lie on back, lift hips until body forms straight line.' },
  { id: 'wall-sit', name: 'Wall Sit', category: 'strength', muscleGroup: 'legs', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 6, instructions: 'Lean against wall, thighs parallel to ground, hold.' },
  { id: 'step-ups', name: 'Step-Ups', category: 'strength', muscleGroup: 'legs', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 7, instructions: 'Step onto elevated surface, drive knee up, alternate.' },

  // ─── Strength - Core ─────────────────────────────────────────────────────────
  { id: 'plank', name: 'Plank', category: 'strength', muscleGroup: 'core', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Hold push-up position on forearms, keep body straight.' },
  { id: 'side-plank', name: 'Side Plank', category: 'strength', muscleGroup: 'core', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Lie on side, lift hips, hold body in straight line.' },
  { id: 'crunches', name: 'Crunches', category: 'strength', muscleGroup: 'core', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 5, instructions: 'Lie on back, curl shoulders toward hips.' },
  { id: 'russian-twist', name: 'Russian Twist', category: 'strength', muscleGroup: 'core', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 6, instructions: 'Seated, lean back slightly, rotate torso side to side.' },
  { id: 'leg-raise', name: 'Leg Raise', category: 'strength', muscleGroup: 'core', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 6, instructions: 'Lie on back, raise legs to 90 degrees, lower slowly.' },
  { id: 'mountain-climbers', name: 'Mountain Climbers', category: 'strength', muscleGroup: 'core', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 10, instructions: 'Plank position, alternate driving knees to chest.' },
  { id: 'ab-rollout', name: 'Ab Rollout', category: 'strength', muscleGroup: 'core', equipment: 'gym', difficulty: 'advanced', caloriesPerMinute: 7, instructions: 'Kneel, roll wheel forward, pull back to start.' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', category: 'strength', muscleGroup: 'core', equipment: 'gym', difficulty: 'advanced', caloriesPerMinute: 7, instructions: 'Hang from bar, raise legs to parallel, lower slowly.' },
  { id: 'dead-bug', name: 'Dead Bug', category: 'strength', muscleGroup: 'core', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 4, instructions: 'Lie on back, extend opposite arm and leg, alternate.' },
  { id: 'bird-dog', name: 'Bird Dog', category: 'strength', muscleGroup: 'core', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 4, instructions: 'On all fours, extend opposite arm and leg, hold.' },

  // ─── Strength - Full Body ────────────────────────────────────────────────────
  { id: 'burpees', name: 'Burpees', category: 'strength', muscleGroup: 'full_body', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 12, instructions: 'Squat, jump back to plank, push-up, jump forward, jump up.' },
  { id: 'clean-and-press', name: 'Clean and Press', category: 'strength', muscleGroup: 'full_body', equipment: 'gym', difficulty: 'advanced', caloriesPerMinute: 10, instructions: 'Lift barbell from ground to shoulders, press overhead.' },
  { id: 'thrusters', name: 'Thrusters', category: 'strength', muscleGroup: 'full_body', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 11, instructions: 'Squat with dumbbells, press up as you stand.' },
  { id: 'turkish-getup', name: 'Turkish Get-Up', category: 'strength', muscleGroup: 'full_body', equipment: 'gym', difficulty: 'advanced', caloriesPerMinute: 8, instructions: 'Lie down with weight, stand up while keeping weight overhead.' },

  // ─── Cardio ──────────────────────────────────────────────────────────────────
  { id: 'running', name: 'Running', category: 'cardio', muscleGroup: 'full_body', equipment: 'none', difficulty: 'beginner', caloriesPerMinute: 11, instructions: 'Run at moderate pace.' },
  { id: 'cycling', name: 'Cycling', category: 'cardio', muscleGroup: 'legs', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 8, instructions: 'Cycle at moderate intensity.' },
  { id: 'rowing', name: 'Rowing', category: 'cardio', muscleGroup: 'full_body', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 10, instructions: 'Row at moderate intensity.' },
  { id: 'jump-rope', name: 'Jump Rope', category: 'cardio', muscleGroup: 'full_body', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 12, instructions: 'Jump rope at moderate pace.' },
  { id: 'swimming', name: 'Swimming', category: 'cardio', muscleGroup: 'full_body', equipment: 'none', difficulty: 'beginner', caloriesPerMinute: 9, instructions: 'Swim laps at moderate pace.' },
  { id: 'stair-climbing', name: 'Stair Climbing', category: 'cardio', muscleGroup: 'legs', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 9, instructions: 'Climb stairs at moderate pace.' },
  { id: 'elliptical', name: 'Elliptical', category: 'cardio', muscleGroup: 'full_body', equipment: 'gym', difficulty: 'beginner', caloriesPerMinute: 8, instructions: 'Use elliptical at moderate intensity.' },
  { id: 'brisk-walking', name: 'Brisk Walking', category: 'cardio', muscleGroup: 'full_body', equipment: 'none', difficulty: 'beginner', caloriesPerMinute: 6, instructions: 'Walk at brisk pace.' },

  // ─── HIIT ────────────────────────────────────────────────────────────────────
  { id: 'hiit-sprints', name: 'Sprint Intervals', category: 'hiit', muscleGroup: 'full_body', equipment: 'none', difficulty: 'intermediate', caloriesPerMinute: 14, instructions: 'Sprint 30s, rest 30s, repeat.' },
  { id: 'tabata', name: 'Tabata Training', category: 'hiit', muscleGroup: 'full_body', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 13, instructions: '20s work, 10s rest, 8 rounds.' },
  { id: 'hiit-circuit', name: 'HIIT Circuit', category: 'hiit', muscleGroup: 'full_body', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 12, instructions: '40s work, 20s rest, 5 exercises, 3 rounds.' },
  { id: 'jumping-jacks-hiit', name: 'Jumping Jack Intervals', category: 'hiit', muscleGroup: 'full_body', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 10, instructions: '45s jumping jacks, 15s rest, repeat.' },
  { id: 'squat-jumps', name: 'Squat Jumps', category: 'hiit', muscleGroup: 'legs', equipment: 'home', difficulty: 'intermediate', caloriesPerMinute: 11, instructions: 'Squat down, explode up into jump.' },
  { id: 'high-knees', name: 'High Knees', category: 'hiit', muscleGroup: 'full_body', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 10, instructions: 'Run in place, driving knees high.' },
  { id: 'box-jumps', name: 'Box Jumps', category: 'hiit', muscleGroup: 'legs', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 11, instructions: 'Jump onto box, step down, repeat.' },
  { id: 'battle-ropes', name: 'Battle Ropes', category: 'hiit', muscleGroup: 'full_body', equipment: 'gym', difficulty: 'intermediate', caloriesPerMinute: 12, instructions: 'Alternating waves with ropes.' },

  // ─── Flexibility ─────────────────────────────────────────────────────────────
  { id: 'yoga-sun-salutation', name: 'Sun Salutation', category: 'flexibility', muscleGroup: 'full_body', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 4, instructions: 'Flow through 12 yoga poses.' },
  { id: 'hip-flexor-stretch', name: 'Hip Flexor Stretch', category: 'flexibility', muscleGroup: 'legs', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 3, instructions: 'Kneeling lunge, push hips forward.' },
  { id: 'hamstring-stretch', name: 'Hamstring Stretch', category: 'flexibility', muscleGroup: 'legs', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 3, instructions: 'Sit with legs extended, reach toward toes.' },
  { id: 'chest-stretch', name: 'Chest Stretch', category: 'flexibility', muscleGroup: 'chest', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 3, instructions: 'Arms behind back, lift chest.' },
  { id: 'cat-cow', name: 'Cat-Cow Stretch', category: 'flexibility', muscleGroup: 'back', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 3, instructions: 'On all fours, alternate arching and rounding back.' },
  { id: 'child-pose', name: 'Child\'s Pose', category: 'flexibility', muscleGroup: 'back', equipment: 'home', difficulty: 'beginner', caloriesPerMinute: 2, instructions: 'Kneel, sit back on heels, stretch arms forward.' },
];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}

export function getExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
  return exercises.filter(e => e.muscleGroup === muscleGroup);
}

export function getExercisesByEquipment(equipment: string): Exercise[] {
  return exercises.filter(e => e.equipment === equipment);
}

export function getExercisesByCategory(category: string): Exercise[] {
  return exercises.filter(e => e.category === category);
}

export function getExercisesByDifficulty(difficulty: string): Exercise[] {
  return exercises.filter(e => e.difficulty === difficulty);
}
