import { useRef, useState, useCallback, useEffect } from 'react';

const MAX_HISTORY = 30;

const useCanvas = () => {
  const canvasRef    = useRef(null);
  const ctxRef       = useRef(null);
  const isDrawing    = useRef(false);
  const lastPos      = useRef({ x: 0, y: 0 });
  const historyRef   = useRef([]);
  const historyIdx   = useRef(-1);

  const [tool,      setTool]      = useState('brush');  // brush | eraser | line | rect | circle | fill
  const [color,     setColor]     = useState('#7DA7D9');
  const [brushSize, setBrushSize] = useState(8);
  const [opacity,   setOpacity]   = useState(1);
  const [canUndo,   setCanUndo]   = useState(false);
  const [canRedo,   setCanRedo]   = useState(false);

  /* ── Init canvas ── */
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
    ctx.lineCap    = 'round';
    ctx.lineJoin   = 'round';
    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveSnapshot();
  }, []);

  /* ── Save snapshot to history ── */
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snap = canvas.toDataURL();
    const newHistory = historyRef.current.slice(0, historyIdx.current + 1);
    newHistory.push(snap);
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    historyRef.current = newHistory;
    historyIdx.current = newHistory.length - 1;
    setCanUndo(historyIdx.current > 0);
    setCanRedo(false);
  }, []);

  /* ── Undo ── */
  const undo = useCallback(() => {
    if (historyIdx.current <= 0) return;
    historyIdx.current -= 1;
    const img = new Image();
    img.src = historyRef.current[historyIdx.current];
    img.onload = () => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    setCanUndo(historyIdx.current > 0);
    setCanRedo(true);
  }, []);

  /* ── Redo ── */
  const redo = useCallback(() => {
    if (historyIdx.current >= historyRef.current.length - 1) return;
    historyIdx.current += 1;
    const img = new Image();
    img.src = historyRef.current[historyIdx.current];
    img.onload = () => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    setCanUndo(true);
    setCanRedo(historyIdx.current < historyRef.current.length - 1);
  }, []);

  /* ── Clear canvas ── */
  const clearCanvas = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveSnapshot();
  }, [saveSnapshot]);

  /* ── Get position relative to canvas ── */
  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    };
  }, []);

  /* ── Bucket fill (flood fill) ── */
  const bucketFill = useCallback((x, y) => {
    const canvas = canvasRef.current;
    const ctx    = ctxRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data   = imageData.data;
    const px     = Math.floor(x);
    const py     = Math.floor(y);
    const idx    = (py * canvas.width + px) * 4;
    const target = [data[idx], data[idx+1], data[idx+2], data[idx+3]];

    // Parse fill color
    const tmp = document.createElement('canvas');
    tmp.width = tmp.height = 1;
    const tc  = tmp.getContext('2d');
    tc.fillStyle = color;
    tc.fillRect(0, 0, 1, 1);
    const fill = Array.from(tc.getImageData(0, 0, 1, 1).data);

    if (target.every((v, i) => v === fill[i])) return;

    const stack = [[px, py]];
    const visited = new Uint8Array(canvas.width * canvas.height);

    const matchTarget = (i) =>
      data[i]===target[0] && data[i+1]===target[1] && data[i+2]===target[2] && data[i+3]===target[3];

    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cy < 0 || cx >= canvas.width || cy >= canvas.height) continue;
      const ci = cy * canvas.width + cx;
      if (visited[ci]) continue;
      visited[ci] = 1;
      const di = ci * 4;
      if (!matchTarget(di)) continue;
      data[di]   = fill[0];
      data[di+1] = fill[1];
      data[di+2] = fill[2];
      data[di+3] = fill[3];
      stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }

    ctx.putImageData(imageData, 0, 0);
    saveSnapshot();
  }, [color, saveSnapshot]);

  /* ── Start drawing ── */
  const startDraw = useCallback((e) => {
    e.preventDefault();
    const pos = getPos(e);
    const ctx = ctxRef.current;

    if (tool === 'fill') { bucketFill(pos.x, pos.y); return; }

    isDrawing.current = true;
    lastPos.current   = pos;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    if (tool === 'brush' || tool === 'eraser') {
      ctx.globalAlpha       = tool === 'eraser' ? 1 : opacity;
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color;
      ctx.lineWidth   = brushSize;
      ctx.lineTo(pos.x + 0.1, pos.y + 0.1);
      ctx.stroke();
    }
  }, [tool, color, brushSize, opacity, getPos, bucketFill]);

  /* ── Drawing ── */
  const draw = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const pos = getPos(e);
    const ctx = ctxRef.current;

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  }, [tool, getPos]);

  /* ── End drawing ── */
  const endDraw = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = ctxRef.current;
    const pos = getPos(e);

    if (tool === 'line') {
      ctx.globalAlpha = opacity;
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth   = brushSize;
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'rect') {
      ctx.globalAlpha = opacity;
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth   = brushSize;
      ctx.strokeRect(
        lastPos.current.x, lastPos.current.y,
        pos.x - lastPos.current.x, pos.y - lastPos.current.y
      );
    } else if (tool === 'circle') {
      ctx.globalAlpha = opacity;
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth   = brushSize;
      const rx = (pos.x - lastPos.current.x) / 2;
      const ry = (pos.y - lastPos.current.y) / 2;
      ctx.beginPath();
      ctx.ellipse(
        lastPos.current.x + rx, lastPos.current.y + ry,
        Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2
      );
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    isDrawing.current = false;
    saveSnapshot();
  }, [tool, color, brushSize, opacity, getPos, saveSnapshot]);

  /* ── Export canvas as base64 ── */
  const exportCanvas = useCallback(() => {
    return canvasRef.current?.toDataURL('image/png');
  }, []);

  return {
    canvasRef, tool, color, brushSize, opacity,
    canUndo, canRedo,
    setTool, setColor, setBrushSize, setOpacity,
    initCanvas, startDraw, draw, endDraw,
    undo, redo, clearCanvas, exportCanvas,
  };
};

export default useCanvas;
