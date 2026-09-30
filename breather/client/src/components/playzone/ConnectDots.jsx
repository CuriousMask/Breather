import React, { useRef, useEffect, useCallback, useState } from 'react';
import styles from './PlayGame.module.css';

const DOT_COUNT  = 18;
const DOT_RADIUS = 10;

const generateDots = (w, h) =>
  Array.from({ length: DOT_COUNT }, (_, i) => ({
    id: i,
    x: DOT_RADIUS * 2 + Math.random() * (w - DOT_RADIUS * 4),
    y: DOT_RADIUS * 2 + Math.random() * (h - DOT_RADIUS * 4),
    color: ['#7DA7D9','#C7B8EA','#A5C89F','#F9A8D4'][i % 4],
    connected: false,
  }));

export default function ConnectDots() {
  const canvasRef  = useRef(null);
  const dotsRef    = useRef([]);
  const linesRef   = useRef([]);
  const dragging   = useRef(null);
  const mousePos   = useRef({ x: 0, y: 0 });
  const animRef    = useRef();
  const [connections, setConnections] = useState(0);

  const reset = useCallback(() => {
    const c = canvasRef.current;
    dotsRef.current = generateDots(c.width, c.height);
    linesRef.current = [];
    setConnections(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    dotsRef.current = generateDots(canvas.width, canvas.height);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Completed lines
      linesRef.current.forEach((l) => {
        ctx.beginPath();
        ctx.strokeStyle = l.color + 'aa';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
      });

      // Active drag line
      if (dragging.current !== null) {
        const d = dotsRef.current[dragging.current];
        ctx.beginPath();
        ctx.strokeStyle = d.color + '88';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(mousePos.current.x, mousePos.current.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Dots
      dotsRef.current.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = d.color + (d.connected ? 'ff' : 'bb');
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const hitDot = (x, y) => {
    return dotsRef.current.findIndex((d) => Math.hypot(d.x - x, d.y - y) < DOT_RADIUS + 4);
  };

  const getXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const onDown = (e) => {
    const { x, y } = getXY(e);
    const i = hitDot(x, y);
    if (i !== -1) dragging.current = i;
  };

  const onMove = (e) => {
    const { x, y } = getXY(e);
    mousePos.current = { x, y };
  };

  const onUp = (e) => {
    if (dragging.current === null) return;
    const { x, y } = getXY(e);
    const target = hitDot(x, y);
    if (target !== -1 && target !== dragging.current) {
      const from = dotsRef.current[dragging.current];
      const to   = dotsRef.current[target];
      linesRef.current.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, color: from.color });
      dotsRef.current[dragging.current].connected = true;
      dotsRef.current[target].connected = true;
      setConnections((c) => c + 1);
    }
    dragging.current = null;
  };

  return (
    <div className={styles.gameArea}>
      <div className={styles.gameHint}>🔗 Drag from dot to dot to connect them!</div>
      <div className={styles.gameScore}>Lines: {connections}</div>
      <button className={styles.resetBtn} onClick={reset}>🔄 Reset</button>
      <canvas
        ref={canvasRef} className={styles.particleCanvas}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
        aria-label="Connect dots canvas"
      />
    </div>
  );
}
