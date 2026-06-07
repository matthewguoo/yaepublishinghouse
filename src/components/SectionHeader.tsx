import styles from './SectionHeader.module.css';

type Props = {
  title: string;
  /** Use h1 for top-of-page, h2 for in-page sections. Defaults to h2. */
  as?: 'h1' | 'h2';
  /** Bottom margin override. Defaults to 2rem. */
  marginBottom?: string;
};

export default function SectionHeader({ title, as = 'h2', marginBottom }: Props) {
  const Tag = as;
  return (
    <div
      className={styles.wrap}
      style={marginBottom ? { marginBottom } : undefined}
    >
      <Tag className={styles.title}>{title}</Tag>
      <div className={styles.line} />
    </div>
  );
}
