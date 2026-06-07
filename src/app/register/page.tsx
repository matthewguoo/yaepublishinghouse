'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './page.module.css';

export default function RegisterPage() {
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setMessage('Check your email to verify your account.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Register' }]} />

        <div className={styles.formCard}>
          <h1 className={styles.title}>Register</h1>
          <p className={styles.subtitle}>Create an account to join the waitlist and earn rewards</p>

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
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className={styles.footer}>
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
