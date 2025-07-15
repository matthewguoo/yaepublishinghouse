import { getTimelineDatabase } from '../../lib/notion';
import Text from '../../components/text';
import styles from './../index.module.css';

export const timelineDatabaseId =
  process.env?.NOTION_TIMELINE_DATABASE_ID ?? 'NOTION_TIMELINE_DATABASE_ID';

async function getPosts() {
  return getTimelineDatabase();
}

// Helper: extract sortable year from “From” field
function extractYear(from) {
  if (!from) return 0;
  const four = from.match(/\b(19|20)\d{2}\b/);
  if (four) return parseInt(four[0], 10);
  const twoDigit = from.match(/\b(\d{2})\b/);
  if (twoDigit) return 2000 + parseInt(twoDigit[1], 10);
  return 0;
}

export default async function Page() {
  const posts = await getPosts();
  const yearsExperience = new Date().getFullYear() - 2022;
  return (
    <main className={styles.container}>
      <header className={styles.header}>
      <title>Matthew Guo | About</title>
        <h1>About</h1>
        <p>I am a hardware designer with {yearsExperience} years of experience delivering PCBA projects from initial ideation and schematic capture to bring-up and rework.
I’ve designed boards featuring modern high-speed interfaces such as PCIe and GbE, with some systems operating reliably for years in harsh, hot, and dusty environments.
<br />
In addition to hardware development, I contribute with scripting, basic RTOS firmware, and embedded OS bring-up, helping hardware teams move fast without breaking things.
When I’m not refining requirements or diving into layout, I explore low-latency hardware programming—or spend time outdoors recharging.
        </p>
      </header>

      <h2 className={styles.heading}>Work</h2>

      <ul className={styles.compactList}>
        {[...posts]
          .sort((a, b) => {
            const yearA = extractYear(a.properties?.From?.rich_text?.[0]?.plain_text);
            const yearB = extractYear(b.properties?.From?.rich_text?.[0]?.plain_text);
            return yearB !== yearA
              ? yearB - yearA // newer first
              : new Date(b.last_edited_time) - new Date(a.last_edited_time);
          })
          .map((post) => {
            const title = post.properties?.Title?.title;
            const role = post.properties?.Role?.rich_text?.[0]?.plain_text || '';
            // pull plain‑text values
            const from = post.properties?.From?.rich_text?.[0]?.plain_text || '';
            const to   = post.properties?.To  ?.rich_text?.[0]?.plain_text || '';

            // display “from – to” when both exist
            const dateRange = to ? `${from} – ${to}` : from;

            return (
              <li key={post.id} className={styles.compactItem}>
                <div>
                  <Text title={title} as="span" />
                  {role && <p className={styles.postDescription}>{role}</p>}
                </div>
            
                {/* dates */}
                <span className={styles.compactDate}>{dateRange}</span>
              </li>
            );
            
          })}
      </ul>
    </main>
  );
}
