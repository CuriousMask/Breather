import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PlayGame.module.css';

const COLORS = ['#7DA7D9','#C7B8EA','#A5C89F','#F9A8D4','#FCD34D','#86EFAC','#93C5FD'];

const randomBubble = (id) => ({
  id,
  x: 5 + Math.random() * 85,
  y: 5 + Math.random() * 85,
  r: 24 + Math.random() * 32,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
});

export default function BubblePop() {
  const [bubbles,  setBubbles]  = useState(() => Array.from({ length: 14 }, (_, i) => randomBubble(i)));
  const [pops,     setPops]     = useState([]);
  const [count,    setCount]    = useState(0);
  const nextId = useRef(20);
  const animRef = useRef();

  /* Gentle drift */
  useEffect(() => {
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      setBubbles((prev) =>
        prev.map((b) => {
          let nx = b.x + b.vx * dt * 0.05;
          let ny = b.y + b.vy * dt * 0.05;
          let vx = b.vx; let vy = b.vy;
          if (nx < 2 || nx > 96) { vx = -vx; nx = Math.max(2, Math.min(96, nx)); }
          if (ny < 2 || ny > 96) { vy = -vy; ny = Math.max(2, Math.min(96, ny)); }
          return { ...b, x: nx, y: ny, vx, vy };
        })
      );
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const pop = useCallback((id, x, y) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setCount((c) => c + 1);
    setPops((p) => [...p, { id: Date.now(), x, y }]);
    setTimeout(() => setPops((p) => p.filter((pp) => pp.id !== Date.now())), 600);
    // Spawn a new one after a short delay
    setTimeout(() => {
      setBubbles((prev) => [...prev, randomBubble(nextId.current++)]);
    }, 1200);
  }, []);

  return (
    <div className={styles.gameArea} role="application" aria-label="Bubble Pop game">
      <div className={styles.gameHint}>🫧 Tap the bubbles!</div>
      <div className={styles.gameScore}>Popped: {count}</div>

      {bubbles.map((b) => (
        <motion.button
          key={b.id}
          className={styles.bubble}
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.r * 2, height: b.r * 2, background: `radial-gradient(circle at 35% 35%, ${b.color}cc, ${b.color}66)`, border: `2px solid ${b.color}88` }}
          onClick={() => pop(b.id, b.x, b.y)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.85 }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Pop bubble"
        />
      ))}

      <AnimatePresence>
        {pops.map((p) => (
          <motion.div
            key={p.id}
            className={styles.popEffect}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
