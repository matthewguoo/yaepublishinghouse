'use client';

import { useEffect, useRef, useState } from 'react';

/* ===== SAKURA PETALS ===== */
function Petals() {
  const petals = Array.from({ length: 30 }, (_, i) => ({
    s: 8 + Math.random() * 16,
    x: Math.random() * 100,
    o: 0.15 + Math.random() * 0.35,
    dur: 10 + Math.random() * 14,
    del: Math.random() * 16,
    sway: 3 + Math.random() * 5,
    rot: Math.random() * 360,
  }));
  return (
    <div className="petals">
      {petals.map((p, i) => (
        <div key={i} className="petal" style={{
          '--s': `${p.s}px`, '--x': `${p.x}%`, '--o': p.o,
          '--dur': `${p.dur}s`, '--del': `${p.del}s`,
          '--sway': `${p.sway}s`, '--rot': `${p.rot}deg`,
        }} />
      ))}
    </div>
  );
}

/* ===== REVEAL HOOK ===== */
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ===== FRAGMENT COMPONENTS ===== */
function ImgFrag({ src, alt, style, w, h }) {
  const [ref, vis] = useReveal(0.15);
  return (
    <div ref={ref} className={`frag frag-img ${vis ? 'vis' : ''}`} style={{ ...style, width: w, height: h }}>
      <img src={src} alt={alt || ''} loading="lazy" />
    </div>
  );
}

function TextFrag({ children, jp, style }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`frag frag-text ${vis ? 'vis' : ''}`} style={style}>
      <p>{children}</p>
      {jp && <p className="jp-line">{jp}</p>}
    </div>
  );
}

function LabelFrag({ text, style }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`frag frag-label ${vis ? 'vis' : ''}`} style={style}>
      {text}
    </div>
  );
}

/* ===== POEM ===== */
function Poem() {
  const [ref, vis] = useReveal(0.3);
  return (
    <div className="poem" ref={ref}>
      <div className="poem-lines">
        {[
          'Stories are the most powerful things in existence.',
          'More enduring than any sacred relic.',
          'Every visitor carries one,',
          'whether they know it or not.',
        ].map((line, i) => (
          <p key={i} className={`poem-line ${vis ? 'vis' : ''}`} style={{ transitionDelay: `${i * 0.2}s` }}>
            {line}
          </p>
        ))}
      </div>
      <p className={`poem-jp ${vis ? 'vis' : ''}`}>
        物語は、世界で最も強いものだ
      </p>
    </div>
  );
}

/* ===== MAIN ===== */
export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <div className="noise" />
      <Petals />

      <div className="canvas">
        {/* ===== OPENING ===== */}
        <section className="opening">
          <div className="opening-bg" />
          <div className="opening-content">
            <h1 className="opening-kanji">八重堂</h1>
            <p className="opening-sub">Yae Publishing House</p>
            <div className="opening-line" />
          </div>

          {/* ghost kanji */}
          <span className="ghost" style={{ top: '15%', left: '8%', fontSize: '8rem', transform: `translateY(${scrollY * 0.05}px)` }}>狐</span>
          <span className="ghost" style={{ bottom: '20%', right: '10%', fontSize: '6rem', transform: `translateY(${scrollY * -0.03}px)` }}>桜</span>
          <span className="ghost" style={{ top: '60%', left: '75%', fontSize: '5rem', transform: `translateY(${scrollY * 0.04}px)` }}>夢</span>
        </section>

        {/* ===== DRIFT STRIP ===== */}
        <div className="strip">
          <div className="strip-text">物語 ・ 花 ・ 狐 ・ 夢 ・ 桜 ・ 神社 ・ 光 ・ 物語 ・ 花 ・ 狐 ・ 夢 ・ 桜</div>
        </div>

        {/* ===== FIRST COLLAGE ===== */}
        <section className="collage">
          <div className="collage-inner">
            {/* main miko image */}
            <ImgFrag
              src="/miko.jpg" alt=""
              style={{ top: '0', left: '5%' }}
              w="340px" h="440px"
            />

            {/* text fragment */}
            <TextFrag
              style={{ top: '60px', right: '10%' }}
              jp="ある狐が、物語の家を建てた"
            >
              Before the shrine bells rang their first note,
              there was a fox who preferred to call herself a storyteller.
            </TextFrag>

            {/* shrine layer as secondary image */}
            <ImgFrag
              src="/shrine_layer.jpg" alt=""
              style={{ top: '320px', right: '15%' }}
              w="280px" h="180px"
            />

            {/* label */}
            <LabelFrag
              text="Grand Narukami Shrine"
              style={{ top: '510px', right: '18%' }}
            />

            {/* mountains as accent */}
            <ImgFrag
              src="/mountains_layer.jpg" alt=""
              style={{ top: '480px', left: '8%' }}
              w="220px" h="160px"
            />

            {/* small text */}
            <TextFrag style={{ top: '660px', left: '35%' }}>
              Every tale that passed through her doors was refined, polished,
              and released into the world like fireflies into the night.
            </TextFrag>

            {/* big background kanji */}
            <span className="frag frag-kanji vis" style={{ top: '100px', left: '42%', fontSize: '18rem', transform: `translateY(${scrollY * 0.02}px)` }}>堂</span>
          </div>
        </section>

        {/* ===== POEM ===== */}
        <Poem />

        {/* ===== SECOND COLLAGE ===== */}
        <section className="collage">
          <div className="collage-inner" style={{ minHeight: '600px' }}>
            <ImgFrag
              src="/sakura_layer.jpg" alt=""
              style={{ top: '0', right: '8%' }}
              w="300px" h="200px"
            />

            <TextFrag
              style={{ top: '30px', left: '8%' }}
              jp="花びらは、言葉よりも多くを語る"
            >
              The petals speak more than words ever could.
              A story well-told is more powerful than any truth.
            </TextFrag>

            <ImgFrag
              src="/sky_layer.jpg" alt=""
              style={{ top: '250px', left: '12%' }}
              w="260px" h="180px"
            />

            <LabelFrag
              text="Inazuma"
              style={{ top: '250px', right: '12%' }}
            />

            <TextFrag style={{ top: '320px', right: '8%', maxWidth: '240px' }}>
              She walked between the world of mortals and the world of spirits,
              belonging fully to neither.
            </TextFrag>

            {/* background kanji */}
            <span className="frag frag-kanji vis" style={{ top: '50px', right: '40%', fontSize: '14rem', transform: `translateY(${scrollY * 0.015}px)` }}>狐</span>
          </div>
        </section>

        {/* ===== SECOND STRIP ===== */}
        <div className="strip">
          <div className="strip-text" style={{ animationDirection: 'reverse' }}>
            八重堂 ・ 出版 ・ 巫女 ・ 雷 ・ 稲荷 ・ 八重堂 ・ 出版 ・ 巫女 ・ 雷 ・ 稲荷
          </div>
        </div>

        {/* ===== LINKS ===== */}
        <div className="links">
          <a href="https://x.com/pci_yae" target="_blank" rel="noopener noreferrer" className="link-item">Twitter</a>
          <a href="https://github.com/matthewguoo" target="_blank" rel="noopener noreferrer" className="link-item">GitHub</a>
          <a href="https://instagram.com/yuuko.koro" target="_blank" rel="noopener noreferrer" className="link-item">Cosplay</a>
          <a href="/typography" className="link-item">Typography</a>
        </div>

        {/* ===== THE WHISPER ===== */}
        <p className="whisper">ft offer at spacex starlink at 16</p>

        {/* ===== FOOTER ===== */}
        <footer className="floor">
          <span className="floor-text">八重堂 — {new Date().getFullYear()}</span>
        </footer>
      </div>
    </>
  );
}
