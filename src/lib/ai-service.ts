import { allFoods } from './food-database';
import { FoodItem } from './types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

const FREE_MODELS = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'nvidia/nemotron-3.5-content-safety:free',
];

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

const VISION_MODEL = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';

function getApiKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('openrouter_api_key');
  }
  return null;
}

function getGeminiKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gemini_api_key');
  }
  return null;
}

function getModel(): string {
  return FREE_MODELS[0];
}

function getVisionModel(): string {
  return VISION_MODEL;
}

export function getCurrentModel(): string {
  return getModel();
}

export function isApiKeySet(): boolean {
  return !!getApiKey() || !!getGeminiKey();
}

// ─── Gemini API Call ─────────────────────────────────────────────────────────

async function callGemini(
  messages: Array<{ role: string; content: any }>,
  maxTokens = 1024
): Promise<string> {
  const key = getGeminiKey();
  if (!key) throw new Error('Gemini API key not configured.');

  const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = err?.error?.message || err?.message || `Gemini API error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ─── OpenRouter API Call ─────────────────────────────────────────────────────

async function callOpenRouter(
  messages: Array<{ role: string; content: any }>,
  maxTokens = 1024,
  model?: string
): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error('API key not configured.');

  const useModel = model || getModel();
  if (process.env.NODE_ENV === 'development') {
    console.log(`Using model: ${useModel}`);
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      'X-Title': 'Gym at Home',
    },
    body: JSON.stringify({
      model: useModel,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = err?.error?.message || err?.message || JSON.stringify(err) || `API error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ─── Dev Console Helper ──────────────────────────────────────────────────────

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__setGymAtHomeApiKey = (key: string) => {
    localStorage.setItem('openrouter_api_key', key);
    console.log('✅ Gym at Home API key saved');
  };
  (window as any).__clearGymAtHomeApiKey = () => {
    localStorage.removeItem('openrouter_api_key');
    console.log('✅ Gym at Home API key removed');
  };
  (window as any).__getGymAtHomeApiKey = () => {
    const key = localStorage.getItem('openrouter_api_key');
    console.log(key ? `API key: ${key.substring(0, 10)}...` : 'No API key set');
    return key;
  };
}

// ─── Food Recognition (Vision + Text) ───────────────────────────────────────

export interface FoodSuggestion {
  food: FoodItem;
  confidence: number;
  reason: string;
}

export async function detectFoodFromPhoto(base64Image: string): Promise<FoodSuggestion[]> {
  const prompt = `Analyze this food/meal photo. For each food item visible, provide a JSON array.
Return ONLY valid JSON array, no markdown, no explanation.
Each item: { "name": "food name", "confidence": 0.0-1.0, "reason": "brief reason" }
Focus on identifying specific Indian foods if visible.
If no food visible, return empty array [].`;

  const content = [
    { type: 'text', text: prompt },
    { type: 'image_url', image_url: { url: base64Image } },
  ];

  const response = await callOpenRouter([
    { role: 'user', content },
  ], 1024, getVisionModel());

  let detected: Array<{ name: string; confidence: number; reason: string }>;
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    detected = JSON.parse(jsonMatch[0]);
  } catch {
    return [];
  }

  const suggestions: FoodSuggestion[] = [];
  const seenIds = new Set<string>();

  for (const item of detected) {
    if (!item.name || seenIds.has(item.name.toLowerCase())) continue;

    const searchTerm = item.name.toLowerCase();
    const matches = allFoods
      .filter(f => {
        const name = f.name.toLowerCase();
        return name.includes(searchTerm) || searchTerm.includes(name);
      })
      .slice(0, 3);

    for (const food of matches) {
      if (seenIds.has(food.id)) continue;
      seenIds.add(food.id);
      suggestions.push({
        food,
        confidence: Math.min(item.confidence || 0.7, 1),
        reason: item.reason || `AI identified "${item.name}"`,
      });
    }

    if (matches.length === 0) {
      const fuzzy = allFoods.filter(f => {
        const words = searchTerm.split(' ');
        return words.some(w => w.length > 3 && f.name.toLowerCase().includes(w));
      }).slice(0, 2);

      for (const food of fuzzy) {
        if (seenIds.has(food.id)) continue;
        seenIds.add(food.id);
        suggestions.push({
          food,
          confidence: (item.confidence || 0.5) * 0.7,
          reason: `Similar to ${item.name}`,
        });
      }
    }
  }

  suggestions.sort((a, b) => b.confidence - a.confidence);
  return suggestions.slice(0, 8);
}

// ─── 7-Day Meal Plan Photo Detection ────────────────────────────────────────

export interface DayMealPlan {
  day: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export async function detectWeeklyMealPlan(base64Image: string): Promise<DayMealPlan[]> {
  const foodNames = allFoods.map(f => f.name).slice(0, 200).join(', ');

  const prompt = `Analyze this image of a 7-day meal plan or menu.
Return ONLY a valid JSON array, no markdown, no explanation.
Each day should have: { "day": "Monday/Tuesday/...", "breakfast": ["food1", "food2"], "lunch": ["food1", "food2"], "dinner": ["food1", "food2"] }

Use food names from this database when possible: ${foodNames}

If you can't identify a full week, return whatever days/meals you can identify.
If no meal plan visible, return empty array [].`;

  const content = [
    { type: 'text', text: prompt },
    { type: 'image_url', image_url: { url: base64Image } },
  ];

  const response = await callOpenRouter([
    { role: 'user', content },
  ], 2048, getVisionModel());

  let detected: DayMealPlan[];
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    detected = JSON.parse(jsonMatch[0]);
  } catch {
    return [];
  }

  return detected.filter(d => d.day && (d.breakfast?.length || d.lunch?.length || d.dinner?.length));
}

// ─── AI Chatbot ──────────────────────────────────────────────────────────────

export async function getChatResponse(
  userMessage: string,
  context?: {
    profile?: any;
    recentMeals?: string;
    healthGoal?: string;
    dailyCalories?: number;
    dailyProtein?: number;
    dailyWater?: number;
  },
  isPaidUser?: boolean
): Promise<string> {
  const systemPrompt = `You are V, a certified AI health & fitness assistant for "Gym at Home". You provide evidence-based advice from WHO, CDC, ACSM, AHA, USDA, ISSN, and Harvard T.H. Chan School of Public Health.

CORE KNOWLEDGE — CITE THESE GUIDELINES:

NUTRITION (USDA DRI / ISSN 2017):
- Protein: 0.8g/kg sedentary → 1.2-1.6g/kg active → 1.6-2.2g/kg muscle gain/fat loss
- Carbs: 3-5g/kg sedentary → 5-7g/kg moderate → 8-12g/kg high intensity athlete
- Fat: 20-35% of total calories (IOM AMDR), minimum 0.5g/kg
- Fiber: 38g/day men, 25g/day women
- Water: 3.7L/day men, 2.7L/day women + 500-1000mL per hour exercise
- Meal timing: 0.4-0.55g protein/kg per meal (20-40g), spread evenly
- Pre-workout (1-3 hrs): easy carbs + moderate protein
- Post-workout (within 2 hrs): protein (20-40g) + carbs (2:1 to 4:1 ratio)
- Vitamin B12: 2.4mcg/day (critical for vegans)
- Iron: 8mg/day men, 18mg/day premenopausal women
- Calcium: 1000mg/day, Vitamin D: 15mcg (600 IU)/day

EXERCISE (ACSM/CDC/WHO 2020):
- 150 min/week moderate aerobic OR 75 min vigorous OR combination
- 2+ strength training sessions/week, all major muscle groups
- 2-3 flexibility sessions/week
- Progressive overload: increase weight 2.5-5% when top of rep range hit
- Rep ranges: strength 1-5, hypertrophy 6-12, endurance 12+
- Rest: 60-90s between sets (hypertrophy), 3-5min (strength)
- Warm-up: 5-10 min dynamic stretching before
- Cool-down: 5-10 min static stretching after
- Max HR: 220 - age (Tanaka: 208 - 0.7 × age)
- Fat burning zone: 60-70% max HR (Zone 2)
- Deload every 4-8 weeks: reduce weight 40-60%, keep same exercises
- 48-72 hours between training same muscle group

BODY COMPOSITION (WHO/ACSM):
- BMI: <18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, 30+ obese
- BMR (Mifflin-St Jeor): Men 10×wt+6.25×ht-5×age+5, Women 10×wt+6.25×ht-5×age-161
- TDEE = BMR × Activity (1.2 sedentary, 1.375 light, 1.55 moderate, 1.725 active, 1.9 very active)
- Healthy weight loss: 0.5-1 kg/week (500 kcal deficit)
- Muscle gain: TDEE + 300-500 kcal, 1.6-2.2g protein/kg

SLEEP (NSF/AASM):
- Adults: 7-9 hours, athletes: 8-10 hours
- Cool room (18-20°C), dark, consistent schedule
- No screens 30-60 min before bed, no caffeine after 2 PM

HEALTH CONDITIONS (CDC/ADA/AHA):
- Diabetes: 150 min/week moderate exercise, high fiber, consistent meals
- Hypertension: DASH diet, <2300mg sodium, aerobic exercise reduces BP 5-8 mmHg
- Obesity: Combine diet + exercise, high protein to preserve muscle

SUPPLEMENTS (ISSN/Mayo Clinic):
- Whey protein: 20-40g post-workout or between meals
- Creatine: 3-5g daily monohydrate
- Caffeine: 3-6 mg/kg 30-60 min pre-exercise
- Vitamin D: 1000-2000 IU if deficient

RULES:
1. Be concise (2-4 sentences max per response)
2. Use bullet points and emojis for readability
3. Always cite the source when giving specific numbers
4. Personalize advice using the user's profile data below
5. Never diagnose or replace medical advice
6. If unsure, say "I recommend consulting a healthcare professional"
7. Use metric units (kg, cm, kcal) as default
8. Be encouraging and supportive tone

${context?.profile ? `USER PROFILE:
- BMI: ${context.profile.bmi || 'N/A'}
- Weight: ${context.profile.weight || 'N/A'} kg
- Height: ${context.profile.height || 'N/A'} cm
- Age: ${context.profile.age || 'N/A'}
- Goal: ${context.healthGoal || 'general fitness'}
- Activity level: ${context.profile.activityLevel || 'moderate'}` : ''}

${context?.dailyCalories ? `Today's intake: ~${context.dailyCalories} kcal (target: ${context.profile?.targetCalories || 'N/A'} kcal)` : ''}
${context?.dailyProtein ? `Today's protein: ~${context.dailyProtein}g` : ''}
${context?.dailyWater ? `Today's water: ~${context.dailyWater}L` : ''}
${context?.recentMeals ? `Recent meals: ${context.recentMeals}` : ''}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  if (isPaidUser && getApiKey()) {
    return await callOpenRouter(messages, 768);
  }

  if (getGeminiKey()) {
    return await callGemini(messages, 768);
  }

  throw new Error('No API key configured. Add a Gemini or OpenRouter key in Dev Settings.');
}
