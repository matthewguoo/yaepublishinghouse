import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendWaitlistConfirmation } from '@/lib/email';
import { getProduct } from '@/lib/products';
import { checkRateLimit } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rateLimit = checkRateLimit(`waitlist:${ip}`, 10, 60 * 60 * 1000); // 10 per hour

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, productId } = body;

    if (!email || !productId) {
      return NextResponse.json(
        { error: 'Email and product ID are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get product info
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if already on waitlist
    const existing = await prisma.waitlist.findUnique({
      where: {
        email_productId: {
          email: email.toLowerCase(),
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You are already on the waitlist for this product' },
        { status: 409 }
      );
    }

    // Add to waitlist
    await prisma.waitlist.create({
      data: {
        email: email.toLowerCase(),
        productId,
      },
    });

    // Send confirmation email
    await sendWaitlistConfirmation(email, {
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '',
      price: product.price,
      description: product.description,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
