import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-05-27.dahlia',
    });
  }
  return stripeClient;
}

// Legacy export for compatibility - lazy getter
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

export function formatAmountForStripe(amount: number): number {
  // Amount should already be in cents
  return Math.round(amount);
}

export function formatAmountFromStripe(amount: number): string {
  return (amount / 100).toFixed(2);
}
