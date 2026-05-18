import SiteLayout from '@/components/SiteLayout';
import styles from '@/components/SiteLayout.module.css';

export default function HiringWritersPage() {
  return (
    <SiteLayout>
      <div className={styles.pageContainer}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; <a href="/news">News</a> &gt; Hiring Writers
        </div>
        
        <article>
          <header className={styles.articleHeader}>
            <div className={styles.articleDate}>2026.05.18 | Recruitment</div>
            <h1 className={styles.articleTitle}>
              The Guuji Seeks Editorial Staff
            </h1>
            <div className={styles.articleMeta}>
              By Yae Publishing House
            </div>
          </header>

          <div className={styles.articleContent}>
            <p>
              Yae Publishing House is expanding its editorial team. We are seeking talented writers, 
              reporters, and content creators to join our publication and cover the ever-growing world 
              of HoYoverse games and community events.
            </p>

            <h2>What We're Looking For</h2>

            <p>
              We welcome applications from passionate fans who can contribute original content about 
              Genshin Impact, Honkai: Star Rail, Zenless Zone Zero, and other HoYoverse titles. 
              Whether you're interested in event coverage, lore analysis, community spotlights, 
              or product reviews—we want to hear from you.
            </p>

            <h2>What You'll Receive</h2>

            <p>
              Contributors to Yae Publishing House receive free merchandise from our store, 
              store vouchers for future purchases, early access to limited edition drops, 
              and direct monetary compensation for published work. 
              Your writing will be published under the Yae Publishing House banner and shared 
              with our growing community of Travelers.
            </p>

            <h2>How to Apply</h2>

            <p>
              To express your interest, please fill out our{' '}
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdcW9rmgzqiSqJCJhAYXyIs3fivJOMu0jjDR7-W4V5M_yVexA/viewform" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5a8c', fontWeight: 600 }}>
                application form
              </a>
              . We'll ask about:
            </p>

            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>A brief introduction about yourself</li>
              <li>Which HoYoverse games you play and your experience level</li>
              <li>What type of content you'd like to create (event reports, lore analysis, reviews, etc.)</li>
              <li>Any relevant writing samples or portfolio links (optional but encouraged)</li>
            </ul>

            <p>
              We look forward to welcoming new voices to the Yae Publishing House family. 
              May your words be as sharp as the Guuji's wit.
            </p>

            <p style={{ marginTop: '40px', fontStyle: 'italic', color: '#888' }}>
              — The Editorial Department
            </p>
          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
