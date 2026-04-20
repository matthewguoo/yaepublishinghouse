import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import prisma from './prisma';

function emailHtml(url: string): string {
  return `
    <div style="background:#fff8fb;padding:32px 20px;font-family:'Helvetica Neue',Arial,sans-serif;color:#3f2b36;">
      <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #f5d7e6;border-radius:28px;padding:32px;box-shadow:0 20px 60px rgba(226,143,178,0.14);">
        <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:#ffe6f0;color:#b24d78;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Yae Publishing House</div>
        <h1 style="font-size:28px;line-height:1.1;margin:18px 0 10px;">Your magic link is ready</h1>
        <p style="font-size:16px;line-height:1.65;margin:0 0 24px;color:#6b4d5b;">Tap the button and finish signing in. The link works once and expires pretty quickly, so don't leave it marinating in your inbox.</p>
        <a href="${url}" style="display:inline-block;background:#ff83b5;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700;box-shadow:0 12px 30px rgba(255,131,181,0.35);">Sign in to your page</a>
        <p style="font-size:13px;line-height:1.6;margin:24px 0 0;color:#8a6575;">If the button acts weird, paste this into your browser.<br /><span style="word-break:break-all;">${url}</span></p>
      </div>
    </div>
  `;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: process.env.RESEND_FROM || 'Yae Publishing House <onboarding@resend.dev>',
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier, url, provider }) {
        if (!process.env.RESEND_API_KEY) {
          throw new Error('Missing RESEND_API_KEY');
        }

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: provider.from,
            to: [identifier],
            subject: 'Your Yae Publishing House magic link',
            html: emailHtml(url),
            text: `Sign in to Yae Publishing House: ${url}`,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Resend failed: ${errorText}`);
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-request',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
};
