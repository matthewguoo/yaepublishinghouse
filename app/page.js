'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/* =============================================
   FORTUNES DATA
   ============================================= */

const FORTUNES = [
  {
    rank: 'Great Blessing',
    rankJp: '大吉',
    class: 'great-blessing',
    text: 'The stars align most favorably. Even I must admit — your luck today is rather... impressive. Do try not to waste it on something boring.',
  },
  {
    rank: 'Great Blessing',
    rankJp: '大吉',
    class: 'great-blessing',
    text: 'My my, the highest fortune! The Electro Archon herself would be envious. Go forth boldly — today, the world bends to your whim.',
  },
  {
    rank: 'Blessing',
    rankJp: '吉',
    class: 'blessing',
    text: 'A gentle wind carries good news your way. Not the most dramatic fortune, but then again, the most beautiful stories unfold quietly.',
  },
  {
    rank: 'Blessing',
    rankJp: '吉',
    class: 'blessing',
    text: 'Fortune smiles upon you — softly, like moonlight on the Sacred Sakura. Take this as permission to pursue what your heart desires.',
  },
  {
    rank: 'Blessing',
    rankJp: '吉',
    class: 'blessing',
    text: 'The threads of fate weave kindly today. A good day to begin something new, or perhaps... to finish something long overdue.',
  },
  {
    rank: 'Small Blessing',
    rankJp: '小吉',
    class: 'small-blessing',
    text: 'A modest fortune, but fortune nonetheless. The fox knows that small blessings, gathered patiently, become great ones. Keep your eyes open.',
  },
  {
    rank: 'Small Blessing',
    rankJp: '小吉',
    class: 'small-blessing',
    text: 'Not every day needs to be extraordinary. Sometimes the warmth of tea and the company of a good book is blessing enough, wouldn\'t you agree?',
  },
  {
    rank: 'Small Blessing',
    rankJp: '小吉',
    class: 'small-blessing',
    text: 'Hmm, a small blessing. The sakura doesn\'t bloom all at once — it takes its time. Your moment will come. Patience, dear visitor.',
  },
  {
    rank: 'Small Blessing',
    rankJp: '小吉',
    class: 'small-blessing',
    text: 'A quiet kind of luck. The sort that doesn\'t announce itself but is there when you need it most. Rather like a certain fox, wouldn\'t you say?',
  },
  {
    rank: 'Uncertain',
    rankJp: '末吉',
    class: 'uncertain',
    text: 'The future is... unclear. How delightful — I do so love a good mystery. Perhaps the uncertainty itself is the most interesting part.',
  },
  {
    rank: 'Uncertain',
    rankJp: '末吉',
    class: 'uncertain',
    text: 'Neither here nor there. The path ahead has many branches, and which you take matters more than what fortune says. Choose wisely... or don\'t. That\'s fun too.',
  },
  {
    rank: 'Uncertain',
    rankJp: '末吉',
    class: 'uncertain',
    text: 'Ara, how ambiguous. Even the great Guuji cannot read this one clearly. But between you and me — the most interesting stories come from uncertain beginnings.',
  },
  {
    rank: 'Small Curse',
    rankJp: '小凶',
    class: 'curse',
    text: 'Oh? A small misfortune. Don\'t look so worried — tie this fortune to the nearest tree and the bad luck stays behind. That\'s the rule, you know.',
  },
  {
    rank: 'Small Curse',
    rankJp: '小凶',
    class: 'curse',
    text: 'A minor curse... how dramatic. I wouldn\'t lose sleep over it. Even kitsune have their unlucky days. The trick is to be charming enough that luck comes crawling back.',
  },
  {
    rank: 'Curse',
    rankJp: '凶',
    class: 'curse',
    text: 'My my... a curse. How unfortunate. But you know what they say — the darkest nights produce the brightest stars. Or was it the other way around? I can never remember.',
  },
  {
    rank: 'Curse',
    rankJp: '凶',
    class: 'curse',
    text: 'Oh dear. Well, I did warn you that fortune-telling is a gamble. Perhaps visit the shrine more often? A few offerings couldn\'t hurt. I accept fried tofu.',
  },
  {
    rank: 'Great Blessing',
    rankJp: '大吉',
    class: 'great-blessing',
    text: 'Exceptional fortune! It seems the Sacred Sakura has taken a liking to you. Use this luck well — opportunities this golden don\'t come around twice. Usually.',
  },
  {
    rank: 'Blessing',
    rankJp: '吉',
    class: 'blessing',
    text: 'Good fortune follows those who move with purpose. Today, let your instincts guide you — they know the way even when the mind hesitates.',
  },
  {
    rank: 'Small Curse',
    rankJp: '小凶',
    class: 'curse',
    text: 'Tsk, a small curse. But fortunes are just paper and ink, aren\'t they? What truly matters is the story you write yourself. Make it a good one.',
  },
  {
    rank: 'Uncertain',
    rankJp: '末吉',
    class: 'uncertain',
    text: 'The fox sees many paths before you, each more tantalizing than the last. This fortune says: the choice itself is your blessing. Or your curse. Fufu~',
  },
];

/* =============================================
   SAKURA PETALS COMPONENT
   ============================================= */

function SakuraPetals() {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 8 + Math.random() * 10,
      fallDuration: 12 + Math.random() * 18,
      swayDuration: 3 + Math.random() * 4,
      delay: Math.random() * 15,
      opacity: 0.3 + Math.random() * 0.4,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="sakura-container" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura-petal"
          style={{
            left: p.left,
            '--petal-size': `${p.size}px`,
            animationDuration: `${p.fallDuration}s, ${p.swayDuration}s, ${p.fallDuration}s`,
            animationDelay: `${p.delay}s, ${p.delay}s, ${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* =============================================
   TORII GATE SVG
   ============================================= */

function ToriiGate() {
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="60">
      <rect x="15" y="8" width="70" height="5" rx="2" fill="currentColor" />
      <rect x="10" y="0" width="80" height="4" rx="2" fill="currentColor" />
      <rect x="20" y="13" width="4" height="65" fill="currentColor" />
      <rect x="76" y="13" width="4" height="65" fill="currentColor" />
      <rect x="24" y="28" width="52" height="3" rx="1" fill="currentColor" />
    </svg>
  );
}

/* =============================================
   X (TWITTER) ICON
   ============================================= */

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* =============================================
   SCROLL REVEAL HOOK
   ============================================= */

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

/* =============================================
   REVEAL WRAPPER
   ============================================= */

function Reveal({ children, className = '' }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

/* =============================================
   MAIN PAGE
   ============================================= */

export default function Home() {
  const [fortune, setFortune] = useState(null);
  const [fortuneKey, setFortuneKey] = useState(0);
  const [lastIndex, setLastIndex] = useState(-1);

  const drawFortune = useCallback(() => {
    let idx;
    do {
      idx = Math.floor(Math.random() * FORTUNES.length);
    } while (idx === lastIndex && FORTUNES.length > 1);

    setLastIndex(idx);
    setFortune(FORTUNES[idx]);
    setFortuneKey((k) => k + 1);
  }, [lastIndex]);

  return (
    <>
      <SakuraPetals />

      <div className="page-wrapper">
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-content">
            <div className="torii-gate fade-in fade-in-delay-1">
              <ToriiGate />
            </div>

            <h1 className="hero-title fade-in fade-in-delay-2">
              Yae Publishing House
            </h1>

            <p className="hero-subtitle fade-in fade-in-delay-2">
              — Grand Narukami Shrine —
            </p>

            <div className="hero-divider fade-in fade-in-delay-3" />

            <p className="hero-greeting fade-in fade-in-delay-3">
              Ara ara~ A visitor? How delightful.
            </p>
            <p className="hero-greeting-sub fade-in fade-in-delay-4">
              Do stay a while… I promise I won&rsquo;t bite.
              <br />
              Much.
            </p>
          </div>

          <div className="scroll-indicator fade-in fade-in-delay-5">
            <span>scroll</span>
          </div>
        </section>

        {/* ── About ── */}
        <section className="section">
          <Reveal>
            <div className="section-divider" />
            <p className="about-text">
              I am <em>Yae Miko</em> — Guuji of the <strong>Grand Narukami Shrine</strong> and
              proprietor of the <strong>Yae Publishing House</strong>, Inazuma&rsquo;s
              finest purveyor of light novels.
              <br /><br />
              A kitsune of many talents and even more secrets.
              I deal in stories — the ones written on paper,
              and the far more interesting ones people carry in their hearts.
              <br /><br />
              You&rsquo;ve wandered into my domain.
              How fortunate for you.
            </p>
          </Reveal>
        </section>

        {/* ── Omikuji ── */}
        <section className="section omikuji-section">
          <Reveal>
            <div className="section-divider" />
            <h2 className="section-title">御神籤 — Omikuji</h2>
            <p className="omikuji-description">
              Every visitor to the shrine deserves a fortune.
              Draw one and see what fate has in store — though
              I make no guarantees you&rsquo;ll like what you find.
            </p>

            <button className="omikuji-draw-btn" onClick={drawFortune}>
              <span className="btn-text">
                {fortune ? 'Draw Again' : 'Draw Your Fortune'}
              </span>
            </button>

            {fortune && (
              <div className="fortune-card" key={fortuneKey}>
                <div className="fortune-card-inner">
                  <div className={`fortune-rank ${fortune.class}`}>
                    {fortune.rankJp} — {fortune.rank}
                  </div>
                  <p className="fortune-text">&ldquo;{fortune.text}&rdquo;</p>
                  <div className="fortune-fox">🦊</div>
                </div>
              </div>
            )}
          </Reveal>
        </section>

        {/* ── Social ── */}
        <section className="social-section">
          <Reveal>
            <a
              href="https://x.com/pci_yae"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <XIcon />
              <span>@pci_yae</span>
            </a>
          </Reveal>
        </section>

        {/* ── Footer ── */}
        <footer className="site-footer">
          <div className="footer-fox">🦊</div>
          <p className="footer-text">
            © {new Date().getFullYear()} Yae Publishing House
          </p>
        </footer>
      </div>
    </>
  );
}
