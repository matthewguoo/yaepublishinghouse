'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export default function PngToolPage() {
  const [inputImage, setInputImage] = useState<HTMLImageElement | null>(null);
  const [inputDataUrl, setInputDataUrl] = useState<string | null>(null);
  const [outputDataUrl, setOutputDataUrl] = useState<string | null>(null);
  const [targetColor, setTargetColor] = useState<RGBA>({ r: 255, g: 255, b: 255, a: 255 });
  const [tolerance, setTolerance] = useState(15);
  const [outerOnly, setOuterOnly] = useState(true);
  const [smoothEdges, setSmoothEdges] = useState(false);
  const [showMask, setShowMask] = useState(false);
  
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setInputImage(img);
        setInputDataUrl(e.target?.result as string);
        setOutputDataUrl(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadImage(file);
  }, [loadImage]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) loadImage(file);
        break;
      }
    }
  }, [loadImage]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Draw input canvas
  useEffect(() => {
    if (!inputImage || !inputCanvasRef.current) return;
    const canvas = inputCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = inputImage.width;
    canvas.height = inputImage.height;
    ctx.drawImage(inputImage, 0, 0);
  }, [inputImage]);

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = inputCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] });
  };

  const colorMatch = (r: number, g: number, b: number, target: RGBA, tol: number) => {
    return Math.abs(r - target.r) <= tol &&
           Math.abs(g - target.g) <= tol &&
           Math.abs(b - target.b) <= tol;
  };

  const processImage = useCallback(() => {
    if (!inputImage || !outputCanvasRef.current) return;
    
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = inputImage.width;
    canvas.height = inputImage.height;
    ctx.drawImage(inputImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    if (outerOnly) {
      // Flood fill from edges
      const visited = new Set<number>();
      const toRemove = new Set<number>();
      const queue: number[] = [];

      // Add edge pixels to queue
      for (let x = 0; x < width; x++) {
        queue.push(x); // top row
        queue.push((height - 1) * width + x); // bottom row
      }
      for (let y = 0; y < height; y++) {
        queue.push(y * width); // left column
        queue.push(y * width + (width - 1)); // right column
      }

      while (queue.length > 0) {
        const idx = queue.shift()!;
        if (visited.has(idx)) continue;
        visited.add(idx);

        const i = idx * 4;
        if (colorMatch(data[i], data[i + 1], data[i + 2], targetColor, tolerance)) {
          toRemove.add(idx);
          const x = idx % width;
          const y = Math.floor(idx / width);
          
          if (x > 0) queue.push(idx - 1);
          if (x < width - 1) queue.push(idx + 1);
          if (y > 0) queue.push(idx - width);
          if (y < height - 1) queue.push(idx + width);
        }
      }

      for (const idx of toRemove) {
        const i = idx * 4;
        if (showMask) {
          data[i] = 255;
          data[i + 1] = 0;
          data[i + 2] = 255;
          data[i + 3] = 128;
        } else {
          data[i + 3] = 0;
        }
      }

      if (smoothEdges && !showMask) {
        // Simple edge feathering
        for (const idx of toRemove) {
          const x = idx % width;
          const y = Math.floor(idx / width);
          
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              const ny = y + dy;
              if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
              const nIdx = ny * width + nx;
              if (!toRemove.has(nIdx)) {
                const ni = nIdx * 4;
                data[ni + 3] = Math.min(data[ni + 3], 200);
              }
            }
          }
        }
      }
    } else {
      // Remove all matching pixels
      for (let i = 0; i < data.length; i += 4) {
        if (colorMatch(data[i], data[i + 1], data[i + 2], targetColor, tolerance)) {
          if (showMask) {
            data[i] = 255;
            data[i + 1] = 0;
            data[i + 2] = 255;
            data[i + 3] = 128;
          } else {
            data[i + 3] = 0;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setOutputDataUrl(canvas.toDataURL('image/png'));
  }, [inputImage, targetColor, tolerance, outerOnly, smoothEdges, showMask]);

  // Auto-process when settings change
  useEffect(() => {
    if (inputImage) processImage();
  }, [inputImage, targetColor, tolerance, outerOnly, smoothEdges, showMask, processImage]);

  const copyToClipboard = async (dataUrl: string) => {
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  return (
    <SiteLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>PNG Transparency Maker</h1>
        <p className={styles.subtitle}>Remove backgrounds instantly. Free, no watermarks, runs locally in your browser.</p>
        <p className={styles.note}>The esteemed Guuji Yae ordered this page to be added after a certain tool countless relied on for their transparent PNGs suddenly no longer worked for free.</p>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <h4>Target Color</h4>
            <p className={styles.controlHint}>Click on the input image to pick a color, or type rgba values.</p>
            <div className={styles.colorInputs}>
              <div className={styles.colorPreview} style={{ background: `rgba(${targetColor.r},${targetColor.g},${targetColor.b},${targetColor.a / 255})` }} />
              <input type="number" min="0" max="255" value={targetColor.r} onChange={e => setTargetColor(c => ({ ...c, r: +e.target.value }))} placeholder="R" />
              <input type="number" min="0" max="255" value={targetColor.g} onChange={e => setTargetColor(c => ({ ...c, g: +e.target.value }))} placeholder="G" />
              <input type="number" min="0" max="255" value={targetColor.b} onChange={e => setTargetColor(c => ({ ...c, b: +e.target.value }))} placeholder="B" />
              <input type="number" min="0" max="255" value={targetColor.a} onChange={e => setTargetColor(c => ({ ...c, a: +e.target.value }))} placeholder="A" />
            </div>
          </div>

          <div className={styles.controlGroup}>
            <h4>Tolerance</h4>
            <input type="range" min="0" max="100" value={tolerance} onChange={e => setTolerance(+e.target.value)} />
            <span className={styles.toleranceValue}>{tolerance}</span>
            <p className={styles.controlHint}>Higher values match more similar colors.</p>
          </div>

          <div className={styles.controlGroup}>
            <h4>Options</h4>
            <label className={styles.checkbox}>
              <input type="checkbox" checked={outerOnly} onChange={e => setOuterOnly(e.target.checked)} />
              <span>Outer pixels only</span>
              <p className={styles.optionHint}>Only remove colors connected to the image edge.</p>
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" checked={smoothEdges} onChange={e => setSmoothEdges(e.target.checked)} />
              <span>Smooth edges</span>
              <p className={styles.optionHint}>Feather the edges for a cleaner result.</p>
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" checked={showMask} onChange={e => setShowMask(e.target.checked)} />
              <span>Show mask preview</span>
              <p className={styles.optionHint}>Highlight pixels that will become transparent.</p>
            </label>
          </div>
        </div>

        <div className={styles.panels}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Input</h2>
              <span className={styles.panelHint}>click to pick color</span>
            </div>
            <div className={styles.panelButtons}>
              <button onClick={() => fileInputRef.current?.click()}>Load</button>
              {inputDataUrl && <button onClick={() => downloadImage(inputDataUrl, 'input.png')}>Save</button>}
              {inputDataUrl && <button onClick={() => copyToClipboard(inputDataUrl)}>Copy</button>}
            </div>
            <div 
              className={styles.canvasWrap}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              {inputImage ? (
                <canvas ref={inputCanvasRef} onClick={pickColor} className={styles.canvas} />
              ) : (
                <div className={styles.placeholder}>
                  <p>Load an image</p>
                  <p className={styles.placeholderHint}>or drop / paste (Ctrl+V)</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Output</h2>
              <span className={styles.panelHint}>transparent result</span>
            </div>
            <div className={styles.panelButtons}>
              {outputDataUrl && <button onClick={() => downloadImage(outputDataUrl, 'transparent.png')}>Save</button>}
              {outputDataUrl && <button onClick={() => copyToClipboard(outputDataUrl)}>Copy</button>}
            </div>
            <div className={`${styles.canvasWrap} ${styles.checkerboard}`}>
              {outputDataUrl ? (
                <canvas ref={outputCanvasRef} className={styles.canvas} />
              ) : (
                <div className={styles.placeholder}>
                  <p>Load an image, then click a color to remove</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className={styles.privacy}>All processing happens locally in your browser. Your images never leave your device.</p>
      </div>
    </SiteLayout>
  );
}
