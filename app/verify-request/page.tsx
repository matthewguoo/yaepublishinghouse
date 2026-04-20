import type { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

export const metadata: Metadata = {
  title: 'Check your email',
};

export default function VerifyRequestPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,173,210,0.38),transparent_16%),radial-gradient(circle_at_82%_14%,rgba(255,231,241,0.92),transparent_20%),radial-gradient(circle_at_76%_74%,rgba(255,195,223,0.24),transparent_24%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
        <Card className="w-full max-w-xl rounded-[34px] border-petal-200/70 bg-white/84 shadow-float">
          <CardContent className="grid gap-6 p-6 sm:p-8">
            <Badge className="w-fit">email sent</Badge>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-petal-100 text-petal-700">
              <MailCheck className="h-7 w-7" />
            </div>
            <div className="grid gap-3">
              <p className="font-scribble text-2xl text-petal-700">tiny inbox quest</p>
              <h1 className="font-display text-4xl leading-none tracking-[-0.05em] sm:text-6xl">
                Check your email for the magic link.
              </h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                It should show up in a minute or two. Click it on the same device if you can, then you should land right back in your dashboard setup.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="normal-case tracking-normal">one-time link</Badge>
              <Badge variant="secondary" className="normal-case tracking-normal">expires fast</Badge>
              <Badge variant="secondary" className="normal-case tracking-normal">no password needed</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href="/login">Back to login</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/signup">Resend from signup</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
