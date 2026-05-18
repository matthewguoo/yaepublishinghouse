'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

export default function PngTransparencyTool() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [tolerance, setTolerance] = useState(15);
  const [smoothEdges, setSmoothEdges] = useState(true);
  const [smoothRadius, setSmoothRadius] = useState(5);
  const [outerOnly, setOuterOnly] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const [colorInput, setColorInput] = useState('');
  
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const alphaMapRef = useRef<Float32Array | null>(null);

  // Handle file upload
  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setTargetColor(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  // Draw input canvas when image loads
  useEffect(() => {
    if (image && inputCanvasRef.current) {
      const canvas = inputCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
      }
    }
  }, [image]);

  // Process image whenever settings change
  useEffect(() => {
    if (!image || !targetColor || !outputCanvasRef.current) return;

    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    
    // Clear canvas to transparent first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Create transparency map
    const alphaMap = new Float32Array(width * height);
    alphaMapRef.current = alphaMap;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const distance = Math.sqrt(
        Math.pow(r - targetColor.r, 2) +
        Math.pow(g - targetColor.g, 2) +
        Math.pow(b - targetColor.b, 2)
      );

      const pixelIndex = i / 4;
      
      if (distance <= tolerance) {
        if (smoothEdges && distance > tolerance * 0.5) {
          alphaMap[pixelIndex] = (distance - tolerance * 0.5) / (tolerance * 0.5);
        } else {
          alphaMap[pixelIndex] = 0;
        }
      } else {
        alphaMap[pixelIndex] = 1;
      }
    }

    // Apply outer-only filter if enabled
    if (outerOnly) {
      const visited = new Set<number>();
      const queue: number[] = [];
      
      // Start from edges - only add pixels that match the target color
      for (let x = 0; x < width; x++) {
        if (alphaMap[x] < 1) queue.push(x);
        if (alphaMap[(height - 1) * width + x] < 1) queue.push((height - 1) * width + x);
      }
      for (let y = 0; y < height; y++) {
        if (alphaMap[y * width] < 1) queue.push(y * width);
        if (alphaMap[y * width + width - 1] < 1) queue.push(y * width + width - 1);
      }

      // Flood fill from edges
      while (queue.length > 0) {
        const idx = queue.shift()!;
        if (visited.has(idx)) continue;
        visited.add(idx);

        // Check neighbors
        const neighbors = [
          idx - 1, idx + 1,
          idx - width, idx + width
        ];

        for (const n of neighbors) {
          if (n >= 0 && n < width * height && !visited.has(n) && alphaMap[n] < 1) {
            queue.push(n);
          }
        }
      }

      // Reset non-visited transparent pixels back to opaque
      for (let i = 0; i < alphaMap.length; i++) {
        if (!visited.has(i) && alphaMap[i] < 1) {
          alphaMap[i] = 1;
        }
      }
    }

    // Apply alpha values
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4;
      if (showMask) {
        const alpha = alphaMap[pixelIndex];
        if (alpha < 1) {
          data[i] = 255;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = Math.floor((1 - alpha) * 200 + 55);
        }
      } else {
        data[i + 3] = Math.floor(alphaMap[pixelIndex] * 255);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [image, targetColor, tolerance, smoothEdges, smoothRadius, outerOnly, showMask]);

  // Click on input canvas to pick color
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || !inputCanvasRef.current) return;
    
    const canvas = inputCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = { r: pixel[0], g: pixel[1], b: pixel[2] };
    setTargetColor(color);
    setColorInput(`rgba(${color.r}, ${color.g}, ${color.b}, 255)`);
  }, [image]);

  // Get clean export canvas (without mask overlay)
  const getExportCanvas = useCallback(() => {
    if (!image || !targetColor || !alphaMapRef.current) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const alphaMap = alphaMapRef.current;
    
    // Apply only transparency (no mask)
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4;
      data[i + 3] = Math.floor(alphaMap[pixelIndex] * 255);
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }, [image, targetColor]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (canvas: HTMLCanvasElement | null, useExport = false) => {
    const targetCanvas = useExport ? getExportCanvas() : canvas;
    if (!targetCanvas) return;
    try {
      const blob = await new Promise<Blob>((resolve) => 
        targetCanvas.toBlob((b) => resolve(b!), 'image/png')
      );
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [getExportCanvas]);

  // Download
  const downloadPng = useCallback((canvas: HTMLCanvasElement | null, filename: string, useExport = false) => {
    const targetCanvas = useExport ? getExportCanvas() : canvas;
    if (!targetCanvas) return;
    const a = document.createElement('a');
    a.href = targetCanvas.toDataURL('image/png');
    a.download = filename;
    a.click();
  }, [getExportCanvas]);

  // Paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) handleFileUpload(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFileUpload]);

  // Parse color input
  const parseColorInput = useCallback((input: string) => {
    const match = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      setTargetColor({
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      });
    }
  }, []);

  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1>PNG Transparency Maker</h1>
          <p>Remove backgrounds instantly. Free, no watermarks, runs locally in your browser.</p>
          <p className={styles.heroLore}>The esteemed Guuji Yae ordered this page to be added after a certain tool countless relied on for their transparent PNGs suddenly no longer worked for free.</p>
        </div>

        <div className={styles.mainLayout}>
          {/* Left Sidebar - Options */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h4>Target Color</h4>
              <div className={styles.colorInputRow}>
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onBlur={() => parseColorInput(colorInput)}
                  placeholder="Click image to pick"
                  className={styles.colorInput}
                />
                <div 
                  className={styles.colorSwatch}
                  style={targetColor ? { background: `rgb(${targetColor.r},${targetColor.g},${targetColor.b})` } : { background: '#eee' }}
                  title="Click on the input image to select a color"
                />
              </div>
              <p className={styles.hint}>Click on the input image to pick a color, or type rgba values.</p>
            </div>

            <div className={styles.sidebarSection}>
              <h4>Tolerance</h4>
              <div className={styles.sliderRow}>
                <input
                  type="range"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  min={0}
                  max={100}
                />
                <span>{tolerance}</span>
              </div>
              <p className={styles.hint}>Higher values match more similar colors.</p>
            </div>

            <div className={styles.sidebarSection}>
              <h4>Options</h4>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={outerOnly}
                  onChange={(e) => setOuterOnly(e.target.checked)}
                />
                Outer pixels only
              </label>
              <p className={styles.hint}>Only remove colors connected to the image edge.</p>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={smoothEdges}
                  onChange={(e) => setSmoothEdges(e.target.checked)}
                />
                Smooth edges
              </label>
              <p className={styles.hint}>Feather the edges for a cleaner result.</p>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={showMask}
                  onChange={(e) => setShowMask(e.target.checked)}
                />
                Show mask preview
              </label>
              <p className={styles.hint}>Highlight pixels that will become transparent.</p>
            </div>
          </div>

          {/* Right - Workspace */}
          <div className={styles.workspace}>
            {/* Input Panel */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Input<span>click to pick color</span></h2>
                <div className={styles.panelBtns}>
                  <button className={styles.panelBtn} onClick={() => document.getElementById('fileInput')?.click()}>
                    Load
                  </button>
                  <button className={`${styles.panelBtn} ${styles.panelBtnSecondary}`} onClick={() => downloadPng(inputCanvasRef.current, 'input.png')} disabled={!image}>
                    Save
                  </button>
                  <button className={`${styles.panelBtn} ${styles.panelBtnSecondary}`} onClick={() => copyToClipboard(inputCanvasRef.current)} disabled={!image}>
                    Copy
                  </button>
                </div>
              </div>
              <div 
                className={styles.canvasWrap}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileUpload(file);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {image ? (
                  <canvas 
                    ref={inputCanvasRef}
                    onClick={handleCanvasClick}
                    className={styles.canvas}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    <button 
                      className={styles.uploadBtn}
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      Load an image
                    </button>
                    <p>or drop / paste (Ctrl+V)</p>
                  </div>
                )}
                <input 
                  id="fileInput"
                  type="file" 
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Output<span>transparent result</span></h2>
                <div className={styles.panelBtns}>
                  <button className={styles.panelBtn} onClick={() => downloadPng(null, 'transparent.png', true)} disabled={!targetColor}>
                    Save
                  </button>
                  <button className={`${styles.panelBtn} ${styles.panelBtnSecondary}`} onClick={() => copyToClipboard(null, true)} disabled={!targetColor}>
                    Copy
                  </button>
                </div>
              </div>
              <div className={styles.canvasWrap}>
                {image && targetColor ? (
                  <canvas 
                    ref={outputCanvasRef}
                    className={styles.canvas}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    <p>Load an image, then click a color to remove</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p>All processing happens locally in your browser. Your images never leave your device.</p>
        </div>
      </div>
    </SiteLayout>
  );
}
