export const COOKIE_NAMES = {
  session: 'yph_session',
  guestId: 'guestId',
} as const;

export const DEFAULTS = {
  siteUrl: 'http://localhost:3456',
  pendingCheckoutEmail: 'pending@checkout.local',
} as const;

export const CART_LIMITS = {
  maxQuantityPerItem: 10,
  maxCheckoutItems: 20,
  guestCookieMaxAgeSeconds: 60 * 60 * 24 * 30,
} as const;

export const RATE_LIMITS = {
  cart: { attempts: 60, windowMs: 15 * 60 * 1000 },
  checkout: { attempts: 10, windowMs: 15 * 60 * 1000 },
  login: { attempts: 10, windowMs: 15 * 60 * 1000 },
  register: { attempts: 5, windowMs: 60 * 60 * 1000 },
  waitlist: { attempts: 10, windowMs: 60 * 60 * 1000 },
} as const;

export const ORDER_STATUS = {
  pending: 'pending',
  paid: 'paid',
  cancelled: 'cancelled',
} as const;

export const PRODUCT_CTA = {
  stripe: 'stripe',
} as const;

export const STRIPE_CHECKOUT = {
  currency: 'usd',
  paymentMethodTypes: ['card'],
  mode: 'payment',
  allowedShippingCountries: ['US', 'CA'],
} as const;
