import { getDatabase } from '../../lib/notion';
// import ProjectsList from '../components/ProjectsList';
// import ProjectsAccordion from '../components/ProjectsAccordion';
import styles from '../index.module.css';

export const databaseId =
  process.env.NOTION_DATABASE_ID ?? 'NOTION_DATABASE_ID';

async function getPosts() {
  return getDatabase();
}

export default async function Page() {
  const posts = await getPosts();
  const yearsExperience = new Date().getFullYear() - 2022;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>About</h1>
        <p>
          I am a hardware designer with {yearsExperience} years of experience
          delivering PCBA projects—from initial ideation and schematic capture
          to bring‑up and rework. I’ve designed boards with modern high‑speed
          interfaces such as PCIe and GbE, many of which have run reliably for
          years in harsh, hot, and dusty environments.
          <br />
          In addition to hardware development, I contribute scripting, basic
          RTOS firmware, and embedded OS bring‑up experience, enabling hardware
          teams to move fast without breaking things.
          <br />
          When I’m not refining requirements or diving into layout, you’ll find
          me exploring low‑latency hardware programming—or recharging outdoors.
        </p>
      </header>

      <h2 className={styles.heading}>Work</h2>

      <ul className={styles.compactList}>
        {[...posts]
          .sort((a, b) => {
            const yearA = extractYear(
              a.properties?.From?.rich_text?.[0]?.plain_text
            );
            const yearB = extractYear(
              b.properties?.From?.rich_text?.[0]?.plain_text
            );
            if (yearA !== yearB) return yearB - yearA;
            return (
              new Date(b.last_edited_time).getTime() -
              new Date(a.last_edited_time).getTime()
            );
          })
          .map((post) => {
            const title = post.properties?.Title?.title;
            const role = post.properties?.Role?.rich_text?.[0]?.plain_text ?? '';
            const from = post.properties?.From?.rich_text?.[0]?.plain_text ?? '';
            const to = post.properties?.To?.rich_text?.[0]?.plain_text ?? '';
            const dateRange = to ? `${from} – ${to}` : from;

            return (
              <li key={post.id} className={styles.compactItem}>
                <div>
                  <Text title={title} as="span" />
                  {role && (
                    <p className={styles.postDescription}>{role}</p>
                  )}
                </div>
                <span className={styles.compactDate}>{dateRange}</span>
              </li>
            );
          })}
      </ul>
    </main>
  );
}
