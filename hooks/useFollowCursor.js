'use client';

import { useEffect, useRef } from 'react';

/**
 * Float an element so its bottom edge meets the cursor,
 * with a soft follow (inertial easing).
 *
 * @param {React.RefObject<HTMLElement>} ref  Target element
 * @param {boolean} active                   Visibility flag
 * @param {number} ox  Horizontal offset (+right, –left)   [default 0]
 * @param {number} oy  Vertical offset (+down, –up)        [default 0]
 */
export default function useFollowCursor(ref, active, ox = 0, oy = 0) {
  const target = useRef({ x: 0, y: 0 });  // latest pointer coords
  const animId = useRef(null);

  useEffect(() => {
    if (!active) return;

    const el = ref.current;
    if (!el) return;
    Object.assign(el.style, { position: 'fixed', pointerEvents: 'none' });

    /* ---------- pointer tracker ---------- */
    const handleMove = ({ clientX: x, clientY: y }) => {
      target.current = { x, y };
    };
    window.addEventListener('mousemove', handleMove);

    /* ---------- inertia animation loop ---------- */
    const ease = 0.05;           // 0 < ease ≤ 1  (lower = more lag)
    const step = () => {
      const { x, y } = target.current;
      const w = el.offsetWidth;
      const h = el.offsetHeight;

      // Desired position: bottom‑touches‑cursor (minus offset)
      const destX = x + ox;             
      const destY = y + oy - h;                  // bottom at cursor

      // Current numeric left/top (fall back to dest first frame)
      const curX = parseFloat(el.style.left) || destX;
      const curY = parseFloat(el.style.top)  || destY;

      // Interpolate
      const nextX = curX + (destX - curX) * ease;
      const nextY = curY + (destY - curY) * ease;

      // Clamp inside viewport (4 px margin)
      const maxX = window.innerWidth  - w - 4;
      const maxY = window.innerHeight - h - 4;
      el.style.left = `${Math.min(Math.max(4, nextX), maxX)}px`;
      el.style.top  = `${Math.min(Math.max(4, nextY), maxY)}px`;

      animId.current = requestAnimationFrame(step);
    };
    step(); // kick off

    /* ---------- cleanup ---------- */
    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animId.current);
    };
  }, [ref, active, ox, oy]);
}
