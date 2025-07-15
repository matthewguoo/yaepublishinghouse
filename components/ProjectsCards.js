'use client';
import styles from './ProjectsCards.module.css';

export default function ProjectsCards({ posts }) {
  return (
    <div className={styles.cardsWrapper}>
      {posts.map((post) => {
        const title = post.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
        const description = post.properties?.Description?.rich_text?.[0]?.plain_text || '';
        const tags = post.properties?.Tags?.multi_select || [];
        const { Title, Description, Tags, ['preview-image']: Preview } =
        post.properties;
    
        const file = Preview?.files?.[0];
        const imgUrl =
          file?.file?.url ?? file?.external?.url ?? null;
        return (
          <div key={post.id} className={styles.card}>
            {imgUrl && (
              <img
                src={imgUrl}
                alt={`Preview of ${title}`}
                className={styles.previewImage}
                loading="lazy"
              />
            )}

            <h3 className={styles.title}>{title}</h3>

            {description && <p className={styles.description}>{description}</p>}

            {tags.length > 0 && (
              <ul className={styles.tags}>
                {tags.map((tag) => (
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
