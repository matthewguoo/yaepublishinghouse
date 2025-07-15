import Link from 'next/link';
import { getArticleDatabase } from '../../lib/notion';
import Text from '../../components/text';
import styles from './../index.module.css';

export const articleDatabaseId = process.env?.NOTION_ARTICLE_DATABASE_ID ?? 'NOTION_ARTICLE_DATABASE_ID';

async function getPosts() {
  const database = await getArticleDatabase();

  return database;
}

export default async function Page() {
  const posts = await getPosts();
  return (
    <div>
      <main className={styles.container}>
        <header className={styles.header}>
        <title>Matthew Guo | Blog</title>
          <h1>Blog</h1>
          <p>
            I write about city life, hardware design, and the occasional exploration of low-latency hardware programming. 
          </p>
        </header>

        <h2 className={styles.heading}>Articles</h2>
        <ol className={styles.posts}>
          {posts.map((post) => {
            const date = new Date(post.last_edited_time).toLocaleString(
              'en-US',
              {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              },
            );
            const slug = post.properties?.Slug?.rich_text[0].text.content;
            return (
              <div></div>
              // <li key={post.id} className={styles.post}>
              //   <h3 className={styles.postTitle}>
              //     <Link href={`/blog/article/${slug}`}>
              //       <Text title={post.properties?.Title?.title} />
              //     </Link>
              //   </h3>

              //   <p className={styles.postDescription}>{date}</p>
              //   <Link href={`/blog/article/${slug}`}>Read post →</Link>
              // </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
