import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

const PRODUCT = {
  name: 'Star Rail Special Pass Keychain',
  description: '24k Gold Plated First Edition',
  priceInCents: 1500,
  image: 'https://yaepublishing.house/nameless-pass-fixed.png',
};

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await req.json().catch(() => ({}));
    const email = body.email as string | undefined;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRODUCT.name,
              description: PRODUCT.description,
              images: [PRODUCT.image],
            },
            unit_amount: PRODUCT.priceInCents,
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'JP', 'SG', 'HK', 'TW', 'KR', 'DE', 'FR', 'NL'],
      },
      customer_email: email || undefined,
      success_url: `${process.env.NEXTAUTH_URL || 'https://yaepublishing.house'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'https://yaepublishing.house'}/ticket?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Ticket checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
