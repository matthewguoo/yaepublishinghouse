'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { Mail, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { FormShell } from './form-shell';
import { getErrorMessage } from '../../lib/errors';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Put your email in first.');
      return;
    }

    try {
      setLoading(true);
      await signIn('email', {
        email: email.trim(),
        callbackUrl: '/dashboard',
      });
    } catch (submitError) {
      setLoading(false);
      setError(getErrorMessage(submitError, 'That link did not send. Try again in a second.'));
    }
  }

  return (
    <FormShell
      badge="magic link login"
      kicker="welcome back, cosplayer"
      title="Log in with email."
      body="No password spreadsheet. We send one link and you hop straight into your dashboard."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-petal-500" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="pl-11"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-[22px] border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading} className="min-w-[180px]">
            {loading ? 'Sending link...' : 'Send magic link'}
          </Button>
          <Button type="button" variant="secondary" asChild>
            <Link href="/signup">Claim a handle first</Link>
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="gap-2 normal-case tracking-normal">
          <Sparkles className="h-3.5 w-3.5" /> email verification
        </Badge>
        <Badge variant="secondary" className="normal-case tracking-normal">one tap sign-in</Badge>
        <Badge variant="secondary" className="normal-case tracking-normal">dashboard after click</Badge>
      </div>
    </FormShell>
  );
}
