'use client';

import SiteLayout from '@/components/SiteLayout';
import styles from '@/components/SiteLayout.module.css';

export default function HoYoFairPage() {
  return (
    <SiteLayout>
      <div className={styles.pageContainer}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; <a href="/news">News</a> &gt; HoYoFair 2026
        </div>
        
        <article>
          <header className={styles.articleHeader}>
            <div className={styles.articleDate}>2026.01.15 | Event Report</div>
            <h1 className={styles.articleTitle}>
              HoYoFair 2026 Los Angeles: A Report from the Front Row
            </h1>
            <div className={styles.articleMeta}>
              By Yae Publishing House Editorial Department
            </div>
          </header>

          <div className={styles.articleImage}>
            <img src="/banner-hoyofair.png" alt="HoYoFair 2026 Key Visual" />
          </div>

          <div className={styles.articleContent}>
            <p>
              On the weekend of January 11-12, 2026, HoYoverse held its annual fan celebration event "HoYoFair 2026" at the Los Angeles Convention Center. The event, which has grown significantly since its inception, drew thousands of attendees from across North America and beyond, gathering to celebrate the worlds of Genshin Impact, Honkai: Star Rail, Honkai Impact 3rd, and Zenless Zone Zero.
            </p>

            <p>
              This reporter was fortunate to attend the event with a gifted front-row seat ticket, courtesy of a generous contact within the community. Accommodations were secured at the hostel directly across the street from the convention center on Hollywood Boulevard, where a two-night stay cost approximately $70. Combined with a $60 flight arranged well in advance, the entire trip totaled roughly $130—a testament to the accessibility of such events for dedicated fans willing to plan ahead.
            </p>

            <h2>Event Highlights</h2>

            <p>
              The main stage program featured a series of announcements and performances that captivated the audience throughout the weekend. Notable appearances included voice actors from both the English and Japanese casts of Genshin Impact, who participated in panel discussions and fan Q&A sessions.
            </p>

            <p>
              The exhibition hall showcased extensive displays dedicated to each title in the HoYoverse portfolio. Of particular interest to attendees was the Honkai: Star Rail section, which featured life-size standees of the Astral Express crew and interactive photo opportunities with themed backdrops depicting various locations from the game.
            </p>

            <h2>Merchandise and Exclusive Items</h2>

            <p>
              The official merchandise booth saw consistent queues throughout the event, with many items selling out within hours of the doors opening. Event-exclusive goods, including limited-edition character pins, acrylic stands, and apparel, were highly sought after by collectors and casual fans alike.
            </p>

            <p>
              Third-party vendors in the artist alley section offered a diverse array of fan-created works, from illustrations and prints to handcrafted accessories. The quality of offerings reflected the talent and dedication of the HoYoverse fan community.
            </p>

            <h2>Community Atmosphere</h2>

            <p>
              Perhaps most notable was the sense of community that pervaded the event. Cosplayers representing characters from all four titles could be seen throughout the venue, with many gathering for impromptu photo sessions and group meetups. The event served not only as a celebration of the games themselves but as an opportunity for fans to connect with like-minded individuals.
            </p>

            <p>
              As this reporter departed the convention center on the final evening, the general sentiment among attendees seemed to be one of satisfaction and anticipation for future events. HoYoFair 2026 demonstrated that the appetite for in-person fan gatherings remains strong, and that HoYoverse continues to invest meaningfully in its global community.
            </p>

            <blockquote>
              "The accessibility of attending such events should not be underestimated. With careful planning, a weekend of celebration need not break the bank."
            </blockquote>

            <p>
              Yae Publishing House extends its gratitude to all who made this coverage possible, and looks forward to continued reporting on community events in the future.
            </p>
          </div>

          <div className={styles.tagList}>
            <span className={styles.tag}>HoYoFair</span>
            <span className={styles.tag}>Event Report</span>
            <span className={styles.tag}>Los Angeles</span>
            <span className={styles.tag}>Genshin Impact</span>
            <span className={styles.tag}>Honkai: Star Rail</span>
          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
