import SiteLayout from '@/components/SiteLayout';
import styles from '@/components/SiteLayout.module.css';

const articles = [
  {
    slug: 'hiring-writers',
    title: 'The Guuji Seeks Editorial Staff',
    date: '2026.05.18',
    category: 'Recruitment',
    excerpt: 'Writers, reporters, and content creators wanted. Contributors receive free merchandise and store vouchers.',
  },
  {
    slug: 'nameless-pass-announcement',
    title: 'Introducing the Nameless Honor Pass',
    date: '2026.05.17',
    category: 'Product Launch',
    excerpt: 'Limited edition gold-plated collectible commemorating the 2158th Year of the Trailblaze.',
  },
  {
    slug: 'hoyofair-2026',
    title: 'HoYoFair 2026 Los Angeles: A Report from the Front Row',
    date: '2026.01.15',
    category: 'Event Report',
    excerpt: 'This reporter was fortunate to attend the event with a gifted front-row seat ticket.',
  },
  {
    slug: 'anniversary-dialogue',
    title: 'Anniversary Dialogue: A Year of Publishing',
    date: '2026.01.01',
    category: 'Editorial',
    excerpt: 'Reflecting on our first year of bringing stories to the Traveler community.',
  },
];

export default function NewsPage() {
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
                <span className={styles.newsDate}>{article.date}</span>
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
