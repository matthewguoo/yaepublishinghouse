import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Missing verification token' },
        { status: 400 }
      );
    }

    // Find user with this token
    const user = await prisma.user.findUnique({
      where: { verifyToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification link' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (user.verifyExpires && user.verifyExpires < new Date()) {
      return NextResponse.json(
        { error: 'Verification link has expired. Please register again.' },
        { status: 400 }
      );
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
