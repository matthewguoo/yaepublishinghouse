'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from '../auth-shell.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
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
    } catch {
      setLoading(false);
      setError('That link did not send. Try again in a second.');
    }
  }

  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <div className={styles.stack}>
          <div className="pill">magic link login</div>
          <p className={styles.kicker}>welcome back, cosplayer</p>
          <h1 className={styles.title}>Log in with email.</h1>
          <p className={styles.body}>
            No password spreadsheet. We send one link and you hop straight into your dashboard.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Sending link...' : 'Send magic link'}
            </button>
          </form>

          <div className={styles.meta}>
            <span>email verification</span>
            <span>one tap sign-in</span>
            <span>dashboard after click</span>
          </div>

          <p className={styles.body}>
            New here? <Link href="/signup">Claim a handle first</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
