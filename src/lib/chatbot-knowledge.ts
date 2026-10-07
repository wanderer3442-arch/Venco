// ═══════════════════════════════════════════════════════════════════════════════
// GYM AT HOME — CERTIFIED HEALTH, NUTRITION & EXERCISE KNOWLEDGE BASE
// Sources: WHO, CDC, ACSM, AHA, USDA, ICMR-NIN (India), NASM, ACE, Harvard T.H. Chan School
// ═══════════════════════════════════════════════════════════════════════════════

// ─── NUTRITION GUIDELINES (USDA DRI / WHO) ──────────────────────────────────

export const MACRO_GUIDELINES = {
  protein: {
    sedentary: { min: 0.8, max: 1.0, unit: 'g/kg/day', source: 'WHO/FAO 2007' },
    moderate: { min: 1.2, max: 1.6, unit: 'g/kg/day', source: 'ACSM 2016' },
    athlete: { min: 1.6, max: 2.2, unit: 'g/kg/day', source: 'ISSN 2017' },
    muscleGain: { min: 1.6, max: 2.2, unit: 'g/kg/day', source: 'ISSN Position Stand' },
    fatLoss: { min: 1.8, max: 2.4, unit: 'g/kg/day', source: 'Helms et al. 2014' },
    elderly: { min: 1.0, max: 1.2, unit: 'g/kg/day', source: 'PROT-AGE Study Group' },
  },
  carbs: {
    sedentary: { min: 3, max: 5, unit: 'g/kg/day', source: 'IOM 2005' },
    moderate: { min: 5, max: 7, unit: 'g/kg/day', source: 'ACSM 2016' },
    athlete: { min: 6, max: 10, unit: 'g/kg/day', source: 'ACSM/AND/DC 2016' },
    endurance: { min: 6, max: 10, unit: 'g/kg/day', source: 'ACSM Position Stand' },
    highIntensity: { min: 8, max: 12, unit: 'g/kg/day', source: 'Burke et al. 2011' },
  },
  fat: {
    general: { min: 0.8, max: 1.0, unit: 'g/kg/day', source: 'IOM 2005' },
    minimum: { min: 0.5, max: 0.8, unit: 'g/kg/day', source: 'WHO minimum' },
    percentCalories: { min: 20, max: 35, unit: '%', source: 'IOM AMDR' },
    athlete: { min: 20, max: 35, unit: '%', source: 'ACSM' },
  },
  fiber: {
    men: { target: 38, unit: 'g/day', source: 'IOM 2005' },
    women: { target: 25, unit: 'g/day', source: 'IOM 2005' },
  },
  water: {
    men: { target: 3.7, unit: 'L/day', source: 'IOM 2004' },
    women: { target: 2.7, unit: 'L/day', source: 'IOM 2004' },
    exercise: { additional: '500-1000 mL per hour of exercise', source: 'ACSM' },
  },
} as const;

// ─── INDIAN NUTRITION GUIDELINES (ICMR-NIN 2020 / DGI 2024) ─────────────────

export const INDIAN_GUIDELINES = {
  protein: {
    rda: { value: 0.83, unit: 'g/kg/day', note: 'safe intake for healthy sedentary adults (EAR 0.66)', source: 'ICMR-NIN 2020' },
    sedentaryAdults: { men: 54, women: 46, unit: 'g/day', source: 'ICMR-NIN 2020' },
    training: { min: 1.6, max: 2.2, unit: 'g/kg/day', note: 'DGI 2024: intakes above 1.6 g/kg add no further strength gains', source: 'ISSN 2017 / ICMR-NIN DGI 2024' },
  },
  macros: {
    carbohydrate: { min: 50, max: 55, unit: '% energy', source: 'ICMR-NIN DGI 2024' },
    protein: { min: 10, max: 15, unit: '% energy', source: 'ICMR-NIN DGI 2024' },
    fat: { min: 20, max: 30, unit: '% energy', source: 'ICMR-NIN DGI 2024' },
  },
  limits: {
    sugar: { max: 25, unit: 'g/day (or <5% of energy)', source: 'ICMR-NIN DGI 2024' },
    salt: { max: 5, unit: 'g/day', source: 'ICMR-NIN DGI 2024 / WHO' },
    cookingOil: { range: '25-30', unit: 'g/day', source: 'ICMR-NIN DGI 2024' },
  },
  fiber: { target: 30, unit: 'g/day (~40 g per 2000 kcal)', source: 'ICMR-NIN 2020' },
  calcium: { target: 1000, unit: 'mg/day adults', source: 'ICMR-NIN 2020' },
  myPlateForDay: {
    note: 'ICMR-NIN "My Plate for the Day" for a 2000 kcal day',
    foods: 'cereals/millets 250g, vegetables 400g, fruits 100g, pulses/egg/meat 85g, milk/curd 300mL, nuts & seeds 35g, fats & oils 27g',
    source: 'ICMR-NIN DGI 2024',
  },
  indiaSpecificNotes: [
    'B12 deficiency affects 43-67% of Indian children (ICMR-NIN study) — vegetarians should include curd, eggs, fortified foods or a B12 supplement',
    'Indian diets have low iron bioavailability (phytate) — ICMR-NIN iron targets are much higher than US values, especially for women; pair dal/leafy greens with vitamin C',
    'Whole foods first — DGI 2024 is cautious on routine protein supplements; shakes are a convenience, not a necessity',
    'Everyday Indian protein per serving: 1 cup cooked dal ~12-15g, paneer 100g ~18g, egg ~6g, curd 100g ~3.5g, milk 250mL ~8g, 1 roti ~3g',
  ],
} as const;

export const VITAMIN_RDA: Record<string, { rda: number; unit: string; foodSources: string[]; deficiency: string }> = {
  'Vitamin A': { rda: 900, unit: 'mcg RAE', foodSources: ['Sweet potato', 'Carrots', 'Spinach', 'Liver', 'Cantaloupe'], deficiency: 'Night blindness, dry skin, weakened immunity' },
  'Vitamin B1': { rda: 1.2, unit: 'mg', foodSources: ['Pork', 'Sunflower seeds', 'Whole grains', 'Legumes'], deficiency: 'Beriberi, fatigue, nerve damage' },
  'Vitamin B2': { rda: 1.3, unit: 'mg', foodSources: ['Milk', 'Eggs', 'Almonds', 'Spinach'], deficiency: 'Cracked lips, sore throat, anemia' },
  'Vitamin B3': { rda: 16, unit: 'mg NE', foodSources: ['Chicken breast', 'Tuna', 'Turkey', 'Mushrooms'], deficiency: 'Pellagra (diarrhea, dermatitis, dementia)' },
  'Vitamin B6': { rda: 1.7, unit: 'mg', foodSources: ['Chickpeas', 'Salmon', 'Potatoes', 'Bananas'], deficiency: 'Anemia, weakened immunity, confusion' },
  'Vitamin B12': { rda: 2.4, unit: 'mcg', foodSources: ['Clams', 'Liver', 'Trout', 'Tuna', 'Fortified cereals'], deficiency: 'Megaloblastic anemia, fatigue, nerve damage' },
  'Vitamin C': { rda: 90, unit: 'mg', foodSources: ['Red bell pepper', 'Oranges', 'Strawberries', 'Broccoli', 'Kiwi'], deficiency: 'Scurvy, slow wound healing, bruising' },
  'Vitamin D': { rda: 15, unit: 'mcg (600 IU)', foodSources: ['Fatty fish', 'Fortified milk', 'Egg yolks', 'Sunlight'], deficiency: 'Rickets (children), osteomalacia (adults), bone pain' },
  'Vitamin E': { rda: 15, unit: 'mg', foodSources: ['Sunflower seeds', 'Almonds', 'Spinach', 'Avocado'], deficiency: 'Nerve/muscle damage, weakened immunity' },
  'Vitamin K': { rda: 120, unit: 'mcg', foodSources: ['Kale', 'Spinach', 'Broccoli', 'Brussels sprouts'], deficiency: 'Excessive bleeding, bruising' },
  'Calcium': { rda: 1000, unit: 'mg', foodSources: ['Milk', 'Yogurt', 'Cheese', 'Sardines', 'Tofu'], deficiency: 'Osteoporosis, muscle cramps, numbness' },
  'Iron': { rda: 8, unit: 'mg (men)', foodSources: ['Red meat', 'Spinach', 'Lentils', 'Fortified cereals'], deficiency: 'Iron-deficiency anemia, fatigue, weakness' },
  'Magnesium': { rda: 420, unit: 'mg (men)', foodSources: ['Pumpkin seeds', 'Almonds', 'Spinach', 'Dark chocolate'], deficiency: 'Muscle cramps, fatigue, irregular heartbeat' },
  'Zinc': { rda: 11, unit: 'mg (men)', foodSources: ['Oysters', 'Beef', 'Pumpkin seeds', 'Chickpeas'], deficiency: 'Hair loss, diarrhea, delayed wound healing' },
  'Potassium': { rda: 3400, unit: 'mg (men)', foodSources: ['Bananas', 'Potatoes', 'Spinach', 'Beans'], deficiency: 'Muscle cramps, weakness, heart palpitations' },
};

// ─── EXERCISE GUIDELINES (ACSM / CDC / WHO) ─────────────────────────────────

export const EXERCISE_GUIDELINES = {
  general: {
    aerobic: {
      moderate: { minutes: 150, per: 'week', source: 'CDC/WHO 2020' },
      vigorous: { minutes: 75, per: 'week', source: 'CDC/WHO 2020' },
      combined: '1 minute vigorous = 2 minutes moderate',
    },
    strength: {
      frequency: '2+ days per week',
      muscles: 'All major muscle groups',
      sets: '2-3 sets of 8-12 reps',
      rest: '60-90 seconds between sets',
      source: 'ACSM 2009',
    },
    flexibility: {
      frequency: '2-3 days per week',
      duration: '60 seconds per stretch',
      type: 'Static stretching after warm-up or at end of workout',
      source: 'ACSM',
    },
  },
  heartRateZones: [
    { zone: 'Zone 1 (Warm-up)', intensity: '50-60% max HR', purpose: 'Recovery, warm-up, cool-down' },
    { zone: 'Zone 2 (Fat Burn)', intensity: '60-70% max HR', purpose: 'Fat burning, endurance base' },
    { zone: 'Zone 3 (Aerobic)', intensity: '70-80% max HR', purpose: 'Cardiovascular fitness, stamina' },
    { zone: 'Zone 4 (Threshold)', intensity: '80-90% max HR', purpose: 'Anaerobic threshold, performance' },
    { zone: 'Zone 5 (Peak)', intensity: '90-100% max HR', purpose: 'Max effort, sprint intervals' },
  ],
  fatBurning: {
    targetZone: '60-70% max HR (Zone 2)',
    duration: '30-60 minutes',
    frequency: '3-5 times per week',
    note: 'Lower intensity burns more fat calories; higher intensity burns more total calories',
    source: 'ACSM Guidelines',
  },
  muscleBuilding: {
    repRange: '8-12 reps for hypertrophy',
    restPeriod: '60-90 seconds',
    setsPerMuscle: '10-20 sets per muscle group per week',
    progressiveOverload: 'Increase weight 2-5% when target reps achieved',
    trainingSplit: 'Push/Pull/Legs or Upper/Lower or Full Body',
    source: 'NSCA Position Stand',
  },
  warmup: {
    duration: '5-10 minutes',
    types: ['Light jogging', 'Dynamic stretching', 'Arm circles', 'Leg swings', 'Hip rotations', 'Bodyweight squats'],
    purpose: 'Increase blood flow, reduce injury risk, prepare joints',
    source: 'ACSM',
  },
  cooldown: {
    duration: '5-10 minutes',
    types: ['Light walking', 'Static stretching', 'Foam rolling', 'Deep breathing'],
    purpose: 'Gradual heart rate reduction, prevent blood pooling, flexibility',
    source: 'ACSM',
  },
} as const;

// ─── COMPOUND EXERCISES DATABASE ─────────────────────────────────────────────

export const COMPOUND_EXERCISES: Record<string, {
  name: string;
  muscles: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  calories_per_min: number;
  tips: string[];
  contraindications: string[];
}> = {
  squat: { name: 'Barbell Squat', muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'], equipment: ['Barbell', 'Rack'], difficulty: 'intermediate', calories_per_min: 8, tips: ['Keep chest up', 'Knees track over toes', 'Break parallel if mobility allows'], contraindications: ['Knee injury (modify)', 'Lower back pain (use goblet squat)'] },
  deadlift: { name: 'Deadlift', muscles: ['Hamstrings', 'Glutes', 'Lower back', 'Traps', 'Grip'], equipment: ['Barbell'], difficulty: 'advanced', calories_per_min: 10, tips: ['Neutral spine throughout', 'Drive through heels', 'Keep bar close to body'], contraindications: ['Disc herniation', 'Severe lower back pain'] },
  benchPress: { name: 'Bench Press', muscles: ['Pectorals', 'Anterior Deltoids', 'Triceps'], equipment: ['Barbell', 'Bench'], difficulty: 'intermediate', calories_per_min: 7, tips: ['Retract scapulae', 'Control the eccentric', 'Feet flat on floor'], contraindications: ['Shoulder impingement', 'Rotator cuff injury'] },
  overheadPress: { name: 'Overhead Press', muscles: ['Deltoids', 'Triceps', 'Upper Chest', 'Core'], equipment: ['Barbell or Dumbbells'], difficulty: 'intermediate', calories_per_min: 6, tips: ['Brace core', 'Full lockout at top', 'Bar path straight up'], contraindications: ['Shoulder instability', 'Lower back pain'] },
  pullUp: { name: 'Pull-Up', muscles: ['Latissimus Dorsi', 'Biceps', 'Rear Deltoids', 'Core'], equipment: ['Pull-up bar'], difficulty: 'intermediate', calories_per_min: 8, tips: ['Full range of motion', 'Initiate with lats', 'Avoid kipping'], contraindications: ['Shoulder instability', 'Elbow tendinitis'] },
  barbellRow: { name: 'Barbell Row', muscles: ['Latissimus Dorsi', 'Rhomboids', 'Biceps', 'Rear Deltoids'], equipment: ['Barbell'], difficulty: 'intermediate', calories_per_min: 6, tips: ['Hinge at hips', 'Pull to lower chest', 'Squeeze shoulder blades'], contraindications: ['Lower back injury'] },
  lunge: { name: 'Walking Lunge', muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'], equipment: ['Dumbbells (optional)'], difficulty: 'beginner', calories_per_min: 7, tips: ['Step far enough forward', 'Front knee at 90 degrees', 'Keep torso upright'], contraindications: ['Knee injury (modify depth)'] },
  hipThrust: { name: 'Hip Thrust', muscles: ['Glutes', 'Hamstrings', 'Core'], equipment: ['Barbell', 'Bench'], difficulty: 'intermediate', calories_per_min: 6, tips: ['Drive through heels', 'Full hip extension', 'Squeeze glutes at top'], contraindications: ['Lower back pain'] },
  dip: { name: 'Dip', muscles: ['Chest', 'Triceps', 'Anterior Deltoids'], equipment: ['Dip bars'], difficulty: 'intermediate', calories_per_min: 7, tips: ['Lean forward for chest focus', 'Upright for triceps', 'Full depth'], contraindications: ['Shoulder instability', 'Elbow injury'] },
  pushUp: { name: 'Push-Up', muscles: ['Pectorals', 'Anterior Deltoids', 'Triceps', 'Core'], equipment: ['Bodyweight'], difficulty: 'beginner', calories_per_min: 7, tips: ['Full range of motion', 'Core tight', 'Hands under shoulders'], contraindications: ['Wrist injury', 'Shoulder impingement'] },
  mountainClimber: { name: 'Mountain Climber', muscles: ['Core', 'Hip Flexors', 'Shoulders', 'Quadriceps'], equipment: ['Bodyweight'], difficulty: 'beginner', calories_per_min: 10, tips: ['Keep hips low', 'Drive knees to chest', 'Maintain plank position'], contraindications: ['Wrist injury', 'Lower back pain'] },
  burpee: { name: 'Burpee', muscles: ['Full Body'], equipment: ['Bodyweight'], difficulty: 'intermediate', calories_per_min: 12, tips: ['Land softly', 'Full extension at top', 'Chest to ground for full version'], contraindications: ['Knee injury', 'Lower back pain', 'Shoulder injury'] },
  kettlebellSwing: { name: 'Kettlebell Swing', muscles: ['Glutes', 'Hamstrings', 'Core', 'Shoulders'], equipment: ['Kettlebell'], difficulty: 'intermediate', calories_per_min: 10, tips: ['Hip hinge pattern', 'Explosive hip drive', 'Arms are just hooks'], contraindications: ['Lower back injury', 'Shoulder injury'] },
  plank: { name: 'Plank', muscles: ['Core', 'Shoulders', 'Glutes'], equipment: ['Bodyweight'], difficulty: 'beginner', calories_per_min: 4, tips: ['Straight line head to heels', 'Don\'t hold breath', 'Squeeze glutes'], contraindications: ['Shoulder injury (modify)'] },
  russianTwist: { name: 'Russian Twist', muscles: ['Obliques', 'Rectus Abdominis'], equipment: ['Bodyweight or Medicine Ball'], difficulty: 'beginner', calories_per_min: 5, tips: ['Lean back slightly', 'Feet can be elevated', 'Rotate through torso'], contraindications: ['Lower back pain', 'Disc issues'] },
  bicycleCrunch: { name: 'Bicycle Crunch', muscles: ['Rectus Abdominis', 'Obliques', 'Hip Flexors'], equipment: ['Bodyweight'], difficulty: 'beginner', calories_per_min: 5, tips: ['Slow and controlled', 'Elbow to opposite knee', 'Lower back pressed down'], contraindications: ['Neck pain', 'Lower back pain'] },
  bulgarianSplitSquat: { name: 'Bulgarian Split Squat', muscles: ['Quadriceps', 'Glutes', 'Hamstrings'], equipment: ['Bench', 'Dumbbells'], difficulty: 'intermediate', calories_per_min: 7, tips: ['Front shin vertical', 'Torso upright', 'Drive through front heel'], contraindications: ['Knee injury', 'Hip flexor tightness'] },
  farmerWalk: { name: 'Farmer\'s Walk', muscles: ['Forearms', 'Traps', 'Core', 'Shoulders'], equipment: ['Dumbbells or Kettlebells'], difficulty: 'beginner', calories_per_min: 8, tips: ['Tall posture', 'Brace core', 'Quick small steps'], contraindications: ['Shoulder injury'] },
};

// ─── COMMON EXERCISES BY BODY PART ──────────────────────────────────────────

export const EXERCISES_BY_MUSCLE: Record<string, string[]> = {
  chest: ['Barbell Bench Press', 'Dumbbell Bench Press', 'Incline Bench Press', 'Cable Fly', 'Push-Up', 'Dip (chest variation)', 'Chest Press Machine', 'Pec Deck'],
  back: ['Barbell Row', 'Deadlift', 'Pull-Up', 'Lat Pulldown', 'Seated Cable Row', 'T-Bar Row', 'Face Pull', 'Hyperextension'],
  shoulders: ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Rear Delt Fly', 'Upright Row', 'Arnold Press', 'Cable Lateral Raise', 'Shrug'],
  biceps: ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Cable Curl', 'Incline Dumbbell Curl', 'Concentration Curl'],
  triceps: ['Tricep Pushdown', 'Overhead Tricep Extension', 'Close-Grip Bench Press', 'Dip (triceps variation)', 'Skull Crusher', 'Diamond Push-Up'],
  quadriceps: ['Barbell Squat', 'Leg Press', 'Leg Extension', 'Bulgarian Split Squat', 'Walking Lunge', 'Front Squat', 'Goblet Squat'],
  hamstrings: ['Romanian Deadlift', 'Leg Curl', 'Glute-Ham Raise', 'Good Morning', 'Nordic Curl', 'Stiff-Leg Deadlift'],
  glutes: ['Hip Thrust', 'Barbell Squat', 'Romanian Deadlift', 'Cable Kickback', 'Glute Bridge', 'Sumo Deadlift', 'Bulgarian Split Squat'],
  calves: ['Standing Calf Raise', 'Seated Calf Raise', 'Leg Press Calf Raise', 'Jump Rope', 'Single-Leg Calf Raise'],
  core: ['Plank', 'Cable Crunch', 'Ab Rollout', 'Hanging Leg Raise', 'Russian Twist', 'Pallof Press', 'Dead Bug', 'Bird Dog'],
  forearms: ['Farmer\'s Walk', 'Wrist Curl', 'Reverse Wrist Curl', 'Dead Hang', 'Plate Pinch'],
};

// ─── MEAL PLANNING GUIDELINES ───────────────────────────────────────────────

export const MEAL_TIMING = {
  preWorkout: {
    timing: '1-3 hours before exercise',
    focus: 'Easy-to-digest carbs + moderate protein',
    examples: [
      'Banana + peanut butter (1 hr before)',
      'Oatmeal with honey (2-3 hrs before)',
      'Rice cakes with almond butter (1 hr before)',
      'Greek yogurt with berries (1-2 hrs before)',
      'Whole grain toast with jam (1 hr before)',
    ],
    avoid: 'High fat, high fiber, large meals',
    source: 'ISSN Position Stand on Nutrient Timing',
  },
  postWorkout: {
    timing: 'Within 2 hours after exercise',
    focus: 'Protein + carbs for recovery',
    examples: [
      'Chicken breast + rice + vegetables',
      'Protein shake + banana',
      'Greek yogurt + granola + fruit',
      'Eggs + whole grain toast + avocado',
      'Salmon + sweet potato + broccoli',
    ],
    ratio: '3:1 or 4:1 carbs to protein for endurance; 2:1 for strength',
    source: 'ISSN 2017',
  },
  mealFrequency: {
    general: '3-5 meals per day, eat every 3-4 hours',
    muscleGain: '4-6 smaller meals to meet calorie target',
    fatLoss: '3 meals + 1-2 snacks to manage hunger',
    source: 'ISSN Position Stand',
  },
  proteinDistribution: {
    perMeal: '0.4-0.55g/kg per meal (20-40g for most adults)',
    optimalTiming: 'Spread protein evenly across meals',
    preSleep: 'Casein protein or cottage cheese before bed for overnight recovery',
    source: 'ISSN 2017',
  },
};

export const HYDRATION_GUIDELINES = {
  daily: {
    men: '3.7 L (125 oz) total water',
    women: '2.7 L (91 oz) total water',
    source: 'IOM 2004',
  },
  exercise: {
    before: '5-10 mL/kg, 2-4 hours before exercise',
    during: '150-250 mL every 15-20 minutes',
    after: '1.5 L per kg of body weight lost',
    source: 'ACSM Position Stand',
  },
  electrolytes: {
    sodium: 'Replace in sweat > 1 L/hour or exercise > 60 min',
    potassium: 'Important for muscle function, found in bananas, potatoes',
    when: 'Long duration (>60 min) or intense heat exercise',
    source: 'ACSM',
  },
  urineColor: {
    paleYellow: 'Well hydrated',
    darkYellow: 'Mildly dehydrated, drink more',
    amber: 'Dehydrated, drink immediately',
    clear: 'Over-hydrated, reduce intake',
  },
};

// ─── SLEEP GUIDELINES (NSF / AASM) ──────────────────────────────────────────

export const SLEEP_GUIDELINES = {
  duration: {
    adults: '7-9 hours per night',
    olderAdults: '7-8 hours per night',
    athletes: '8-10 hours per night',
    source: 'National Sleep Foundation',
  },
  hygiene: [
    'Consistent sleep/wake time (even weekends)',
    'Cool room temperature (65-68°F / 18-20°C)',
    'Complete darkness (blackout curtains or eye mask)',
    'No screens 30-60 minutes before bed',
    'Avoid caffeine after 2 PM',
    'Avoid alcohol close to bedtime',
    'Exercise earlier in the day',
    'Relaxation routine before bed',
    'No large meals 2-3 hours before bed',
    'Limit daytime naps to 20-30 minutes',
  ],
  sleepStages: {
    light: 'Stage 1-2: 50% of sleep, easy to wake',
    deep: 'Stage 3: Physical recovery, growth hormone release, immune function',
    rem: 'REM: Mental recovery, memory consolidation, learning',
  },
  exerciseAndSleep: {
    benefit: 'Regular exercise improves sleep quality by 65%',
    timing: 'Finish vigorous exercise 2-3 hours before bed',
    best: 'Morning exercise best for sleep quality',
    source: 'Journal of Clinical Sleep Medicine',
  },
  screenTime: {
    blueLight: 'Suppresses melatonin production by 50%',
    cutoff: 'No screens 30-60 minutes before bed',
    alternative: 'Read, meditate, journal, listen to music',
  },
};

// ─── HEALTH CONDITIONS (CDC / WHO) ──────────────────────────────────────────

export const HEALTH_CONDITIONS: Record<string, {
  overview: string;
  exercise: string;
  nutrition: string;
  warnings: string[];
  source: string;
}> = {
  diabetes: {
    overview: 'Chronic condition affecting blood sugar regulation. Type 2 is most common and often lifestyle-related.',
    exercise: 'Aim for 150 min/week moderate aerobic activity. Resistance training 2-3x/week improves insulin sensitivity. Monitor blood sugar before/after exercise.',
    nutrition: 'Focus on complex carbs, high fiber, lean protein. Limit refined sugars and processed foods. Consistent meal timing helps blood sugar control.',
    warnings: ['Monitor blood sugar during exercise', 'Carry fast-acting carbs for hypoglycemia', 'Stay hydrated', 'Foot care important'],
    source: 'ADA Standards of Medical Care 2024',
  },
  hypertension: {
    overview: 'Blood pressure consistently above 130/80 mmHg. Major risk factor for heart disease and stroke.',
    exercise: 'Regular aerobic exercise can reduce BP by 5-8 mmHg. Walking, cycling, swimming are excellent. Avoid heavy Valsalva maneuvers.',
    nutrition: 'DASH diet: rich in fruits, vegetables, whole grains, lean protein. Limit sodium to <2300 mg/day (ideally <1500 mg). Increase potassium intake.',
    warnings: ['Monitor blood pressure regularly', 'Avoid heavy lifting without proper breathing', 'Stay hydrated', 'Limit caffeine'],
    source: 'AHA Guidelines 2023',
  },
  obesity: {
    overview: 'BMI ≥30 or excess body fat. Chronic disease risk factor for diabetes, heart disease, certain cancers.',
    exercise: 'Start with 150 min/week moderate activity. Walking, swimming, cycling (joint-friendly). Gradually increase to 300 min/week for weight loss. Add resistance training.',
    nutrition: 'Moderate caloric deficit (500 kcal/day for ~0.5 kg/week loss). High protein (1.6-2.2 g/kg) to preserve muscle. Limit processed foods and sugary drinks.',
    warnings: ['Consult doctor before starting', 'Start low, progress gradually', 'Protect joints', 'Focus on sustainable changes'],
    source: 'WHO 2024 / CDC',
  },
  arthritis: {
    overview: 'Joint inflammation causing pain and stiffness. Osteoarthritis (wear) and Rheumatoid (autoimmune) are most common.',
    exercise: 'Low-impact exercise essential: swimming, cycling, walking, yoga. Range of motion exercises daily. Avoid high-impact activities during flare-ups.',
    nutrition: 'Anti-inflammatory foods: fatty fish (omega-3), berries, leafy greens, turmeric, ginger. Limit processed foods and sugar.',
    warnings: ['Avoid high-impact during flare-ups', 'Warm up thoroughly', 'Listen to your body', 'Water exercise recommended'],
    source: 'Arthritis Foundation',
  },
  asthma: {
    overview: 'Chronic lung condition causing airway inflammation and breathing difficulty.',
    exercise: 'Regular exercise improves lung capacity. Swimming is excellent (warm, humid air). Warm up 10+ minutes. Carry rescue inhaler.',
    nutrition: 'Anti-inflammatory diet: omega-3 fatty acids, fruits, vegetables. Avoid sulfites in food. Vitamin D may help.',
    warnings: ['Always warm up', 'Carry rescue inhaler', 'Avoid cold dry air', 'Stop if breathing becomes difficult'],
    source: 'GINA Guidelines 2023',
  },
  osteoporosis: {
    overview: 'Bone density loss, increasing fracture risk. More common in postmenopausal women.',
    exercise: 'Weight-bearing exercise essential: walking, jogging, dancing, resistance training. Balance exercises to prevent falls.',
    nutrition: 'Calcium (1000-1200 mg/day), Vitamin D (600-800 IU/day), adequate protein. Limit caffeine and alcohol.',
    warnings: ['Avoid forward flexion exercises', 'Focus on posture', 'Balance training important', 'No high-impact if severe'],
    source: 'NOF Guidelines',
  },
  heartDisease: {
    overview: 'Cardiovascular conditions including coronary artery disease, heart failure, arrhythmias.',
    exercise: 'Cardiac rehabilitation recommended. Start supervised. 150 min/week moderate aerobic. Avoid extreme temperatures.',
    nutrition: 'Heart-healthy: omega-3, fiber, whole grains. Limit sodium (<2000 mg), saturated fat, trans fat. Mediterranean diet recommended.',
    warnings: ['Get medical clearance first', 'Supervised exercise initially', 'Monitor heart rate', 'Stop if chest pain or dizziness'],
    source: 'AHA 2023',
  },
  backPain: {
    overview: 'Most common musculoskeletal condition. Often due to poor posture, weak core, or disc issues.',
    exercise: 'Core strengthening: planks, bird dog, dead bug. McKenzie method extensions. Avoid heavy deadlifts/squats initially. Walking is excellent.',
    nutrition: 'Anti-inflammatory diet. Omega-3, turmeric, ginger. Maintain healthy weight to reduce spinal load.',
    warnings: ['Avoid heavy lifting initially', 'Focus on core stability', 'Maintain neutral spine', 'Consult physiotherapist'],
    source: 'ACP Clinical Guidelines',
  },
};

// ─── CALORIE REFERENCES (USDA FoodData Central) ─────────────────────────────

export const FOOD_CALORIE_REFERENCES: Record<string, { calories: number; protein: number; carbs: number; fat: number; per: string }> = {
  'chicken_breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, per: '100g cooked' },
  'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13, per: '100g cooked' },
  'egg': { calories: 78, protein: 6, carbs: 0.6, fat: 5, per: '1 large' },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, per: '100g cooked' },
  'oats': { calories: 389, protein: 17, carbs: 66, fat: 7, per: '100g dry' },
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, per: '100g' },
  'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50, per: '100g' },
  'greek_yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, per: '100g' },
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, per: '100g' },
  'sweet_potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, per: '100g' },
  'quinoa': { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, per: '100g cooked' },
  'lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, per: '100g cooked' },
  'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, per: '100g' },
  'avocado': { calories: 160, protein: 2, carbs: 9, fat: 15, per: '100g' },
  'olive_oil': { calories: 884, protein: 0, carbs: 0, fat: 100, per: '100ml' },
  'whey_protein': { calories: 120, protein: 24, carbs: 3, fat: 1.5, per: '1 scoop (30g)' },
  'cottage_cheese': { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, per: '100g' },
  'turkey_breast': { calories: 135, protein: 30, carbs: 0, fat: 1, per: '100g cooked' },
  'tuna': { calories: 132, protein: 28, carbs: 0, fat: 1.3, per: '100g canned' },
  'oatmeal': { calories: 68, protein: 2.4, carbs: 12, fat: 1.4, per: '100g cooked' },
  'milk': { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, per: '100ml' },
  'peanut_butter': { calories: 588, protein: 25, carbs: 20, fat: 50, per: '100g' },
  'honey': { calories: 304, protein: 0.3, carbs: 82, fat: 0, per: '100g' },
  'brown_bread': { calories: 247, protein: 13, carbs: 41, fat: 3.4, per: '100g' },
  'paneer': { calories: 265, protein: 18, carbs: 4, fat: 20, per: '100g' },
  'dal': { calories: 116, protein: 9, carbs: 20, fat: 0.4, per: '100g cooked' },
  'roti': { calories: 266, protein: 7.5, carbs: 56, fat: 1.5, per: '100g (2 medium)' },
  'curd': { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, per: '100g' },
  'banana_milk': { calories: 100, protein: 3.5, carbs: 18, fat: 1.5, per: '1 glass' },
};

// ─── WEIGHT MANAGEMENT FORMULAS ──────────────────────────────────────────────

export const CALCULATIONS = {
  bmr: {
    men: (weight: number, height: number, age: number) => 10 * weight + 6.25 * height - 5 * age + 5,
    women: (weight: number, height: number, age: number) => 10 * weight + 6.25 * height - 5 * age - 161,
    source: 'Mifflin-St Jeor (1990), most accurate for non-athletes',
  },
  bmi: {
    formula: (weight: number, heightCm: number) => weight / ((heightCm / 100) ** 2),
    categories: [
      { range: '<18.5', label: 'Underweight' },
      { range: '18.5-24.9', label: 'Normal weight' },
      { range: '25-29.9', label: 'Overweight' },
      { range: '30-34.9', label: 'Obese Class I' },
      { range: '35-39.9', label: 'Obese Class II' },
      { range: '≥40', label: 'Obese Class III' },
    ],
    source: 'WHO 2000',
  },
  tdee: {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
    source: 'Harris-Benedict (revised)',
  },
  calorieTargets: {
    weightLoss: (tdee: number) => tdee - 500,
    muscleGain: (tdee: number) => tdee + 300,
    maintain: (tdee: number) => tdee,
    rapidLoss: (tdee: number) => Math.max(tdee - 1000, 1200),
    source: 'ACSM Position Statement',
  },
  maxHR: {
    formula: (age: number) => 220 - age,
    tanaka: (age: number) => 208 - 0.7 * age,
    source: 'Tanaka et al. 2001',
  },
};

// ─── STRESS & MENTAL HEALTH ─────────────────────────────────────────────────

export const MENTAL_HEALTH = {
  exerciseAndMood: {
    benefit: 'Exercise releases endorphins, serotonin, BDNF',
    minimum: '30 minutes moderate exercise, 3x/week',
    effect: 'Can be as effective as antidepressants for mild-moderate depression',
    source: 'Harvard Medical School',
  },
  breathingTechniques: [
    { name: '4-7-8 Breathing', steps: 'Inhale 4s → Hold 7s → Exhale 8s', benefit: 'Calms nervous system, reduces anxiety' },
    { name: 'Box Breathing', steps: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s', benefit: 'Improves focus, reduces stress' },
    { name: 'Diaphragmatic Breathing', steps: 'Belly rises on inhale, falls on exhale', benefit: 'Activates parasympathetic nervous system' },
    { name: 'Alternate Nostril Breathing', steps: 'Close right, inhale left → Close left, exhale right', benefit: 'Balances nervous system, improves focus' },
  ],
  mindfulness: {
    beginnerDuration: '5 minutes daily',
    progression: 'Increase 1 minute per week up to 20 minutes',
    bestTime: 'Morning or before bed',
    apps: 'Headspace, Calm, Insight Timer',
    source: 'APA Mindfulness Guidelines',
  },
};

// ─── AGING & EXERCISE ───────────────────────────────────────────────────────

export const AGING_GUIDELINES = {
  muscleLoss: {
    rate: '3-8% per decade after 30',
    prevention: 'Resistance training 2-3x/week',
    proteinNeed: '1.0-1.2 g/kg/day (higher than younger adults)',
    source: 'PROT-AGE Study Group',
  },
  balance: {
    importance: 'Fall risk increases with age',
    exercises: ['Single-leg stand', 'Heel-to-toe walk', 'Tai Chi', 'Yoga', 'Balance board'],
    frequency: 'Daily practice',
    source: 'CDC Fall Prevention',
  },
  boneDensity: {
    peak: 'Achieved by age 30',
    prevention: 'Weight-bearing exercise + calcium + Vitamin D',
    exercises: ['Walking', 'Jogging', 'Dancing', 'Stair climbing', 'Resistance training'],
    source: 'NOF',
  },
  flexibility: {
    decline: 'Reduces 20-50% between ages 30-70',
    prevention: 'Daily stretching, yoga, mobility work',
    focus: 'Hips, shoulders, hamstrings, thoracic spine',
    source: 'ACSM',
  },
};

// ─── SUPPLEMENTS (ISSN / Mayo Clinic) ───────────────────────────────────────

export const SUPPLEMENTS: Record<string, {
  evidence: 'strong' | 'moderate' | 'limited';
  benefit: string;
  dosage: string;
  timing: string;
  source: string;
}> = {
  'Whey Protein': { evidence: 'strong', benefit: 'Muscle protein synthesis, recovery, satiety', dosage: '20-40g per serving', timing: 'Post-workout or between meals', source: 'ISSN 2017' },
  'Creatine Monohydrate': { evidence: 'strong', benefit: 'Strength, power, muscle growth, brain function', dosage: '3-5g daily (no loading needed)', timing: 'Any time, consistent daily', source: 'ISSN 2017' },
  'Caffeine': { evidence: 'strong', benefit: 'Performance, alertness, fat oxidation', dosage: '3-6 mg/kg body weight', timing: '30-60 min before exercise', source: 'ISSN 2013' },
  'Vitamin D': { evidence: 'moderate', benefit: 'Bone health, immune function, mood', dosage: '1000-2000 IU daily (if deficient)', timing: 'With fat-containing meal', source: 'Endocrine Society' },
  'Omega-3 Fish Oil': { evidence: 'moderate', benefit: 'Heart health, anti-inflammatory, joint health', dosage: '1-3g EPA+DHA daily', timing: 'With meals', source: 'AHA 2019' },
  'Magnesium': { evidence: 'moderate', benefit: 'Sleep quality, muscle recovery, anxiety', dosage: '200-400mg daily', timing: 'Before bed for sleep', source: 'NIH ODS' },
  'BCAA': { evidence: 'limited', benefit: 'May help if protein intake is inadequate', dosage: '5-10g', timing: 'During or post-workout', source: 'ISSN (less effective than whey)' },
  'Glutamine': { evidence: 'limited', benefit: 'May help gut health and immune function', dosage: '5-10g daily', timing: 'Any time', source: 'ISSN' },
  'Multivitamin': { evidence: 'limited', benefit: 'Fills nutrient gaps, not a substitute for diet', dosage: 'As directed', timing: 'With breakfast', source: 'Mayo Clinic' },
};

// ─── COMMON QUESTIONS & ANSWERS ──────────────────────────────────────────────

export const FAQ: Record<string, { answer: string; source: string }> = {
  'how much water should i drink': { answer: 'Men need ~3.7L/day, women ~2.7L/day. During exercise, add 500-1000mL per hour. A good indicator is pale yellow urine.', source: 'IOM 2004' },
  'how many calories do i need': { answer: 'Depends on your TDEE (Total Daily Energy Expenditure). For weight loss: TDEE - 500 kcal. For muscle gain: TDEE + 300 kcal. Use our Calculator page for personalized numbers.', source: 'ACSM' },
  'what should i eat before a workout': { answer: '1-3 hours before: easy-to-digest carbs + moderate protein. Examples: banana + peanut butter, oatmeal, rice cakes. Avoid high fat and fiber.', source: 'ISSN' },
  'what should i eat after a workout': { answer: 'Within 2 hours: protein (20-40g) + carbs. Ratio 3:1 carbs:protein for endurance, 2:1 for strength. Examples: chicken + rice, protein shake + banana.', source: 'ISSN 2017' },
  'how to lose weight': { answer: 'Create a 500 kcal/day deficit through diet + exercise. Eat high protein (1.6-2.2g/kg) to preserve muscle. Combine strength training + cardio. Aim for 0.5-1 kg/week loss.', source: 'ACSM/Obesity Society' },
  'how to build muscle': { answer: 'Eat 300-500 kcal surplus. Protein 1.6-2.2g/kg. Progressive overload (increase weight/reps). Train each muscle 2x/week. Sleep 7-9 hours. Be consistent for months.', source: 'NSCA Position Stand' },
  'how to get six pack abs': { answer: 'Visible abs require ~12-15% body fat (men) or ~16-20% (women). Core training (planks, cable crunches) builds muscle. Diet and overall fat loss reveal them. Spot reduction is impossible.', source: 'ACSM' },
  'is cardio or weights better': { answer: 'Both are important. Weights build/maintain muscle and boost metabolism. Cardio improves heart health and endurance. For fat loss: combine both. For muscle: prioritize weights.', source: 'ACSM 2016' },
  'how to improve sleep': { answer: 'Consistent sleep schedule, cool dark room (18-20°C), no screens 1hr before bed, avoid caffeine after 2PM, regular exercise (not too close to bed), relaxation routine.', source: 'National Sleep Foundation' },
  'how to reduce stress': { answer: 'Regular exercise (endorphins), deep breathing (4-7-8 technique), meditation (5-20 min daily), time in nature, social connection, adequate sleep, journaling.', source: 'APA' },
  'how much protein per day': { answer: 'General: 0.8g/kg. Active: 1.2-1.6g/kg. Muscle building: 1.6-2.2g/kg. Fat loss: 1.8-2.4g/kg. Spread across meals (0.4-0.55g/kg per meal).', source: 'ISSN 2017' },
  'should i take supplements': { answer: 'Focus on whole foods first. Evidence-based: Whey protein (convenience), Creatine (strong evidence for strength), Vitamin D (if deficient), Omega-3. Skip unproven supplements.', source: 'ISSN / Mayo Clinic' },
  'how to warm up properly': { answer: '5-10 minutes: light cardio (jogging, jumping jacks) + dynamic stretching (arm circles, leg swings, hip rotations, bodyweight squats). Never stretch cold muscles statically.', source: 'ACSM' },
  'how to prevent injury': { answer: 'Warm up properly, progress gradually (10% rule), use proper form, rest between sessions, stay hydrated, listen to your body, wear appropriate footwear, cool down after.', source: 'ACSM / NSCA' },
  'what is progressive overload': { answer: 'Gradually increasing training demand over time. Methods: increase weight, reps, sets, or decrease rest. Essential for continued strength and muscle gains. Without it, progress stalls.', source: 'NSCA' },
  'how often should i work out': { answer: 'CDC recommends: 150 min moderate aerobic OR 75 min vigorous aerobic per week + 2+ strength sessions. For best results: 4-5 sessions/week with proper rest days.', source: 'CDC 2020' },
  'can i lose weight without exercise': { answer: 'Yes, through caloric deficit alone. But exercise preserves muscle, boosts metabolism, improves health markers, and makes weight loss more sustainable. Best approach: diet + exercise.', source: 'ACSM' },
  'how to count calories': { answer: 'Use a food scale for accuracy. Track in an app (MyFitnessPal, LoseIt). Measure portions. Read nutrition labels. Focus on whole foods. Weight loss = calories in < calories out.', source: 'USDA' },
  'what is BMI': { answer: 'Body Mass Index = weight(kg) / height(m)². Categories: <18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, 30+ obese. Limitations: doesn\'t account for muscle mass.', source: 'WHO' },
  'what is TDEE': { answer: 'Total Daily Energy Expenditure = BMR × Activity Level. This is your total daily calorie burn. Use it to set intake: deficit for loss, surplus for gain, equal for maintenance.', source: 'Harris-Benedict' },
  'rest days important': { answer: 'Yes! Muscles grow during rest, not training. Overtraining causes injury, fatigue, and stalled progress. Aim for 1-2 rest days per week. Sleep is when recovery happens.', source: 'ACSM' },
  'stretching before or after workout': { answer: 'Dynamic stretching BEFORE workout (leg swings, arm circles). Static stretching AFTER workout (hold 30-60 seconds). Static stretching cold muscles can increase injury risk.', source: 'ACSM' },
  'how to improve flexibility': { answer: 'Static stretching after workouts: hold 30-60 seconds, 2-4 reps per muscle. Yoga 2-3x/week. Foam rolling. Daily mobility work. Consistency is key — flexibility takes weeks to improve.', source: 'ACSM' },
  'what foods to avoid': { answer: 'Limit: trans fats, excessive sugar, processed meats, excessive alcohol, sugary drinks, refined carbs (white bread, pastries), excessive sodium. Focus on whole, minimally processed foods.', source: 'Harvard T.H. Chan' },
  'usda guidelines for indians': { answer: 'Yes — the core numbers (protein per kg, TDEE, hydration) are body-based and work for everyone. India adds its own layer: ICMR-NIN 2020 sets protein at 0.83 g/kg (vs USDA 0.8), fiber 30g/day, and DGI 2024 caps sugar at 25g and salt at 5g per day.', source: 'ICMR-NIN 2020 / DGI 2024' },
  'icmr nin guidelines': { answer: "ICMR-NIN is India's national nutrition authority. Its 2020 RDA + 2024 Dietary Guidelines for Indians: protein 0.83 g/kg/day, fiber 30g/day, plate balance 50-55% carbs / 10-15% protein / 20-30% fat, sugar <25g/day, salt <5g/day, cooking oil 25-30g/day.", source: 'ICMR-NIN' },
  'indian protein sources vegetarian': { answer: 'Solid Indian options: dal/khichdi ~12-15g per cup, paneer ~18g per 100g, eggs ~6g each, curd ~3.5g per 100g, milk ~8g per 250mL, sprouts, rajma, chana, soya chunks ~52g per 100g dry. Combine cereals + pulses for complete amino acids.', source: 'ICMR-NIN / IFCT 2017' },
};
