import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ─── Cursor variant definitions ──────────────────────────────────────────────
// NOTE: mix-blend-mode is intentionally NOT used — it causes invisibility on
// light/white backgrounds (admin pages, forms, modals). We use solid gold instead.
const VARIANTS = {
  default: {
    width: 22,
    height: 22,
    backgroundColor: 'transparent',
    border: '1.5px solid #C9A84C',
    opacity: 1,
  },
  button: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(201,168,76,0.18)',
    border: '1.5px solid #C9A84C',
    opacity: 1,
  },
  link: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(201,168,76,0.12)',
    border: '1.5px solid #C9A84C',
    opacity: 1,
  },
  card: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(201,168,76,0.10)',
    border: '1px solid #C9A84C',
    opacity: 1,
  },
  input: {
    width: 4,
    height: 28,
    backgroundColor: '#C9A84C',
    border: 'none',
    borderRadius: '2px',
    opacity: 1,
  },
};

// Determine variant from a DOM element
const getVariant = (el) => {
  if (!el) return 'default';
  // Walk up max 6 levels to find a matching ancestor
  let node = el;
  for (let i = 0; i < 6; i++) {
    if (!node || node === document.body) break;
    const tag = node.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'input';
    if (tag === 'button' || node.getAttribute?.('role') === 'button') return 'button';
    if (node.getAttribute?.('data-cursor') === 'magnetic') return 'button';
    if (node.classList?.contains('cursor-card')) return 'card';
    if (tag === 'a') return 'link';
    node = node.parentElement;
  }
  return 'default';
};

// Computed once at module level — never changes after first load
const IS_TOUCH_DEVICE =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const MagneticCursor = () => {
  const [variant, setVariant] = useState('default');
  const [isClicking, setIsClicking] = useState(false);
  const [hasMoved, setHasMoved] = useState(false); // hide until first mousemove

  const magnetTarget = useRef(null);

  // ── Raw mouse position ────────────────────────────────────────────────────
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // ── Derived position (with optional magnet lerp) ──────────────────────────
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  // ── Springs ───────────────────────────────────────────────────────────────
  // Ring: slightly lagged for premium feel
  const ringX = useSpring(cursorX, { stiffness: 320, damping: 28, mass: 0.4 });
  const ringY = useSpring(cursorY, { stiffness: 320, damping: 28, mass: 0.4 });
  // Dot: tight, almost instant
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 38 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 38 });

  const syncCursorPos = useCallback(() => {
    const mx = mouseX.get();
    const my = mouseY.get();
    if (magnetTarget.current) {
      const { centerX, centerY, strength } = magnetTarget.current;
      const f = Math.min(strength, 1) * 0.65;
      cursorX.set(mx + (centerX - mx) * f);
      cursorY.set(my + (centerY - my) * f);
    } else {
      cursorX.set(mx);
      cursorY.set(my);
    }
  }, [mouseX, mouseY, cursorX, cursorY]);

  useEffect(() => {
    if (IS_TOUCH_DEVICE) return;

    // ── Mouse tracking ────────────────────────────────────────────────────
    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      syncCursorPos();
      if (!hasMoved) setHasMoved(true);
    };

    // ── Click state ───────────────────────────────────────────────────────
    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    // ── Magnet events ─────────────────────────────────────────────────────
    const onMagnetOn = (e) => {
      magnetTarget.current = e.detail;
      syncCursorPos();
    };
    const onMagnetOff = () => {
      magnetTarget.current = null;
      syncCursorPos();
    };

    // ── Global hover delegation (single listener, no per-element attach) ──
    // This avoids the duplicate-listener buildup from MutationObserver spam.
    const onMouseOver = (e) => {
      setVariant(getVariant(e.target));
    };
    const onMouseOut = (e) => {
      // Only reset when leaving to a non-child target
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setVariant('default');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('magnetic-active', onMagnetOn);
    window.addEventListener('magnetic-inactive', onMagnetOff);
    document.documentElement.addEventListener('mouseover', onMouseOver);
    document.documentElement.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('magnetic-active', onMagnetOn);
      window.removeEventListener('magnetic-inactive', onMagnetOff);
      document.documentElement.removeEventListener('mouseover', onMouseOver);
      document.documentElement.removeEventListener('mouseout', onMouseOut);
    };
  }, [mouseX, mouseY, cursorX, cursorY, syncCursorPos, hasMoved]);

  // Don't render on touch devices
  if (IS_TOUCH_DEVICE) return null;

  const v = VARIANTS[variant] ?? VARIANTS.default;
  const isInputMode = variant === 'input';

  return (
    <>
      {/* ── Outer ring ────────────────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 2147483647, // max z-index — always on top
          pointerEvents: 'none',
          borderRadius: isInputMode ? '2px' : '50%',
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          width: v.width,
          height: v.height,
          backgroundColor: v.backgroundColor,
          border: v.border,
          borderRadius: isInputMode ? '2px' : '50%',
          scale: isClicking ? 0.85 : 1,
          opacity: hasMoved ? 1 : 0,
        }}
        transition={{
          width: { type: 'spring', stiffness: 260, damping: 22 },
          height: { type: 'spring', stiffness: 260, damping: 22 },
          backgroundColor: { duration: 0.15 },
          border: { duration: 0.15 },
          borderRadius: { duration: 0.15 },
          scale: { type: 'spring', stiffness: 400, damping: 20 },
          opacity: { duration: 0.3 },
        }}
      />

      {/* ── Inner dot ─────────────────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          backgroundColor: '#C9A84C',
          borderRadius: '50%',
          zIndex: 2147483647,
          pointerEvents: 'none',
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{ opacity: hasMoved ? 1 : 0 }}
        transition={{ opacity: { duration: 0.3 } }}
      />
    </>
  );
};

export default MagneticCursor;
