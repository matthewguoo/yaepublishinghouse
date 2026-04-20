'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../auth-shell.module.css';

export default function WelcomeForm({ initialHandle = '', initialError = '' }) {
  const router = useRouter();
  const [handle, setHandle] = useState(initialHandle);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
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
      setError(submitError.message || 'Could not claim handle.');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="welcome-handle">Handle</label>
        <input
          id="welcome-handle"
          type="text"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          placeholder="yuuko"
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
        />
      </div>

      <div className={styles.note}>
        {handle.trim() ? `Your page will live at yaepublishing.house/@${handle.trim().toLowerCase().replace(/^@+/, '')}` : 'Pick a lowercase handle with letters, numbers, or underscores.'}
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? 'Claiming handle...' : 'Claim my page'}
      </button>
    </form>
  );
}
