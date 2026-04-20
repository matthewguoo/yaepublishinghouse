import type { ReactNode } from 'react';
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,173,210,0.38),transparent_18%),radial-gradient(circle_at_84%_12%,rgba(255,231,241,0.95),transparent_20%),radial-gradient(circle_at_78%_72%,rgba(255,195,223,0.26),transparent_22%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <Card className={cn('w-full max-w-2xl overflow-hidden rounded-[34px] border-petal-200/70 bg-white/82 shadow-float', className)}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,194,220,0.42),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,233,242,0.9),transparent_25%)]" />
          <CardContent className="relative grid gap-8 p-6 sm:p-8">
            <div className="grid gap-4">
              <Badge className="w-fit">{badge}</Badge>
              <p className="font-scribble text-2xl text-petal-700 sm:text-[1.7rem]">{kicker}</p>
              <div className="grid gap-3">
                <h1 className="font-display text-4xl leading-none tracking-[-0.05em] text-foreground sm:text-6xl">{title}</h1>
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
