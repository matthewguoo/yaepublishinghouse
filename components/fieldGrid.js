'use client';

import React, { useState } from 'react';
import styles from './fieldGrid.module.css';

export default function FieldGrid({ projects }) {
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags))
  ).sort();

  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const columns = allTags.length * 2;
  const rows = projects.length;

  const tagIndex = (tag) => allTags.indexOf(tag);
  const hasTag = (project, tag) => project.tags.includes(tag);

  return (
    <div
      className={styles.gridWrapper}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows + 1}, 1fr)`, // +1 for header row
      }}
    >
      {/* Headers */}
      {allTags.map((tag, i) => (
        <div
          key={tag}
          className={styles.categoryHeader}
          style={{
            gridColumnStart: i * 2 + 1,
            gridColumnEnd: i * 2 + 3,
            gridRowStart: 1,
          }}
        >
          {tag}
        </div>
      ))}

      {/* Project rows */}
      {projects.map((project, rowIndex) => {
        const tagCount = project.tags.length;
        return allTags.flatMap((tag, tagIdx) => {
          const isHovered = hoveredProjectId === project.id;
          const projectHasTag = hasTag(project, tag);

          if (!projectHasTag) {
            // Empty cells — just empty divs
            return [
              <div
                key={`${project.id}-${tag}-left`}
                className={styles.emptyCell}
                style={{
                  gridColumnStart: tagIdx * 2 + 1,
                  gridRowStart: rowIndex + 2,
                }}
              />,
              <div
                key={`${project.id}-${tag}-right`}
                className={styles.emptyCell}
                style={{
                  gridColumnStart: tagIdx * 2 + 2,
                  gridRowStart: rowIndex + 2,
                }}
              />,
            ];
          }

          if (tagCount === 1) {
            // Single-tag: a single square (1 column wide)
            return (
              <div
                key={`${project.id}-${tag}`}
                className={`${styles.fullSquare} ${
                  isHovered ? styles.hovered : ''
                }`}
                style={{
                  gridColumnStart: tagIdx * 2 + 1,
                  gridRowStart: rowIndex + 2,
                }}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                title={project.title}
              />
            );
          }

          // Multi-tag: half-box triangle
          const tagPos = project.tags.indexOf(tag);
          return (
            <div
              key={`${project.id}-${tag}`}
              className={`${styles.halfBox} ${
                isHovered ? styles.hovered : ''
              } ${tagPos === 0 ? styles.leftHalf : styles.rightHalf}`}
              style={{
                gridColumnStart: tagIdx * 2 + (tagPos === 0 ? 1 : 2),
                gridRowStart: rowIndex + 2,
              }}
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
              title={project.title}
            />
          );
        });
      })}
    </div>
  );
}
