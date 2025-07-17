import Link from 'next/link';
import { getArticleDatabase } from '../../lib/notion';
import Text from '../../components/text';
import styles from '../index.module.css'; // ← remove extra “./” segment

// const articleDatabaseId =
//   process.env.NOTION_ARTICLE_DATABASE_ID ?? 'NOTION_ARTICLE_DATABASE_ID';

async function getPosts() {
  return getArticleDatabase();
}

export default async function Page() {
  const posts = await getPosts();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Blog</h1>
        <p>
          I write about city life and applying for things.
        </p>
      </header>

      <h2 className={styles.heading}>Articles</h2>

      <ol className={styles.compactList}>
        {posts.map(post => {
          const edited = new Date(post.last_edited_time).toLocaleString(
            'en-US',
            { month: 'short', day: '2-digit', year: 'numeric' }
          );
          const slug =
            post.properties?.Slug?.rich_text?.[0]?.text?.content ?? 'untitled';

          return (
            <li key={post.id} className={styles.compactItem}>

            <Link href={`/blog/article/${slug}`} className={styles.compactLink}>
                              <Text title={post.properties?.Title?.title} as="span" />
                              </Link>
                            <span className={styles.compactDate}>{edited}</span>
            
                          </li>
          );
        })}
      </ol>
    </main>
  );
}
