import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ArrowLeft, WandSparkles } from 'lucide-react';
import { authOptions } from '../../../lib/auth';
import { claimHandleForUser, getProfileByUserId, isDatabaseConfigured } from '../../../lib/data';
import { getErrorMessage } from '../../../lib/errors';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import WelcomeForm from './welcome-form';

export const metadata: Metadata = {
  title: 'Finish setup',
};

type DashboardWelcomePageProps = {
  searchParams?: {
    handle?: string;
  };
};

export default async function DashboardWelcomePage({ searchParams }: DashboardWelcomePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.email) {
    redirect('/login');
  }

  if (!isDatabaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <Card className="w-full max-w-xl rounded-[34px] border-[rgba(111,82,95,0.14)] bg-white/88 shadow-float">
          <CardContent className="grid gap-5 p-6 sm:p-8">
            <Badge className="w-fit">database needed</Badge>
            <div className="grid gap-3">
              <p className="font-marker text-3xl text-petal-700 sm:text-4xl">almost there</p>
              <h1 className="font-body text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl">add Postgres first.</h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                this part needs Vercel Postgres before a handle can actually be claimed.
              </p>
            </div>
            <Button asChild variant="secondary" className="w-fit">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                back home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const existingProfile = await getProfileByUserId(session.user.id);
  if (existingProfile) {
    redirect('/dashboard');
  }

  const requestedHandle = typeof searchParams?.handle === 'string' ? searchParams.handle : '';
  let claimError = '';

  if (requestedHandle) {
    try {
      await claimHandleForUser({
        userId: session.user.id,
        email: session.user.email,
        rawHandle: requestedHandle,
      });
      redirect('/dashboard?created=1');
    } catch (error) {
      claimError = getErrorMessage(error, 'Could not claim that handle.');
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,182,213,0.3),transparent_18%),radial-gradient(circle_at_85%_12%,rgba(255,238,245,0.95),transparent_20%),radial-gradient(circle_at_76%_70%,rgba(255,195,223,0.24),transparent_22%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl items-center justify-center">
        <Card className="w-full max-w-2xl rounded-[34px] border-[rgba(111,82,95,0.14)] bg-white/88 shadow-float">
          <CardContent className="grid gap-8 p-6 sm:p-8">
            <div className="grid gap-4">
              <Badge className="w-fit">finish your page</Badge>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-petal-100 text-petal-700">
                <WandSparkles className="h-7 w-7" />
              </div>
              <div className="grid gap-3">
                <p className="font-marker text-3xl text-petal-700">almost there</p>
                <h1 className="font-body text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl">claim your @handle.</h1>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  your email is verified. pick the handle you want on the page and we&apos;ll drop you into the editor.
                </p>
              </div>
            </div>
            <WelcomeForm initialHandle={requestedHandle} initialError={claimError} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
