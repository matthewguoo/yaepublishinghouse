import { notFound } from 'next/navigation';
import SiteLayout from '@/components/SiteLayout';
import MarkdownArticle from '@/components/MarkdownArticle';
import styles from '@/components/SiteLayout.module.css';
import { prisma } from '@/lib/db';
import { formatArticleDate } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article || !article.published) notFound();

  return (
    <SiteLayout>
      <div className={styles.pageContainer}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; <a href="/news">News</a> &gt; {article.title}
        </div>
        
        <article>
          <header className={styles.articleHeader}>
            <div className={styles.articleDate}>{formatArticleDate(article.date)} | {article.category}</div>
            <h1 className={styles.articleTitle}>{article.title}</h1>
            <div className={styles.articleMeta}>By Yae Publishing House</div>
          </header>
          <MarkdownArticle content={article.content} />
        </article>
      </div>
    </SiteLayout>
  );
}
