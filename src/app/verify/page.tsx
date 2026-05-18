'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SiteLayout from '@/components/SiteLayout';
import styles from '@/components/SiteLayout.module.css';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  }, [token]);

  return (
    <div className={styles.articleContent}>
      {status === 'loading' && <p>Verifying your email...</p>}
      
      {status === 'success' && (
        <>
          <p style={{ color: '#2d7a2d' }}>{message}</p>
          <p>
            <a href="/" style={{ color: '#8b5a8c' }}>Return to homepage</a>
          </p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <p style={{ color: '#a33' }}>{message}</p>
          <p>
            <a href="/" style={{ color: '#8b5a8c' }}>Return to homepage</a>
          </p>
        </>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <SiteLayout>
      <div className={styles.pageContainer}>
        <article>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>Email Verification</h1>
          </header>

          <Suspense fallback={<div className={styles.articleContent}><p>Loading...</p></div>}>
            <VerifyContent />
          </Suspense>
        </article>
      </div>
    </SiteLayout>
  );
}
