'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, AtSign } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { getErrorMessage } from '../../../lib/errors';

type WelcomeFormProps = {
  initialHandle?: string;
  initialError?: string;
};

export default function WelcomeForm({ initialHandle = '', initialError = '' }: WelcomeFormProps) {
  const router = useRouter();
  const [handle, setHandle] = useState(initialHandle);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/profile/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not claim handle.');
      }

      router.push('/dashboard?created=1');
      router.refresh();
    } catch (submitError) {
      setLoading(false);
      setError(getErrorMessage(submitError, 'Could not claim handle.'));
    }
  }

  const previewHandle = handle.trim().toLowerCase().replace(/^@+/, '');

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <Label htmlFor="welcome-handle">Handle</Label>
        <div className="relative">
          <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-petal-500" />
          <Input
            id="welcome-handle"
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

      <div className="rounded-[24px] border border-dashed border-petal-300/80 bg-petal-50/80 px-4 py-3 text-sm leading-6 text-muted-foreground">
        {previewHandle
          ? `Your page will live at yaepublishing.house/@${previewHandle}`
          : 'Pick a lowercase handle with letters, numbers, or underscores.'}
      </div>

      {error ? (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading} className="min-w-[200px]">
          {loading ? 'Claiming handle...' : 'Claim my page'}
        </Button>
        <Button type="button" variant="secondary" disabled className="gap-2 opacity-100">
          <ArrowRight className="h-4 w-4" />
          Dashboard next
        </Button>
      </div>
    </form>
  );
}
