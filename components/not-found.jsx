// app/not-found.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <Image
        src="/yae.jpg"
        alt="Yae"
        width={180}
        height={180}
        className={styles.image}
        priority
      />
      <h1 className={styles.title}>404 — Page not found</h1>
      <p className={styles.message}>Even Yae couldn&apos;t find this one...</p>
      <Link href="/" className={styles.home}>
        Go back home
      </Link>
    </div>
  );
}
