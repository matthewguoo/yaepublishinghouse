'use client';

import { useState, useEffect, useRef } from 'react';
import './typography.css';

export default function Typography() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [activeWord, setActiveWord] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const words = [
    { text: 'TYPOGRAPHY', style: 'hero', delay: 0 },
    { text: 'is a', style: 'connector', delay: 0.1 },
    { text: 'beautiful', style: 'beautiful-1', delay: 0.2 },
    { text: 'GROUP', style: 'group', delay: 0.3 },
    { text: 'OF', style: 'of', delay: 0.35 },
    { text: 'LETTERS,', style: 'letters', delay: 0.4 },
    { text: 'not a group of', style: 'negation', delay: 0.6 },
    { text: 'Beautiful', style: 'beautiful-2', delay: 0.8 },
    { text: 'letters.', style: 'letters-end', delay: 0.9 },
  ];

  return (
    <div className="typo-site" ref={containerRef}>
      <div 
        className="mouse-orb"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
        }}
      />

      <section className="typo-hero">
        <div className="quote-container">
          {words.map((word, i) => (
            <span
              key={i}
              className={`word ${word.style} ${revealed ? 'revealed' : ''} ${activeWord === i ? 'active' : ''}`}
              style={{ '--delay': `${word.delay}s` }}
              onMouseEnter={() => setActiveWord(i)}
              onMouseLeave={() => setActiveWord(null)}
            >
              {word.text}
            </span>
          ))}
        </div>

        <div className="attribution">
          <span className="attr-line" />
          <span className="attr-text">Robert Bringhurst</span>
          <span className="attr-line" />
        </div>

        <div className="scroll-indicator">
          <span>↓</span>
        </div>
      </section>

      <section className="typo-breakdown">
        <div className="breakdown-card">
          <div className="card-number">01</div>
          <h2 className="card-title">The Group</h2>
          <p className="card-body">
            Typography is not about making each letter perfect in isolation. 
            It is about how letters work <em>together</em> — their rhythm, 
            their spacing, their collective voice.
          </p>
          <div className="card-demo">
            <span className="demo-bad">B e a u t i f u l</span>
            <span className="demo-vs">vs</span>
            <span className="demo-good">Beautiful</span>
          </div>
        </div>

        <div className="breakdown-card">
          <div className="card-number">02</div>
          <h2 className="card-title">The Contrast</h2>
          <p className="card-body">
            Notice how &quot;beautiful&quot; appears twice — first as part of the group, 
            then standing alone. Same word, different meaning. Context is everything.
          </p>
          <div className="card-demo contrast-demo">
            <span className="demo-context">a <em>beautiful</em> group</span>
            <span className="demo-context">beautiful <em>letters</em></span>
          </div>
        </div>

        <div className="breakdown-card">
          <div className="card-number">03</div>
          <h2 className="card-title">The Negative</h2>
          <p className="card-body">
            &quot;Not a group of&quot; — the quietest part of the quote. 
            It exists to negate, to redirect. Good typography knows 
            when to whisper.
          </p>
          <div className="card-demo negative-demo">
            <span className="demo-loud">NOT A GROUP OF</span>
            <span className="demo-quiet">not a group of</span>
          </div>
        </div>
      </section>

      <section className="typo-playground">
        <h2 className="playground-title">Experiment</h2>
        <p className="playground-sub">Hover over the letters. Watch them breathe.</p>
        
        <div className="letter-grid">
          {'TYPOGRAPHY'.split('').map((letter, i) => (
            <span 
              key={i} 
              className="grid-letter"
              style={{ '--i': i }}
            >
              {letter}
            </span>
          ))}
        </div>
      </section>

      <footer className="typo-footer">
        <div className="footer-brand">
          <span className="brand-jp">八重堂</span>
          <span className="brand-en">Yae Publishing House</span>
        </div>
        <p className="footer-note">
          A typography study for GOA Graphic Design
        </p>
      </footer>
    </div>
  );
}
