'use client';

import { Check, X, Star, Zap, Crown, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '@/lib/subscription-context';
import { SubscriptionPlan } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';

type BillingCycle = 'monthly' | 'annual';

const plans = [
  {
    id: 'free' as SubscriptionPlan,
    name: 'Free',
    icon: Star,
    description: 'Get started with basic features',
    price: { monthly: 0, annual: 0 },
    features: [
      { name: 'Basic health tracking', included: true },
      { name: 'Food database access', included: true },
      { name: 'Meal planning', included: true },
      { name: 'Exercise planning', included: true },
      { name: 'Weekly progress reports', included: true },
      { name: 'AI Chatbot (30 msgs/day)', included: true },
      { name: 'Health conditions', included: false },
      { name: 'Export reports', included: false },
    ],
  },
  {
    id: 'pro' as SubscriptionPlan,
    name: 'Pro',
    icon: Zap,
    description: 'Unlock all features',
    price: { monthly: 300, annual: 3000 },
    popular: true,
    features: [
      { name: 'Basic health tracking', included: true },
      { name: 'Food database access', included: true },
      { name: 'Meal planning', included: true },
      { name: 'Exercise planning', included: true },
      { name: 'Weekly progress reports', included: true },
      { name: 'AI Chatbot (unlimited)', included: true },
      { name: 'Health conditions', included: true },
      { name: 'Export reports', included: true },
    ],
  },
];

export default function ChoosePlanPage() {
  const { subscription, setPlan } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(subscription.plan);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `₹${price.toLocaleString()}`;
  };

  const calculateSavings = (monthly: number, annual: number) => {
    if (monthly === 0) return 0;
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    return Math.round((savings / monthlyCost) * 100);
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPlan(selectedPlan);
    setIsProcessing(false);
  };

  const isCurrentPlan = (planId: SubscriptionPlan) => subscription.plan === planId;

  return (
    <DashboardLayout title="Choose Your Plan" subtitle="Select the plan that fits your health journey">
      <div className="max-w-5xl mx-auto space-y-8 pb-8">
        {/* Current Plan Banner */}
        {subscription.plan !== 'free' && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    You&apos;re on the <span className="text-primary font-semibold capitalize">{subscription.plan}</span> plan
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {subscription.expiresAt
                      ? `Renews on ${new Date(subscription.expiresAt).toLocaleDateString()}`
                      : 'Active subscription'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">Active</span>
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-surface-container p-1 rounded-xl inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-0.5 bg-success/10 text-success text-xs font-bold rounded-full">
                Save up to 33%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = plan.price[billingCycle];
            const savings = calculateSavings(plan.price.monthly, plan.price.annual);
            const isCurrent = isCurrentPlan(plan.id);
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-surface rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-primary shadow-[0_8px_30px_rgba(0,108,73,0.12)] ring-1 ring-primary/20'
                    : 'border-outline-variant hover:border-outline'
                } ${plan.popular ? 'border-2 border-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-on-primary text-xs font-bold rounded-full shadow-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        plan.id === 'free'
                          ? 'bg-surface-container-high'
                          : plan.id === 'pro'
                          ? 'bg-primary/10'
                          : 'bg-tertiary/10'
                      }`}
                    >
                      <plan.icon
                        className={`w-7 h-7 ${
                          plan.id === 'free'
                            ? 'text-on-surface-variant'
                            : plan.id === 'pro'
                            ? 'text-primary'
                            : 'text-tertiary'
                        }`}
                      />
                    </div>
                    <h3 className="text-headline-md font-bold text-on-surface">{plan.name}</h3>
                    <p className="text-sm text-on-surface-variant mt-1">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-on-surface">{formatPrice(price)}</span>
                      {price > 0 && (
                        <span className="text-on-surface-variant text-sm">
                          / {billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'annual' && savings > 0 && (
                      <p className="text-sm text-success mt-1 font-medium">Save {savings}% vs monthly</p>
                    )}
                    {billingCycle === 'annual' && price > 0 && (
                      <p className="text-xs text-on-surface-variant mt-1">
                        ₹{Math.round(price / 12).toLocaleString()}/month
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-success" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-on-surface-variant/50" />
                          </div>
                        )}
                        <span
                          className={`text-sm ${
                            feature.included ? 'text-on-surface' : 'text-on-surface-variant/50'
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full h-12 bg-surface-container-high text-on-surface-variant rounded-xl text-sm font-bold cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full h-12 rounded-xl text-sm font-bold transition-all ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-md hover:shadow-lg'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {isSelected ? (
                        <span className="flex items-center justify-center gap-2">
                          Selected
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      ) : (
                        'Select Plan'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Subscribe Button */}
        {selectedPlan !== subscription.plan && (
          <div className="flex justify-center">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="h-14 px-12 bg-primary text-on-primary rounded-xl text-label-lg font-bold hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Subscribe to {plans.find((p) => p.id === selectedPlan)?.name}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-surface rounded-2xl border border-outline-variant p-6">
          <h2 className="text-headline-md font-semibold text-on-surface mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-surface-container rounded-xl">
              <h3 className="text-sm font-semibold text-on-surface mb-2">Can I switch plans anytime?</h3>
              <p className="text-sm text-on-surface-variant">
                Yes! Upgrade or downgrade anytime. Changes take effect immediately with prorated payments.
              </p>
            </div>
            <div className="p-4 bg-surface-container rounded-xl">
              <h3 className="text-sm font-semibold text-on-surface mb-2">Is there a free trial?</h3>
              <p className="text-sm text-on-surface-variant">
                All paid plans include a 14-day free trial. No credit card required.
              </p>
            </div>
            <div className="p-4 bg-surface-container rounded-xl">
              <h3 className="text-sm font-semibold text-on-surface mb-2">What payment methods?</h3>
              <p className="text-sm text-on-surface-variant">
                UPI, credit/debit cards, net banking, and popular wallets like Paytm and Google Pay.
              </p>
            </div>
            <div className="p-4 bg-surface-container rounded-xl">
              <h3 className="text-sm font-semibold text-on-surface mb-2">Can I cancel?</h3>
              <p className="text-sm text-on-surface-variant">
                Cancel anytime from account settings. Access continues until the billing period ends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
