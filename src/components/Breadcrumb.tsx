import { Fragment } from 'react';
import Link from 'next/link';
import styles from './Breadcrumb.module.css';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className={styles.breadcrumb}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={`${item.label}-${i}`}>
            {item.href && !isLast ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              item.label
            )}
            {!isLast && ' > '}
          </Fragment>
        );
      })}
    </div>
  );
}
