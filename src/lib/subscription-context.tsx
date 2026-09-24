'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subscription, SubscriptionPlan } from './types';
import { getSubscription, initializeBilling } from './billing-service';

interface SubscriptionContextType {
  subscription: Subscription;
  setPlan: (plan: SubscriptionPlan) => void;
  isPro: boolean;
  isPremium: boolean;
  isFree: boolean;
  hasFeature: (featureId: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const featureMap: Record<string, SubscriptionPlan> = {
  basic_tracking: 'free',
  food_database: 'free',
  basic_charts: 'free',
  health_conditions: 'pro',
  ai_chatbot: 'pro',
  meal_plans: 'free',
  exercise_plans: 'free',
  download_reports: 'pro',
  advanced_analytics: 'pro',
  priority_support: 'pro',
};

const planHierarchy: Record<SubscriptionPlan, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription>({
    plan: 'free',
    expiresAt: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('gymathome_subscription');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
          setSubscription({ plan: 'free', expiresAt: null });
          return;
        }
        setSubscription(parsed);
      } catch {
        setSubscription({ plan: 'free', expiresAt: null });
      }
    }

    const verifySubscription = async () => {
      await initializeBilling();
      const result = await getSubscription();
      if (result.subscribed) {
        setSubscription({ plan: result.plan as SubscriptionPlan, expiresAt: result.expiresAt });
      }
    };
    verifySubscription();
  }, []);

  useEffect(() => {
    localStorage.setItem('gymathome_subscription', JSON.stringify(subscription));
  }, [subscription]);

  const setPlan = (plan: SubscriptionPlan) => {
    setSubscription({
      plan,
      expiresAt: plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  const isPro = subscription.plan === 'pro' || subscription.plan === 'premium';
  const isPremium = subscription.plan === 'premium';
  const isFree = subscription.plan === 'free';

  const hasFeature = (featureId: string): boolean => {
    const requiredPlan = featureMap[featureId];
    if (!requiredPlan) return false;
    return planHierarchy[subscription.plan] >= planHierarchy[requiredPlan];
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, setPlan, isPro, isPremium, isFree, hasFeature }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
