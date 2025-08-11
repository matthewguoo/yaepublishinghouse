import styles from '../index.module.css';

export default function Page() {
  return (
    <main className={styles.container}>
      <div className={styles.marginOnDesktop}></div>
      <header className={styles.header}>
        <h1 className={styles.heading}>SpaceX Offer Letter</h1>
        <p>Redacted for privacy — but still something I’m proud of.</p>
      </header>
      <p>
          For mobile or a fullscreen, you can{' '}
          <a
            href="/spacex-offer-redacted.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            view the PDF here
          </a>
          .
        </p>
      {/* Desktop View */}
      <div className={styles.desktopOnly}>
        <iframe
          src="/spacex-offer-redacted.pdf"
          className={styles.pdfViewer}
          title="SpaceX Offer Letter"
        ></iframe>
      </div>
    </main>
  );
}
