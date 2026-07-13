import { NextRequest } from 'next/server';
import { getCurrentUser, checkRateLimit, isValidEmail } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';
import { ok, apiError, badRequest, unauthorized, rateLimited } from '@/lib/api/responses';

const BASE_PRICE_CENTS = 20000; // $200 for 50 pcs / 5 designs
const PREVIEW_MAX_BYTES = 2 * 1024 * 1024; // 2MB base64 cap

function computeCents(quantity: number, designs: number): number {
  // Base package: up to 50 pcs, up to 5 designs = $200
  // Extra pieces beyond 50: +$2/pc
  // Extra designs beyond 5: +$15/design
  const overQty = Math.max(0, quantity - 50);
  const overDesigns = Math.max(0, designs - 5);
  return BASE_PRICE_CENTS + overQty * 200 + overDesigns * 1500;
}

function sanitizeText(s: unknown, max = 500): string {
  if (typeof s !== 'string') return '';
  return s.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max).trim();
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized('Please sign in to place an order.');

  const rl = checkRateLimit(`kc:order:${user.id}`, 10, 60_000);
  if (!rl.allowed) return rateLimited();

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return badRequest('Invalid payload');

  const name = sanitizeText(body.name, 120);
  const email = sanitizeText(body.email, 254).toLowerCase();
  const handle = sanitizeText(body.handle, 60);
  const notes = sanitizeText(body.notes, 1000);
  const fileName = sanitizeText(body.fileName, 200);
  const promoCode = sanitizeText(body.promoCode, 40).toUpperCase();

  const quantity = Math.max(10, Math.min(1000, Math.floor(Number(body.quantity) || 0)));
  const designs = Math.max(1, Math.min(20, Math.floor(Number(body.designs) || 0)));

  if (!name) return badRequest('Please add your name.');
  if (!isValidEmail(email)) return badRequest('Please provide a valid email.');
  if (!quantity || !designs) return badRequest('Quantity and designs are required.');

  // Preview PNG - optional, size-capped, must be data URL for image/png
  let previewPng: string | null = null;
  if (typeof body.previewPng === 'string') {
    if (!body.previewPng.startsWith('data:image/png;base64,')) {
      return badRequest('Preview must be PNG.');
    }
    if (body.previewPng.length > PREVIEW_MAX_BYTES) {
      return badRequest('Preview image too large.');
    }
    previewPng = body.previewPng;
  }

  // Pricing + promo
  let priceCents = computeCents(quantity, designs);
  let promoApplied: { code: string; pctOff: number } | null = null;
  if (promoCode) {
    const promo = await prisma.keychainPromo.findUnique({ where: { code: promoCode } });
    const valid =
      promo &&
      (promo.expiresAt == null || promo.expiresAt > new Date()) &&
      (promo.maxUses == null || promo.timesUsed < promo.maxUses);
    if (!valid) return badRequest('That promo code is not valid.');
    const pct = Math.max(0, Math.min(100, promo!.discountPct));
    priceCents = Math.round((priceCents * (100 - pct)) / 100);
    promoApplied = { code: promo!.code, pctOff: pct };
  }

  // Create order record
  const order = await prisma.keychainOrder.create({
    data: {
      userId: user.id,
      name,
      email,
      handle: handle || null,
      notes: notes || null,
      fileName: fileName || null,
      quantity,
      designs,
      priceInCents: priceCents,
      previewPng,
      status: 'new',
    },
  });

  // Stripe checkout
  const baseUrl = process.env.NEXTAUTH_URL || 'https://yaepublishing.house';
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Custom Keychain Run · ${quantity} pieces / ${designs} design${designs > 1 ? 's' : ''}`,
            description: promoApplied
              ? `Promo ${promoApplied.code} applied · ${promoApplied.pctOff}% off`
              : 'Real gold plating on fiberglass',
          },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ],
    customer_email: email,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'JP', 'SG', 'HK', 'TW', 'KR', 'DE', 'FR', 'NL'],
    },
    metadata: {
      kind: 'keychain',
      keychainOrderId: order.id,
      userId: user.id,
      promoCode: promoApplied?.code || '',
    },
    success_url: `${baseUrl}/account?keychain=paid`,
    cancel_url: `${baseUrl}/keychains?cancelled=true`,
  });

  // Bump promo use count (best-effort, doesn't require paid confirmation to reserve;
  // maxUses is protective enough for a low-volume launch tool).
  if (promoApplied) {
    await prisma.keychainPromo.update({
      where: { code: promoApplied.code },
      data: { timesUsed: { increment: 1 } },
    });
  }

  return ok({ url: session.url, orderId: order.id });
}
