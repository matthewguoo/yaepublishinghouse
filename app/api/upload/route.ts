import { randomUUID } from 'crypto';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You need to sign in first.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      throw new Error('Pick an image first.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Only image uploads are allowed.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Keep uploads under 8MB.');
    }

    const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    const filename = `uploads/${session.user.id}/${randomUUID()}.${extension}`;
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Upload failed.' }, { status: 400 });
  }
}
