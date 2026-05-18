'use client';

import SiteLayout from '@/components/SiteLayout';
import ProductCard from '@/components/ProductCard';
import { getProduct } from '@/lib/products';
import styles from '@/components/SiteLayout.module.css';

const product = getProduct('nameless-pass')!;

export default function NamelessPassAnnouncementPage() {
  return (
    <SiteLayout>
      <div className={styles.pageContainer}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; <a href="#">News</a> &gt; Nameless Honor Pass Announcement
        </div>
        
        <article>
          <header className={styles.articleHeader}>
            <div className={styles.articleDate}>May 17, 2026</div>
            <h1 className={styles.articleTitle}>
              Announcing the Nameless Honor Pass: Limited Edition PCB Collectible
            </h1>
            <div className={styles.articleMeta}>
              A collaboration between the Interastral Peace Corporation and xingjitech
            </div>
          </header>

          <div className={styles.articleImage}>
            <img src="/banner-ipc.png" alt="Nameless Honor Pass Banner" />
          </div>

          <div className={styles.articleContent}>
            <p>
              We are pleased to announce the Nameless Honor Pass, a limited edition collectible 
              commemorating the 2158th Year of the Trailblaze and the Nameless' extraordinary 
              contributions during the Penacony incident.
            </p>

            <ProductCard product={product} />

            <h2>About This Edition</h2>
            <p>
              Produced under official authorization from the Interastral Peace Corporation, 
              each Nameless Honor Pass is manufactured using premium materials and processes 
              typically reserved for aerospace-grade electronics.
            </p>
            <p>
              The pass features an ENIG (Electroless Nickel Immersion Gold) finish, with real 
              gold plating covering over 50% of the surface area. Each unit is individually 
              serialized from 0001 to 2158, ensuring every piece is unique.
            </p>

            <h2>Manufacturing Specifications</h2>
            <p>
              Dimensions: 100 × 42 × 1.0 mm. Substrate: FR-4 fiberglass. Surface finish: ENIG 
              with UV silkscreen printing for vibrant, fade-resistant colors.
            </p>

            <h2>The Stellaron Hunters Collaboration</h2>
            <p>
              In an unprecedented partnership, the Stellaron Hunters have collaborated with 
              the IPC to bring this commemorative item to Trailblazers across the cosmos. 
              Silver Wolf personally supervised the digital security measures embedded in 
              each pass.
            </p>
            <p>
              A portion of proceeds supports Astral Express operational costs, including but 
              not limited to: fuel, snacks for Pom-Pom, and emergency repairs.
            </p>

            <h2>Availability</h2>
            <p>
              The Nameless Honor Pass will be available for pre-order starting at the Seattle 
              HoYo Community Event on May 30th. Online orders will open shortly after.
            </p>
            <p>
              Due to the limited production run of 2,158 units, we recommend joining the 
              waitlist to secure your serial number.
            </p>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <a 
                href="/products/nameless-pass" 
                style={{
                  display: 'inline-block',
                  padding: '15px 40px',
                  background: '#8b5a8c',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                }}
              >
                View Product Details →
              </a>
            </div>
          </div>

          <div className={styles.tagList}>
            <span className={styles.tag}>Products</span>
            <span className={styles.tag}>Honkai: Star Rail</span>
            <span className={styles.tag}>Limited Edition</span>
            <span className={styles.tag}>PCB</span>
          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
