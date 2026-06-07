import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - Stripe features will not work');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

export function formatAmountForStripe(amount: number): number {
  // Amount should already be in cents
  return Math.round(amount);
}

export function formatAmountFromStripe(amount: number): string {
  return (amount / 100).toFixed(2);
}
