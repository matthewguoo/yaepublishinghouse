import { getDatabase } from '../lib/notion';
import ProjectsList from '../components/ProjectsList';
import ProjectsAccordion from '../components/ProjectsAccordion';
import ProjectsCards from '../components/ProjectsCards';
import styles from './index.module.css';

const databaseId =
  process.env.NOTION_DATABASE_ID ?? 'NOTION_DATABASE_ID';

async function getPosts() {
  return getDatabase();
}

export default async function Page() {
  const posts = await getPosts();
  const selectedPosts = posts.filter(
    (post) => post.properties?.Selected?.checkbox === true
  );
  // const nonSelectedPosts = posts.filter(
  //   (post) => !post.properties?.Selected?.checkbox
  // );

  return (
    <main className={styles.container}>
      <div className={styles.marginOnDesktop}></div>
      <header className={styles.header}>
        <h1 className={styles.heading}>Matthew Guo</h1>
        <p>I design hardware that is enjoyable to work with.</p>
      </header>

      {/* Desktop View */}
      <div className={styles.desktopOnly}>
        {selectedPosts.length > 0 && (
          <>
            <h2 className={styles.heading}>Selected Projects</h2>
            <ProjectsList posts={selectedPosts} compact={false} />
          </>
        )}

        <h2 className={styles.heading}>All Projects</h2>
        <ProjectsList posts={posts} compact />
      </div>

      {/* Mobile View */}
      <div className={styles.mobileOnly}>
        {selectedPosts.length > 0 && (
          <>
            <h2 className={styles.heading}>Selected Projects</h2>
            <ProjectsCards posts={selectedPosts} />
          </>
        )}
        <h2 className={styles.heading}>All Projects</h2>
        <ProjectsAccordion posts={posts} />
      </div>
    </main>
  );
}
