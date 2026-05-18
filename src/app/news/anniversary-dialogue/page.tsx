'use client';

import SiteLayout from '@/components/SiteLayout';
import styles from '@/components/SiteLayout.module.css';

export default function AnniversaryPage() {
  return (
    <SiteLayout>
      <div className={styles.pageContainer}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; <a href="/news">News</a> &gt; 500th Anniversary Special
        </div>
        
        <article>
          <header className={styles.articleHeader}>
            <div className={styles.articleDate}>2026.02.01 | Special Feature</div>
            <h1 className={styles.articleTitle}>
              宮司様と将軍様の特別対談：八重堂創業500周年を記念して
            </h1>
            <div className={styles.articleMeta}>
              Special Dialogue: The Guuji and the Shogun — Celebrating 500 Years of Yae Publishing House
            </div>
          </header>

          <div className={styles.articleImage}>
            <img src="/yae-raiden-banner.png" alt="Yae Miko and Raiden Shogun" />
          </div>

          <div className={styles.articleContent}>
            <p>
              In commemoration of the 500th anniversary of Yae Publishing House, we are honored to present an exclusive dialogue between Lady Yae Miko, Chief Priestess of the Grand Narukami Shrine and founder of this esteemed establishment, and the Raiden Shogun, Almighty Narukami Ogosho and eternal protector of Inazuma.
            </p>

            <p>
              The following conversation took place within the Tenshukaku, with permission graciously granted by the Shogunate. We present it here in its entirety, lightly edited for clarity.
            </p>

            <h2>On the Founding of Yae Publishing House</h2>

            <p>
              <strong>Raiden Shogun:</strong> Five hundred years. Even by the measure of eternity, this is no small span of time. I recall when you first proposed this venture. Many in the court questioned the necessity of such an establishment.
            </p>

            <p>
              <strong>Yae Miko:</strong> And yet here we are, still printing, still binding, still selling books that the people of Inazuma—and beyond—seem quite eager to purchase. I believe the phrase is "I told you so," though I'm far too gracious to say it directly.
            </p>

            <p>
              <strong>Raiden Shogun:</strong> Your graciousness is noted.
            </p>

            <h2>On Literature and Eternity</h2>

            <p>
              <strong>Yae Miko:</strong> What I find most fascinating is how stories endure. Buildings crumble, empires shift, but a good story—truly good—finds its way into the hearts of each new generation. That is a form of eternity, is it not?
            </p>

            <p>
              <strong>Raiden Shogun:</strong> You speak of the eternity of ideas rather than physical permanence. This is... a valid interpretation.
            </p>

            <p>
              <strong>Yae Miko:</strong> Coming from you, that's practically a glowing endorsement. I shall have it printed in the next catalog.
            </p>

            <h2>Looking Forward</h2>

            <p>
              <strong>Raiden Shogun:</strong> What are your ambitions for the next five hundred years?
            </p>

            <p>
              <strong>Yae Miko:</strong> Oh, the usual. More light novels about certain electro archons reincarnating with overpowered abilities. Perhaps some merchandise expansions. I've been considering branching into other nations—Sumeru has quite the academic market, and Fontaine's readers have sophisticated tastes.
            </p>

            <p>
              <strong>Raiden Shogun:</strong> You continue to surprise me, Miko.
            </p>

            <p>
              <strong>Yae Miko:</strong> That is, after all, the entire point.
            </p>

            <blockquote>
              This special anniversary edition includes a limited-run signed bookplate from Lady Yae Miko herself. Only 500 copies will be produced—one for each year of our history.
            </blockquote>

            <p>
              Yae Publishing House thanks its readers for five centuries of patronage, and looks forward to many more centuries of bringing stories to Teyvat and beyond.
            </p>
          </div>

          <div className={styles.tagList}>
            <span className={styles.tag}>Anniversary</span>
            <span className={styles.tag}>Special Feature</span>
            <span className={styles.tag}>Yae Miko</span>
            <span className={styles.tag}>Raiden Shogun</span>
          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
