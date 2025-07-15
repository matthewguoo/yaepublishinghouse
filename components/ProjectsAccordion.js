'use client';
import { useState } from 'react';
import styles from './ProjectsAccordion.module.css';

export default function ProjectsAccordion({ posts, autoExpandSelected = false }) {
  // If autoExpandSelected is true, selected projects start expanded
  const [openIndex, setOpenIndex] = useState(() => {
    if (autoExpandSelected) {
      return posts.reduce((acc, post, i) => (post.properties?.Selected?.checkbox ? i : acc), null);
    }
    return null;
  });

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordionWrapper}>
      {posts.map((post, index) => {
        const title = post.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
        const description = post.properties?.Description?.rich_text?.[0]?.plain_text || '';
        const tags = post.properties?.Tags?.multi_select || [];

        const { Title, Description, Tags, ['preview-image']: Preview } =
        post.properties;
    
        const file = Preview?.files?.[0];
        const imgUrl =
          file?.file?.url ?? file?.external?.url ?? null;

        const isOpen = openIndex === index;

        return (
          <div key={post.id} className={styles.item}>
            <button onClick={() => toggle(index)} className={styles.header}>
              <span>{title}</span>
              <span className={styles.chevron}>{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen && (
              <div className={styles.body}>
                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt={`Preview of ${title}`}
                    className={styles.previewImage}
                    loading="lazy"
                  />
                )}
                {description && <p className={styles.description}>{description}</p>}
                {tags.length > 0 && (
                  <ul className={styles.tags}>
                    {tags.map((tag) => (
                      <li key={tag.id}>{tag.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
