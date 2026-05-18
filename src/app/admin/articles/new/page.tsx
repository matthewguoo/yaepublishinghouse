import ArticleForm from '../ArticleForm';
import { createArticle } from '../../actions';
import styles from '../../admin.module.css';

export default function NewArticlePage() {
  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>New dispatch</p>
            <h1 className={styles.title}>Write Article</h1>
            <p className={styles.subtitle}>Markdown is supported. Keep it sharp, not corporate.</p>
          </div>
          <a className={styles.ghostButton} href="/admin/articles">Back</a>
        </div>
        <ArticleForm action={createArticle} />
      </section>
    </main>
  );
}
