'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProjectsAccordion.module.css';

export default function ProjectsAccordion({ posts, autoExpandSelected = false }) {
  // Selected projects open by default when autoExpandSelected = true
  const [openIndex, setOpenIndex] = useState(() => {
    if (!autoExpandSelected) return null;
    // first selected project
    return posts.findIndex(p => p.properties?.Selected?.checkbox);
  });

  const toggle = index => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className={styles.accordionWrapper}>
      {posts.map((post, index) => {
        const title =
          post.properties?.Title?.title?.[0]?.plain_text ?? 'Untitled';
        const description =
          post.properties?.Description?.rich_text?.[0]?.plain_text ?? '';
        const tags = post.properties?.Tags?.multi_select ?? [];

        const preview =
          post.properties?.['preview-image']?.files?.[0] ?? null;
        const imgUrl = preview?.file?.url ?? preview?.external?.url ?? '';

        const isOpen = openIndex === index;

        return (
          <div key={post.id} className={styles.item}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className={styles.header}
            >
              <span>{title}</span>
              <span className={styles.chevron}>{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen && (
              <div className={styles.body}>
                {imgUrl && (
                  <Image
                    src={`/api/image?id=${post.id}`}
                    unoptimized
                    alt={`Preview of ${title}`}
                    width={640}
                    height={360}
                    className={styles.previewImage}
                    placeholder="empty"
                  />
                )}

                {description && (
                  <p className={styles.description}>{description}</p>
                )}

            {tags.length > 0 && (
            <p className={styles.tags}>
              {tags?.map(tag => tag.name).join(' · ')}
            </p>
            )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
