import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { authOptions } from '../../lib/auth';
import { getProfileByUserId, isDatabaseConfigured } from '../../lib/data';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import DashboardEditor from './dashboard-editor';

export const metadata: Metadata = {
  title: 'Dashboard',
};

type DashboardPageProps = {
  searchParams?: {
    created?: string;
  };
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (!isDatabaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <Card className="w-full max-w-2xl rounded-[34px] border-petal-200/70 bg-white/84 shadow-float">
          <CardContent className="grid gap-5 p-6 sm:p-8">
            <Badge className="w-fit">setup still needed</Badge>
            <div className="grid gap-3">
              <h1 className="font-display text-4xl leading-none tracking-[-0.05em] sm:text-6xl">Hook up Vercel Postgres first.</h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                The editor is wired, but the database env vars have to exist before profile data can save.
              </p>
            </div>
            <Button asChild variant="secondary" className="w-fit">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const profile = await getProfileByUserId(session.user.id);

  if (!profile) {
    redirect('/dashboard/welcome');
  }

  return (
    <DashboardEditor
      created={searchParams?.created === '1'}
      email={session.user.email || ''}
      profile={profile}
    />
  );
}
