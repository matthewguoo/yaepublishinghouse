import { getDatabase } from '../lib/notion';
import ProjectsList from '../components/ProjectsList';
import ProjectsAccordion from '../components/ProjectsAccordion';
import ProjectsCards from '../components/ProjectsCards';
import styles from './index.module.css';
import FieldGrid from '../components/fieldGrid';

export const databaseId = process.env.NOTION_DATABASE_ID ?? 'NOTION_DATABASE_ID';

async function getPosts() {
  return getDatabase();
}

export default async function Page() {
  const posts = await getPosts();

  const selectedPosts = posts.filter(
    (post) => post.properties?.Selected?.checkbox === true
  );

  const nonSelectedPosts = posts.filter(
    (post) => !post.properties?.Selected?.checkbox
  );
  // const projects = posts.map((p) => ({
  //   id: p.id,
  //   title: p.properties?.Title?.title?.[0]?.plain_text,
  //   tags: p.properties?.Tags?.multi_select?.map((t) => t.name) || [],
  // }));
  

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <title>Matthew Guo | Yae Publishing House</title>
        <h1 className={styles.heading}>Matthew Guo</h1>
        <p>I design hardware that is enjoyable to work with.</p>
      </header>

      {/* Desktop View */}
      <div className={styles.desktopOnly}>
      {/* <FieldGrid projects={projects} /> */}

        {selectedPosts.length > 0 && (
          <>
            <h2 className={styles.heading}>Selected Projects</h2>
            <ProjectsList posts={selectedPosts} compact={false} />
          </>
        )}

        <h2 className={styles.heading}>All Projects</h2>
        <ProjectsList posts={posts} compact={true} />
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
        <ProjectsAccordion posts={nonSelectedPosts} />
      </div>
    </main>
  );
}
