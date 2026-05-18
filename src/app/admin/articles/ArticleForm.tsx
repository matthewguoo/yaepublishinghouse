'use client';

import { useMemo, useState } from 'react';
import MarkdownArticle from '@/components/MarkdownArticle';
import formStyles from '../admin.module.css';
import siteStyles from '@/components/SiteLayout.module.css';

type ArticleDefaults = {
  id?: string;
  slug?: string;
  title?: string;
  date?: string;
  category?: string;
  excerpt?: string;
  content?: string;
  published?: boolean;
  featured?: boolean;
};

type Props = {
  defaults?: ArticleDefaults;
  action: (data: FormData) => void | Promise<void>;
  deleteAction?: () => void | Promise<void>;
};

export default function ArticleForm({ defaults, action, deleteAction }: Props) {
  const [content, setContent] = useState(defaults?.content || '');
  const [title, setTitle] = useState(defaults?.title || '');
  const [category, setCategory] = useState(defaults?.category || 'Editorial');
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <>
      <form action={action} className={formStyles.form}>
        <div className={formStyles.grid}>
          <label className={formStyles.field}>
            Title
            <input name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label className={formStyles.field}>
            Slug
            <input name="slug" defaultValue={defaults?.slug || ''} placeholder="auto-generated if blank" />
          </label>
        </div>

        <div className={formStyles.grid}>
          <label className={formStyles.field}>
            Date
            <input name="date" type="date" defaultValue={(defaults?.date || today).replaceAll('.', '-')} required />
          </label>
          <label className={formStyles.field}>
            Category
            <input name="category" value={category} onChange={(event) => setCategory(event.target.value)} required />
          </label>
        </div>

        <label className={formStyles.field}>
          Excerpt
          <input name="excerpt" defaultValue={defaults?.excerpt || ''} required />
        </label>

        <label className={formStyles.field}>
          Content, Markdown
          <textarea name="content" value={content} onChange={(event) => setContent(event.target.value)} required />
        </label>

        <div className={formStyles.checks}>
          <label><input type="checkbox" name="published" defaultChecked={defaults?.published ?? true} /> Published</label>
          <label><input type="checkbox" name="featured" defaultChecked={defaults?.featured ?? false} /> Featured on homepage</label>
        </div>

        <div className={formStyles.actions}>
          <button className={formStyles.button} type="submit">Save article</button>
          <a className={formStyles.ghostButton} href="/admin/articles">Cancel</a>
          {deleteAction && <button className={formStyles.dangerButton} type="submit" formAction={deleteAction}>Delete</button>}
        </div>
      </form>

      <section className={formStyles.previewBox}>
        <p className={formStyles.eyebrow}>Live preview</p>
        <article>
          <header className={siteStyles.articleHeader}>
            <div className={siteStyles.articleDate}>{category}</div>
            <h1 className={siteStyles.articleTitle}>{title || 'Untitled dispatch'}</h1>
            <div className={siteStyles.articleMeta}>By Yae Publishing House</div>
          </header>
          <MarkdownArticle content={content || 'Start writing. The preview will appear here.'} />
        </article>
      </section>
    </>
  );
}
