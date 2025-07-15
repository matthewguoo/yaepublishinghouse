// HoverCard.jsx
'use client';

import { useRef } from 'react';
import Image from 'next/image';               // <-- new
import useFollowCursor from '../hooks/useFollowCursor';
import styles from './HoverCard.module.css';

export default function HoverCard({ post, visible }) {
  const cardRef = useRef(null);
  useFollowCursor(cardRef, visible);

  if (!visible) return null;

  const { Title, Description, Tags, ['preview-image']: Preview } =
    post.properties;

  const file = Preview?.files?.[0];
  const imgUrl =
    file?.file?.url ?? file?.external?.url ?? null;

  return (
    <div ref={cardRef} className={`${styles.card} ${styles.show}`}>
      {imgUrl && (
        <Image
          src={imgUrl}
          alt=""
          width={400}          
          height={230}
          className={styles.img}
          placeholder="blur"
          blurDataURL="/blur.png" // tiny 1×1 or solid‑color data URI works too
          sizes="(max-width: 640px) 60vw, 400px"
        />
      )}

      <h4 className={styles.title}>
        {Title?.title?.[0]?.plain_text}
      </h4>
      <p className={styles.tags}>
        {Tags?.multi_select?.map((t) => t.name).join(' · ')}
      </p>
      <p className={styles.desc}>
        {Description?.rich_text?.[0]?.plain_text ?? ''}
      </p>
    </div>
  );
}
