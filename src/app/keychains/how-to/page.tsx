import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import SectionHeader from '@/components/SectionHeader';
import styles from './page.module.css';

export const metadata = {
  title: 'Preparing your artwork · Yae Publishing House',
  description: 'How to set up a PSD for a gold-plated keychain run.',
};

export default function HowToPage() {
  return (
    <SiteLayout>
      <div className={styles.page}>
        <div className={styles.eyebrow}>Artwork Guide</div>
        <h1 className={styles.title}>Preparing your PSD</h1>
        <p className={styles.tagline}>
          Three layers. One canvas. Real gold where you paint gold.
        </p>

        {/* Diagram */}
        <div className={styles.diagram}>
          <div className={styles.diagramItem}>
            <div className={`${styles.diagramSwatch} ${styles.swOutline}`}>
              <div className={styles.swOutlineShape} />
            </div>
            <div className={styles.diagramLabel}>outline</div>
            <div className={styles.diagramSub}>the cut shape</div>
          </div>
          <div className={styles.diagramItem}>
            <div className={`${styles.diagramSwatch} ${styles.swGold}`}>
              <div className={styles.swGoldShape} />
            </div>
            <div className={styles.diagramLabel}>gold</div>
            <div className={styles.diagramSub}>real gold plating</div>
          </div>
          <div className={styles.diagramItem}>
            <div className={`${styles.diagramSwatch} ${styles.swArt}`}>
              <div className={styles.swArtShape} />
            </div>
            <div className={styles.diagramLabel}>art</div>
            <div className={styles.diagramSub}>your full-color artwork</div>
          </div>
          <div className={styles.diagramItem}>
            <div className={`${styles.diagramSwatch} ${styles.swFinal}`}>
              <div className={styles.swFinalShape} />
            </div>
            <div className={styles.diagramLabel}>result</div>
            <div className={styles.diagramSub}>what ships to you</div>
          </div>
        </div>

        <SectionHeader title="Canvas setup" />
        <table className={styles.spec}>
          <tbody>
            <tr><th>Canvas size</th><td>50×50mm (or your final size)</td></tr>
            <tr><th>Resolution</th><td>300 dpi</td></tr>
            <tr><th>Color mode</th><td>RGB · we convert to CMYK for print</td></tr>
            <tr><th>File format</th><td>PSD with layers named exactly <code>outline</code>, <code>gold</code>, <code>art</code></td></tr>
          </tbody>
        </table>

        <SectionHeader title="What each layer does" />

        <div className={styles.layerBlock}>
          <div className={styles.layerHead}>
            <span className={styles.layerTag}>outline</span>
            <span className={styles.layerHeadSub}>the cut shape of your keychain</span>
          </div>
          <p className={styles.layerBody}>
            Fill solid where you want fiberglass. Anything outside this shape gets cut away.
            No stroke, no gradients — one solid color.
          </p>
          <ul className={styles.rules}>
            <li>Minimum size: 5×5mm (about ¼ inch)</li>
            <li>Maximum size: 400×500mm</li>
            <li>Keep artwork at least 0.2mm inside the cut edge</li>
            <li>Sharp or rounded corners both work</li>
            <li>Add a hole for the keyring: 3–4mm across is ideal (0.5mm minimum)</li>
          </ul>
        </div>

        <div className={styles.layerBlock}>
          <div className={styles.layerHead}>
            <span className={styles.layerTag}>gold</span>
            <span className={styles.layerHeadSub}>where real gold shows through</span>
          </div>
          <p className={styles.layerBody}>
            Fill solid wherever you want plated gold. Fine lines, dots, and filigree all work.
            The gold sits under the color layer, so anything not covered by <code>art</code>
            will be visible metallic gold.
          </p>
          <ul className={styles.rules}>
            <li>Minimum line width: 0.1mm — very fine detail is fine</li>
            <li>Minimum dot: 0.25mm across</li>
            <li>Keep gold at least 0.15mm inside the cut edge</li>
            <li>Gold areas can touch or overlap freely</li>
          </ul>
        </div>

        <div className={styles.layerBlock}>
          <div className={styles.layerHead}>
            <span className={styles.layerTag}>art</span>
            <span className={styles.layerHeadSub}>your full color artwork</span>
          </div>
          <p className={styles.layerBody}>
            Your normal illustration. Printed full color on top of the gold and substrate.
            Where the art has transparent pixels, the gold or dark substrate shows through.
          </p>
          <ul className={styles.rules}>
            <li>Minimum line width: 0.15mm</li>
            <li>Minimum text height: 1mm (smaller won&rsquo;t print cleanly)</li>
            <li>Keep important detail 0.15mm away from gold edges</li>
            <li>Full color CMYK — bright saturated colors reproduce best</li>
          </ul>
        </div>

        <SectionHeader title="Rules of thumb" />
        <ul className={styles.tips}>
          <li>
            <strong>Every layer at the same scale.</strong> If <code>outline</code> is scaled
            differently from <code>art</code>, nothing will line up.
          </li>
          <li>
            <strong>Leave a 0.5mm safety margin.</strong> Don&rsquo;t place critical detail right
            at the edge of the outline.
          </li>
          <li>
            <strong>Preview before you order.</strong> Drop your PSD into the studio; the render
            will show you where gold, art, and substrate meet.
          </li>
          <li>
            <strong>Save with Maximize Compatibility on.</strong> In Photoshop, this is under
            Preferences → File Handling.
          </li>
        </ul>

        <SectionHeader title="Templates" />
        <div className={styles.templates}>
          <a className={styles.templateCard} href="/keychain-template-50mm.psd" download>
            <div className={styles.templateName}>50×50mm PSD template</div>
            <div className={styles.templateSub}>pre-named layers · guide lines · 300dpi</div>
            <div className={styles.templateArrow}>↓</div>
          </a>
          <div className={styles.templateNote}>
            Works with Photoshop, Procreate (open the PSD, keep layer names), and Clip Studio Paint.
          </div>
        </div>

        <div className={styles.cta}>
          <Link href="/keychains" className={styles.ctaBtn}>Back to the studio →</Link>
        </div>
      </div>
    </SiteLayout>
  );
}
