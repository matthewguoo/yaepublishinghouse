import type { ReactNode } from 'react';
import { DoodleHeart, DoodleStar } from '../../components/scrapbook-doodles';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../lib/utils';

type FormShellProps = {
  badge: string;
  kicker: string;
  title: string;
  body: string;
  children: ReactNode;
  className?: string;
};

export function FormShell({ badge, kicker, title, body, children, className }: FormShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,173,210,0.32),transparent_18%),radial-gradient(circle_at_84%_12%,rgba(255,231,241,0.92),transparent_20%),radial-gradient(circle_at_78%_72%,rgba(255,195,223,0.24),transparent_22%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <Card className={cn('w-full max-w-2xl overflow-hidden rounded-[34px] border-[rgba(111,82,95,0.14)] bg-white/88 shadow-float', className)}>
          <CardContent className="relative grid gap-8 p-6 sm:p-8">
            <div className="absolute left-10 top-[-9px] h-5 w-24 rotate-[-7deg] rounded-[4px] bg-[rgba(255,219,231,0.9)]" />
            <div className="absolute right-14 top-[-8px] h-5 w-16 rotate-[7deg] rounded-[4px] bg-[rgba(255,219,231,0.86)]" />
            <DoodleStar className="absolute right-5 top-6 h-8 w-8 text-petal-700" />
            <DoodleHeart className="absolute right-12 top-20 h-7 w-7 text-petal-700" />
            <div className="grid gap-4">
              <Badge className="w-fit">{badge}</Badge>
              <p className="font-marker text-3xl text-petal-700 sm:text-[2.2rem]">{kicker}</p>
              <div className="grid gap-3">
                <h1 className="font-body text-4xl font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-6xl">{title}</h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{body}</p>
              </div>
            </div>
            {children}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
