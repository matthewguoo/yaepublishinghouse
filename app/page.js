'use client';

import { useState, useEffect, useCallback } from 'react';

const FORTUNES = [
  { rank: 'Great Blessing', rankJp: '大吉', class: 'great-blessing', text: 'The stars align most favorably. Even I must admit — your luck today is rather... impressive. Do try not to waste it on something boring.' },
  { rank: 'Great Blessing', rankJp: '大吉', class: 'great-blessing', text: 'My my, the highest fortune! The Electro Archon herself would be envious. Go forth boldly — today, the world bends to your whim.' },
  { rank: 'Blessing', rankJp: '吉', class: 'blessing', text: 'A gentle wind carries good news your way. Not the most dramatic fortune, but then again, the most beautiful stories unfold quietly.' },
  { rank: 'Blessing', rankJp: '吉', class: 'blessing', text: 'Fortune smiles upon you — softly, like moonlight on the Sacred Sakura. Take this as permission to pursue what your heart desires.' },
  { rank: 'Blessing', rankJp: '吉', class: 'blessing', text: 'The threads of fate weave kindly today. A good day to begin something new, or perhaps... to finish something long overdue.' },
  { rank: 'Small Blessing', rankJp: '小吉', class: 'small-blessing', text: 'A modest fortune, but fortune nonetheless. The fox knows that small blessings, gathered patiently, become great ones. Keep your eyes open.' },
  { rank: 'Small Blessing', rankJp: '小吉', class: 'small-blessing', text: 'Not every day needs to be extraordinary. Sometimes the warmth of tea and the company of a good book is blessing enough, wouldn\'t you agree?' },
  { rank: 'Small Blessing', rankJp: '小吉', class: 'small-blessing', text: 'Hmm, a small blessing. The sakura doesn\'t bloom all at once — it takes its time. Your moment will come. Patience, dear visitor.' },
  { rank: 'Small Blessing', rankJp: '小吉', class: 'small-blessing', text: 'A quiet kind of luck. The sort that doesn\'t announce itself but is there when you need it most. Rather like a certain fox, wouldn\'t you say?' },
  { rank: 'Uncertain', rankJp: '末吉', class: 'uncertain', text: 'The future is... unclear. How delightful — I do so love a good mystery. Perhaps the uncertainty itself is the most interesting part.' },
  { rank: 'Uncertain', rankJp: '末吉', class: 'uncertain', text: 'Neither here nor there. The path ahead has many branches, and which you take matters more than what fortune says. Choose wisely... or don\'t. That\'s fun too.' },
  { rank: 'Uncertain', rankJp: '末吉', class: 'uncertain', text: 'Ara, how ambiguous. Even the great Guuji cannot read this one clearly. But between you and me — the most interesting stories come from uncertain beginnings.' },
  { rank: 'Small Curse', rankJp: '小凶', class: 'curse', text: 'Oh? A small misfortune. Don\'t look so worried — tie this fortune to the nearest tree and the bad luck stays behind. That\'s the rule, you know.' },
  { rank: 'Small Curse', rankJp: '小凶', class: 'curse', text: 'A minor curse... how dramatic. I wouldn\'t lose sleep over it. Even kitsune have their unlucky days. The trick is to be charming enough that luck comes crawling back.' },
  { rank: 'Curse', rankJp: '凶', class: 'curse', text: 'My my... a curse. How unfortunate. But you know what they say — the darkest nights produce the brightest stars. Or was it the other way around? I can never remember.' },
  { rank: 'Curse', rankJp: '凶', class: 'curse', text: 'Oh dear. Well, I did warn you that fortune-telling is a gamble. Perhaps visit the shrine more often? A few offerings couldn\'t hurt. I accept fried tofu.' },
  { rank: 'Great Blessing', rankJp: '大吉', class: 'great-blessing', text: 'Exceptional fortune! It seems the Sacred Sakura has taken a liking to you. Use this luck well — opportunities this golden don\'t come around twice. Usually.' },
  { rank: 'Blessing', rankJp: '吉', class: 'blessing', text: 'Good fortune follows those who move with purpose. Today, let your instincts guide you — they know the way even when the mind hesitates.' },
  { rank: 'Small Curse', rankJp: '小凶', class: 'curse', text: 'Tsk, a small curse. But fortunes are just paper and ink, aren\'t they? What truly matters is the story you write yourself. Make it a good one.' },
  { rank: 'Uncertain', rankJp: '末吉', class: 'uncertain', text: 'The fox sees many paths before you, each more tantalizing than the last. This fortune says: the choice itself is your blessing. Or your curse. Fufu~' },
];

const CHAPTERS = [
  { id: 'fox', titleJp: '第一章', titleEn: 'The Fox', lines: ['Long before the Sacred Sakura bloomed, before the shrine bells rang their first note —', 'there was a fox.', 'She walked between the world of mortals and the world of spirits, belonging fully to neither.', 'Some called her a trickster. Others, a sage.', 'She preferred to call herself... a storyteller.'] },
  { id: 'publishing', titleJp: '第二章', titleEn: 'The Publishing House', lines: ['Stories, she discovered, were the most powerful things in existence.', 'More powerful than any divine decree. More enduring than any sacred relic.', 'And so she built a house — not of worship, but of words.', 'Every tale that passed through her doors was refined, polished,', 'and released into the world like fireflies into the night.'] },
  { id: 'sakura', titleJp: '第三章', titleEn: 'The Sacred Sakura', lines: ['At the heart of the shrine stands the Sacred Sakura —', 'ancient, eternal, alive with memory.', 'Its roots drink from the dreams of a thousand generations.', 'Its blossoms carry wishes to the heavens.', 'The fox tends to it still, as she has for centuries uncounted.'] },
  { id: 'traveler', titleJp: '第四章', titleEn: 'The Traveler', lines: ['And now... you.', 'Another traveler drawn by the light of the Sacred Sakura.', 'Every visitor carries a story — whether they know it or not.', 'Tell me, what tale do you bring to my shrine?', 'Perhaps the fortune slips will reveal what words cannot.'] },
];

function XIcon() {
  return <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

function SakuraPetals() {
  const petals = Array.from({ length: 25 }, (_, i) => ({
    size: 8 + Math.random() * 14, left: Math.random() * 100,
    delay: Math.random() * 12, duration: 8 + Math.random() * 10,
    swayDuration: 3 + Math.random() * 4, opacity: 0.25 + Math.random() * 0.4,
    rotation: Math.random() * 360,
  }));
  return (
    <div className="sakura-container">
      {petals.map((p, i) => <div key={i} className="sakura-petal" style={{ '--size': `${p.size}px`, '--left': `${p.left}%`, '--delay': `${p.delay}s`, '--duration': `${p.duration}s`, '--sway-duration': `${p.swayDuration}s`, '--opacity': p.opacity, '--rotation': `${p.rotation}deg` }} />)}
    </div>
  );
}

function GoldBorder({ children, className = '' }) {
  return (
    <div className={`panel ${className}`}>
      <div className="corner corner-tl" /><div className="corner corner-tr" />
      <div className="corner corner-bl" /><div className="corner corner-br" />
      {children}
    </div>
  );
}

function Divider() {
  return <div className="divider"><span className="divider-line" /><span className="divider-dot">◆</span><span className="divider-line" /></div>;
}

export default function Home() {
  const [fortune, setFortune] = useState(null);
  const [fortuneKey, setFortuneKey] = useState(0);
  const [lastIndex, setLastIndex] = useState(-1);
  const [scrollY, setScrollY] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const drawFortune = useCallback(() => {
    setIsDrawing(true);
    setTimeout(() => {
      let idx;
      do { idx = Math.floor(Math.random() * FORTUNES.length); } while (idx === lastIndex && FORTUNES.length > 1);
      setLastIndex(idx); setFortune(FORTUNES[idx]); setFortuneKey((k) => k + 1); setIsDrawing(false);
    }, 800);
  }, [lastIndex]);

  return (
    <div className="site">
      <SakuraPetals />

      {/* Hero */}
      <section className="hero">
        <div className="parallax">
          <div className="parallax-layer layer-sky" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
          <div className="parallax-layer layer-mountains" style={{ transform: `translateY(${scrollY * 0.25}px)` }} />
          <div className="parallax-layer layer-shrine" style={{ transform: `translateY(${scrollY * 0.4}px)` }} />
          <div className="parallax-layer layer-sakura" style={{ transform: `translateY(${scrollY * 0.55}px)` }} />
          <div className="parallax-layer layer-foreground" style={{ transform: `translateY(${scrollY * 0.7}px)` }} />
        </div>
        <div className="hero-fade" />
        <div className="hero-content">
          <div className="emblem">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
              <text x="50" y="55" textAnchor="middle" fontSize="24" fill="currentColor" fontFamily="serif">狐</text>
            </svg>
          </div>
          <h1 className="hero-title">
            <span className="title-jp">八重堂</span>
            <span className="title-en">Yae Publishing House</span>
          </h1>
          <p className="hero-sub">Grand Narukami Shrine</p>
          <Divider />
          <p className="hero-greeting">Ara ara~ A visitor?</p>
          <p className="hero-desc">Welcome to my shrine. Scroll down, and let me tell you a story.</p>
          <div className="scroll-hint"><span>⌄</span></div>
        </div>
      </section>

      {/* Story */}
      <div className="story">
        {CHAPTERS.map((ch) => (
          <section key={ch.id} className="chapter reveal">
            <GoldBorder>
              <span className="ch-num">{ch.titleJp}</span>
              <h2 className="ch-title">{ch.titleEn}</h2>
              <div className="ch-rule" />
              {ch.lines.map((line, i) => <p key={i} className="ch-line">{line}</p>)}
            </GoldBorder>
          </section>
        ))}
      </div>

      {/* Omikuji + About + Footer */}
      <div className="bottom">
        <section className="omikuji reveal">
          <GoldBorder>
            <div className="sec-header"><span className="sec-line" /><h2 className="sec-title"><span className="sec-jp">御神籤</span><span className="sec-en">Omikuji</span></h2><span className="sec-line" /></div>
            <p className="omikuji-desc">The Grand Narukami Shrine offers divine fortunes to those who seek guidance. Each slip carries the blessing — or mischief — of a certain fox.</p>
            <button className={`draw-btn ${isDrawing ? 'drawing' : ''}`} onClick={drawFortune} disabled={isDrawing}>
              <span className="draw-inner"><span className="draw-icon">⛩</span>{isDrawing ? 'Reading the stars...' : fortune ? 'Draw Again' : 'Draw Your Fortune'}</span>
            </button>
            {fortune && (
              <div className="fortune" key={fortuneKey}>
                <div className="fortune-inner">
                  <div className="fortune-glow" /><div className="fortune-top-bar" />
                  <div className={`fortune-rank ${fortune.class}`}><span className="rank-jp">{fortune.rankJp}</span><span className="rank-div">—</span><span className="rank-en">{fortune.rank}</span></div>
                  <div className="fortune-q">&ldquo;</div>
                  <p className="fortune-text">{fortune.text}</p>
                  <div className="fortune-seal"><span>🦊</span><span className="seal-name">Guuji Yae</span></div>
                </div>
              </div>
            )}
          </GoldBorder>
        </section>

        <section className="about reveal">
          <GoldBorder>
            <div className="sec-header"><span className="sec-line" /><h2 className="sec-title"><span className="sec-jp">巫女の言葉</span><span className="sec-en">Words of the Miko</span></h2><span className="sec-line" /></div>
            <blockquote className="quote">&ldquo;People believe what they want to believe. And so, a story well-told is more powerful than any truth. That&rsquo;s why I run a publishing house, not a shrine... though I do that too.&rdquo;</blockquote>
            <p className="attribution">— Yae Miko, Guuji of the Grand Narukami Shrine</p>
          </GoldBorder>
        </section>

        <footer className="footer reveal">
          <Divider />
          <a href="https://x.com/pci_yae" target="_blank" rel="noopener noreferrer" className="social"><XIcon /><span>@pci_yae</span></a>
          <p className="copy">© {new Date().getFullYear()} Yae Publishing House</p>
          <p className="blessing">May the Sacred Sakura watch over you 🌸</p>
        </footer>
      </div>
    </div>
  );
}
