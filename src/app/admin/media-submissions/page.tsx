import Link from 'next/link';
import { prisma } from '@/lib/db';
import { approveMediaSubmission, rejectMediaSubmission } from '../actions';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminMediaSubmissionsPage() {
  const submissions = await prisma.mediaSubmission.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: { user: { select: { email: true } } },
  });

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Reward counter</p>
            <h1 className={styles.title}>Media Review</h1>
            <p className={styles.subtitle}>Approve posts for a $3 manual refund or mint a $5 store-credit voucher.</p>
          </div>
          <div className={styles.buttonRow}>
            <Link className={styles.ghostButton} href="/admin/articles">Editorial</Link>
            <Link className={styles.ghostButton} href="/">View site</Link>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Media</th>
              <th>Reward</th>
              <th>Status</th>
              <th>Submitted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.user.email}</td>
                <td>
                  <strong>{submission.platform}</strong><br />
                  <a className={styles.inlineLink} href={submission.mediaUrl} target="_blank" rel="noreferrer">
                    {submission.mediaUrl}
                  </a>
                </td>
                <td>{submission.rewardType === 'voucher' ? '$5 voucher' : '$3 refund'}</td>
                <td><span className={styles.status}>{submission.status}</span></td>
                <td>{submission.createdAt.toLocaleDateString()}</td>
                <td>
                  {submission.status === 'pending' ? (
                    <div className={styles.buttonRow}>
                      <form action={approveMediaSubmission.bind(null, submission.id)}>
                        <button className={styles.button} type="submit">Approve</button>
                      </form>
                      <form action={rejectMediaSubmission.bind(null, submission.id)}>
                        <button className={styles.dangerButton} type="submit">Reject</button>
                      </form>
                    </div>
                  ) : submission.reviewedAt ? (
                    <small>Reviewed {submission.reviewedAt.toLocaleDateString()}</small>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {submissions.length === 0 && <p className={styles.subtitle}>No submissions yet. The fox clerks are bored.</p>}
      </section>
    </main>
  );
}
