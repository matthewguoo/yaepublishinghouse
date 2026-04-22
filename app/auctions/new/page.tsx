import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { getProfileByUserId } from '../../../lib/data';
import { NewAuctionForm } from './new-auction-form';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Create auction' };

export default async function NewAuctionPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/auctions/new');
  }

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) {
    return (
      <main style={{ maxWidth: 560, margin: '60px auto', padding: '0 22px' }}>
        <h1 style={{ fontFamily: 'var(--font-marker), cursive', color: 'var(--ink)' }}>
          claim a handle first
        </h1>
        <p style={{ fontFamily: 'var(--font-note), cursive', color: 'var(--ink-soft)' }}>
          you need a public profile before you can list an auction.
        </p>
        <Link href="/dashboard" className="primary-button" style={{ marginTop: 16 }}>
          set up profile
        </Link>
      </main>
    );
  }

  return <NewAuctionForm handle={profile.handle} />;
}
