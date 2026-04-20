import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import styles from '../../auth-shell.module.css';
import { authOptions } from '../../../lib/auth';
import { claimHandleForUser, getProfileByUserId, isDatabaseConfigured } from '../../../lib/data';
import WelcomeForm from './welcome-form';

export const metadata = {
  title: 'Finish setup',
};

export default async function DashboardWelcomePage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.email) {
    redirect('/login');
  }

  if (!isDatabaseConfigured()) {
    return (
      <main className={styles.wrapper}>
        <section className={styles.card}>
          <div className={styles.stack}>
            <div className="pill">database needed</div>
            <h1 className={styles.title}>Add Postgres first.</h1>
            <p className={styles.body}>
              This part needs Vercel Postgres hooked up before a handle can actually be claimed.
            </p>
            <p className={styles.body}>
              Once the env vars are in place, come back here and it should work. <Link href="/">Back home</Link>.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const existingProfile = await getProfileByUserId(session.user.id);
  if (existingProfile) {
    redirect('/dashboard');
  }

  const requestedHandle = typeof searchParams?.handle === 'string' ? searchParams.handle : '';
  let claimError = '';

  if (requestedHandle) {
    try {
      await claimHandleForUser({
        userId: session.user.id,
        email: session.user.email,
        rawHandle: requestedHandle,
      });
      redirect('/dashboard?created=1');
    } catch (error) {
      claimError = error.message || 'Could not claim that handle.';
    }
  }

  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        <div className={styles.stack}>
          <div className="pill">finish your page</div>
          <p className={styles.kicker}>almost there</p>
          <h1 className={styles.title}>Claim your @handle.</h1>
          <p className={styles.body}>
            Your email is verified. Pick the handle you want attached to this account and we’ll drop you into the editor.
          </p>
          <WelcomeForm initialHandle={requestedHandle} initialError={claimError} />
        </div>
      </section>
    </main>
  );
}
