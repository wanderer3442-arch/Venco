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
  console.log(`Using model: ${useModel}`);

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

if (typeof window !== 'undefined') {
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
  },
  isPaidUser?: boolean
): Promise<string> {
  const systemPrompt = `You are V, a friendly AI fitness and nutrition assistant for the Gym at Home "Gym at Home" app.
You help users with:
- Meal planning and nutrition advice
- Exercise recommendations
- Health and wellness tips
- Food identification and calorie estimation
- Weight management guidance

Be concise (2-3 sentences max), friendly, and helpful. Use simple language.
${context?.profile ? `User profile: BMI ${context.profile.bmi}, Goal: ${context.healthGoal || 'general fitness'}` : ''}
${context?.recentMeals ? `Recent meals: ${context.recentMeals}` : ''}

If you don't know something, say so honestly. Never give medical advice.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  if (isPaidUser && getApiKey()) {
    return await callOpenRouter(messages, 512);
  }

  if (getGeminiKey()) {
    return await callGemini(messages, 512);
  }

  throw new Error('No API key configured. Add a Gemini or OpenRouter key in Dev Settings.');
}
