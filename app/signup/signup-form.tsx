'use client';

import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { AtSign, Mail, Sparkles } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { FormShell } from '../login/form-shell';
import { getErrorMessage } from '../../lib/errors';

function normalizeHandle(value: string): string {
  return value.trim().toLowerCase().replace(/^@+/, '');
}

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewHandle = useMemo(() => normalizeHandle(handle), [handle]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/signup/prepare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, handle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not reserve that handle.');
      }

      await signIn('email', {
        email: email.trim(),
        callbackUrl: `/dashboard/welcome?handle=${data.handle}`,
      });
    } catch (submitError) {
      setLoading(false);
      setError(getErrorMessage(submitError, 'Could not start signup.'));
    }
  }

  return (
    <FormShell
      badge="claim your cute page"
      kicker="soft launch energy"
      title="Reserve a handle, then verify by email."
      body="Pick your @handle now. We save it, send a magic link, and finish setup after you click it."
      className="max-w-3xl"
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-3">
            <Label htmlFor="signup-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-petal-500" />
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-11"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="signup-handle">Handle</Label>
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-petal-500" />
              <Input
                id="signup-handle"
                type="text"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                placeholder="yuuko"
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                className="pl-11"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-dashed border-petal-300/80 bg-petal-50/80 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {previewHandle
            ? `Your page will live at yaepublishing.house/@${previewHandle}`
            : 'Handles can use lowercase letters, numbers, and underscores.'}
        </div>

        {error ? (
          <div className="rounded-[22px] border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading} className="min-w-[220px]">
            {loading ? 'Saving handle...' : 'Claim handle with email'}
          </Button>
          <Button type="button" variant="secondary" asChild>
            <Link href="/login">Log in instead</Link>
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="gap-2 normal-case tracking-normal">
          <Sparkles className="h-3.5 w-3.5" /> 3-20 chars
        </Badge>
        <Badge variant="secondary" className="normal-case tracking-normal">lowercase only</Badge>
        <Badge variant="secondary" className="normal-case tracking-normal">reserved names blocked</Badge>
      </div>
    </FormShell>
  );
}
