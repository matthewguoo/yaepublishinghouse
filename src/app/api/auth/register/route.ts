import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { 
  hashPassword, 
  generateVerifyToken, 
  checkRateLimit, 
  isValidEmail, 
  isValidPassword 
} from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rateLimit = checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000); // 5 per hour
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, website } = body;

    // Honeypot check - bots fill this hidden field
    if (website) {
      // Silently reject but return success to not tip off bots
      return NextResponse.json({ success: true });
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // Don't reveal if email exists - send generic message
      return NextResponse.json(
        { error: 'If this email is available, a verification link will be sent.' },
        { status: 200 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const verifyToken = generateVerifyToken();
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        verifyToken,
        verifyExpires,
      },
    });

    // Send verification email
    await sendVerificationEmail(email.toLowerCase(), verifyToken);

    return NextResponse.json({
      success: true,
      message: 'Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
