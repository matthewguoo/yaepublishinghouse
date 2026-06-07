'use client';

import { useState } from 'react';
import formStyles from '../admin.module.css';

type ProductDefaults = {
  id?: string;
  slug?: string;
  sku?: string | null;
  name?: string;
  subtitle?: string | null;
  description?: string;
  price?: string;
  originalPrice?: string | null;
  badge?: string | null;
  badgeType?: string | null;
  images?: string[];
  specs?: string;
  ctaType?: string;
  ctaButtonText?: string | null;
  ctaSuccessText?: string | null;
  ctaPriceId?: string | null;
  ctaMessage?: string | null;
  stock?: number | null;
  stockStatus?: string | null;
  shippingText?: string | null;
  serialRange?: string | null;
  featured?: boolean;
  published?: boolean;
  announcementUrl?: string | null;
  watermarkTop?: string | null;
  watermarkBottom?: string | null;
  timeline?: unknown;
  sortOrder?: number;
};

type Props = {
  defaults?: ProductDefaults;
  action: (data: FormData) => void | Promise<void>;
  deleteAction?: () => void | Promise<void>;
};

function timelineToText(t: unknown): string {
  if (!Array.isArray(t)) return '';
  return (t as { label: string; date: string; status?: string }[])
    .map((m) => `${m.label} | ${m.date} | ${m.status || 'upcoming'}`)
    .join('\n');
}

export default function ProductForm({ defaults, action, deleteAction }: Props) {
  const d = defaults || {};
  const [ctaType, setCtaType] = useState(d.ctaType || 'email');

  return (
    <form action={action} className={formStyles.form}>
      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Name
          <input name="name" defaultValue={d.name || ''} required />
        </label>
        <label className={formStyles.field}>
          Slug
          <input name="slug" defaultValue={d.slug || ''} placeholder="auto-generated if blank" />
        </label>
      </div>

      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          SKU
          <input name="sku" defaultValue={d.sku || ''} placeholder="YPH-0001" />
        </label>
        <label className={formStyles.field}>
          Subtitle
          <input name="subtitle" defaultValue={d.subtitle || ''} />
        </label>
      </div>

      <label className={formStyles.field}>
        Description
        <textarea name="description" defaultValue={d.description || ''} required rows={3} />
      </label>

      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Price (display)
          <input name="price" defaultValue={d.price || ''} required placeholder="US$15.00" />
        </label>
        <label className={formStyles.field}>
          Original Price
          <input name="originalPrice" defaultValue={d.originalPrice || ''} placeholder="optional" />
        </label>
      </div>

      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Badge
          <input name="badge" defaultValue={d.badge || ''} placeholder="NEW, SALE..." />
        </label>
        <label className={formStyles.field}>
          Badge Type
          <select name="badgeType" defaultValue={d.badgeType || ''}>
            <option value="">none</option>
            <option value="new">new</option>
            <option value="limited">limited</option>
            <option value="sale">sale</option>
          </select>
        </label>
      </div>

      <label className={formStyles.field}>
        Images (one URL per line, or comma-separated)
        <textarea name="images" defaultValue={(d.images || []).join('\n')} rows={3} placeholder="/nameless-pass.png" />
      </label>

      <label className={formStyles.field}>
        Specs (pipe-separated)
        <input name="specs" defaultValue={d.specs || ''} placeholder=".999 24k Gold Plating|Ceramic coat|Fiberglass base" />
      </label>

      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Stock
          <input name="stock" type="number" defaultValue={d.stock ?? ''} />
        </label>
        <label className={formStyles.field}>
          Stock Status
          <input name="stockStatus" defaultValue={d.stockStatus || ''} placeholder="In Stock / Pre-order" />
        </label>
      </div>

      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Shipping Text
          <input name="shippingText" defaultValue={d.shippingText || ''} placeholder="Ships free from US" />
        </label>
        <label className={formStyles.field}>
          Serial Range
          <input name="serialRange" defaultValue={d.serialRange || ''} placeholder="0001-2158" />
        </label>
      </div>

      <fieldset style={{ border: '1px solid #e5e0e2', padding: '1rem', borderRadius: 6 }}>
        <legend style={{ padding: '0 0.5rem', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b4d5c' }}>CTA</legend>
        <div className={formStyles.grid}>
          <label className={formStyles.field}>
            Type
            <select name="ctaType" value={ctaType} onChange={(e) => setCtaType(e.target.value)}>
              <option value="email">email (waitlist)</option>
              <option value="stripe">stripe checkout</option>
              <option value="soldout">sold out</option>
              <option value="comingsoon">coming soon</option>
            </select>
          </label>
          <label className={formStyles.field}>
            Button Text
            <input name="ctaButtonText" defaultValue={d.ctaButtonText || ''} placeholder="Join Waitlist / Buy Now" />
          </label>
        </div>

        {ctaType === 'email' && (
          <label className={formStyles.field}>
            Success Message
            <input name="ctaSuccessText" defaultValue={d.ctaSuccessText || ''} />
          </label>
        )}
        {ctaType === 'stripe' && (
          <label className={formStyles.field}>
            Stripe Price ID
            <input name="ctaPriceId" defaultValue={d.ctaPriceId || ''} placeholder="price_..." />
          </label>
        )}
        {(ctaType === 'soldout' || ctaType === 'comingsoon') && (
          <label className={formStyles.field}>
            Message
            <input name="ctaMessage" defaultValue={d.ctaMessage || ''} />
          </label>
        )}
      </fieldset>

      <label className={formStyles.field}>
        Timeline (one per line: <code>Label | Date | status</code>, status = upcoming|active|completed)
        <textarea
          name="timeline"
          defaultValue={timelineToText(d.timeline)}
          rows={4}
          placeholder="Order Period | Jun 1 – Jun 15 | upcoming"
        />
      </label>

      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Announcement URL
          <input name="announcementUrl" defaultValue={d.announcementUrl || ''} placeholder="/news/..." />
        </label>
        <label className={formStyles.field}>
          Sort Order
          <input name="sortOrder" type="number" defaultValue={d.sortOrder ?? 0} />
        </label>
      </div>

      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Watermark Top
          <input name="watermarkTop" defaultValue={d.watermarkTop || ''} />
        </label>
        <label className={formStyles.field}>
          Watermark Bottom
          <input name="watermarkBottom" defaultValue={d.watermarkBottom || ''} />
        </label>
      </div>

      <div className={formStyles.checks}>
        <label><input type="checkbox" name="published" defaultChecked={d.published ?? true} /> Published</label>
        <label><input type="checkbox" name="featured" defaultChecked={d.featured ?? false} /> Featured</label>
      </div>

      <div className={formStyles.actions}>
        <button className={formStyles.button} type="submit">Save product</button>
        <a className={formStyles.ghostButton} href="/admin/products">Cancel</a>
        {deleteAction && (
          <button className={formStyles.dangerButton} type="submit" formAction={deleteAction}>Delete</button>
        )}
      </div>
    </form>
  );
}
