import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { getProfileByUserId, isDatabaseConfigured } from '../../lib/data';
import DashboardEditor from './dashboard-editor';
import styles from './dashboard.module.css';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (!isDatabaseConfigured()) {
    return (
      <main className={styles.page}>
        <section className={styles.setupCard}>
          <div className="pill">setup still needed</div>
          <h1>Hook up Vercel Postgres first.</h1>
          <p>
            The editor is wired, but the database env vars have to exist before profile data can save.
          </p>
          <Link href="/" className="secondary-button">
            Back home
          </Link>
        </section>
      </main>
    );
  }

  const profile = await getProfileByUserId(session.user.id);

  if (!profile) {
    redirect('/dashboard/welcome');
  }

  return (
    <DashboardEditor
      created={searchParams?.created === '1'}
      email={session.user.email || ''}
      profile={profile}
    />
  );
}
