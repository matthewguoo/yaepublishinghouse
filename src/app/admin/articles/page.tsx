import Link from 'next/link';
import { prisma } from '@/lib/db';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Webmaster console</p>
            <h1 className={styles.title}>Editorial Desk</h1>
            <p className={styles.subtitle}>Publish, hide, and revise Yae Publishing House articles without a redeploy.</p>
          </div>
          <div className={styles.buttonRow}>
            <Link className={styles.ghostButton} href="/">View site</Link>
            <Link className={styles.ghostButton} href="/admin/media-submissions">Media review</Link>
            <Link className={styles.button} href="/admin/articles/new">New article</Link>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Category</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>
                  <strong>{article.title}</strong><br />
                  <small>/news/{article.slug}</small>
                </td>
                <td>{article.date}</td>
                <td>{article.category}</td>
                <td>
                  <span className={styles.status}>{article.published ? 'Published' : 'Draft'}</span>{' '}
                  {article.featured && <span className={styles.status}>Featured</span>}
                </td>
                <td><a className={styles.ghostButton} href={`/admin/articles/${article.id}/edit`}>Edit</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
