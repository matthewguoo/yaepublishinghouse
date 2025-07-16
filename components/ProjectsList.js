'use client';

import { useState } from 'react';
import Link from 'next/link';
import Text from './text';
import HoverCard from './HoverCard';
import styles from '../app/index.module.css';

export default function ProjectsList({ posts, compact }) {
  const [hoveredPost, setHoveredPost] = useState(null);

  const fmt = iso => new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

  const ListTag = compact ? 'ul' : 'ol';
  const itemClass = compact ? styles.compactItem : styles.post;

  return (
    <>
      <ListTag className={compact ? styles.compactList : styles.posts}>
        {posts.map(post => {
          const slug = post.properties?.Slug?.rich_text?.[0]?.text?.content;

          return (
            <li
              key={post.id}
              className={itemClass}
              onMouseEnter={() => setHoveredPost(post)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {compact ? (
                <>
                  <Text title={post.properties?.Title?.title} />
                  <span className={styles.compactDate}>
                    {fmt(post.last_edited_time)}
                  </span>
                </>
              ) : (
                <>
                  <h3 className={styles.postTitle}>
                    <Link href={`/case-study/${slug}`}>
                      <Text title={post.properties?.Title?.title} />
                    </Link>
                  </h3>
                  <p className={styles.postDescription}>
                    {fmt(post.last_edited_time)}
                  </p>
                  <Link href={`/case-study/${slug}`}>Case Study →</Link>
                </>
              )}
            </li>
          );
        })}
      </ListTag>

      <HoverCard post={hoveredPost} visible={!!hoveredPost} />
    </>
  );
}
