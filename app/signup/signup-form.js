'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from '../auth-shell.module.css';

function normalizeHandle(value) {
  return value.trim().toLowerCase().replace(/^@+/, '');
}

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewHandle = useMemo(() => normalizeHandle(handle), [handle]);

  async function handleSubmit(event) {
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
      setError(submitError.message || 'Could not start signup.');
    }
  }

  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <div className={styles.stack}>
          <div className="pill">claim your cute page</div>
          <p className={styles.kicker}>soft launch energy</p>
          <h1 className={styles.title}>Reserve a handle, then verify by email.</h1>
          <p className={styles.body}>
            Pick your @handle now. We save it, send a magic link, and finish setup after you click it.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className="field">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="signup-handle">Handle</label>
                <input
                  id="signup-handle"
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                  placeholder="yuuko"
                  value={handle}
                  onChange={(event) => setHandle(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.note}>
              {previewHandle ? `Your page will live at yaepublishing.house/@${previewHandle}` : 'Handles can use lowercase letters, numbers, and underscores.'}
            </div>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Saving handle...' : 'Claim handle with email'}
            </button>
          </form>

          <div className={styles.meta}>
            <span>3-20 chars</span>
            <span>lowercase only</span>
            <span>reserved names blocked</span>
          </div>

          <p className={styles.body}>
            Already have one? <Link href="/login">Log in instead</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
