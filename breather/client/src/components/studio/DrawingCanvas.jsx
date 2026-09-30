import React, { useEffect, useRef } from 'react';
import styles from './DrawingCanvas.module.css';

const DrawingCanvas = ({ canvasRef, onStart, onDraw, onEnd, onInit, tool }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      // Preserve content on resize by saving/restoring
      const tmp = canvas.toDataURL();
      canvas.width  = width;
      canvas.height = height;
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        onInit();
      };
      img.src = tmp || '';
      if (!tmp) onInit();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(containerRef.current);
    resize();
    return () => ro.disconnect();
  }, []);                           // eslint-disable-line react-hooks/exhaustive-deps

  const cursorMap = {
    brush:  'crosshair',
    eraser: 'cell',
    line:   'crosshair',
    rect:   'crosshair',
    circle: 'crosshair',
    fill:   'copy',
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ cursor: cursorMap[tool] || 'crosshair' }}
        onMouseDown={onStart}
        onMouseMove={onDraw}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onStart}
        onTouchMove={onDraw}
        onTouchEnd={onEnd}
        aria-label="Drawing canvas"
        role="img"
      />
    </div>
  );
};

export default DrawingCanvas;
