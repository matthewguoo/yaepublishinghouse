'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

type Voucher = {
  id: string;
  code: string;
  value: string;
  expiresAt: string;
  usedAt: string | null;
};

type MediaSubmission = {
  id: string;
  mediaUrl: string;
  platform: string;
  status: string;
  rewardType: string;
  createdAt: string;
  reviewedAt: string | null;
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [submissions, setSubmissions] = useState<MediaSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaUrl, setMediaUrl] = useState('');
  const [rewardType, setRewardType] = useState('voucher');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [nowMs, setNowMs] = useState(0);

  const activeBalance = useMemo(() => {
    return vouchers.reduce((sum, voucher) => {
      if (voucher.usedAt || new Date(voucher.expiresAt).getTime() < nowMs) return sum;
      return sum + Number(voucher.value);
    }, 0);
  }, [nowMs, vouchers]);

  async function loadRewards() {
    const res = await fetch('/api/account/rewards');
    if (!res.ok) return;
    const data = await res.json();
    setVouchers(data.vouchers || []);
    setSubmissions(data.mediaSubmissions || []);
    setNowMs(Date.now());
  }

  useEffect(() => {
    async function loadAccount() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.user) {
          router.push('/');
          return;
        }
        setUser(data.user);
        await loadRewards();
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    }
    loadAccount();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  async function handleSubmitMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const res = await fetch('/api/media-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaUrl, rewardType }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);

    if (!res.ok) {
      setMessage(data.error || 'Could not submit this link.');
      return;
    }

    setMediaUrl('');
    setMessage('Sent to the shrine office. We will review it soon.');
    await loadRewards();
  }

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
          <Link href="/">Home</Link> &gt; Account
        </div>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Shrine ledger</p>
          <h1>Account</h1>
          <p>Vouchers, media rewards, and the tiny accounting foxes that make commerce possible.</p>
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

        <section className={styles.rewardsGrid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Vouchers</h2>
              <strong className={styles.balance}>${activeBalance.toFixed(2)}</strong>
            </div>
            <p className={styles.note}>Store credit will be usable at checkout once Stripe checkout is wired in.</p>
            <div className={styles.voucherList}>
              {vouchers.length === 0 ? (
                <p className={styles.empty}>No vouchers yet. Post something cute and claim tribute.</p>
              ) : vouchers.map((voucher) => {
                const expired = new Date(voucher.expiresAt).getTime() < nowMs;
                const state = voucher.usedAt ? 'Used' : expired ? 'Expired' : 'Active';
                const stateKey = voucher.usedAt ? 'used' : expired ? 'expired' : 'active';
                return (
                  <article className={`${styles.voucher} ${styles[`voucher_${stateKey}`]}`} key={voucher.id}>
                    <div className={styles.voucherStub} aria-hidden="true">
                      <span className={styles.voucherStubLabel}>福 · 券</span>
                      <span className={styles.voucherStubKana}>YAE</span>
                    </div>
                    <div className={styles.voucherBody}>
                      <div className={styles.voucherTopRow}>
                        <span className={styles.voucherKind}>Shrine Tribute</span>
                        <span className={`${styles.voucherState} ${styles[`state_${stateKey}`]}`}>{state}</span>
                      </div>
                      <div className={styles.voucherValue}>
                        <span className={styles.voucherCurrency}>$</span>
                        <span className={styles.voucherAmount}>{Number(voucher.value).toFixed(2)}</span>
                        <span className={styles.voucherDenom}>store credit</span>
                      </div>
                      <div className={styles.voucherMeta}>
                        <code className={styles.voucherCode}>{voucher.code}</code>
                        <small>有效期至 {new Date(voucher.expiresAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className={styles.card}>
            <h2>Submit media</h2>
            <p className={styles.note}>Drop an Instagram Reel, TikTok, YouTube Short, or post featuring Yae Publishing House.</p>
            <form className={styles.mediaForm} onSubmit={handleSubmitMedia}>
              <label>
                Media link
                <input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder="https://www.instagram.com/reel/..." required />
              </label>
              <label>
                Reward
                <select value={rewardType} onChange={(event) => setRewardType(event.target.value)}>
                  <option value="voucher">$5 voucher</option>
                  <option value="refund">$3 refund</option>
                </select>
              </label>
              <button className={styles.primaryBtn} disabled={submitting} type="submit">
                {submitting ? 'Sending...' : 'Submit for review'}
              </button>
              {message && <p className={styles.message}>{message}</p>}
            </form>
          </div>
        </section>

        <div className={styles.card}>
          <h2>Media submissions</h2>
          {submissions.length === 0 ? (
            <p className={styles.empty}>Nothing submitted yet.</p>
          ) : (
            <div className={styles.submissionList}>
              {submissions.map((submission) => (
                <article className={styles.submission} key={submission.id}>
                  <div>
                    <span className={styles.status}>{submission.status}</span>
                    <strong>{submission.platform}</strong>
                    <a href={submission.mediaUrl} target="_blank" rel="noreferrer">{submission.mediaUrl}</a>
                  </div>
                  <small>{submission.rewardType === 'voucher' ? '$5 voucher' : '$3 refund'} requested on {new Date(submission.createdAt).toLocaleDateString()}</small>
                </article>
              ))}
            </div>
          )}
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
