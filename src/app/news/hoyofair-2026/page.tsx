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
            <div className={styles.articleDate}>2026.05.03 | Event Report</div>
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
              On Friday, May 1st, 2026, HoYoverse brought its annual fan celebration "HoYoFair 2026" to the Dolby Theatre in Los Angeles. The historic venue, famous for hosting the Academy Awards, provided a fitting backdrop for what would be an unforgettable evening of music and celebration for fans of Genshin Impact, Honkai: Star Rail, Honkai Impact 3rd, and Zenless Zone Zero.
            </p>

            <p>
              This reporter was fortunate to attend the concert with a gifted front-row seat ticket, courtesy of a generous contact within the community. Accommodations were secured at a hostel on Hollywood Boulevard, where a two-night stay cost approximately $70. Combined with a $60 flight arranged well in advance, the entire trip totaled roughly $130—a testament to the accessibility of such events for dedicated fans willing to plan ahead.
            </p>

            <h2>Concert Highlights</h2>

            <p>
              The evening opened with an orchestral arrangement of Genshin Impact's "Liyue" theme that immediately drew gasps from the audience. The HoYoverse Symphony Orchestra, accompanied by a full choir, delivered breathtaking performances of fan-favorite tracks spanning all four titles.
            </p>

            <p>
              Of particular note was a medley from Honkai: Star Rail featuring music from the Penacony arc, which earned a standing ovation from the crowd. The visual production was equally impressive, with synchronized lighting and projections that transformed the Dolby Theatre into the various worlds of the HoYoverse.
            </p>

            <h2>Special Appearances</h2>

            <p>
              Voice actors from both the English and Japanese casts made surprise appearances throughout the evening, delivering live readings and interacting with the audience between musical segments. The energy in the theatre was electric as fans cheered for their favorite characters and performers.
            </p>

            <h2>Community Atmosphere</h2>

            <p>
              The lobby and surrounding areas of Hollywood Boulevard were filled with cosplayers representing characters from all four titles. The sense of community was palpable—fans who had traveled from across the globe gathered to share in a collective experience that transcended language barriers.
            </p>

            <p>
              As this reporter departed the Dolby Theatre that evening, the general sentiment among attendees seemed to be one of pure joy. HoYoFair 2026 demonstrated that live events remain an irreplaceable way to celebrate the games and communities we love.
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
            <span className={styles.tag}>Concert</span>
            <span className={styles.tag}>Los Angeles</span>
            <span className={styles.tag}>Dolby Theatre</span>
          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
