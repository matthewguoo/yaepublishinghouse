'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

type LayerCanvases = {
  outline?: HTMLCanvasElement;
  gold?: HTMLCanvasElement;
  art?: HTMLCanvasElement;
};

type LayerReport = {
  width: number;
  height: number;
  found: { outline: boolean; gold: boolean; art: boolean };
  unknown: string[];
};

const CANVAS_PX = 600;
const MAX_PSD_BYTES = 60 * 1024 * 1024; // 60MB

// ─── PSD validation ──────────────────────────────────────────

async function isPsdMagic(file: File): Promise<boolean> {
  const head = await file.slice(0, 4).arrayBuffer();
  const b = new Uint8Array(head);
  // "8BPS"
  return b[0] === 0x38 && b[1] === 0x42 && b[2] === 0x50 && b[3] === 0x53;
}

// ─── Canvas helpers (unchanged from prior iteration) ─────────

function makeAlphaMask(src: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = src.width; out.height = src.height;
  const sctx = src.getContext('2d')!;
  const octx = out.getContext('2d')!;
  const data = sctx.getImageData(0, 0, src.width, src.height);
  const outData = octx.createImageData(src.width, src.height);
  for (let i = 0; i < data.data.length; i += 4) {
    const a = data.data[i + 3];
    const r = data.data[i], g = data.data[i + 1], b = data.data[i + 2];
    const nearWhite = r > 245 && g > 245 && b > 245;
    const filled = a > 20 && !nearWhite;
    outData.data[i] = filled ? 255 : 0;
    outData.data[i + 1] = filled ? 255 : 0;
    outData.data[i + 2] = filled ? 255 : 0;
    outData.data[i + 3] = filled ? 255 : 0;
  }
  octx.putImageData(outData, 0, 0);
  return out;
}

function paintGold(mask: HTMLCanvasElement, w: number, h: number): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const ctx = out.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#8a6414');
  grad.addColorStop(0.15, '#c69a3c');
  grad.addColorStop(0.35, '#f0d478');
  grad.addColorStop(0.5, '#fff3b0');
  grad.addColorStop(0.65, '#f0d478');
  grad.addColorStop(0.85, '#c69a3c');
  grad.addColorStop(1, '#7d5a10');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const shimmer = ctx.createLinearGradient(0, h, w, 0);
  shimmer.addColorStop(0, 'rgba(255,255,255,0)');
  shimmer.addColorStop(0.45, 'rgba(255,255,255,0.18)');
  shimmer.addColorStop(0.5, 'rgba(255,255,255,0.35)');
  shimmer.addColorStop(0.55, 'rgba(255,255,255,0.18)');
  shimmer.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = shimmer;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(mask, 0, 0, w, h);
  return out;
}

function composeKeychain(target: HTMLCanvasElement, layers: LayerCanvases): void {
  const w = target.width, h = target.height;
  const ctx = target.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);
  if (!layers.outline) return;
  const outlineMask = makeAlphaMask(layers.outline);
  const scratch = document.createElement('canvas');
  scratch.width = w; scratch.height = h;
  const sctx = scratch.getContext('2d')!;
  sctx.fillStyle = '#0d1a12';
  sctx.fillRect(0, 0, w, h);
  if (layers.gold) {
    const goldMask = makeAlphaMask(layers.gold);
    sctx.drawImage(paintGold(goldMask, w, h), 0, 0, w, h);
  }
  if (layers.art) sctx.drawImage(layers.art, 0, 0, w, h);
  sctx.globalCompositeOperation = 'destination-in';
  sctx.drawImage(outlineMask, 0, 0, w, h);
  sctx.globalCompositeOperation = 'source-over';
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;
  ctx.drawImage(scratch, 0, 0);
  ctx.restore();
}

function layerToCanvas(
  layer: { canvas?: HTMLCanvasElement; left?: number; top?: number },
  docW: number, docH: number, targetW: number, targetH: number,
): HTMLCanvasElement | undefined {
  if (!layer.canvas) return undefined;
  const c = document.createElement('canvas');
  c.width = targetW; c.height = targetH;
  const ctx = c.getContext('2d')!;
  const scaleX = targetW / docW;
  const scaleY = targetH / docH;
  ctx.drawImage(
    layer.canvas,
    (layer.left ?? 0) * scaleX,
    (layer.top ?? 0) * scaleY,
    layer.canvas.width * scaleX,
    layer.canvas.height * scaleY,
  );
  return c;
}

type PsdLayer = {
  name?: string;
  canvas?: HTMLCanvasElement;
  left?: number; top?: number;
  children?: PsdLayer[];
};

function findLayer(layers: PsdLayer[] | undefined, name: string): PsdLayer | undefined {
  if (!layers) return undefined;
  const target = name.toLowerCase();
  for (const l of layers) {
    if (l.name && l.name.trim().toLowerCase() === target) return l;
    if (l.children) {
      const f = findLayer(l.children, name);
      if (f) return f;
    }
  }
}

function collectNames(layers: PsdLayer[] | undefined, out: string[] = []): string[] {
  if (!layers) return out;
  for (const l of layers) {
    if (l.name) out.push(l.name);
    if (l.children) collectNames(l.children, out);
  }
  return out;
}

// ─── Component ──────────────────────────────────────────────

type Me = { id: string; email: string } | null;

export default function KeychainStudio({ me }: { me: Me }) {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'ready' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [report, setReport] = useState<LayerReport | null>(null);
  const [fileName, setFileName] = useState('');

  const [designs, setDesigns] = useState(5);
  const [quantity, setQuantity] = useState(50);
  const [email, setEmail] = useState(me?.email ?? '');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [notes, setNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0); // pct
  const [promoMsg, setPromoMsg] = useState('');
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => { setEmail(me?.email ?? ''); }, [me]);

  const handleFile = useCallback(async (file: File) => {
    setStatus('parsing');
    setErrorMsg('');
    setFileName(file.name);

    if (file.size > MAX_PSD_BYTES) {
      setStatus('error');
      setErrorMsg('File is over 60MB. Please flatten unused layers and try again.');
      return;
    }
    if (!(await isPsdMagic(file))) {
      setStatus('error');
      setErrorMsg('That doesn\u2019t look like a .psd file.');
      return;
    }

    try {
      const { readPsd } = await import('ag-psd');
      const buf = await file.arrayBuffer();
      const psd = readPsd(buf, { skipCompositeImageData: true, useImageData: false });
      const docW = psd.width, docH = psd.height;
      const layers = (psd.children ?? []) as PsdLayer[];
      const outlineL = findLayer(layers, 'outline');
      const goldL = findLayer(layers, 'gold');
      const artL = findLayer(layers, 'art');

      const composed: LayerCanvases = {
        outline: outlineL ? layerToCanvas(outlineL, docW, docH, CANVAS_PX, CANVAS_PX) : undefined,
        gold: goldL ? layerToCanvas(goldL, docW, docH, CANVAS_PX, CANVAS_PX) : undefined,
        art: artL ? layerToCanvas(artL, docW, docH, CANVAS_PX, CANVAS_PX) : undefined,
      };

      setReport({
        width: docW, height: docH,
        found: { outline: !!outlineL, gold: !!goldL, art: !!artL },
        unknown: collectNames(layers).filter(
          (n) => !['outline', 'gold', 'art'].includes(n.trim().toLowerCase()),
        ),
      });

      if (!composed.outline) {
        setStatus('error');
        setErrorMsg('Missing a layer named "outline". That defines your cut shape.');
        return;
      }
      const target = previewRef.current!;
      target.width = CANVAS_PX; target.height = CANVAS_PX;
      composeKeychain(target, composed);
      setStatus('ready');
    } catch (e) {
      console.error(e);
      setStatus('error');
      setErrorMsg('Could not read that PSD. In Photoshop, re-save with "Maximize Compatibility" on.');
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  // pricing
  const overQty = Math.max(0, quantity - 50);
  const overDesigns = Math.max(0, designs - 5);
  const base = 200 + overQty * 2 + overDesigns * 15;
  const discounted = Math.round(base * (100 - promoDiscount) / 100);

  const applyPromo = useCallback(async () => {
    if (!promoCode.trim()) return;
    setChecking(true);
    setPromoMsg('');
    try {
      const res = await fetch('/api/keychains/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoDiscount(0);
        setPromoMsg(data?.error || 'Invalid code.');
      } else {
        setPromoDiscount(data.discountPct || 0);
        setPromoMsg(`${data.discountPct}% off applied${data.note ? ` \u00b7 ${data.note}` : ''}`);
      }
    } catch {
      setPromoMsg('Could not check that code.');
    } finally {
      setChecking(false);
    }
  }, [promoCode]);

  const submit = useCallback(async () => {
    setSubmitError('');
    if (!me) { setSubmitError('Please sign in first.'); return; }
    if (!name || !email) { setSubmitError('Name and email are required.'); return; }
    setSubmitting(true);
    try {
      const previewPng = previewRef.current?.toDataURL('image/png') ?? null;
      const res = await fetch('/api/keychains/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, handle, notes, quantity, designs, fileName,
          previewPng, promoCode: promoCode.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setSubmitError(data?.error || 'Could not start checkout.');
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setSubmitError('Could not start checkout.');
      setSubmitting(false);
    }
  }, [me, name, email, handle, notes, quantity, designs, fileName, promoCode]);

  useEffect(() => {
    const c = previewRef.current;
    if (c) { c.width = CANVAS_PX; c.height = CANVAS_PX; }
  }, []);

  return (
    <section className={styles.studio}>
      <div className={styles.studioGrid}>
        {/* PREVIEW */}
        <div className={styles.previewPane}>
          <div className={styles.previewFrame}>
            <canvas ref={previewRef} className={styles.previewCanvas} />
            {status === 'idle' && (
              <div className={styles.previewOverlay}>
                <div className={styles.previewOverlayInner}>
                  <div className={styles.previewMark}>八</div>
                  <p className={styles.previewLabel}>Your preview appears here</p>
                  <p className={styles.previewSub}>Drop a .psd to see your keychain</p>
                </div>
              </div>
            )}
            {status === 'parsing' && (
              <div className={styles.previewOverlay}>
                <div className={styles.previewOverlayInner}>
                  <p className={styles.previewLabel}>Reading your file&hellip;</p>
                </div>
              </div>
            )}
          </div>
          <p className={styles.previewCaption}>
            Live render &middot; gold shown as plating &middot; substrate approximated
          </p>
        </div>

        {/* ORDER */}
        <div className={styles.orderPane}>
          <div className={styles.eyebrow}>Custom Order · Small Batch</div>
          <h1 className={styles.studioTitle}>Design your keychain</h1>
          <p className={styles.studioTagline}>
            Upload a layered artwork file. See the finished piece before you commit.
          </p>

          <label
            className={styles.dropzone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept=".psd,image/vnd.adobe.photoshop"
              className={styles.fileInput}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className={styles.dropzoneInner}>
              <div className={styles.dropzoneIcon}>+</div>
              <div>
                <div className={styles.dropzoneTitle}>
                  {fileName ? fileName : 'Upload your .psd'}
                </div>
                <div className={styles.dropzoneSub}>
                  Layers named <code>outline</code>, <code>gold</code>, <code>art</code> &middot; 50×50mm @ 300dpi
                  {' · '}
                  <Link href="/keychains/how-to" className={styles.link}>guide</Link>
                </div>
              </div>
            </div>
          </label>

          {report && (
            <div className={styles.layerReport}>
              <div className={styles.reportRow}>
                <span>Document</span>
                <span className={styles.reportVal}>{report.width}×{report.height}px</span>
              </div>
              <div className={styles.reportRow}>
                <span>outline layer</span>
                <span className={report.found.outline ? styles.chipOk : styles.chipMissing}>
                  {report.found.outline ? 'found' : 'missing'}
                </span>
              </div>
              <div className={styles.reportRow}>
                <span>gold layer</span>
                <span className={report.found.gold ? styles.chipOk : styles.chipWarn}>
                  {report.found.gold ? 'found' : 'optional · none'}
                </span>
              </div>
              <div className={styles.reportRow}>
                <span>art layer</span>
                <span className={report.found.art ? styles.chipOk : styles.chipWarn}>
                  {report.found.art ? 'found' : 'optional · none'}
                </span>
              </div>
              {report.unknown.length > 0 && (
                <div className={styles.reportNote}>
                  Ignored: {report.unknown.slice(0, 5).join(', ')}
                  {report.unknown.length > 5 ? ` +${report.unknown.length - 5} more` : ''}
                </div>
              )}
            </div>
          )}

          {status === 'error' && <div className={styles.errorBox}>{errorMsg}</div>}

          {/* Sign-in gate */}
          {!me && (
            <div className={styles.signInGate}>
              <div className={styles.gateTitle}>Sign in to place an order</div>
              <div className={styles.gateBody}>
                An account keeps your designs, previews, and order history together
                so you can reorder in one click.
              </div>
              <div className={styles.gateActions}>
                <Link href="/login?next=/keychains" className={styles.gateBtn}>Sign in</Link>
                <Link href="/register?next=/keychains" className={styles.gateBtnAlt}>Create account</Link>
              </div>
            </div>
          )}

          {/* Order form (always visible; submit gated by auth) */}
          <div className={styles.orderForm}>
            <div className={styles.formRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Designs</span>
                <input
                  type="number" min={1} max={20}
                  value={designs}
                  onChange={(e) => setDesigns(Math.max(1, Number(e.target.value) || 1))}
                  className={styles.input}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Total quantity</span>
                <input
                  type="number" min={10} step={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(10, Number(e.target.value) || 50))}
                  className={styles.input}
                />
              </label>
            </div>
            <div className={styles.formRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
              </label>
            </div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Handle (optional)</span>
              <input className={styles.input} value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourhandle" />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Notes (optional)</span>
              <textarea className={styles.textarea} value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Anything we should know?" />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Promo code</span>
              <div className={styles.voucherRow}>
                <input
                  className={styles.input}
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoDiscount(0); setPromoMsg(''); }}
                  placeholder="e.g. LAUNCH50"
                />
                <button type="button" className={styles.voucherApplyBtn} onClick={applyPromo} disabled={checking}>
                  {checking ? '…' : 'Apply'}
                </button>
              </div>
            </label>
            {promoMsg && <div className={promoDiscount > 0 ? styles.voucherOk : styles.errorBox}>{promoMsg}</div>}

            <div className={styles.priceBox}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>
                  {promoDiscount > 0 ? `${promoDiscount}% off applied` : 'Order total'}
                </span>
                <span>
                  {promoDiscount > 0 && <span className={styles.priceStrike}>${base}</span>}
                  <span className={styles.priceValue}>${discounted}</span>
                </span>
              </div>
              <div className={styles.priceMeta}>
                {quantity} pieces · {designs} design{designs > 1 ? 's' : ''} · ~2–3 week lead time · US shipping included
              </div>
            </div>

            <button
              className={styles.submitBtn}
              onClick={submit}
              disabled={submitting || status !== 'ready' || !me}
            >
              {!me
                ? 'Sign in to continue'
                : status !== 'ready'
                  ? 'Upload a design to continue'
                  : submitting
                    ? 'Redirecting…'
                    : 'Continue to checkout →'}
            </button>
            {submitError && <div className={styles.errorBox}>{submitError}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
