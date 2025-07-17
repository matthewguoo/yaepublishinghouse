/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import useFollowCursor from '../hooks/useFollowCursor';
import styles from './HoverCard.module.css';

export default function HoverCard({ post, visible }) {
  const cardRef = useRef(null);
  useFollowCursor(cardRef, visible);

  if (!visible) return null;

  const { Title, Description, Tags } = post.properties;
  const previewProp = post.properties['preview-image'];
  const file = previewProp?.files?.[0];
  const imgUrl = file?.file?.url ?? file?.external?.url ?? null;

  return (
    <div ref={cardRef} className={`${styles.card} ${styles.show}`}>
      {imgUrl && (
        <Image
          src={`/api/image?id=${post.id}`}
          alt=""
          width={400}
          height={230}
          className={styles.img}
          placeholder="blur"
          blurDataURL="/blur.png"
          unoptimized
          sizes="(max-width: 640px) 60vw, 400px"
        />
      )}

      <h4 className={styles.title}>{Title?.title?.[0]?.plain_text}</h4>

      <p className={styles.tags}>
        {Tags?.multi_select?.map(tag => tag.name).join(' · ')}
      </p>

      <p className={styles.desc}>
        {Description?.rich_text?.[0]?.plain_text ?? ''}
      </p>
    </div>
  );
}
