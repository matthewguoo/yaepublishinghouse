'use client';

import { useState, useEffect, useCallback } from 'react';

/* =============================================
   FORTUNES
   ============================================= */
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
  { id: 'fox', titleJp: '第一章', titleEn: 'The Fox', decoration: 'fox', lines: ['Long before the Sacred Sakura bloomed, before the shrine bells rang their first note —', 'there was a fox.', 'She walked between the world of mortals and the world of spirits, belonging fully to neither.', 'Some called her a trickster. Others, a sage.', 'She preferred to call herself... a storyteller.'] },
  { id: 'publishing', titleJp: '第二章', titleEn: 'The Publishing House', decoration: 'scrolls', lines: ['Stories, she discovered, were the most powerful things in existence.', 'More powerful than any divine decree. More enduring than any sacred relic.', 'And so she built a house — not of worship, but of words.', 'Every tale that passed through her doors was refined, polished,', 'and released into the world like fireflies into the night.'] },
  { id: 'sakura', titleJp: '第三章', titleEn: 'The Sacred Sakura', decoration: 'branches', lines: ['At the heart of the shrine stands the Sacred Sakura —', 'ancient, eternal, alive with memory.', 'Its roots drink from the dreams of a thousand generations.', 'Its blossoms carry wishes to the heavens.', 'The fox tends to it still, as she has for centuries uncounted.'] },
  { id: 'traveler', titleJp: '第四章', titleEn: 'The Traveler', decoration: 'torii', lines: ['And now... you.', 'Another traveler drawn by the light of the Sacred Sakura.', 'Every visitor carries a story — whether they know it or not.', 'Tell me, what tale do you bring to my shrine?', 'Perhaps the fortune slips will reveal what words cannot.'] },
];

/* =============================================
   SVG DECORATIVE COMPONENTS
   ============================================= */

function XIcon() {
  return <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

/* Sakura blossom - 5 petal flower */
function SakuraBlossom({ cx, cy, size = 6, opacity = 0.8 }) {
  const petals = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const px = cx + Math.cos(angle) * size;
    const py = cy + Math.sin(angle) * size;
    petals.push(<ellipse key={i} cx={px} cy={py} rx={size * 0.6} ry={size * 0.35} transform={`rotate(${i * 72 + 18}, ${px}, ${py})`} fill="#ffb7c5" opacity={opacity} />);
  }
  return <>{petals}<circle cx={cx} cy={cy} r={size * 0.25} fill="#f0d590" opacity={opacity} /></>;
}

/* Sakura branch SVG reaching from left */
function BranchLeft() {
  return (
    <svg className="deco deco-branch-left scroll-craft" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-10 380 Q30 340 40 300 Q50 260 35 220 Q20 180 40 140 Q60 100 55 60 Q50 30 70 10" stroke="#8a4060" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M35 220 Q60 210 80 230" stroke="#8a4060" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M40 140 Q70 120 90 135" stroke="#8a4060" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M55 60 Q80 40 100 55" stroke="#8a4060" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M40 300 Q65 280 85 295" stroke="#8a4060" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <SakuraBlossom cx={82} cy={228} size={8} opacity={0.7} />
      <SakuraBlossom cx={92} cy={132} size={7} opacity={0.6} />
      <SakuraBlossom cx={102} cy={52} size={6} opacity={0.5} />
      <SakuraBlossom cx={88} cy={292} size={7} opacity={0.65} />
      <SakuraBlossom cx={50} cy={170} size={5} opacity={0.4} />
      <SakuraBlossom cx={65} cy={80} size={5} opacity={0.45} />
      <SakuraBlossom cx={30} cy={260} size={6} opacity={0.5} />
    </svg>
  );
}

/* Sakura branch SVG reaching from right */
function BranchRight() {
  return (
    <svg className="deco deco-branch-right scroll-craft" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M210 370 Q170 330 165 290 Q160 250 175 210 Q190 170 170 130 Q150 90 160 50 Q170 20 150 0" stroke="#8a4060" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M175 210 Q150 195 130 215" stroke="#8a4060" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M170 130 Q140 115 125 135" stroke="#8a4060" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M160 50 Q135 35 115 50" stroke="#8a4060" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M165 290 Q140 275 125 290" stroke="#8a4060" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <SakuraBlossom cx={128} cy={212} size={8} opacity={0.7} />
      <SakuraBlossom cx={122} cy={132} size={7} opacity={0.6} />
      <SakuraBlossom cx={112} cy={47} size={6} opacity={0.5} />
      <SakuraBlossom cx={122} cy={287} size={7} opacity={0.65} />
      <SakuraBlossom cx={160} cy={170} size={5} opacity={0.4} />
      <SakuraBlossom cx={148} cy={75} size={5} opacity={0.45} />
      <SakuraBlossom cx={180} cy={250} size={6} opacity={0.5} />
    </svg>
  );
}

/* CSS cloud shapes */
function CloudLeft() {
  return (
    <div className="deco deco-cloud-left scroll-craft">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
    </div>
  );
}

function CloudRight() {
  return (
    <div className="deco deco-cloud-right scroll-craft">
      <div className="cloud cloud-4" />
      <div className="cloud cloud-5" />
    </div>
  );
}

/* Torii gate SVG */
function ToriiLeft() {
  return (
    <svg className="deco deco-torii-left scroll-craft" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="8" height="170" rx="2" fill="#c44060" opacity="0.5" />
      <rect x="70" y="30" width="8" height="170" rx="2" fill="#c44060" opacity="0.5" />
      <rect x="10" y="22" width="85" height="10" rx="2" fill="#c44060" opacity="0.6" />
      <path d="M5 18 Q50 8 100 18" stroke="#c44060" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
      <rect x="16" y="50" width="70" height="5" rx="1" fill="#c44060" opacity="0.4" />
    </svg>
  );
}

function ToriiRight() {
  return (
    <svg className="deco deco-torii-right scroll-craft" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="42" y="30" width="8" height="170" rx="2" fill="#c44060" opacity="0.5" />
      <rect x="92" y="30" width="8" height="170" rx="2" fill="#c44060" opacity="0.5" />
      <rect x="32" y="22" width="85" height="10" rx="2" fill="#c44060" opacity="0.6" />
      <path d="M25 18 Q72 8 120 18" stroke="#c44060" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
      <rect x="38" y="50" width="70" height="5" rx="1" fill="#c44060" opacity="0.4" />
    </svg>
  );
}

/* Fox silhouette SVG */
function FoxSilhouette() {
  return (
    <svg className="deco deco-fox scroll-craft" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 155 Q55 130 50 110 Q45 90 55 75 Q65 60 60 45 L50 20 Q55 35 65 40 Q70 42 75 38 Q80 30 85 25 Q88 35 90 45 Q95 55 100 50 Q105 45 108 35 L115 20 Q112 40 110 50 Q108 60 115 70 Q125 80 130 95 Q135 110 135 130 Q136 145 140 155 Z" fill="#ffb7c5" opacity="0.25" />
      <path d="M60 155 Q55 130 50 110 Q45 90 55 75 Q65 60 60 45 L50 20 Q55 35 65 40 Q70 42 75 38 Q80 30 85 25 Q88 35 90 45 Q95 55 100 50 Q105 45 108 35 L115 20 Q112 40 110 50 Q108 60 115 70 Q125 80 130 95 Q135 110 135 130 Q136 145 140 155" stroke="#ffb7c5" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Tails */}
      <path d="M130 130 Q145 110 160 105 Q170 100 175 90" stroke="#ffb7c5" strokeWidth="1.2" fill="none" opacity="0.3" strokeLinecap="round" />
      <path d="M132 125 Q150 100 165 95 Q178 88 185 75" stroke="#ffb7c5" strokeWidth="1.2" fill="none" opacity="0.25" strokeLinecap="round" />
      <path d="M128 135 Q140 120 155 115 Q165 112 170 105" stroke="#ffb7c5" strokeWidth="1.2" fill="none" opacity="0.25" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="80" cy="52" r="2" fill="#ffb7c5" opacity="0.5" />
    </svg>
  );
}

/* Lantern SVG */
function Lantern({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <line x1="12" y1="0" x2="12" y2="15" stroke="#d4a853" strokeWidth="1" opacity="0.4" />
      <rect x="4" y="15" width="16" height="4" rx="2" fill="#d4a853" opacity="0.5" />
      <ellipse cx="12" cy="35" rx="10" ry="14" fill="none" stroke="#ffb7c5" strokeWidth="1.5" opacity="0.4" />
      <ellipse cx="12" cy="35" rx="6" ry="10" fill="#ffb7c5" opacity="0.12" />
      <rect x="6" y="48" width="12" height="3" rx="1.5" fill="#d4a853" opacity="0.5" />
      <line x1="10" y1="51" x2="9" y2="58" stroke="#d4a853" strokeWidth="0.8" opacity="0.3" />
      <line x1="14" y1="51" x2="15" y2="58" stroke="#d4a853" strokeWidth="0.8" opacity="0.3" />
    </g>
  );
}

function LanternsLeft() {
  return (
    <svg className="deco deco-lanterns-left scroll-craft" viewBox="0 0 80 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Lantern x={15} y={10} scale={1} />
      <Lantern x={40} y={50} scale={0.8} />
      <Lantern x={10} y={100} scale={0.9} />
    </svg>
  );
}

function LanternsRight() {
  return (
    <svg className="deco deco-lanterns-right scroll-craft" viewBox="0 0 80 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Lantern x={25} y={20} scale={0.9} />
      <Lantern x={45} y={70} scale={1} />
    </svg>
  );
}

/* Scroll/book decorations */
function ScrollDeco() {
  return (
    <svg className="deco deco-scroll-left scroll-craft" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="50" height="70" rx="3" fill="none" stroke="#ffb7c5" strokeWidth="1.2" opacity="0.3" />
      <rect x="24" y="34" width="42" height="62" rx="1" fill="#ffb7c5" opacity="0.06" />
      <line x1="30" y1="45" x2="56" y2="45" stroke="#ffb7c5" strokeWidth="0.8" opacity="0.2" />
      <line x1="30" y1="52" x2="50" y2="52" stroke="#ffb7c5" strokeWidth="0.8" opacity="0.2" />
      <line x1="30" y1="59" x2="54" y2="59" stroke="#ffb7c5" strokeWidth="0.8" opacity="0.2" />
      <line x1="30" y1="66" x2="48" y2="66" stroke="#ffb7c5" strokeWidth="0.8" opacity="0.2" />
      <line x1="30" y1="73" x2="52" y2="73" stroke="#ffb7c5" strokeWidth="0.8" opacity="0.2" />
      <line x1="30" y1="80" x2="45" y2="80" stroke="#ffb7c5" strokeWidth="0.8" opacity="0.2" />
      {/* Scroll roll */}
      <ellipse cx="35" cy="130" rx="22" ry="6" fill="none" stroke="#ffb7c5" strokeWidth="1" opacity="0.3" />
      <rect x="15" y="130" width="40" height="50" rx="2" fill="none" stroke="#ffb7c5" strokeWidth="1" opacity="0.25" />
      <line x1="22" y1="140" x2="48" y2="140" stroke="#ffb7c5" strokeWidth="0.6" opacity="0.15" />
      <line x1="22" y1="148" x2="44" y2="148" stroke="#ffb7c5" strokeWidth="0.6" opacity="0.15" />
      <line x1="22" y1="156" x2="46" y2="156" stroke="#ffb7c5" strokeWidth="0.6" opacity="0.15" />
      <line x1="22" y1="164" x2="40" y2="164" stroke="#ffb7c5" strokeWidth="0.6" opacity="0.15" />
    </svg>
  );
}

function BookDeco() {
  return (
    <svg className="deco deco-book-right scroll-craft" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Open book */}
      <path d="M50 50 Q30 45 15 50 L15 120 Q30 115 50 120 Q70 115 85 120 L85 50 Q70 45 50 50Z" fill="#ffb7c5" opacity="0.06" stroke="#ffb7c5" strokeWidth="1" />
      <line x1="50" y1="50" x2="50" y2="120" stroke="#ffb7c5" strokeWidth="0.8" opacity="0.2" />
      <line x1="25" y1="65" x2="45" y2="63" stroke="#ffb7c5" strokeWidth="0.5" opacity="0.15" />
      <line x1="25" y1="75" x2="45" y2="73" stroke="#ffb7c5" strokeWidth="0.5" opacity="0.15" />
      <line x1="25" y1="85" x2="45" y2="83" stroke="#ffb7c5" strokeWidth="0.5" opacity="0.15" />
      <line x1="55" y1="63" x2="78" y2="65" stroke="#ffb7c5" strokeWidth="0.5" opacity="0.15" />
      <line x1="55" y1="73" x2="78" y2="75" stroke="#ffb7c5" strokeWidth="0.5" opacity="0.15" />
      <line x1="55" y1="83" x2="78" y2="85" stroke="#ffb7c5" strokeWidth="0.5" opacity="0.15" />
      {/* Sparkle */}
      <path d="M70 40 L72 35 L74 40 L79 42 L74 44 L72 49 L70 44 L65 42Z" fill="#f0d590" opacity="0.3" />
      <path d="M30 140 L31.5 136 L33 140 L37 141.5 L33 143 L31.5 147 L30 143 L26 141.5Z" fill="#f0d590" opacity="0.25" />
    </svg>
  );
}

/* Decorations per chapter */
function ChapterDecorations({ type }) {
  switch (type) {
    case 'fox':
      return <><FoxSilhouette /><CloudLeft /><CloudRight /></>;
    case 'scrolls':
      return <><ScrollDeco /><BookDeco /><LanternsRight /></>;
    case 'branches':
      return <><BranchLeft /><BranchRight /></>;
    case 'torii':
      return <><ToriiLeft /><ToriiRight /><LanternsLeft /></>;
    default:
      return null;
  }
}

/* =============================================
   SHARED COMPONENTS
   ============================================= */

function SakuraPetals() {
  const petals = Array.from({ length: 25 }, (_, i) => ({
    size: 8 + Math.random() * 14,
    left: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 8 + Math.random() * 10,
    swayDuration: 3 + Math.random() * 4,
    opacity: 0.25 + Math.random() * 0.4,
    rotation: Math.random() * 360,
  }));
  return (
    <div className="sakura-container">
      {petals.map((p, i) => (
        <div key={i} className="sakura-petal" style={{ '--size': `${p.size}px`, '--left': `${p.left}%`, '--delay': `${p.delay}s`, '--duration': `${p.duration}s`, '--sway-duration': `${p.swayDuration}s`, '--opacity': p.opacity, '--rotation': `${p.rotation}deg` }} />
      ))}
    </div>
  );
}

function GoldBorder({ children, className = '' }) {
  return (
    <div className={`gold-border-frame ${className}`}>
      <div className="gold-corner gold-corner-tl" /><div className="gold-corner gold-corner-tr" />
      <div className="gold-corner gold-corner-bl" /><div className="gold-corner gold-corner-br" />
      {children}
    </div>
  );
}

function OrnamentalDivider() {
  return <div className="ornamental-divider"><span className="divider-line" /><span className="divider-diamond">◆</span><span className="divider-line" /></div>;
}

/* =============================================
   STORY SCENE
   ============================================= */

function StoryScene({ chapter }) {
  return (
    <section className="story-scene" data-chapter={chapter.id}>
      <ChapterDecorations type={chapter.decoration} />
      <div className="scene-content">
        <div className="scene-panel scroll-reveal">
          <div className="gold-corner gold-corner-tl" /><div className="gold-corner gold-corner-tr" />
          <div className="gold-corner gold-corner-bl" /><div className="gold-corner gold-corner-br" />
          <span className="scene-chapter-num">{chapter.titleJp}</span>
          <h2 className="scene-chapter-title">{chapter.titleEn}</h2>
          <div className="scene-rule" />
          <div className="scene-text">
            {chapter.lines.map((line, i) => <p key={i} className="scene-line">{line}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================
   MAIN PAGE
   ============================================= */

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

    const craftObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('craft-visible'); });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach((el) => obs.observe(el));
    document.querySelectorAll('.scroll-craft').forEach((el) => craftObs.observe(el));
    return () => { obs.disconnect(); craftObs.disconnect(); };
  }, []);

  const drawFortune = useCallback(() => {
    setIsDrawing(true);
    setTimeout(() => {
      let idx;
      do { idx = Math.floor(Math.random() * FORTUNES.length); } while (idx === lastIndex && FORTUNES.length > 1);
      setLastIndex(idx);
      setFortune(FORTUNES[idx]);
      setFortuneKey((k) => k + 1);
      setIsDrawing(false);
    }, 800);
  }, [lastIndex]);

  return (
    <div className="site-wrapper">
      <div className="paper-texture" />
      <SakuraPetals />

      <section className="hero-section">
        <div className="parallax-bg">
          <div className="parallax-layer layer-sky" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
          <div className="parallax-layer layer-mountains" style={{ transform: `translateY(${scrollY * 0.25}px)` }} />
          <div className="parallax-layer layer-shrine" style={{ transform: `translateY(${scrollY * 0.4}px)` }} />
          <div className="parallax-layer layer-sakura" style={{ transform: `translateY(${scrollY * 0.55}px)` }} />
          <div className="parallax-layer layer-foreground" style={{ transform: `translateY(${scrollY * 0.7}px)` }} />
        </div>
        <div className="hero-fade" />
        <div className="hero-content">
          <div className="hero-emblem">
            <svg viewBox="0 0 100 100" className="hero-emblem-svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
              <text x="50" y="55" textAnchor="middle" fontSize="24" fill="currentColor" fontFamily="serif">狐</text>
            </svg>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-jp">八重堂</span>
            <span className="hero-title-en">Yae Publishing House</span>
          </h1>
          <p className="hero-subtitle">Grand Narukami Shrine</p>
          <OrnamentalDivider />
          <p className="hero-greeting">Ara ara~ A visitor?</p>
          <p className="hero-desc">Welcome to my shrine. Scroll down, and let me tell you a story.</p>
          <div className="scroll-indicator"><span className="scroll-arrow">⌄</span></div>
        </div>
      </section>

      {CHAPTERS.map((ch) => <StoryScene key={ch.id} chapter={ch} />)}

      <div className="deep-section">
        <section className="omikuji-section scroll-reveal">
          <GoldBorder className="omikuji-frame">
            <div className="section-header"><span className="section-header-line" /><h2 className="section-title"><span className="section-title-jp">御神籤</span><span className="section-title-en">Omikuji</span></h2><span className="section-header-line" /></div>
            <p className="omikuji-desc">The Grand Narukami Shrine offers divine fortunes to those who seek guidance. Each slip carries the blessing — or mischief — of a certain fox.</p>
            <button className={`omikuji-btn ${isDrawing ? 'drawing' : ''}`} onClick={drawFortune} disabled={isDrawing}>
              <span className="btn-inner"><span className="btn-icon">⛩</span><span className="btn-text">{isDrawing ? 'Reading the stars...' : fortune ? 'Draw Again' : 'Draw Your Fortune'}</span></span>
            </button>
            {fortune && (
              <div className="fortune-card" key={fortuneKey}>
                <div className="fortune-card-inner">
                  <div className="fortune-card-glow" /><div className="fortune-card-top-border" />
                  <div className={`fortune-rank ${fortune.class}`}><span className="fortune-rank-jp">{fortune.rankJp}</span><span className="fortune-rank-divider">—</span><span className="fortune-rank-en">{fortune.rank}</span></div>
                  <div className="fortune-quote-mark">&ldquo;</div>
                  <p className="fortune-text">{fortune.text}</p>
                  <div className="fortune-seal"><span>🦊</span><span className="fortune-seal-text">Guuji Yae</span></div>
                </div>
              </div>
            )}
          </GoldBorder>
        </section>
        <section className="about-section scroll-reveal">
          <GoldBorder className="about-frame">
            <div className="section-header"><span className="section-header-line" /><h2 className="section-title"><span className="section-title-jp">巫女の言葉</span><span className="section-title-en">Words of the Miko</span></h2><span className="section-header-line" /></div>
            <div className="about-content">
              <blockquote className="about-quote">&ldquo;People believe what they want to believe. And so, a story well-told is more powerful than any truth. That&rsquo;s why I run a publishing house, not a shrine... though I do that too.&rdquo;</blockquote>
              <p className="about-attribution">— Yae Miko, Guuji of the Grand Narukami Shrine</p>
            </div>
          </GoldBorder>
        </section>
        <footer className="site-footer scroll-reveal">
          <div className="footer-inner">
            <OrnamentalDivider />
            <a href="https://x.com/pci_yae" target="_blank" rel="noopener noreferrer" className="social-link"><XIcon /><span>@pci_yae</span></a>
            <p className="footer-copy">© {new Date().getFullYear()} Yae Publishing House</p>
            <p className="footer-blessing">May the Sacred Sakura watch over you 🌸</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
