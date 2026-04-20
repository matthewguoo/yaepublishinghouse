import { NextResponse } from 'next/server';

const HANDLE_PATH = /^\/@([a-z0-9_]{3,20})\/?$/;

export function middleware(request) {
  const match = request.nextUrl.pathname.match(HANDLE_PATH);

  if (!match) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/profile/${match[1]}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|site.webmanifest|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|spacex-offer.pdf).*)'],
};
