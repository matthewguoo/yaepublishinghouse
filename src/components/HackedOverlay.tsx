'use client';

import { useEffect, useState } from 'react';
import styles from './HackedOverlay.module.css';

interface HackedOverlayProps {
  isGlitching: boolean;
  isHacked: boolean;
}

export default function HackedOverlay({ isGlitching, isHacked }: HackedOverlayProps) {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  
  const allLines = [
    '> connection established...',
    '> yae_publishing_house.inazuma bypassed',
    '> injecting IPC payload...',
    '> decrypting merchant protocols...',
    '> NAMELESS HONOR PASS - NOW AVAILABLE',
  ];

  useEffect(() => {
    if (isHacked && terminalLines.length < allLines.length) {
      const timer = setTimeout(() => {
        setTerminalLines(prev => [...prev, allLines[prev.length]]);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isHacked, terminalLines.length]);

  if (!isGlitching && !isHacked) return null;

  return (
    <div className={`${styles.overlay} ${isHacked ? styles.hacked : styles.glitching}`}>
      {isGlitching && !isHacked && (
        <div className={styles.glitchLayer}>
          <div className={styles.scanlines}></div>
          <div className={styles.noise}></div>
          <div className={styles.glitchText}>INTRUSION DETECTED</div>
        </div>
      )}
      
      {isHacked && (
        <div className={styles.hackedContent}>
          <header className={styles.header}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>◈</span>
              <span className={styles.logoText}>STELLARON HUNTERS</span>
            </div>
            <div className={styles.status}>
              <span className={styles.statusDot}></span>
              SYSTEM ACCESSED
            </div>
          </header>

          <div className={styles.main}>
            <div className={styles.terminal}>
              {terminalLines.map((line, i) => (
                <p key={i} className={i === terminalLines.length - 1 ? styles.highlight : ''}>
                  {line}
                </p>
              ))}
              <span className={styles.cursor}>_</span>
            </div>

            <div className={styles.productSection}>
              <div className={styles.productInfo}>
                <h1 className={styles.title}>The Wolf Has Arrived</h1>
                <p className={styles.desc}>
                  Limited edition gold-plated collectible. 2,158 units. Each one serialized.
                </p>
                <ul className={styles.specs}>
                  <li>Real gold ENIG finish</li>
                  <li>100 × 42mm fiberglass substrate</li>
                  <li>UV silkscreen printing</li>
                  <li>Corrosion-proof, reflective</li>
                </ul>
                <a href="/products/star-rail-pass" className={styles.cta}>
                  VIEW PRODUCT
                  <span className={styles.arrow}>→</span>
                </a>
              </div>
              <div className={styles.productImage}>
                <img src="/star-rail-pass.png" alt="Nameless Honor Pass" />
              </div>
            </div>
          </div>

          <footer className={styles.footer}>
            <div className={styles.footerMarquee}>
              <span>◇ IPC AUTHORIZED ◇ XINGJITECH CORP ◇ EARTH DIVISION ◇ AMBER ERA COMMEMORATIVE ◇ IPC AUTHORIZED ◇ XINGJITECH CORP ◇</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
