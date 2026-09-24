'use client';

import { Capacitor } from '@capacitor/core';
import { BillingPlugin } from 'capacitor-billing';

export interface SubscriptionResult {
  subscribed: boolean;
  plan: string;
  expiresAt: string | null;
  purchaseToken?: string;
}

const PRODUCT_MONTHLY = 'pro_monthly';
const PRODUCT_ANNUAL = 'pro_annual';

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

function parsePurchase(raw: unknown): { purchaseToken?: string; acknowledged?: boolean } | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.value === 'string') {
    if (obj.value === 'web' || obj.value === '') return null;
    try {
      const parsed = JSON.parse(obj.value);
      if (parsed && typeof parsed === 'object') {
        return parsed as { purchaseToken?: string; acknowledged?: boolean };
      }
    } catch {
      return null;
    }
    return null;
  }
  if (obj.purchaseToken) {
    return obj as { purchaseToken?: string; acknowledged?: boolean };
  }
  return null;
}

export async function initializeBilling(): Promise<boolean> {
  if (!isNative()) return false;
  try {
    await BillingPlugin.querySkuDetails({ product: PRODUCT_MONTHLY, type: 'SUBS' });
    return true;
  } catch {
    return false;
  }
}

export async function getSubscription(): Promise<SubscriptionResult> {
  if (!isNative()) {
    return { subscribed: false, plan: 'free', expiresAt: null };
  }
  try {
    const monthly = await BillingPlugin.querySkuDetails({ product: PRODUCT_MONTHLY, type: 'SUBS' });
    const parsedMonthly = parsePurchase(monthly);
    if (parsedMonthly?.purchaseToken) {
      return {
        subscribed: true,
        plan: 'pro',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        purchaseToken: parsedMonthly.purchaseToken,
      };
    }
    const annual = await BillingPlugin.querySkuDetails({ product: PRODUCT_ANNUAL, type: 'SUBS' });
    const parsedAnnual = parsePurchase(annual);
    if (parsedAnnual?.purchaseToken) {
      return {
        subscribed: true,
        plan: 'premium',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        purchaseToken: parsedAnnual.purchaseToken,
      };
    }
    return { subscribed: false, plan: 'free', expiresAt: null };
  } catch {
    return { subscribed: false, plan: 'free', expiresAt: null };
  }
}

export async function purchaseSubscription(product: 'monthly' | 'annual'): Promise<SubscriptionResult> {
  if (!isNative()) {
    return { subscribed: false, plan: 'free', expiresAt: null };
  }
  const productId = product === 'monthly' ? PRODUCT_MONTHLY : PRODUCT_ANNUAL;
  try {
    const result = await BillingPlugin.launchBillingFlow({ product: productId, type: 'SUBS' });
    const purchase = parsePurchase(result);
    if (purchase?.purchaseToken) {
      try {
        await BillingPlugin.sendAck({ purchaseToken: purchase.purchaseToken });
      } catch {
        // ack may fail if already acknowledged
      }
      return {
        subscribed: true,
        plan: product === 'monthly' ? 'pro' : 'premium',
        expiresAt:
          product === 'monthly'
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        purchaseToken: purchase.purchaseToken,
      };
    }
    return { subscribed: false, plan: 'free', expiresAt: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err ?? '');
    if (msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('dismiss')) {
      return { subscribed: false, plan: 'free', expiresAt: null };
    }
    throw err;
  }
}

export async function restorePurchases(): Promise<SubscriptionResult> {
  return await getSubscription();
}
