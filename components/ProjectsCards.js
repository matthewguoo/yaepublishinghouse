'use client';

import Image from 'next/image';
import styles from './ProjectsCards.module.css';

export default function ProjectsCards({ posts }) {
  return (
    <div className={styles.cardsWrapper}>
      {posts.map(post => {
        const title =
          post.properties?.Title?.title?.[0]?.plain_text ?? 'Untitled';
        const description =
          post.properties?.Description?.rich_text?.[0]?.plain_text ?? '';
        const tags = post.properties?.Tags?.multi_select ?? [];

        const preview = post.properties?.['preview-image']?.files?.[0] ?? null;
        const imgUrl = preview?.file?.url ?? preview?.external?.url ?? '';

        return (
          <div key={post.id} className={styles.card}>
            {imgUrl && (
              <Image
                src={imgUrl}
                alt={`Preview of ${title}`}
                width={640}
                height={360}
                className={styles.previewImage}
                placeholder="empty"
              />
            )}

            <h3 className={styles.title}>{title}</h3>

            {description && (
              <p className={styles.description}>{description}</p>
            )}

            {tags.length > 0 && (
              <ul className={styles.tags}>
                {tags.map(tag => (
                  <li key={tag.id} className={styles.tag}>
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
