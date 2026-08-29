export interface ChatResponse {
  keywords: string[];
  response: string;
  followUp?: string[];
}

export const chatResponses: ChatResponse[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello! I'm V, your Gym at Home AI Health Assistant. How can I help you today? You can ask me about:\n\n• Your health metrics\n• Meal suggestions\n• Exercise recommendations\n• Sleep tips\n• Hydration goals",
    followUp: ['Analyze my progress', 'Suggest a meal', 'Give me exercise tips'],
  },
  {
    keywords: ['analyze', 'progress', 'stats', 'metrics'],
    response: "Based on your recent data, here's your weekly analysis:\n\n**Calorie Intake:** You've averaged 2,050 kcal/day, which is within your target range.\n\n**Protein:** Averaging 120g/day - great for muscle maintenance!\n\n**Hydration:** You've hit your water goal 5/7 days this week.\n\n**Exercise:** 4 workouts completed this week.\n\n**Recommendations:**\n• Increase protein on rest days\n• Try to hit water goal daily\n• Consider adding a stretching routine",
    followUp: ['How can I improve?', 'What should I eat?', 'Show me exercises'],
  },
  {
    keywords: ['meal', 'food', 'eat', 'breakfast', 'lunch', 'dinner', 'snack'],
    response: "Here are some healthy meal ideas based on your goals:\n\n**Breakfast Options:**\n• Greek yogurt with berries & granola (350 kcal, 25g protein)\n• Oatmeal with banana & almonds (300 kcal, 12g protein)\n• Eggs with whole grain toast (380 kcal, 22g protein)\n\n**Lunch Options:**\n• Grilled chicken salad with olive oil dressing (420 kcal, 35g protein)\n• Quinoa bowl with vegetables (380 kcal, 15g protein)\n• Lentil soup with whole grain bread (350 kcal, 18g protein)\n\n**Dinner Options:**\n• Baked salmon with roasted vegetables (450 kcal, 40g protein)\n• Lean beef stir-fry with brown rice (480 kcal, 35g protein)\n• Tofu curry with quinoa (400 kcal, 20g protein)\n\n**Snacks:**\n• Apple with peanut butter (200 kcal, 8g protein)\n• Handful of mixed nuts (180 kcal, 6g protein)\n• Protein shake (150 kcal, 25g protein)",
    followUp: ['Calculate my macros', 'What should I avoid?', 'Show me recipes'],
  },
  {
    keywords: ['exercise', 'workout', 'train', 'gym', 'run', 'cardio'],
    response: "Based on your fitness level and goals, here's what I recommend:\n\n**Today's Workout:**\n1. Warm-up: 5 min light cardio\n2. Main: 30 min strength training\n3. Cool-down: 5 min stretching\n\n**Weekly Goals:**\n• 3 strength sessions\n• 2 cardio sessions\n• 1 flexibility session\n\n**Tips:**\n• Focus on compound movements (squats, deadlifts, bench press)\n• Progressive overload each week\n• Rest between sets: 60-90 seconds\n• Stay hydrated during workouts",
    followUp: ['What exercises for chest?', 'How to build muscle?', 'Cardio vs strength?'],
  },
  {
    keywords: ['sleep', 'rest', 'tired', 'fatigue'],
    response: "Great question! Based on your recent data, here are my recommendations for better sleep:\n\n**Sleep Quality Improvement Plan:**\n\n1. **Consistent Schedule:** Your sleep times have varied by 2+ hours. Try to sleep within the same 30-minute window each night.\n\n2. **Evening Routine:** Your last screen time averages 11:30 PM. Consider reducing blue light exposure 1 hour before bed.\n\n3. **Caffeine Cutoff:** You logged coffee at 4 PM twice this week. Try to cut off caffeine by 2 PM.\n\n4. **Exercise Timing:** Your evening workouts end around 8:30 PM, which is good - this gives you 3+ hours before sleep.\n\n**Your Sleep Score: 72/100**\n• Duration: 7.5h (Good)\n• Consistency: 65% (Needs improvement)\n• Quality: 70% (Fair)",
    followUp: ['Create sleep plan', 'Melatonin tips', 'Relaxation techniques'],
  },
  {
    keywords: ['water', 'hydrate', 'hydration', 'drink'],
    response: "Hydration is crucial for your health! Here's your status:\n\n**Today's Water Intake:** 1.8L / 2.5L goal\n\n**Hydration Tips:**\n• Drink a glass of water first thing in the morning\n• Keep a water bottle at your desk\n• Set hourly reminders\n• Drink before, during, and after exercise\n• Monitor urine color (should be light yellow)\n\n**Benefits of Proper Hydration:**\n• Improved energy levels\n• Better brain function\n• Enhanced physical performance\n• Clearer skin\n• Better digestion",
    followUp: ['How much should I drink?', 'Water vs sports drinks?', 'Hydration reminders'],
  },
  {
    keywords: ['weight', 'lose', 'fat', 'calorie', 'diet'],
    response: "Let's talk about your weight management goals:\n\n**Your Current Stats:**\n• BMI: 23.5 (Normal range ✓)\n• Target Calories: 2,200 kcal/day\n• Current Intake: 2,050 kcal/day\n\n**Weight Management Tips:**\n1. **Caloric Deficit:** You're currently at a 150 kcal deficit, which is healthy\n2. **Protein Intake:** Aim for 1.8-2.2g per kg of body weight\n3. **Meal Timing:** Eat every 3-4 hours to maintain metabolism\n4. **Avoid:** Processed foods, sugary drinks, excessive carbs\n\n**Expected Progress:**\n• Healthy weight loss: 0.5-1 kg per week\n• Maintain muscle mass with protein + strength training\n• Stay hydrated",
    followUp: ['Create meal plan', 'Calculate my TDEE', 'What to avoid?'],
  },
  {
    keywords: ['muscle', 'gain', 'bulk', 'strength', 'build'],
    response: "Great goal! Here's how to build muscle effectively:\n\n**Muscle Building Fundamentals:**\n\n1. **Progressive Overload:** Increase weight/reps each week\n2. **Protein Intake:** 1.6-2.2g per kg of body weight\n3. **Caloric Surplus:** Eat 300-500 calories above maintenance\n4. **Sleep:** 7-9 hours for recovery\n5. **Rest Days:** Muscles grow during rest, not training\n\n**Your Target Macros:**\n• Protein: 125g/day\n• Carbs: 280g/day\n• Fat: 65g/day\n\n**Best Muscle-Building Exercises:**\n• Compound: Squats, Deadlifts, Bench Press, Rows\n• Isolation: Curls, Tricep Extensions, Lateral Raises\n• Frequency: Train each muscle 2x per week",
    followUp: ['Show me workout plan', 'What to eat for muscle?', 'Recovery tips'],
  },
  {
    keywords: ['stress', 'anxiety', 'mental', 'mind', 'calm'],
    response: "Mental health is just as important as physical health. Here are some tips:\n\n**Stress Management Techniques:**\n\n1. **Deep Breathing:** 4-7-8 technique (inhale 4s, hold 7s, exhale 8s)\n2. **Meditation:** Start with 5 minutes daily\n3. **Exercise:** Regular physical activity reduces stress hormones\n4. **Sleep:** Prioritize 7-9 hours\n5. **Social Connection:** Spend time with loved ones\n6. **Time in Nature:** Even 15 minutes helps\n\n**Your Stress Score:** 65/100\n• Consider adding meditation to your routine\n• Your workout consistency is helping!\n• Try journaling before bed",
    followUp: ['Guided meditation', 'Breathing exercises', 'Workout for stress'],
  },
  {
    keywords: ['protein', 'macro', 'nutrition', 'vitamin'],
    response: "Let's optimize your nutrition:\n\n**Your Daily Macro Targets:**\n• Protein: 125g (500 kcal)\n• Carbs: 220g (880 kcal)\n• Fat: 58g (522 kcal)\n• Total: 2,200 kcal\n\n**Protein Sources:**\n• Chicken breast: 31g per 100g\n• Salmon: 20g per 100g\n• Eggs: 13g per egg\n• Greek yogurt: 10g per 100g\n• Lentils: 9g per 100g\n\n**Important Vitamins:**\n• Vitamin D: Sunlight, fatty fish\n• Vitamin B12: Meat, eggs, dairy\n• Iron: Red meat, spinach, lentils\n• Calcium: Dairy, leafy greens",
    followUp: ['Meal plan with these macros', 'Supplement recommendations', 'Food sources'],
  },
  {
    keywords: ['bmi', 'calculate', 'body', 'mass'],
    response: "Here are your body metrics:\n\n**Body Mass Index (BMI):**\n• Your BMI: 23.5\n• Category: Normal weight ✓\n• Healthy range: 18.5-24.9\n\n**Basal Metabolic Rate (BMR):**\n• Your BMR: 1,680 kcal/day\n• This is calories burned at rest\n\n**Total Daily Energy Expenditure (TDEE):**\n• Your TDEE: 2,604 kcal/day\n• Activity level: Moderate\n\n**Recommendations:**\n• Maintain current weight with 2,200 kcal/day\n• For weight loss: 1,800-2,000 kcal/day\n• For muscle gain: 2,500-2,700 kcal/day",
    followUp: ['How to lose weight?', 'How to gain muscle?', 'Calculate my macros'],
  },
  {
    keywords: ['heart', 'blood pressure', 'cardio', 'cardiovascular'],
    response: "Let's talk about your cardiovascular health:\n\n**Heart Health Tips:**\n\n1. **Exercise:** 150 min moderate OR 75 min vigorous per week\n2. **Diet:** Low sodium, high fiber, omega-3 rich foods\n3. **Weight:** Maintain healthy BMI\n4. **Stress:** Manage chronic stress\n5. **Sleep:** 7-9 hours nightly\n\n**Heart-Healthy Foods:**\n• Fatty fish (salmon, mackerel)\n• Oats and whole grains\n• Berries and dark chocolate\n• Nuts and seeds\n• Olive oil\n• Leafy greens\n\n**Your Cardio Score:** 78/100\n• Good workout consistency\n• Consider adding more cardio sessions",
    followUp: ['Cardio workouts', 'Heart-healthy meals', 'Blood pressure tips'],
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    response: "You're welcome! I'm here to help you reach your fitness goals. Remember:\n\n• Consistency is key\n• Small changes lead to big results\n• Listen to your body\n• Celebrate small victories\n\nIs there anything else you'd like help with?",
    followUp: ['Analyze my progress', 'Suggest a meal', 'Give me exercise tips'],
  },
  {
    keywords: ['help', 'what can you do', 'capabilities'],
    response: "I'm V, your AI Health Assistant! Here's what I can help with:\n\n**Health Tracking:**\n• Analyze your progress\n• Track your metrics\n• Identify trends\n\n**Nutrition:**\n• Meal suggestions\n• Macro calculations\n• Food recommendations\n\n**Exercise:**\n• Workout suggestions\n• Exercise form tips\n• Training plans\n\n**Wellness:**\n• Sleep optimization\n• Stress management\n• Hydration goals\n\nJust ask me anything about your health and fitness journey!",
    followUp: ['Analyze my progress', 'Suggest a meal', 'Give me exercise tips'],
  },
];

export function findResponse(input: string): string {
  const lower = input.toLowerCase();

  for (const item of chatResponses) {
    if (item.keywords.some(keyword => lower.includes(keyword))) {
      return item.response;
    }
  }

  return "I'm still learning! Here's what I can help with:\n\n• **Health metrics** - Ask about your BMI, calories, or progress\n• **Meal suggestions** - Get personalized meal ideas\n• **Exercise tips** - Find workouts for your goals\n• **Sleep advice** - Improve your rest quality\n• **Hydration** - Track your water intake\n\nTry asking something like \"Suggest a meal\" or \"How can I improve my sleep?\"";
}

export function getFollowUps(input: string): string[] {
  const lower = input.toLowerCase();

  for (const item of chatResponses) {
    if (item.keywords.some(keyword => lower.includes(keyword))) {
      return item.followUp || [];
    }
  }

  return ['Analyze my progress', 'Suggest a meal', 'Give me exercise tips'];
}
