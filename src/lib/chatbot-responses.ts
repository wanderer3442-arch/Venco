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
    response: "Hey! 👋 I'm V — your gym buddy who happens to know a lot about health and fitness.\n\nI can help with workouts, nutrition, sleep, supplements, you name it. What's on your mind?",
    followUp: ['Suggest a meal', 'Workout tips', 'How much protein?', 'Sleep advice'],
    category: 'greeting',
  },
  {
    keywords: ['who are you', 'what are you', 'tell me about yourself', 'your name'],
    response: "I'm V — think of me as a fitness nerd who's read way too many research papers so you don't have to. I pull advice from WHO, CDC, Harvard, and sports nutrition guidelines to give you stuff that actually works.\n\nNot a doctor though — for medical stuff, always check with a real one.",
    followUp: ['What can you do?', 'Health tips', 'Meal suggestions'],
    category: 'greeting',
  },

  // ─── NUTRITION — MACROS ────────────────────────────────────────────────────
  {
    keywords: ['protein', 'how much protein', 'protein intake', 'protein per day', 'protein needs'],
    response: `Protein — the building block of muscle! Here's what the research says:\n\n📊 **How much you need (ISSN 2017):**\n• Just staying active: 0.8–1.0 g/kg/day\n• Regular gym-goer: 1.2–1.6 g/kg/day\n• Building muscle: 1.6–2.2 g/kg/day\n• Losing fat (to keep muscle): 1.8–2.4 g/kg/day\n• Over 65: 1.0–1.2 g/kg/day\n\n💡 **Per meal:** Aim for 20–40g — that's the sweet spot for muscle protein synthesis.\n\n**Top sources:**\n• Chicken breast — 31g per 100g\n• Salmon — 20g per 100g\n• Eggs — 6g each\n• Greek yogurt — 10g per 100g\n• Lentils — 9g per 100g\n\n🎯 **Pro tip:** Spread your protein across meals instead of loading it all into dinner. Your muscles respond better to consistent intake throughout the day.`,
    followUp: ['Best protein foods', 'Protein timing', 'Calculate my macros'],
    category: 'nutrition',
  },
  {
    keywords: ['carbs', 'carbohydrates', 'how many carbs', 'carb intake', 'low carb'],
    response: `Carbs are NOT the enemy — they fuel your brain, muscles, and workouts. Here's the breakdown:\n\n📊 **How much you need (IOM/ACSM):**\n• Sedentary: 3–5 g/kg/day\n• Moderate exercise: 5–7 g/kg/day\n• High intensity athlete: 8–12 g/kg/day\n• Endurance athlete: 6–10 g/kg/day\n\n✅ **Quality matters:** Go for complex carbs — oats, brown rice, sweet potatoes, quinoa. They give you sustained energy without the crash.\n\n❌ **Skip the refined stuff:** White bread, sugary drinks, candy — they spike your blood sugar and leave you hungry again in an hour.\n\n💡 **Bottom line:** Low-carb diets can kill your gym performance. You need carbs to lift heavy and recover well. Don't fear them — just choose wisely.`,
    followUp: ['Best carb sources', 'When to eat carbs', 'Low carb vs keto'],
    category: 'nutrition',
  },
  {
    keywords: ['fat', 'fats', 'healthy fat', 'fat intake', 'dietary fat'],
    response: `Fat isn't the villain — your body actually needs it for hormones, brain function, and absorbing vitamins.\n\n📊 **How much (IOM):**\n• General: 20–35% of your daily calories\n• Don't go below 20% — your hormones will thank you\n• That's roughly 0.8–1.0 g/kg/day\n\n✅ **The good fats (eat plenty):**\n• Olive oil, avocados, nuts, fatty fish (salmon, sardines)\n\n⚠️ **Saturated fats (in moderation):**\n• Red meat, cheese, butter — fine occasionally\n\n❌ **Trans fats (avoid completely):**\n• Found in processed/fried foods — seriously bad for your heart\n\n💡 **Don't skip fats on a diet.** They keep you full, support testosterone production, and help your body absorb vitamins A, D, E, and K.`,
    followUp: ['Best fat sources', 'Omega-3 benefits', 'Saturated fat risks'],
    category: 'nutrition',
  },
  {
    keywords: ['calories', 'calorie', 'calorie intake', 'daily calories', 'how many calories'],
    response: `Your calorie needs depend on how active you are. Here's how to figure it out:\n\n📊 **TDEE (Total Daily Energy Expenditure):**\n• Sedentary (desk job): BMR × 1.2\n• Light activity: BMR × 1.375\n• Moderate (3–5 gym sessions): BMR × 1.55\n• Active (6–7 sessions): BMR × 1.725\n• Very active (physical job + training): BMR × 1.9\n\n🎯 **What to aim for:**\n• Lose weight: TDEE minus 500 kcal/day\n• Build muscle: TDEE plus 300 kcal/day\n• Maintain: Match your TDEE\n\n📐 **Quick BMR formula (Mifflin-St Jeor):**\n• Men: 10×weight(kg) + 6.25×height(cm) – 5×age + 5\n• Women: 10×weight(kg) + 6.25×height(cm) – 5×age – 161\n\nHead over to the Calculator page for your personalized numbers!`,
    followUp: ['Calculate my TDEE', 'Weight loss calories', 'Muscle gain calories'],
    category: 'nutrition',
  },

  // ─── NUTRITION — MEALS ────────────────────────────────────────────────────
  {
    keywords: ['meal', 'food', 'eat', 'breakfast', 'lunch', 'dinner', 'snack', 'what to eat', 'suggest meal', 'meal suggestion'],
    response: `Not sure what to eat? Here are some solid options based on USDA guidelines:\n\n🍳 **Breakfast (400–500 kcal):**\n• Oatmeal + banana + almond butter + whey scoop\n• Greek yogurt + berries + granola + honey\n• 3 eggs + whole grain toast + avocado\n\n🥗 **Lunch (500–600 kcal):**\n• Grilled chicken salad with olive oil dressing\n• Quinoa bowl + veggies + paneer\n• Lentil soup + whole grain bread\n\n🍗 **Dinner (400–550 kcal):**\n• Baked salmon + sweet potato + broccoli\n• Chicken stir-fry + brown rice\n• Tofu curry + quinoa + vegetables\n\n🍎 **Snacks (150–250 kcal):**\n• Apple + peanut butter\n• Greek yogurt + nuts\n• Protein shake + banana\n• Cottage cheese + berries\n\n🎯 **Rule of thumb:** Aim for 3–5 meals spread throughout the day, every 3–4 hours.`,
    followUp: ['Calculate my macros', 'Meal timing tips', 'High protein meals'],
    category: 'nutrition',
  },
  {
    keywords: ['meal plan', 'meal prep', 'meal planning', 'weekly meal', 'diet plan'],
    response: `Meal prepping is a game-changer — here's how to do it right:\n\n📋 **The structure:**\n• 3–5 meals per day\n• Each meal: 0.4–0.55g protein per kg of body weight\n• Pre-workout (1–3 hrs before): Carbs + moderate protein\n• Post-workout (within 2 hrs): Protein + carbs\n\n🥘 **Prep tips that actually work:**\n• Batch cook proteins (chicken, lentils) on Sunday\n• Pre-cut your veggies for the week\n• Make overnight oats for grab-and-go breakfasts\n• Keep healthy snacks in reach\n\n📊 **Macro balance:** 40% carbs, 30% protein, 30% fat — adjust based on your goals.\n\n💡 Check out the Meal Plan page to track your weekly intake!`,
    followUp: ['Pre-workout meals', 'Post-workout meals', 'Snack ideas'],
    category: 'nutrition',
  },
  {
    keywords: ['pre workout', 'pre-workout', 'before workout', 'eat before', 'before exercise'],
    response: `What you eat before a workout matters. Here's the timing:\n\n⏰ **1–3 hours before:**\n• Oatmeal with honey\n• Banana + peanut butter\n• Greek yogurt with berries\n• Rice cakes with almond butter\n\n⏰ **30 minutes before (quick fuel):**\n• Small banana\n• Sports drink\n• A handful of dates\n\n❌ **Avoid:** High fat, high fiber, or large meals — they sit in your stomach and slow you down.\n\n💡 **The goal:** Give your body easy-to-digest carbs + a bit of protein so you have energy without feeling heavy.`,
    followUp: ['Post-workout nutrition', 'Best pre-workout foods', 'Hydration tips'],
    category: 'nutrition',
  },
  {
    keywords: ['post workout', 'post-workout', 'after workout', 'after exercise', 'recovery meal'],
    response: `Your post-workout meal is crucial for recovery. Here's what to eat and when:\n\n⏰ **Within 2 hours after exercise**\n\n🍽️ **What to eat:**\n• Protein (20–40g) + Carbs\n• Chicken breast + rice + vegetables\n• Protein shake + banana\n• Greek yogurt + granola + fruit\n• Eggs + whole grain toast + avocado\n\n📊 **The ratio depends on your workout:**\n• Strength training → 2:1 carbs to protein\n• Endurance training → 3:1 or 4:1 carbs to protein\n\n💡 **Why this matters:** Your muscles are like sponges after a workout — they soak up nutrients really efficiently. Protein repairs the muscle damage, carbs refill your energy stores.\n\nDon't skip this window — it makes a real difference in how fast you recover!`,
    followUp: ['Pre-workout meals', 'Protein shake timing', 'Recovery tips'],
    category: 'nutrition',
  },

  // ─── HYDRATION ─────────────────────────────────────────────────────────────
  {
    keywords: ['water', 'hydrate', 'hydration', 'drink', 'how much water', 'dehydration', 'thirst'],
    response: `Water is boring to talk about but essential for everything — from muscle function to fat loss.\n\n💧 **Daily targets:**\n• Men: about 3.7 liters\n• Women: about 2.7 liters\n\n🏃 **During exercise:**\n• Before: 500 mL, 2–4 hours prior\n• During: 150–250 mL every 15–20 minutes\n• After: 1.5 L per kg of body weight lost through sweat\n\n🔍 **Quick check — urine color:**\n• Pale yellow = good ✓\n• Dark yellow = drink more\n• Amber = dehydrated\n• Completely clear = over-hydrating\n\n🎯 **Easy tips:**\n• Keep a water bottle where you can see it\n• Drink a glass first thing in the morning\n• Set hourly reminders on your phone\n• If you're sweating a lot, add electrolytes`,
    followUp: ['Electrolyte tips', 'Water vs sports drinks', 'Hydration reminders'],
    category: 'hydration',
  },

  // ─── EXERCISE — GENERAL ───────────────────────────────────────────────────
  {
    keywords: ['exercise', 'workout', 'train', 'gym', 'run', 'cardio', 'exercise tips', 'workout tips'],
    response: `Here's what the CDC and ACSM actually recommend — no fluff:\n\n📅 **Weekly targets:**\n• 150 min moderate aerobic (brisk walking, cycling) OR 75 min vigorous (running, swimming)\n• 2+ strength sessions hitting all major muscles\n• Flexibility work 2–3 days/week\n\n🔥 **What a good session looks like:**\n1. Warm-up: 5–10 min dynamic stretching\n2. Main workout: 30–45 min\n3. Cool-down: 5–10 min static stretching\n\n📈 **The principles that matter:**\n• Progressive overload — keep making it harder\n• Form over ego — heavy weights with bad form = injury\n• 60–90 seconds rest between sets\n• Rest days are when you actually grow\n\n💡 **The real secret?** Consistency beats intensity. Showing up 4 times a week at moderate effort will beat one killer session followed by skipping a week.`,
    followUp: ['Full body workout', 'Upper/lower split', 'Home exercises'],
    category: 'exercise',
  },
  {
    keywords: ['warm up', 'warmup', 'warm-up', 'before workout', 'stretching'],
    response: `Don't skip your warm-up — it cuts injury risk by about 50%. Here's what to do:\n\n🔥 **5–10 minutes before every session:**\n• Arm circles — 10 each direction\n• Leg swings — 10 each leg\n• Hip rotations — 10 each direction\n• Bodyweight squats — 10 reps\n• Walking lunges — 10 each leg\n• High knees — 30 seconds\n• Butt kicks — 30 seconds\n\n⚠️ **Important:** Don't static stretch cold muscles! That's for after your workout. Dynamic movement warms you up; static stretching cools you down.`,
    followUp: ['Cool-down routine', 'Dynamic vs static stretching', 'Pre-workout stretches'],
    category: 'exercise',
  },
  {
    keywords: ['cool down', 'cooldown', 'cool-down', 'after workout', 'post workout stretch'],
    response: `Cooling down properly helps your body transition back to resting state. Here's the routine:\n\n❄️ **5–10 minutes after every session:**\n1. Light walking — 3–5 min to bring your heart rate down gradually\n2. Static stretches — hold each 30–60 seconds:\n   • Hamstrings\n   • Quads\n   • Chest\n   • Shoulders\n   • Hip flexors\n   • Calves\n3. Deep breathing — 1 minute\n\n💡 **Why it matters:**\n• Prevents blood from pooling in your legs\n• Reduces next-day soreness\n• Improves flexibility over time\n\nStretch to the point of mild tension — never pain.`,
    followUp: ['Warm-up routine', 'Stretching routine', 'Recovery tips'],
    category: 'exercise',
  },
  {
    keywords: ['compound', 'compound exercise', 'best exercises', 'multi joint', 'multi-joint'],
    response: `Compound exercises are the heavy hitters — they work multiple joints and muscle groups at once. Here's why they're king:\n\n🏋️ **Lower body:**\n• Barbell Squat — quads, glutes, hamstrings, core\n• Deadlift — hamstrings, glutes, back, traps\n• Walking Lunge — quads, glutes, hamstrings\n\n🏋️ **Upper push:**\n• Bench Press — chest, shoulders, triceps\n• Overhead Press — shoulders, triceps, core\n• Dip — chest, triceps\n\n🏋️ **Upper pull:**\n• Barbell Row — back, biceps, rear delts\n• Pull-Up — lats, biceps, core\n\n🏋️ **Full body:**\n• Kettlebell Swing — glutes, hamstrings, core\n• Burpee — full body conditioning\n\n💡 **Rule:** Build your workout around compounds first, then add isolation work to hit weak spots.`,
    followUp: ['Isolation exercises', 'Beginner routine', 'Advanced routine'],
    category: 'exercise',
  },
  {
    keywords: ['isolation', 'isolation exercise', 'single muscle', 'bicep curl', 'tricep extension'],
    response: `Isolation exercises hit one muscle at a time — they're great for fixing imbalances or adding extra volume after your main lifts.\n\n🎯 **Examples by muscle:**\n• Biceps: Barbell Curl, Hammer Curl, Preacher Curl\n• Triceps: Pushdown, Overhead Extension, Skull Crusher\n• Shoulders: Lateral Raise, Front Raise, Rear Delt Fly\n• Legs: Leg Extension, Leg Curl, Calf Raise\n• Abs: Cable Crunch, Ab Rollout, Leg Raise\n\n📊 **When and how:**\n• Do them after compound exercises\n• 10–15 reps, 2–3 sets\n• 30–60 seconds rest\n\n💡 Think of it this way: compounds are your main course, isolation work is the side dish. Both matter, but prioritize the main stuff.`,
    followUp: ['Compound exercises', 'Bicep workout', 'Shoulder workout'],
    category: 'exercise',
  },
  {
    keywords: ['progressive overload', 'overload', 'increase weight', 'getting stronger', 'stalled progress', 'plateau'],
    response: `This is THE most important principle for getting results. Without it, your body adapts and stops changing.\n\n📈 **How to progressively overload:**\n1. Add weight — when you hit the top of your rep range, bump it up by 2.5–5 kg\n2. Add reps — squeeze out 1–2 more reps per set each week\n3. Add sets — throw in an extra set per exercise\n4. Cut rest — reduce rest periods by 10–15 seconds\n5. Better form — improve your mind-muscle connection\n\n📋 **Example progression:**\nWeek 1: 60kg × 3 × 8 reps\nWeek 2: 60kg × 3 × 9 reps\nWeek 3: 60kg × 3 × 10 reps\nWeek 4: 62.5kg × 3 × 8 reps\n\n🎯 **The 2.5–5% rule:** Increase the load by 2.5–5% once you hit your target reps.\n\n💡 If you're not tracking your workouts, you're guessing. Log everything!`,
    followUp: ['How to track progress', 'Deload weeks', 'When to change program'],
    category: 'exercise',
  },
  {
    keywords: ['rest day', 'rest days', 'recovery', 'how often rest', 'overtraining'],
    response: `Yes, rest days are actually essential — here's why:\n\n😴 **How much rest:**\n• 1–2 rest days per week minimum\n• 48–72 hours between training the same muscle group\n• 7–9 hours of sleep nightly\n\n🔬 **What happens when you rest:**\n• Muscles repair and grow\n• Glycogen stores refill\n• Hormones optimize (testosterone, growth hormone)\n• Nervous system recovers\n• Mental batteries recharge\n\n⚠️ **Signs you're overdoing it:**\n• Constant fatigue that doesn't go away\n• Performance dropping instead of improving\n• Elevated resting heart rate\n• Terrible sleep\n• Getting sick more often\n• Mood swings\n\n🧘 **Active recovery days:** Light walking, yoga, foam rolling — don't just sit on the couch all day.\n\n💡 **The truth:** More training ≠ better results. Your body grows during rest, not during the workout itself.`,
    followUp: ['Deload weeks', 'Sleep tips', 'Foam rolling guide'],
    category: 'exercise',
  },
  {
    keywords: ['deload', 'deload week', 'take a break', 'reduce intensity'],
    response: `A deload is a planned week where you dial back the intensity — it's not slacking, it's smart training.\n\n🔄 **What to do:**\n• Drop the weight by 40–60%\n• Keep the same exercises\n• Same number of sets\n• Focus on perfect form\n\n📅 **When:** Every 4–8 weeks\n\n💡 **Why it works:**\n• Lets your body fully recover\n• Prevents overtraining\n• Reduces injury risk\n• Refreshes you mentally\n• Sets you up for a stronger next cycle\n\n⚠️ **Signs you need one now:**\n• Performance is declining\n• You're sore all the time\n• You dread going to the gym\n• Sleep is off\n\nThink of deloads as an investment in long-term progress, not a step backwards.`,
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
    response: `Sleep is honestly the most underrated performance enhancer. Here's what actually matters:\n\n😴 **Duration:**\n• Adults: 7–9 hours\n• Athletes: 8–10 hours\n\n🌙 **Sleep hygiene checklist:**\n• Same sleep/wake time every day — yes, weekends too\n• Cool room: 18–20°C (65–68°F)\n• Complete darkness\n• No screens 30–60 min before bed\n• No caffeine after 2 PM\n• No alcohol close to bedtime\n• No big meals 2–3 hours before bed\n• Exercise regularly, but not right before bed\n\n🔬 **Why it matters:**\n• Deep sleep = physical recovery + growth hormone release\n• REM sleep = mental recovery + memory + learning\n• Poor sleep increases hunger hormones by 28%\n• Bad sleep drops testosterone by 10–15%\n• Bad sleep cuts workout performance by 20–30%\n\n💡 **Bottom line:** You can't out-train bad sleep. Fix this first before anything else.`,
    followUp: ['Sleep routine tips', 'Relaxation techniques', 'Exercise and sleep'],
    category: 'sleep',
  },

  // ─── MENTAL HEALTH ────────────────────────────────────────────────────────
  {
    keywords: ['stress', 'anxiety', 'mental health', 'mind', 'calm', 'relax', 'overwhelmed', 'burnout'],
    response: `Feeling stressed? Exercise is genuinely one of the best things you can do for your mind.\n\n💪 **Exercise & mood:**\n• 30 minutes of moderate exercise, 3x/week\n• Releases endorphins, serotonin, and BDNF (brain fertilizer)\n• Studies show it can be as effective as antidepressants for mild-moderate depression\n\n🫁 **Breathing techniques that work:**\n• 4-7-8: Inhale 4s → Hold 7s → Exhale 8s (great for falling asleep)\n• Box breathing: 4s inhale → 4s hold → 4s exhale → 4s hold\n• Diaphragmatic: Breathe into your belly, not your chest\n\n🧘 **Mindfulness:**\n• Start with just 5 minutes a day\n• Add 1 minute per week up to 20\n• Morning or before bed works best\n\n🌿 **Other stuff that helps:**\n• Get outside in nature for 15+ minutes\n• Talk to people you care about\n• Write things down\n• Reduce screen time\n• Learn to say no to things that drain you\n\n⚠️ **If stress is constant or overwhelming:** Please talk to a healthcare professional. There's no shame in getting support.`,
    followUp: ['Guided meditation', 'Workout for stress', 'Sleep tips'],
    category: 'mental',
  },

  // ─── SUPPLEMENTS ──────────────────────────────────────────────────────────
  {
    keywords: ['supplement', 'supplements', 'whey', 'creatine', 'protein powder', 'vitamin', 'fish oil', 'bcaa'],
    response: `Let's cut through the marketing noise. Here's what the research actually supports:\n\n✅ **Strong evidence (worth taking):**\n• Whey Protein — 20–40g per serving, post-workout or between meals. Convenient way to hit your protein targets.\n• Creatine Monohydrate — 3–5g daily. Cheapest, most studied, actually works. No loading needed.\n• Caffeine — 3–6 mg/kg, 30–60 min before training. Proven ergogenic aid.\n\n👍 **Moderate evidence (good if deficient):**\n• Vitamin D — 1000–2000 IU daily. Most people are deficient.\n• Omega-3 Fish Oil — 1–3g EPA+DHA daily. Good for inflammation and brain health.\n• Magnesium — 200–400mg daily, especially before bed. Helps with sleep too.\n\n🤷 **Limited evidence (save your money):**\n• BCAAs — if you eat enough protein, these are redundant\n• Glutamine — marginal benefit at best\n• Testosterone boosters — mostly worthless\n\n📋 **Priority order:**\n1. Whole foods first, always\n2. Whey protein (convenience)\n3. Creatine (strongest evidence)\n4. Vitamin D (if deficient)\n5. Omega-3\n\n⚠️ Supplements are the cherry on top — they don't replace a solid diet.`,
    followUp: ['Best protein powder', 'Creatine guide', 'Vitamin D sources'],
    category: 'supplements',
  },
  {
    keywords: ['creatine', 'creatine supplement', 'creatine monohydrate'],
    response: `Creatine is the single most researched supplement out there, and it actually works. Here's the lowdown:\n\n💊 **What it does:** Recycles ATP (your muscles' energy currency) so you can push harder.\n\n📊 **Dosage:** 3–5g daily. That's it. No loading phase needed.\n\n✅ **Proven benefits:**\n• Strength gains of 5–10%\n• Better power output\n• More muscle growth\n• May even help brain function\n• Safe for long-term use\n\n⏰ **Timing:** Doesn't matter — just take it daily. Consistency beats timing.\n\n❌ **Myths debunked:**\n• "It hurts your kidneys" — nope, in healthy people\n• "It causes hair loss" — one study, never replicated\n• "You need to load it" — unnecessary\n• "It's a steroid" — it's a natural compound found in meat\n\n📝 **Best form:** Creatine monohydrate. Cheapest, most studied, works perfectly.\n\n💧 **One thing:** Drink a bit more water while on it — it pulls water into your muscles.`,
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
    response: `Hey — I'm V, your fitness sidekick. Here's what I can help with:\n\n💪 Exercise: Workout programs, exercise form, progressive overload, body-part splits, cardio guidance\n🥗 Nutrition: Macro calculations, meal planning, pre/post workout meals, special diets\n📊 Health: BMI, TDEE, body composition, weight management, health conditions\n😴 Sleep: How to sleep better, sleep hygiene, recovery\n💊 Supplements: What's worth taking and what's marketing\n🧠 Mental Health: Stress management, breathing techniques, mindfulness\n🏥 Conditions: Diabetes, hypertension, back pain — with medical disclaimers\n\nAll my advice comes from certified sources like WHO, CDC, ACSM, and sports nutrition guidelines. What do you want to know?`,
    followUp: ['Calculate my TDEE', 'Suggest a meal', 'Workout plan'],
    category: 'general',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'awesome', 'great', 'perfect', 'nice'],
    response: "Happy to help! Remember — consistency beats perfection, small changes add up, and your body is always communicating with you. Listen to it.\n\nWhat else can I help with?",
    followUp: ['Analyze my progress', 'Suggest a meal', 'Workout plan'],
    category: 'general',
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'done', 'exit'],
    response: "Catch you later! Keep showing up — that's literally 90% of the battle. I'm here whenever you need me. 💪",
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
    return "I can help with exercise! Try asking about:\n\n• Workout programs — full body, upper/lower, push/pull/legs\n• Body parts — chest, back, legs, arms, shoulders, core\n• Principles — progressive overload, warm-up, cool-down\n• Cardio — HIIT, steady state, heart rate zones\n\nFor example, try \"Chest workout\" or \"How to warm up\"";
  }

  if (lower.match(/\b(food|eat|meal|diet|nutrition|calorie|protein|carb|fat)\b/)) {
    return "I can help with nutrition! Try asking about:\n\n• Meal planning — pre-workout, post-workout, daily meals\n• Macros — protein, carbs, fats, calories\n• Hydration — daily water, electrolytes\n• Supplements — whey, creatine, vitamins\n\nFor example, try \"How much protein\" or \"Suggest a meal\"";
  }

  if (lower.match(/\b(sleep|rest|tired|fatigue|insomnia)\b/)) {
    return "I can help with sleep! Here are the key things:\n\n• 7–9 hours per night is the target\n• Keep your room cool and dark\n• Same sleep time every day — even weekends\n• No screens before bed\n• Avoid caffeine after 2 PM\n\nTry asking \"Sleep tips\" for the full breakdown!";
  }

  return "I'm still learning! Here's what I know about:\n\n💪 Exercise — workouts, form, cardio, progressive overload\n🥗 Nutrition — macros, meals, hydration\n📊 Health — BMI, TDEE, weight management\n😴 Sleep — duration, hygiene, recovery\n💊 Supplements — whey, creatine, vitamins\n🧠 Mental health — stress, anxiety, mindfulness\n🏥 Conditions — diabetes, hypertension, back pain\n\nTry asking something specific!";
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
