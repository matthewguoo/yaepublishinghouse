'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteLayout from '@/components/SiteLayout';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setMessage('Check your email for a magic link to sign in.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Login' }]} />

        <div className={styles.formCard}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.subtitle}>Enter your email to receive a magic link</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                className={styles.input}
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          <p className={styles.footer}>
            Don't have an account? <Link href="/register">Register</Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
