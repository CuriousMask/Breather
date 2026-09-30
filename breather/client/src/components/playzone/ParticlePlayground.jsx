import React, { useRef, useEffect, useCallback } from 'react';
import styles from './PlayGame.module.css';

const PALETTES = [
  ['#7DA7D9','#C7B8EA','#A5C89F'],
  ['#F9A8D4','#FCD34D','#86EFAC'],
  ['#818CF8','#34D399','#FB923C'],
];

export default function ParticlePlayground() {
  const canvasRef   = useRef(null);
  const particles   = useRef([]);
  const mouse       = useRef({ x: -999, y: -999, down: false });
  const animRef     = useRef();
  const paletteIdx  = useRef(0);
  const palette     = useRef(PALETTES[0]);

  const spawn = useCallback((x, y, count = 6) => {
    const pal = palette.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      particles.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        decay: 0.012 + Math.random() * 0.016,
        r: 3 + Math.random() * 8,
        color: pal[Math.floor(Math.random() * pal.length)],
      });
    }
    // Limit total
    if (particles.current.length > 400) particles.current = particles.current.slice(-400);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.fillStyle = 'rgba(15,20,35,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mouse.current.down) spawn(mouse.current.x, mouse.current.y, 3);

      particles.current = particles.current.filter((p) => p.life > 0);

      particles.current.forEach((p) => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.06;       // gravity
        p.vx *= 0.99;
        p.life -= p.decay;

        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [spawn]);

  const getXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const onMove  = (e) => { const p = getXY(e); mouse.current = { ...p, down: mouse.current.down }; if (mouse.current.down) spawn(p.x, p.y, 4); };
  const onDown  = (e) => { const p = getXY(e); mouse.current = { ...p, down: true }; spawn(p.x, p.y, 10); };
  const onUp    = ()  => { mouse.current.down = false; };
  const changePalette = () => { paletteIdx.current = (paletteIdx.current + 1) % PALETTES.length; palette.current = PALETTES[paletteIdx.current]; };

  return (
    <div className={styles.gameArea} style={{ background: '#0f1423' }}>
      <div className={styles.gameHint} style={{ color: 'rgba(255,255,255,0.7)' }}>✨ Click or drag to make particles!</div>
      <button className={styles.paletteBtn} onClick={changePalette}>🎨 Change Colors</button>
      <canvas
        ref={canvasRef}
        className={styles.particleCanvas}
        onMouseMove={onMove} onMouseDown={onDown} onMouseUp={onUp}
        onTouchMove={onMove} onTouchStart={onDown} onTouchEnd={onUp}
        aria-label="Particle playground canvas"
      />
    </div>
  );
}
