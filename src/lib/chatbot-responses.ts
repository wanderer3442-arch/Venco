import {
  MACRO_GUIDELINES,
  VITAMIN_RDA,
  EXERCISE_GUIDELINES,
  EXERCISES_BY_MUSCLE,
  MEAL_TIMING,
  HYDRATION_GUIDELINES,
  SLEEP_GUIDELINES,
  HEALTH_CONDITIONS,
  CALCULATIONS,
  MENTAL_HEALTH,
  AGING_GUIDELINES,
  SUPPLEMENTS,
  FAQ,
} from './chatbot-knowledge';

export interface ChatResponse {
  keywords: string[];
  response: string;
  followUp?: string[];
  category: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE RESPONSE DATABASE — 120+ TOPICS
// Based on WHO, CDC, ACSM, AHA, USDA, ISSN, NASM, ACE guidelines
// ═══════════════════════════════════════════════════════════════════════════════

export const chatResponses: ChatResponse[] = [

  // ─── GREETINGS ─────────────────────────────────────────────────────────────
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo', 'good morning', 'good evening', 'good afternoon'],
    response: "Hey! I'm V, your certified health & fitness assistant. I can help with:\n\n💪 Exercise & workouts\n🥗 Nutrition & meal planning\n📊 Body metrics & progress\n😴 Sleep & recovery\n💊 Supplements\n🧠 Mental health\n\nWhat would you like to know?",
    followUp: ['Analyze my progress', 'Suggest a meal', 'Exercise tips', 'Sleep advice'],
    category: 'greeting',
  },
  {
    keywords: ['who are you', 'what are you', 'tell me about yourself', 'your name'],
    response: "I'm V — your AI health assistant backed by certified guidelines from WHO, CDC, ACSM, Harvard, and the International Society of Sports Nutrition. I provide evidence-based advice on nutrition, exercise, sleep, and wellness.\n\n⚠️ I'm not a doctor. Always consult a healthcare professional for medical conditions.",
    followUp: ['What can you do?', 'Health tips', 'Meal suggestions'],
    category: 'greeting',
  },

  // ─── NUTRITION — MACROS ────────────────────────────────────────────────────
  {
    keywords: ['protein', 'how much protein', 'protein intake', 'protein per day', 'protein needs'],
    response: `📊 **Protein Guidelines (ISSN 2017):**

• Sedentary: 0.8-1.0 g/kg/day
• Active/Moderate: 1.2-1.6 g/kg/day
• Muscle building: 1.6-2.2 g/kg/day
• Fat loss: 1.8-2.4 g/kg/day
• Elderly (65+): 1.0-1.2 g/kg/day

**Per meal:** 0.4-0.55g/kg (20-40g for most adults)

**Best sources:** Chicken breast (31g/100g), salmon (20g/100g), eggs (6g each), Greek yogurt (10g/100g), lentils (9g/100g)

Tip: Spread protein evenly across meals for optimal muscle protein synthesis.`,
    followUp: ['Best protein foods', 'Protein timing', 'Calculate my macros'],
    category: 'nutrition',
  },
  {
    keywords: ['carbs', 'carbohydrates', 'how many carbs', 'carb intake', 'low carb'],
    response: `📊 **Carbohydrate Guidelines (IOM/ACSM):**

• Sedentary: 3-5 g/kg/day
• Moderate exercise: 5-7 g/kg/day
• High intensity athlete: 8-12 g/kg/day
• Endurance athlete: 6-10 g/kg/day

**Quality matters:** Choose complex carbs (oats, brown rice, sweet potatoes, quinoa) over refined (white bread, sugar).

**Carbs aren't the enemy!** They fuel your brain, muscles, and workout performance. Low-carb diets can impair high-intensity exercise.`,
    followUp: ['Best carb sources', 'When to eat carbs', 'Low carb vs keto'],
    category: 'nutrition',
  },
  {
    keywords: ['fat', 'fats', 'healthy fat', 'fat intake', 'dietary fat'],
    response: `📊 **Fat Guidelines (IOM):**

• General: 20-35% of total calories
• Minimum: Don't go below 20% (hormone health)
• Per kg: 0.8-1.0 g/kg/day

**Types matter:**
✅ Unsaturated: Olive oil, avocados, nuts, fatty fish
⚠️ Saturated: Moderate amounts (red meat, cheese)
❌ Trans fats: Avoid completely (processed foods)

**Essential fatty acids:** Omega-3 (fish, flaxseed) and Omega-6 (nuts, seeds) are required for brain health and inflammation control.`,
    followUp: ['Best fat sources', 'Omega-3 benefits', 'Saturated fat risks'],
    category: 'nutrition',
  },
  {
    keywords: ['calories', 'calorie', 'calorie intake', 'daily calories', 'how many calories'],
    response: `📊 **Calorie Guidelines:**

Your daily needs depend on TDEE (Total Daily Energy Expenditure):
• Sedentary: BMR × 1.2
• Light activity: BMR × 1.375
• Moderate: BMR × 1.55
• Active: BMR × 1.725
• Very active: BMR × 1.9

**Targets:**
• Weight loss: TDEE - 500 kcal/day
• Muscle gain: TDEE + 300 kcal/day
• Maintenance: TDEE = intake

**Formula (Mifflin-St Jeor):**
Men: 10×weight(kg) + 6.25×height(cm) - 5×age + 5
Women: 10×weight(kg) + 6.25×height(cm) - 5×age - 161

Use our Calculator page for personalized numbers!`,
    followUp: ['Calculate my TDEE', 'Weight loss calories', 'Muscle gain calories'],
    category: 'nutrition',
  },

  // ─── NUTRITION — MEALS ────────────────────────────────────────────────────
  {
    keywords: ['meal', 'food', 'eat', 'breakfast', 'lunch', 'dinner', 'snack', 'what to eat', 'suggest meal', 'meal suggestion'],
    response: `🍽️ **Meal Suggestions (USDA guidelines):**

**Breakfast (400-500 kcal):**
• Oatmeal + banana + almond butter + whey
• Greek yogurt + berries + granola + honey
• Eggs (3) + whole grain toast + avocado

**Lunch (500-600 kcal):**
• Grilled chicken salad + olive oil dressing
• Quinoa bowl + vegetables + paneer
• Lentil soup + whole grain bread

**Dinner (400-550 kcal):**
• Baked salmon + sweet potato + broccoli
• Chicken stir-fry + brown rice
• Tofu curry + quinoa + vegetables

**Snacks (150-250 kcal):**
• Apple + peanut butter
• Greek yogurt + nuts
• Protein shake + banana
• Cottage cheese + berries

Aim for 3-5 meals/day, every 3-4 hours.`,
    followUp: ['Calculate my macros', 'Meal timing tips', 'High protein meals'],
    category: 'nutrition',
  },
  {
    keywords: ['meal plan', 'meal prep', 'meal planning', 'weekly meal', 'diet plan'],
    response: `📋 **Meal Planning Tips (ISSN):**

**Structure:**
• 3-5 meals per day
• Each meal: 0.4-0.55g protein/kg body weight
• Pre-workout (1-3 hrs): Carbs + moderate protein
• Post-workout (within 2 hrs): Protein + carbs

**Prep tips:**
• Batch cook proteins (chicken, lentils) on Sunday
• Pre-cut vegetables for the week
• Prepare overnight oats for quick breakfasts
• Keep healthy snacks accessible

**Macro balance:** 40% carbs, 30% protein, 30% fat (adjustable based on goals)

Use our Meal Plan page to track your weekly food intake!`,
    followUp: ['Pre-workout meals', 'Post-workout meals', 'Snack ideas'],
    category: 'nutrition',
  },
  {
    keywords: ['pre workout', 'pre-workout', 'before workout', 'eat before', 'before exercise'],
    response: `⏰ **Pre-Workout Nutrition (ISSN):**

**Timing:** 1-3 hours before exercise

**What to eat:**
• Easy-to-digest carbs + moderate protein
• Banana + peanut butter (1 hr before)
• Oatmeal with honey (2-3 hrs before)
• Rice cakes with almond butter (1 hr before)
• Greek yogurt with berries (1-2 hrs before)

**Avoid:** High fat, high fiber, large meals (slow digestion)

**Quick option (30 min before):** Small banana or sports drink

Fuel your workout for better performance and recovery!`,
    followUp: ['Post-workout nutrition', 'Best pre-workout foods', 'Hydration tips'],
    category: 'nutrition',
  },
  {
    keywords: ['post workout', 'post-workout', 'after workout', 'after exercise', 'recovery meal'],
    response: `⏰ **Post-Workout Nutrition (ISSN 2017):**

**Timing:** Within 2 hours after exercise

**What to eat:**
• Protein (20-40g) + Carbs
• Chicken breast + rice + vegetables
• Protein shake + banana
• Greek yogurt + granola + fruit
• Eggs + whole grain toast + avocado

**Ratios:**
• Strength training: 2:1 carbs:protein
• Endurance: 3:1 or 4:1 carbs:protein

**Why?** Your muscles are primed for nutrient uptake. Protein repairs muscle; carbs replenish glycogen stores.

Don't skip this window — it speeds recovery significantly!`,
    followUp: ['Pre-workout meals', 'Protein shake timing', 'Recovery tips'],
    category: 'nutrition',
  },

  // ─── HYDRATION ─────────────────────────────────────────────────────────────
  {
    keywords: ['water', 'hydrate', 'hydration', 'drink', 'how much water', 'dehydration', 'thirst'],
    response: `💧 **Hydration Guidelines (IOM 2004 / ACSM):**

**Daily needs:**
• Men: 3.7 L (125 oz)
• Women: 2.7 L (91 oz)

**During exercise:**
• Before: 500 mL, 2-4 hours before
• During: 150-250 mL every 15-20 minutes
• After: 1.5 L per kg of body weight lost

**Urine color guide:**
• Pale yellow = well hydrated ✓
• Dark yellow = drink more
• Amber = dehydrated, drink now
• Clear = over-hydrated, reduce

**Tips:**
• Keep a water bottle visible
• Drink a glass first thing in the morning
• Set hourly reminders
• Electrolytes for exercise >60 minutes`,
    followUp: ['Electrolyte tips', 'Water vs sports drinks', 'Hydration reminders'],
    category: 'hydration',
  },

  // ─── EXERCISE — GENERAL ───────────────────────────────────────────────────
  {
    keywords: ['exercise', 'workout', 'train', 'gym', 'run', 'cardio', 'exercise tips', 'workout tips'],
    response: `💪 **Exercise Guidelines (CDC/ACSM 2020):**

**Weekly targets:**
• 150 min moderate aerobic OR 75 min vigorous
• 2+ strength training sessions (all major muscles)
• Flexibility training 2-3 days/week

**Today's workout suggestion:**
1. Warm-up: 5-10 min (dynamic stretching)
2. Main workout: 30-45 min
3. Cool-down: 5-10 min (static stretching)

**Key principles:**
• Progressive overload (increase weight/reps)
• Proper form over heavy weight
• Rest between sets: 60-90 seconds
• Rest days are essential (muscles grow during rest)

Consistency > intensity. Show up every day!`,
    followUp: ['Full body workout', 'Upper/lower split', 'Home exercises'],
    category: 'exercise',
  },
  {
    keywords: ['warm up', 'warmup', 'warm-up', 'before workout', 'stretching'],
    response: `🔥 **Warm-Up Protocol (ACSM):**

**Duration:** 5-10 minutes before every workout

**Dynamic stretches:**
• Arm circles (10 each direction)
• Leg swings (10 each leg)
• Hip rotations (10 each direction)
• Bodyweight squats (10 reps)
• Walking lunges (10 each leg)
• High knees (30 seconds)
• Butt kicks (30 seconds)

**Why it matters:**
• Increases blood flow to muscles
• Raises core temperature
• Improves range of motion
• Reduces injury risk by 50%

**Never** static stretch cold muscles — do it after the workout instead.`,
    followUp: ['Cool-down routine', 'Dynamic vs static stretching', 'Pre-workout stretches'],
    category: 'exercise',
  },
  {
    keywords: ['cool down', 'cooldown', 'cool-down', 'after workout', 'post workout stretch'],
    response: `❄️ **Cool-Down Protocol (ACSM):**

**Duration:** 5-10 minutes after every workout

**Routine:**
1. Light walking (3-5 min) — gradual heart rate reduction
2. Static stretching (30-60 seconds per muscle):
   • Hamstring stretch
   • Quad stretch
   • Chest stretch
   • Shoulder stretch
   • Hip flexor stretch
   • Calf stretch
3. Deep breathing (1 min)

**Why it matters:**
• Prevents blood pooling in extremities
• Reduces muscle soreness (DOMS)
• Improves flexibility over time
• Promotes recovery

Hold stretches to the point of mild tension, not pain.`,
    followUp: ['Warm-up routine', 'Stretching routine', 'Recovery tips'],
    category: 'exercise',
  },
  {
    keywords: ['compound', 'compound exercise', 'best exercises', 'multi joint', 'multi-joint'],
    response: `🏋️ **Compound Exercises (NSCA Position Stand):**

Compound movements work multiple joints and muscle groups — the most efficient exercises for strength and muscle:

**Lower Body:**
• Barbell Squat — Quads, glutes, hamstrings, core
• Deadlift — Hamstrings, glutes, back, traps
• Walking Lunge — Quads, glutes, hamstrings

**Upper Body Push:**
• Bench Press — Chest, shoulders, triceps
• Overhead Press — Shoulders, triceps, core
• Dip — Chest, triceps

**Upper Body Pull:**
• Barbell Row — Back, biceps, rear delts
• Pull-Up — Lats, biceps, core

**Full Body:**
• Kettlebell Swing — Glutes, hamstrings, core
• Burpee — Full body conditioning

Always prioritize compound exercises in your routine!`,
    followUp: ['Isolation exercises', 'Beginner routine', 'Advanced routine'],
    category: 'exercise',
  },
  {
    keywords: ['isolation', 'isolation exercise', 'single muscle', 'bicep curl', 'tricep extension'],
    response: `🎯 **Isolation Exercises:**

Isolation exercises target one muscle group at a time. Use them after compound exercises to address weaknesses or imbalances.

**Examples by muscle:**
• Biceps: Barbell Curl, Hammer Curl, Preacher Curl
• Triceps: Pushdown, Overhead Extension, Skull Crusher
• Shoulders: Lateral Raise, Front Raise, Rear Delt Fly
• Legs: Leg Extension, Leg Curl, Calf Raise
• Abs: Cable Crunch, Ab Rollout, Leg Raise

**When to use:**
• After compound movements
• To correct muscle imbalances
• For rehabilitation
• For aesthetic focus

**Rep range:** 10-15 reps, 2-3 sets
**Rest:** 30-60 seconds

Compounds first, isolation second!`,
    followUp: ['Compound exercises', 'Bicep workout', 'Shoulder workout'],
    category: 'exercise',
  },
  {
    keywords: ['progressive overload', 'overload', 'increase weight', 'getting stronger', 'stalled progress', 'plateau'],
    response: `📈 **Progressive Overload (NSCA):**

The #1 principle for continued progress. Without it, your body adapts and stops changing.

**Methods to progress:**
1. **Increase weight** — Add 2.5-5 kg when you hit top of rep range
2. **Increase reps** — Add 1-2 reps per set each week
3. **Increase sets** — Add 1 set per exercise
4. **Decrease rest** — Reduce rest periods by 10-15 seconds
5. **Improve form** — Better mind-muscle connection

**Example progression:**
Week 1: 60kg × 3 × 8 reps
Week 2: 60kg × 3 × 9 reps
Week 3: 60kg × 3 × 10 reps
Week 4: 62.5kg × 3 × 8 reps

**The 2.5-5% rule:** Increase load by 2.5-5% when target reps achieved.

Track your workouts! If you're not tracking, you're guessing.`,
    followUp: ['How to track progress', 'Deload weeks', 'When to change program'],
    category: 'exercise',
  },
  {
    keywords: ['rest day', 'rest days', 'recovery', 'how often rest', 'overtraining'],
    response: `😴 **Rest & Recovery (ACSM):**

**Yes, rest days are essential!**

**How much rest:**
• 1-2 rest days per week (minimum)
• 48-72 hours between training same muscle groups
• 7-9 hours sleep per night

**What happens during rest:**
• Muscle repair and growth
• Glycogen replenishment
• Hormone optimization (testosterone, growth hormone)
• Nervous system recovery
• Mental recharge

**Signs of overtraining:**
• Persistent fatigue
• Decreased performance
• Elevated resting heart rate
• Poor sleep
• Frequent illness
• Mood changes

**Active recovery:** Light walking, yoga, foam rolling on rest days.

Listen to your body — more training ≠ better results.`,
    followUp: ['Deload weeks', 'Sleep tips', 'Foam rolling guide'],
    category: 'exercise',
  },
  {
    keywords: ['deload', 'deload week', 'take a break', 'reduce intensity'],
    response: `🔄 **Deload Weeks (NSCA):**

**What:** Planned reduction in training volume/intensity (every 4-8 weeks)

**How:**
• Reduce weight by 40-60%
• Keep same exercises
• Same number of sets
• Focus on form and technique

**Duration:** 1 week

**Why it's important:**
• Allows full recovery
• Prevents overtraining
• Reduces injury risk
• Mental freshness
• Sets up next training block

**Signs you need a deload:**
• Performance declining
• Persistent soreness
• Poor motivation
• Poor sleep

Think of deloads as investing in long-term progress, not losing progress.`,
    followUp: ['How to track progress', 'Training periodization', 'Signs of overtraining'],
    category: 'exercise',
  },

  // ─── EXERCISE — BODY PARTS ────────────────────────────────────────────────
  {
    keywords: ['chest', 'chest workout', 'pecs', 'pectoral', 'chest exercise', 'build chest'],
    response: `💪 **Chest Workout (ACSM/NSCA):**

**Beginner:**
• Push-Up: 3 × 12-15
• Incline Dumbbell Press: 3 × 10-12
• Chest Fly: 2 × 12-15

**Intermediate:**
• Barbell Bench Press: 4 × 8-10
• Incline Dumbbell Press: 3 × 10-12
• Cable Fly: 3 × 12-15
• Dip (chest lean): 3 × 10-12

**Advanced:**
• Decline Bench Press: 4 × 6-8
• Flat Dumbbell Press: 4 × 8-10
• Incline Cable Fly: 3 × 12-15
• Weighted Dip: 3 × 8-10

**Tips:**
• Retract scapulae (pinch shoulder blades)
• Control the eccentric (lowering phase)
• Full range of motion
• Mind-muscle connection`,
    followUp: ['Back workout', 'Shoulder workout', 'Full body split'],
    category: 'exercise',
  },
  {
    keywords: ['back', 'back workout', 'lats', 'latissimus', 'rhomboids', 'build back'],
    response: `💪 **Back Workout (ACSM/NSCA):**

**Beginner:**
• Pull-Up/Assisted Pull-Up: 3 × 8-12
• Seated Cable Row: 3 × 10-12
• Dumbbell Row: 3 × 10-12

**Intermediate:**
• Deadlift: 4 × 6-8
• Barbell Row: 4 × 8-10
• Lat Pulldown: 3 × 10-12
• Face Pull: 3 × 15-20

**Advanced:**
• Pendlay Row: 4 × 5-8
• Weighted Pull-Up: 4 × 6-8
• T-Bar Row: 3 × 8-10
• Rack Pull: 3 × 8-10

**Tips:**
• Initiate pulls with your lats, not arms
• Squeeze shoulder blades at top
• Full stretch at bottom
• Keep spine neutral during rows`,
    followUp: ['Chest workout', 'Shoulder workout', 'Bicep workout'],
    category: 'exercise',
  },
  {
    keywords: ['shoulder', 'shoulder workout', 'delt', 'deltoid', 'build shoulders'],
    response: `💪 **Shoulder Workout (ACSM/NSCA):**

**Beginner:**
• Overhead Press: 3 × 10-12
• Lateral Raise: 3 × 12-15
• Front Raise: 2 × 12-15

**Intermediate:**
• Military Press: 4 × 8-10
• Dumbbell Lateral Raise: 4 × 12-15
• Rear Delt Fly: 3 × 15-20
• Arnold Press: 3 × 10-12

**Advanced:**
• Push Press: 4 × 6-8
• Cable Lateral Raise: 4 × 12-15
• Face Pull: 3 × 15-20
• Upright Row (wide grip): 3 × 10-12

**Tips:**
• Don't use momentum on lateral raises
• Train all three heads: anterior, lateral, posterior
• Rear delts are often neglected — train them!
• Warm up rotator cuffs before heavy pressing`,
    followUp: ['Chest workout', 'Back workout', 'Arm workout'],
    category: 'exercise',
  },
  {
    keywords: ['leg', 'leg workout', 'quads', 'hamstrings', 'glutes', 'build legs', 'leg day'],
    response: `💪 **Leg Workout (ACSM/NSCA):**

**Beginner:**
• Goblet Squat: 3 × 12-15
• Walking Lunge: 3 × 10 each leg
• Leg Press: 3 × 12-15
• Calf Raise: 3 × 15-20

**Intermediate:**
• Barbell Back Squat: 4 × 8-10
• Romanian Deadlift: 4 × 8-10
• Bulgarian Split Squat: 3 × 10 each
• Leg Curl: 3 × 12-15

**Advanced:**
• Front Squat: 4 × 6-8
• Barbell Hip Thrust: 4 × 8-10
• Walking Lunge: 3 × 12 each
• Nordic Curl: 3 × 6-8

**Tips:**
• Squat depth: break parallel if mobility allows
• Drive through heels
• Knees track over toes (this is safe!)
• Don't skip leg day — legs are your largest muscles`,
    followUp: ['Upper body split', 'Full body workout', 'Home leg exercises'],
    category: 'exercise',
  },
  {
    keywords: ['arm', 'arm workout', 'bicep', 'tricep', 'build arms', 'bigger arms'],
    response: `💪 **Arm Workout:**

**Beginner:**
• Barbell Curl: 3 × 10-12
• Tricep Pushdown: 3 × 10-12
• Hammer Curl: 2 × 12-15
• Overhead Extension: 2 × 12-15

**Intermediate:**
• Barbell Curl: 4 × 8-10
• Close-Grip Bench Press: 4 × 8-10
• Incline Dumbbell Curl: 3 × 10-12
• Skull Crusher: 3 × 10-12
• Hammer Curl: 3 × 12-15
• Dip: 3 × 10-12

**Tips:**
• Triceps = 2/3 of arm size, prioritize them
• Full range of motion on curls
• No swinging — strict form
• Compound exercises (rows, dips) build arms too

Most arm size comes from compound movements!`,
    followUp: ['Chest workout', 'Back workout', 'Shoulder workout'],
    category: 'exercise',
  },
  {
    keywords: ['abs', 'ab', 'core', 'core workout', 'six pack', 'stomach', 'abs workout', 'get abs'],
    response: `💪 **Core Workout:**

**Visible abs require ~12-15% body fat (men) or ~16-20% (women).**

**Beginner:**
• Plank: 3 × 30-60 seconds
• Dead Bug: 3 × 10 each side
• Bird Dog: 3 × 10 each side
• Glute Bridge: 3 × 15

**Intermediate:**
• Hanging Leg Raise: 3 × 10-12
• Cable Crunch: 3 × 12-15
• Ab Rollout: 3 × 10-12
• Pallof Press: 3 × 10 each side

**Advanced:**
• Dragon Flag: 3 × 6-8
• Hanging Windshield Wiper: 3 × 8 each
• L-Sit Hold: 3 × 20-30 seconds

**Tips:**
• Diet reveals abs, training builds them
• Train core 3-4x/week
• Focus on anti-extension and anti-rotation
• Compound lifts (squats, deadlifts) train core heavily`,
    followUp: ['Diet for visible abs', 'Full body workout', 'Belly fat tips'],
    category: 'exercise',
  },

  // ─── EXERCISE — PROGRAMS ──────────────────────────────────────────────────
  {
    keywords: ['full body', 'full body workout', 'full body routine', 'full body split'],
    response: `🏋️ **Full Body Workout (ACSM Recommended):**

Best for beginners or those training 3x/week.

**Monday/Wednesday/Friday:**
1. Barbell Squat: 3 × 8-10
2. Bench Press: 3 × 8-10
3. Barbell Row: 3 × 8-10
4. Overhead Press: 3 × 10-12
5. Romanian Deadlift: 3 × 10-12
6. Plank: 3 × 45-60 sec
7. Face Pull: 2 × 15-20

**Rest between sets:** 60-90 seconds
**Total time:** ~45-60 minutes

**Progression:** Add 2.5 kg to upper body lifts and 5 kg to lower body lifts when you hit 10 reps for all sets.

This is the most efficient program for beginners!`,
    followUp: ['Upper/lower split', 'Push/pull/legs', 'Home workout'],
    category: 'exercise',
  },
  {
    keywords: ['upper lower', 'upper lower split', 'upper body', 'lower body', '4 day split'],
    response: `🏋️ **Upper/Lower Split (NSCA):**

Best for intermediate lifters, training 4x/week.

**Monday — Upper:**
1. Bench Press: 4 × 8-10
2. Barbell Row: 4 × 8-10
3. Overhead Press: 3 × 10-12
4. Lat Pulldown: 3 × 10-12
5. Dumbbell Curl: 3 × 10-12
6. Tricep Pushdown: 3 × 10-12

**Tuesday — Lower:**
1. Barbell Squat: 4 × 8-10
2. Romanian Deadlift: 4 × 8-10
3. Leg Press: 3 × 12-15
4. Leg Curl: 3 × 12-15
5. Calf Raise: 4 × 15-20
6. Plank: 3 × 60 sec

**Thursday — Upper** (variation)
**Friday — Lower** (variation)

**Rest:** 60-90 sec between sets
**Duration:** 50-70 min per session`,
    followUp: ['Full body workout', 'Push/pull/legs', '5 day split'],
    category: 'exercise',
  },
  {
    keywords: ['push pull', 'push pull legs', 'ppl', 'ppl split', '6 day split'],
    response: `🏋️ **Push/Pull/Legs Split (NSCA):**

Best for advanced lifters, training 6x/week.

**Push (Chest/Shoulders/Triceps):**
1. Bench Press: 4 × 8-10
2. Overhead Press: 3 × 10-12
3. Incline Dumbbell Press: 3 × 10-12
4. Lateral Raise: 4 × 12-15
5. Tricep Pushdown: 3 × 10-12
6. Overhead Extension: 3 × 12-15

**Pull (Back/Biceps):**
1. Deadlift: 4 × 5-8
2. Barbell Row: 4 × 8-10
3. Lat Pulldown: 3 × 10-12
4. Face Pull: 3 × 15-20
5. Barbell Curl: 3 × 10-12
6. Hammer Curl: 3 × 12-15

**Legs:**
1. Barbell Squat: 4 × 8-10
2. Romanian Deadlift: 4 × 8-10
3. Leg Press: 3 × 12-15
4. Walking Lunge: 3 × 10 each
5. Leg Curl: 3 × 12-15
6. Calf Raise: 4 × 15-20

Each muscle trained 2x per week — optimal for growth!`,
    followUp: ['Upper/lower split', 'Full body workout', 'Rest day importance'],
    category: 'exercise',
  },

  // ─── CARDIO ────────────────────────────────────────────────────────────────
  {
    keywords: ['cardio', 'aerobic', 'endurance', 'running', 'jogging', 'cycling', 'swimming'],
    response: `🏃 **Cardio Guidelines (CDC/ACSM):**

**Weekly targets:**
• 150 min moderate (brisk walking, cycling)
• OR 75 min vigorous (running, swimming laps)
• OR combination

**Heart rate zones:**
• Zone 1 (50-60%): Warm-up, recovery
• Zone 2 (60-70%): Fat burning, endurance base
• Zone 3 (70-80%): Cardiovascular fitness
• Zone 4 (80-90%): Anaerobic threshold
• Zone 5 (90-100%): Max effort, sprint intervals

**Best cardio for fat loss:** Zone 2 for 30-60 min
**Best for fitness:** Mix of Zone 2-4

**Max HR formula:** 220 - age (Tanaka: 208 - 0.7 × age)

**Tip:** Low-intensity steady state (LISS) burns more fat calories; high-intensity (HIIT) burns more total calories.`,
    followUp: ['HIIT vs LISS', 'Heart rate zones', 'Running plan for beginners'],
    category: 'exercise',
  },
  {
    keywords: ['hiit', 'high intensity', 'interval training', 'sprint', 'tabata'],
    response: `⚡ **HIIT Training (ACSM):**

**What:** Alternating high-intensity bursts with recovery periods

**Benefits:**
• Burns more calories in less time
• EPOC (afterburn) effect — elevated metabolism for 24-48 hrs
• Improves VO2 max
• Preserves muscle during fat loss

**Sample HIIT workout (20 min):**
1. Warm-up: 3 min light jog
2. Sprint 30 sec / Walk 60 sec × 10 rounds
3. Cool-down: 3 min walk

**Tabata protocol:**
• 20 sec max effort / 10 sec rest × 8 rounds
• Total: 4 minutes

**Frequency:** 2-3x per week (not consecutive days)
**Never** do HIIT before strength training (fatigues you)

Warning: Not for beginners — build base fitness first.`,
    followUp: ['HIIT vs steady state', 'Beginner cardio plan', 'Fat burning tips'],
    category: 'exercise',
  },

  // ─── BODY COMPOSITION ─────────────────────────────────────────────────────
  {
    keywords: ['bmi', 'body mass index', 'body fat', 'body composition', 'body metrics'],
    response: `📊 **Body Metrics (WHO Guidelines):**

**BMI Categories:**
• <18.5: Underweight
• 18.5-24.9: Normal weight ✓
• 25-29.9: Overweight
• 30-34.9: Obese Class I
• 35-39.9: Obese Class II
• ≥40: Obese Class III

**BMI limitations:**
• Doesn't distinguish muscle from fat
• Athletes may have high BMI but low body fat
• Waist circumference is a better health indicator

**Healthy waist circumference:**
• Men: <94 cm (37 inches)
• Women: <80 cm (31 inches)

**Body fat ranges (ACSM):**
• Men: Essential 2-5%, Athletes 6-13%, Fitness 14-17%, Average 18-24%
• Women: Essential 10-13%, Athletes 14-20%, Fitness 21-24%, Average 25-31%`,
    followUp: ['Calculate my BMI', 'How to reduce body fat', 'Body measurements'],
    category: 'health',
  },
  {
    keywords: ['tdee', 'total daily energy', 'maintenance calories', 'metabolism'],
    response: `📊 **TDEE Calculation (Harris-Benedict):**

Your TDEE = BMR × Activity Multiplier

**BMR (Mifflin-St Jeor):**
Men: 10×weight(kg) + 6.25×height(cm) - 5×age + 5
Women: 10×weight(kg) + 6.25×height(cm) - 5×age - 161

**Activity multipliers:**
• Sedentary (desk job): ×1.2
• Light exercise (1-3 days/wk): ×1.375
• Moderate (3-5 days/wk): ×1.55
• Active (6-7 days/wk): ×1.725
• Very active (physical job + training): ×1.9

**Example:** 70kg male, 175cm, 30 years, moderate exercise
BMR = 10(70) + 6.25(175) - 5(30) + 5 = 1,694 kcal
TDEE = 1,694 × 1.55 = 2,626 kcal/day

Use our Calculator page for your personalized numbers!`,
    followUp: ['Weight loss calories', 'Muscle gain calories', 'Calculate my BMR'],
    category: 'health',
  },
  {
    keywords: ['weight loss', 'lose weight', 'fat loss', 'lose fat', 'cutting', 'diet', 'dieting'],
    response: `⚖️ **Weight Loss Guidelines (ACSM/Obesity Society):**

**The science:** Caloric deficit = calories in < calories out

**Safe rate:** 0.5-1 kg (1-2 lbs) per week

**How to create deficit:**
• Diet: TDEE - 500 kcal/day (primary driver)
• Exercise: Adds to deficit + preserves muscle

**Key principles:**
• High protein (1.8-2.4g/kg) to preserve muscle
• Strength training to maintain muscle mass
• Moderate cardio for calorie burn
• Consistency > perfection

**Common mistakes:**
❌ Too aggressive deficit (>1000 kcal) — causes muscle loss
❌ Skipping protein — muscle breaks down
❌ No strength training — metabolism drops
❌ Only cardio — unsustainable long term

**Sustainability:** Make changes you can maintain for months, not weeks.`,
    followUp: ['Calculate my calories', 'Meal plan for weight loss', 'Exercise for fat loss'],
    category: 'health',
  },
  {
    keywords: ['muscle gain', 'build muscle', 'bulk', 'weight gain', 'put on weight', 'get bigger'],
    response: `💪 **Muscle Gain Guidelines (NSCA/ISSN):**

**Caloric surplus:** TDEE + 300-500 kcal/day

**Protein:** 1.6-2.2 g/kg/day (critical for muscle protein synthesis)

**Training:**
• Progressive overload (increase weight/reps)
• Train each muscle 2x/week
• Compound exercises as foundation
• 8-12 reps for hypertrophy
• 60-90 seconds rest between sets

**Recovery:**
• 7-9 hours sleep (growth hormone released during deep sleep)
• 1-2 rest days per week
• Manage stress (cortisol inhibits muscle growth)

**Realistic expectations:**
• Beginners: 1-1.5 kg muscle/month
• Intermediate: 0.5-1 kg/month
• Advanced: 0.25-0.5 kg/month

**It takes years, not months. Be patient and consistent.**`,
    followUp: ['Muscle building meals', 'Workout program', 'Supplements for muscle'],
    category: 'health',
  },

  // ─── SLEEP ─────────────────────────────────────────────────────────────────
  {
    keywords: ['sleep', 'rest', 'tired', 'fatigue', 'insomnia', 'cant sleep', 'sleep better', 'sleep quality'],
    response: `😴 **Sleep Guidelines (National Sleep Foundation):**

**Duration:** 7-9 hours per night (adults), 8-10 hours (athletes)

**Sleep hygiene checklist:**
✓ Consistent sleep/wake time (even weekends)
✓ Cool room (18-20°C / 65-68°F)
✓ Complete darkness
✓ No screens 30-60 min before bed
✓ No caffeine after 2 PM
✓ No alcohol close to bedtime
✓ No large meals 2-3 hours before bed
✓ Regular exercise (not too close to bed)

**Sleep stages:**
• Deep sleep: Physical recovery, growth hormone
• REM sleep: Mental recovery, memory, learning

**Impact of poor sleep:**
• Increases hunger hormones by 28%
• Reduces testosterone by 10-15%
• Impairs muscle recovery
• Reduces workout performance by 20-30%
• Increases injury risk

Sleep is the most underrated performance enhancer!`,
    followUp: ['Sleep routine tips', 'Relaxation techniques', 'Exercise and sleep'],
    category: 'sleep',
  },

  // ─── MENTAL HEALTH ────────────────────────────────────────────────────────
  {
    keywords: ['stress', 'anxiety', 'mental health', 'mind', 'calm', 'relax', 'overwhelmed', 'burnout'],
    response: `🧠 **Stress Management (APA/Mental Health Foundation):**

**Exercise & mood:**
• 30 minutes moderate exercise 3x/week
• Releases endorphins, serotonin, BDNF
• Can be as effective as antidepressants for mild-moderate depression

**Breathing techniques:**
• 4-7-8: Inhale 4s → Hold 7s → Exhale 8s
• Box breathing: 4s inhale → 4s hold → 4s exhale → 4s hold
• Diaphragmatic: Breathe into belly, not chest

**Mindfulness:**
• Start with 5 minutes daily
• Increase 1 min/week up to 20 min
• Best time: Morning or before bed

**Other strategies:**
• Time in nature (15+ minutes)
• Social connection
• Journaling
• Limiting screen time
• Saying no to excessive commitments

**If stress is persistent:** Please talk to a healthcare professional.`,
    followUp: ['Guided meditation', 'Workout for stress', 'Sleep tips'],
    category: 'mental',
  },

  // ─── SUPPLEMENTS ──────────────────────────────────────────────────────────
  {
    keywords: ['supplement', 'supplements', 'whey', 'creatine', 'protein powder', 'vitamin', 'fish oil', 'bcaa'],
    response: `💊 **Evidence-Based Supplements (ISSN/Mayo Clinic):**

**Strong evidence:**
• Whey Protein: 20-40g per serving, post-workout or between meals
• Creatine Monohydrate: 3-5g daily (no loading needed)
• Caffeine: 3-6 mg/kg, 30-60 min before exercise

**Moderate evidence:**
• Vitamin D: 1000-2000 IU daily (if deficient)
• Omega-3 Fish Oil: 1-3g EPA+DHA daily
• Magnesium: 200-400mg daily (before bed for sleep)

**Limited evidence:**
• BCAAs: Less effective than whey protein alone
• Glutamine: Marginal benefit if protein intake is adequate
• Testosterone boosters: Mostly ineffective

**Priority order:**
1. Whole foods first
2. Whey protein (convenience)
3. Creatine (strongest evidence)
4. Vitamin D (if deficient)
5. Omega-3

⚠️ Supplements supplement a good diet — they don't replace it.`,
    followUp: ['Best protein powder', 'Creatine guide', 'Vitamin D sources'],
    category: 'supplements',
  },
  {
    keywords: ['creatine', 'creatine supplement', 'creatine monohydrate'],
    response: `💊 **Creatine Guide (ISSN 2017):**

**What:** Natural compound that recycles ATP (energy) for muscles

**Dosage:** 3-5g daily (no loading phase needed)

**Benefits (strong evidence):**
• Increases strength by 5-10%
• Improves power output
• Enhances muscle growth
• May improve brain function
• Safe for long-term use

**Timing:** Any time of day, consistency matters more than timing

**Myths debunked:**
❌ Doesn't cause kidney damage (healthy individuals)
❌ Doesn't cause hair loss
❌ Doesn't require loading phase
❌ Isn't a steroid

**Best form:** Creatine monohydrate (cheapest, most studied)

**Hydration:** Drink extra water while on creatine (it draws water into muscles)

One of the most researched and effective supplements available!`,
    followUp: ['Whey protein', 'Pre-workout supplements', 'How to build muscle'],
    category: 'supplements',
  },

  // ─── HEALTH CONDITIONS ────────────────────────────────────────────────────
  {
    keywords: ['diabetes', 'blood sugar', 'insulin', 'type 2', 'sugar level'],
    response: `🏥 **Diabetes Management (ADA 2024):**

**Exercise:**
• 150 min/week moderate aerobic activity
• Resistance training 2-3x/week (improves insulin sensitivity)
• Monitor blood sugar before/after exercise
• Avoid exercising if blood sugar >250 mg/dL with ketones

**Nutrition:**
• Focus on complex carbs, high fiber, lean protein
• Limit refined sugars and processed foods
• Consistent meal timing helps blood sugar control
• Glycemic index awareness

**Important:** Always consult your doctor before starting an exercise program with diabetes. Carry fast-acting carbs during exercise.

⚠️ I'm not a medical professional. Please work with your healthcare team.`,
    followUp: ['Safe exercises for diabetes', 'Diabetes-friendly meals', 'Blood sugar monitoring'],
    category: 'health',
  },
  {
    keywords: ['blood pressure', 'hypertension', 'high blood pressure', 'heart health'],
    response: `🏥 **Blood Pressure Management (AHA 2023):**

**Exercise:**
• Regular aerobic exercise reduces BP by 5-8 mmHg
• Walking, cycling, swimming are excellent
• Avoid heavy Valsalva maneuvers (holding breath while lifting)
• 150 min/week moderate activity

**Nutrition (DASH diet):**
• Rich in fruits, vegetables, whole grains, lean protein
• Limit sodium to <2300 mg/day (ideally <1500 mg)
• Increase potassium (bananas, potatoes, spinach)
• Limit alcohol and caffeine

**Normal BP:** <120/80 mmHg
**Elevated:** 120-129/<80
**High (Stage 1):** 130-139/80-89
**High (Stage 2):** ≥140/≥90

⚠️ If you have hypertension, get medical clearance before vigorous exercise.`,
    followUp: ['Heart-healthy meals', 'DASH diet plan', 'Safe exercises'],
    category: 'health',
  },
  {
    keywords: ['back pain', 'lower back', 'back injury', 'spine', 'disc'],
    response: `🏥 **Back Pain Management (ACP Guidelines):**

**Exercise:**
• Core strengthening: Planks, Bird Dog, Dead Bug
• Walking (excellent for back pain)
• Swimming (low impact, full body)
• McKenzie method extensions
• Gradual return to activity

**Avoid initially:**
• Heavy deadlifts/squats
• Forward flexion exercises
• High-impact activities
• Prolonged sitting

**Nutrition:**
• Anti-inflammatory diet (omega-3, turmeric, ginger)
• Maintain healthy weight to reduce spinal load
• Calcium and Vitamin D for bone health

**Prevention:**
• Proper lifting technique (hinge at hips, not back)
• Core strength
• Ergonomic workspace
• Regular movement breaks

⚠️ Severe or persistent back pain requires medical evaluation.`,
    followUp: ['Core exercises for back', 'Ergonomic tips', 'Anti-inflammatory foods'],
    category: 'health',
  },

  // ─── AGE-SPECIFIC ─────────────────────────────────────────────────────────
  {
 keywords: ['older', 'elderly', 'aging', 'senior', 'over 40', 'over 50', 'over 60'],
    response: `👴 **Exercise for Older Adults (ACSM/CDC):**

**Muscle loss:** 3-8% per decade after 30 — resistance training is essential!

**Guidelines:**
• 150 min/week moderate aerobic (walking, cycling)
• 2-3 strength training sessions/week
• Balance exercises daily (fall prevention)
• Flexibility work daily

**Priority exercises:**
• Squats (chair-assisted if needed)
• Wall push-ups
• Resistance band rows
• Standing calf raises
• Single-leg stands
• Walking

**Protein need:** Higher than younger adults — 1.0-1.2 g/kg/day

**Benefits of exercise after 50:**
• Preserves muscle mass and bone density
• Improves balance and reduces fall risk
• Enhances cognitive function
• Manages chronic conditions
• Improves mood and sleep

It's never too late to start!`,
    followUp: ['Safe exercises for seniors', 'Balance exercises', 'Nutrition for aging'],
    category: 'health',
  },

  // ─── SPECIFIC QUESTIONS ───────────────────────────────────────────────────
  {
    keywords: ['heart rate', 'target heart rate', 'max heart rate', 'hr zone'],
    response: `❤️ **Heart Rate Zones (ACSM):**

**Max Heart Rate:** 220 - age (or Tanaka: 208 - 0.7 × age)

**Zones:**
• Zone 1 (50-60%): Warm-up, recovery
• Zone 2 (60-70%): Fat burning, endurance
• Zone 3 (70-80%): Cardiovascular fitness
• Zone 4 (80-90%): Anaerobic threshold
• Zone 5 (90-100%): Max effort, sprint intervals

**Example (30-year-old):**
Max HR = 220 - 30 = 190 bpm
Zone 2 = 114-133 bpm
Zone 3 = 133-152 bpm
Zone 4 = 152-171 bpm

**Best zone for:**
• Fat loss: Zone 2 (30-60 min)
• Fitness: Mix of Zone 2-4
• Performance: Zone 4-5 intervals

Use a heart rate monitor for accuracy!`,
    followUp: ['Zone 2 benefits', 'HIIT heart rate', 'Resting heart rate'],
    category: 'health',
  },
  {
    keywords: ['flexibility', 'stretching', 'flexible', 'mobility', 'tight', 'stiff'],
    response: `🧘 **Flexibility & Mobility (ACSM):**

**Why it matters:**
• Reduces injury risk
• Improves exercise performance
• Reduces muscle soreness
• Better posture
• Improved range of motion

**Types of stretching:**
• Dynamic: BEFORE workout (leg swings, arm circles)
• Static: AFTER workout (hold 30-60 seconds)
• PNF: Most effective (contract-relax technique)

**Daily routine (10 min):**
• Neck rotations: 10 each direction
• Shoulder circles: 10 each
• Hip circles: 10 each
• Hamstring stretch: 30 sec each
• Quad stretch: 30 sec each
• Calf stretch: 30 sec each
• Cat-cow: 10 reps

**Flexibility takes weeks to improve. Be consistent!**
**Yoga 2-3x/week** is excellent for overall flexibility.`,
    followUp: ['Yoga for beginners', 'Foam rolling', 'Warm-up routine'],
    category: 'exercise',
  },
  {
    keywords: ['injury', 'injured', 'hurt', 'pain', 'soreness', 'doms', 'muscle soreness'],
    response: `🏥 **Injury Prevention & Management (ACSM):**

**Prevention:**
✓ Warm up properly (5-10 min)
✓ Progress gradually (10% rule — increase max 10%/week)
✓ Use proper form
✓ Rest between sessions
✓ Stay hydrated
✓ Wear appropriate footwear
✓ Listen to your body

**DOMS (Delayed Onset Muscle Soreness):**
• Peaks 24-72 hours after exercise
• Normal response to new or intense exercise
• Manage with: light activity, foam rolling, hydration, sleep

**When to stop exercising:**
• Sharp pain (not normal muscle fatigue)
• Joint pain
• Dizziness or chest pain
• Pain that gets worse during exercise

**RICE for minor injuries:**
• Rest, Ice, Compression, Elevation

⚠️ Persistent or severe pain requires medical attention.`,
    followUp: ['Recovery tips', 'Warm-up routine', 'When to see a doctor'],
    category: 'health',
  },
  {
    keywords: ['women', 'female', 'women workout', 'women exercise', 'female fitness'],
    response: `👩 **Women's Fitness (ACSM/ACOG):**

**Exercise guidelines:**
Same as men: 150 min aerobic + 2x strength training

**Unique considerations:**
• Strength training is safe and beneficial — you won't "bulk up"
• Hormonal cycle can affect energy (follicular phase = higher energy)
• Menstrual cycle: Light exercise can reduce PMS symptoms
• Pregnancy: Modify intensity, avoid supine exercises after 1st trimester
• Menopause: Resistance training crucial for bone density

**Common myths:**
❌ "Lifting heavy makes women bulky" — testosterone too low
❌ "Cardio only for fat loss" — strength training more effective
❌ "Avoid strength training" — essential for bone health

**Priority for women:**
• Resistance training (bone density, metabolism)
• Protein intake (1.6-2.2 g/kg for active women)
• Calcium + Vitamin D (osteoporosis prevention)
• Core strength (pelvic floor health)

Strong is beautiful! 💪`,
    followUp: ['Women\'s workout plan', 'Strength training basics', 'Nutrition for women'],
    category: 'health',
  },
  {
    keywords: ['vegan', 'vegetarian', 'plant based', 'no meat', 'plant protein'],
    response: `🌱 **Plant-Based Nutrition (Academy of Nutrition & Dietetics):**

**Protein sources:**
• Lentils: 9g per 100g cooked
• Chickpeas: 9g per 100g cooked
• Tofu: 8g per 100g
• Tempeh: 19g per 100g
• Edamame: 11g per 100g
• Quinoa: 4.4g per 100g (complete protein)
• Hemp seeds: 10g per 3 tbsp
• Seitan: 25g per 100g

**Key nutrients to monitor:**
• Vitamin B12: Supplement (no plant sources)
• Iron: Combine with Vitamin C for absorption
• Omega-3: Algae-based supplement
• Calcium: Fortified plant milks, tofu, leafy greens
• Zinc: Pumpkin seeds, legumes, whole grains
• Protein: Combine throughout the day for complete amino acids

**Tip:** Plant proteins are complementary — rice + beans = complete protein.

A well-planned plant-based diet supports excellent athletic performance!`,
    followUp: ['Plant protein meals', 'Vegan supplements', 'Vegetarian meal plan'],
    category: 'nutrition',
  },
  {
    keywords: ['keto', 'ketogenic', 'low carb', 'keto diet'],
    response: `🥑 **Ketogenic Diet:**

**What:** Very low carb (<50g/day), high fat, moderate protein

**Pros:**
• Can reduce appetite
• May improve blood sugar in type 2 diabetes
• Effective for short-term weight loss

**Cons:**
• Difficult to sustain long-term
• May impair high-intensity exercise performance
• "Keto flu" during adaptation
• Risk of nutrient deficiencies
• May increase LDL cholesterol

**Exercise impact:**
• Strength training: Often maintained
• High-intensity cardio: Impaired (glycogen depleted)
• Endurance: May improve after adaptation

**ISSN position:** Low-carb diets can work for fat loss but are not superior to moderate-carb diets when calories and protein are matched.

**Recommendation:** Moderate carb reduction is more sustainable than strict keto for most people.`,
    followUp: ['Carb counting', 'Sustainable diet plan', 'Exercise on keto'],
    category: 'nutrition',
  },

  // ─── FAQ / GENERAL ────────────────────────────────────────────────────────
  {
    keywords: ['help', 'what can you do', 'capabilities', 'features', 'commands'],
    response: `🤖 **What I Can Help With:**

💪 **Exercise:**
• Workout programs (beginner to advanced)
• Exercise form and technique
• Progressive overload strategies
• Body-part specific training
• Cardio and HIIT guidance

🥗 **Nutrition:**
• Macro calculations
• Meal planning and timing
• Food recommendations
• Pre/post workout nutrition
• Special diets (vegan, keto, etc.)

📊 **Health:**
• BMI and TDEE calculations
• Body composition tracking
• Health condition guidance
• Supplement recommendations

😴 **Recovery:**
• Sleep optimization
• Stress management
• Flexibility and mobility
• Injury prevention

I provide evidence-based advice from certified guidelines. What would you like to know?`,
    followUp: ['Calculate my TDEE', 'Suggest a meal', 'Workout plan'],
    category: 'general',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'awesome', 'great', 'perfect', 'nice'],
    response: "You're welcome! I'm here to help you reach your goals. Remember:\n\n• Consistency beats perfection\n• Small changes compound into big results\n• Listen to your body\n• Celebrate every small victory\n\nWhat else can I help with?",
    followUp: ['Analyze my progress', 'Suggest a meal', 'Workout plan'],
    category: 'general',
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'done', 'exit'],
    response: "Goodbye! Keep up the great work on your fitness journey. I'm always here when you need me. Stay consistent and stay healthy! 💪",
    followUp: ['See you next time'],
    category: 'general',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SMART RESPONSE MATCHING — KEYWORD SCORING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

function calculateScore(input: string, keywords: string[]): number {
  const lower = input.toLowerCase();
  let score = 0;
  for (const keyword of keywords) {
    if (lower.includes(keyword)) {
      score += keyword.length; // Longer matches score higher
    }
  }
  return score;
}

export function findResponse(input: string): string {
  let bestScore = 0;
  let bestResponse: string | null = null;

  for (const item of chatResponses) {
    const score = calculateScore(input, item.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestResponse = item.response;
    }
  }

  if (bestResponse && bestScore > 0) return bestResponse;

  // Fallback: try FAQ
  const lower = input.toLowerCase();
  for (const [key, value] of Object.entries(FAQ)) {
    if (lower.includes(key) || key.split(' ').every(w => lower.includes(w))) {
      return value.answer;
    }
  }

  // Smart fallback based on topic detection
  if (lower.match(/\b(exercise|workout|train|gym|lift|reps|sets)\b/)) {
    return "I can help with exercise! Here are some topics:\n\n💪 **Workout programs:** Full body, upper/lower, push/pull/legs\n🎯 **Body parts:** Chest, back, legs, arms, shoulders, core\n📈 **Principles:** Progressive overload, warm-up, cool-down\n🏃 **Cardio:** HIIT, steady state, heart rate zones\n\nTry asking something specific like \"Chest workout\" or \"How to warm up\"!";
  }

  if (lower.match(/\b(food|eat|meal|diet|nutrition|calorie|protein|carb|fat)\b/)) {
    return "I can help with nutrition! Here are some topics:\n\n🥗 **Meal planning:** Pre-workout, post-workout, daily meals\n📊 **Macros:** Protein, carbs, fats, calories\n💧 **Hydration:** Daily water, electrolytes\n💊 **Supplements:** Whey, creatine, vitamins\n\nTry asking something specific like \"How much protein\" or \"Suggest a meal\"!";
  }

  if (lower.match(/\b(sleep|rest|tired|fatigue|insomnia)\b/)) {
    return "I can help with sleep! Key tips:\n\n😴 **Duration:** 7-9 hours per night\n🌙 **Sleep hygiene:** Cool dark room, consistent schedule, no screens before bed\n💪 **Exercise helps:** Regular physical activity improves sleep quality\n☕ **Caffeine:** Avoid after 2 PM\n\nTry asking \"Sleep tips\" for detailed advice!";
  }

  return "I'm still learning! Here's what I can help with:\n\n💪 **Exercise** — Workout programs, exercises, cardio, progressive overload\n🥗 **Nutrition** — Macros, meal planning, pre/post workout meals\n📊 **Health** — BMI, TDEE, body composition, weight management\n😴 **Sleep** — Duration, hygiene, tips\n💊 **Supplements** — Whey, creatine, vitamins\n🧠 **Mental health** — Stress, anxiety, mindfulness\n🏥 **Conditions** — Diabetes, hypertension, back pain\n\nTry asking something specific!";
}

export function getFollowUps(input: string): string[] {
  let bestScore = 0;
  let bestFollowUps: string[] = [];

  for (const item of chatResponses) {
    const score = calculateScore(input, item.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestFollowUps = item.followUp || [];
    }
  }

  if (bestFollowUps.length > 0) return bestFollowUps;

  return ['Analyze my progress', 'Suggest a meal', 'Exercise tips'];
}

export function getCategory(input: string): string {
  let bestScore = 0;
  let bestCategory = 'general';

  for (const item of chatResponses) {
    const score = calculateScore(input, item.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = item.category;
    }
  }

  return bestCategory;
}
