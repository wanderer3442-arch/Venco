import { SubscriptionPlan } from './types';

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  requiredPlan: SubscriptionPlan;
}

export const subscriptionFeatures: SubscriptionFeature[] = [
  {
    id: 'basic_tracking',
    name: 'Basic Tracking',
    description: 'Log meals, exercises, and water intake',
    requiredPlan: 'free',
  },
  {
    id: 'food_database',
    name: 'Food Database',
    description: 'Access to 1000+ food items',
    requiredPlan: 'free',
  },
  {
    id: 'basic_charts',
    name: 'Basic Charts',
    description: 'View weekly progress charts',
    requiredPlan: 'free',
  },
  {
    id: 'health_conditions',
    name: 'Health Conditions',
    description: 'View health condition database and personalized tips',
    requiredPlan: 'pro',
  },
  {
    id: 'ai_chatbot',
    name: 'AI Chatbot V',
    description: 'Full access to AI health assistant',
    requiredPlan: 'pro',
  },
  {
    id: 'meal_plans',
    name: 'Meal Plans',
    description: 'Generate personalized meal plans',
    requiredPlan: 'free',
  },
  {
    id: 'exercise_plans',
    name: 'Exercise Plans',
    description: 'Generate personalized exercise plans',
    requiredPlan: 'free',
  },
  {
    id: 'download_reports',
    name: 'Download Reports',
    description: 'Export detailed health reports',
    requiredPlan: 'pro',
  },
  {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Detailed analytics and trends',
    requiredPlan: 'pro',
  },
  {
    id: 'priority_support',
    name: 'Priority Support',
    description: 'Get priority customer support',
    requiredPlan: 'pro',
  },
];

const planHierarchy: Record<SubscriptionPlan, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

export function hasFeatureAccess(
  userPlan: SubscriptionPlan,
  featureId: string
): boolean {
  const feature = subscriptionFeatures.find(f => f.id === featureId);
  if (!feature) return false;

  const userLevel = planHierarchy[userPlan];
  const requiredLevel = planHierarchy[feature.requiredPlan];

  return userLevel >= requiredLevel;
}

export function getRequiredPlan(featureId: string): SubscriptionPlan | null {
  const feature = subscriptionFeatures.find(f => f.id === featureId);
  return feature?.requiredPlan ?? null;
}

export function getPlanPrice(plan: SubscriptionPlan): { monthly: number; yearly: number } {
  switch (plan) {
    case 'free':
      return { monthly: 0, yearly: 0 };
    case 'pro':
      return { monthly: 300, yearly: 3000 };
    case 'premium':
      return { monthly: 300, yearly: 3000 };
    default:
      return { monthly: 0, yearly: 0 };
  }
}

export function getPlanFeatures(plan: SubscriptionPlan): SubscriptionFeature[] {
  return subscriptionFeatures.filter(f => {
    const userLevel = planHierarchy[plan];
    const requiredLevel = planHierarchy[f.requiredPlan];
    return userLevel >= requiredLevel;
  });
}

export function getLockedFeatures(userPlan: SubscriptionPlan): SubscriptionFeature[] {
  return subscriptionFeatures.filter(f => {
    const userLevel = planHierarchy[userPlan];
    const requiredLevel = planHierarchy[f.requiredPlan];
    return userLevel < requiredLevel;
  });
}
