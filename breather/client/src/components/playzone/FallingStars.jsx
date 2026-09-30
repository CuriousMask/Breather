import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './PlayGame.module.css';

const STAR_EMOJIS = ['⭐','🌟','✨','💫','🌠'];

const makeStar = (id) => ({
  id,
  x: Math.random() * 94,
  y: -8,
  size: 1.2 + Math.random() * 1.6,
  speed: 0.015 + Math.random() * 0.025,
  emoji: STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)],
  wobble: (Math.random() - 0.5) * 0.006,
  caught: false,
});

export default function FallingStars() {
  const [stars,   setStars]   = useState(() => Array.from({ length: 8 }, (_, i) => makeStar(i)));
  const [caught,  setCaught]  = useState(0);
  const [trail,   setTrail]   = useState([]);
  const nextId  = useRef(20);
  const animRef = useRef();

  useEffect(() => {
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;
      setStars((prev) => {
        const next = prev
          .map((s) => ({ ...s, y: s.y + s.speed * dt, x: s.x + s.wobble * dt }))
          .filter((s) => s.y < 108);
        // Spawn if below threshold
        while (next.length < 8) next.push(makeStar(nextId.current++));
        return next;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const catchStar = useCallback((id, x, y) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
    setCaught((c) => c + 1);
    setTrail((t) => [...t.slice(-12), { id: Date.now(), x, y }]);
  }, []);

  return (
    <div
      className={styles.gameArea}
      style={{ background: 'linear-gradient(180deg, #020614 0%, #0d1b2a 60%, #1a2744 100%)' }}
      role="application" aria-label="Falling Stars game"
    >
      <div className={styles.gameHint} style={{ color: 'rgba(255,255,255,0.7)' }}>⭐ Catch the falling stars!</div>
      <div className={styles.gameScore} style={{ color: 'rgba(255,255,255,0.8)' }}>Caught: {caught}</div>

      {stars.map((s) => (
        <button
          key={s.id}
          className={styles.fallingItem}
          style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: `${s.size}rem` }}
          onClick={() => catchStar(s.id, s.x, s.y)}
          aria-label="Catch star"
        >
          {s.emoji}
        </button>
      ))}

      {trail.map((t) => (
        <div key={t.id} className={styles.trailEffect} style={{ left: `${t.x}%`, top: `${t.y}%` }}>
          💥
        </div>
      ))}
    </div>
  );
}
