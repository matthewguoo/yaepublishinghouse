import Link from 'next/link';
import Text from '../../components/text';
import { getTimelineDatabase } from '../../lib/notion';
import styles from '../index.module.css';

// Helper: extract sortable year from “From” field
function extractYear(from) {
  if (!from) return 0;
  const four = from.match(/\b(19|20)\d{2}\b/);
  if (four) return parseInt(four[0], 10);
  const two = from.match(/\b(\d{2})\b/);
  if (two) return 2000 + parseInt(two[1], 10);
  return 0;
}

async function getPosts() {
  return getTimelineDatabase();
}

export default async function Page() {
  const posts = await getPosts();
  const yearsExperience = new Date().getFullYear() - 2022;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>About me</h1>
        <p>
          I am a hardware designer with
          {' '}
          {yearsExperience}
          {' '}
          years of experience delivering PCBA projects—from initial ideation
          and schematic capture to bring‑up and rework. I’ve designed boards
          with modern high‑speed interfaces such as PCIe and GbE, many of which
          have run reliably for years in harsh, hot, and dusty environments.
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
              a.properties?.From?.rich_text?.[0]?.plain_text,
            );
            const yearB = extractYear(
              b.properties?.From?.rich_text?.[0]?.plain_text,
            );
            if (yearA !== yearB) return yearB - yearA;
            return (
              new Date(b.last_edited_time).getTime()
              - new Date(a.last_edited_time).getTime()
            );
          })
          .map(post => {
            const title = post.properties?.Title?.title;
            const role = post.properties?.Role?.rich_text?.[0]?.plain_text ?? '';
            const from = post.properties?.From?.rich_text?.[0]?.plain_text ?? '';
            const to = post.properties?.To?.rich_text?.[0]?.plain_text ?? '';
            const dateRange = to ? `${from} – ${to}` : from;
            const link = post.properties?.Link?.rich_text?.[0]?.plain_text ?? '';

            return (
              <li key={post.id} className={styles.compactItem}>

<Link href={link} className={styles.compactLink}>
                  <Text title={title} as="span" />
                  {role && (
                    <p className={styles.postDescription}>{role}</p>
                  )}
                  </Link>
                <span className={styles.compactDate}>{dateRange}</span>

              </li>
            );
          })}
      </ul>
    </main>
  );
}
