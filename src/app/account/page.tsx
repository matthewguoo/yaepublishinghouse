'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/');
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className={styles.container}>
          <p>Loading...</p>
        </div>
      </SiteLayout>
    );
  }

  if (!user) return null;

  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; Account
        </div>

        <header className={styles.header}>
          <h1>Account</h1>
        </header>

        <div className={styles.card}>
          <h2>Profile</h2>
          <div className={styles.field}>
            <label>Email</label>
            <span>{user.email}</span>
          </div>
          <div className={styles.field}>
            <label>Status</label>
            <span className={styles.verified}>
              {user.emailVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <div className={styles.field}>
            <label>Member since</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Actions</h2>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}
