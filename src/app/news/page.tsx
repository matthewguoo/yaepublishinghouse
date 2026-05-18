import SiteLayout from '@/components/SiteLayout';
import styles from '@/components/SiteLayout.module.css';
import { prisma } from '@/lib/db';
import { formatArticleDate } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <SiteLayout>
      <div className={styles.pageContainer}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; News
        </div>
        
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>News & Announcements</h1>
          <p className={styles.pageSubtitle}>Latest updates from Yae Publishing House</p>
        </header>

        <div className={styles.newsList}>
          {articles.map((article) => (
            <a 
              key={article.slug} 
              href={`/news/${article.slug}`}
              className={styles.newsCard}
            >
              <div className={styles.newsCardMeta}>
                <span className={styles.newsDate}>{formatArticleDate(article.date)}</span>
                <span className={styles.newsCategory}>{article.category}</span>
              </div>
              <h2 className={styles.newsCardTitle}>{article.title}</h2>
              <p className={styles.newsCardExcerpt}>{article.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
