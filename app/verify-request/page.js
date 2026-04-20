import Link from 'next/link';
import styles from '../auth-shell.module.css';

export const metadata = {
  title: 'Check your email',
};

export default function VerifyRequestPage() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <div className={styles.stack}>
          <div className="pill">email sent</div>
          <p className={styles.kicker}>tiny inbox quest</p>
          <h1 className={styles.title}>Check your email for the magic link.</h1>
          <p className={styles.body}>
            It should show up in a minute or two. Click it on the same device if you can, then you should land right back in your dashboard setup.
          </p>
          <div className={styles.meta}>
            <span>one-time link</span>
            <span>expires fast</span>
            <span>no password needed</span>
          </div>
          <p className={styles.body}>
            If it doesn't show up, head back to <Link href="/login">login</Link> or <Link href="/signup">signup</Link> and resend it.
          </p>
        </div>
      </section>
    </main>
  );
}
