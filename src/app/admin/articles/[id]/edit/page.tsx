import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ArticleForm from '../../ArticleForm';
import { deleteArticle, updateArticle } from '../../../actions';
import styles from '../../../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Editing /news/{article.slug}</p>
            <h1 className={styles.title}>Revise Article</h1>
            <p className={styles.subtitle}>Changes go live as soon as published is checked.</p>
          </div>
          <div className={styles.buttonRow}>
            <a className={styles.ghostButton} href={`/news/${article.slug}`}>View</a>
            <a className={styles.ghostButton} href="/admin/articles">Back</a>
          </div>
        </div>
        <ArticleForm
          defaults={article}
          action={updateArticle.bind(null, article.id)}
          deleteAction={deleteArticle.bind(null, article.id)}
        />
      </section>
    </main>
  );
}
