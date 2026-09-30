import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import DrawingCanvas from '../components/studio/DrawingCanvas';
import StudioToolbar from '../components/studio/StudioToolbar';
import useCanvas from '../hooks/useCanvas';
import { studioService } from '../services/studioService';
import styles from './CreativeStudioPage.module.css';

const PROMPTS = [
  'Draw something inspired by nature 🌿',
  "Sketch a place you'd love to visit ✈️",
  'Draw your current mood as a shape 🎭',
  'Create a pattern using only circles ⭕',
  'Draw what peace looks like to you 🕊️',
  'Sketch a dream landscape 🌄',
  'Draw something that makes you smile 😊',
  'Create a portrait of your ideal day ☀️',
];

const CreativeStudioPage = () => {
  const {
    canvasRef, tool, color, brushSize, opacity, canUndo, canRedo,
    setTool, setColor, setBrushSize, setOpacity,
    initCanvas, startDraw, draw, endDraw,
    undo, redo, clearCanvas, exportCanvas,
  } = useCanvas();

  const [prompt,      setPrompt]     = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [saveStatus,  setSaveStatus] = useState('idle');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [drawingTitle,  setDrawingTitle]  = useState('');
  const titleRef = useRef(null);

  const newPrompt = () => setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const canvasData = exportCanvas();
      await studioService.saveCreation({
        title: drawingTitle || 'Untitled',
        canvasData,
        prompt,
        thumbnail: canvasData,
      });
      setSaveStatus('saved');
      setShowSaveModal(false);
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `breather-drawing-${Date.now()}.png`;
    link.href = exportCanvas();
    link.click();
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ── Top bar ── */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <span className={styles.topIcon}>🎨</span>
            <div>
              <h1 className={styles.topTitle}>Creative Studio</h1>
              <p className={styles.topSub}>Make Something</p>
            </div>
          </div>

          <div className={styles.promptBanner}>
            <span className={styles.promptText}>{prompt}</span>
            <button className={styles.promptRefresh} onClick={newPrompt} title="New prompt">🔄</button>
          </div>

          <div className={styles.topActions}>
            {saveStatus === 'saved'  && <span className={styles.statusBadge}>✅ Saved!</span>}
            {saveStatus === 'error'  && <span className={styles.statusBadgeErr}>❌ Error</span>}
            <button className={styles.dlBtn}   onClick={handleDownload}>⬇ Download</button>
            <button className={styles.saveBtn} onClick={() => setShowSaveModal(true)}>💾 Save</button>
          </div>
        </div>

        {/* ── Workspace ── */}
        <div className={styles.workspace}>
          <StudioToolbar
            tool={tool} color={color} brushSize={brushSize} opacity={opacity}
            canUndo={canUndo} canRedo={canRedo}
            onToolChange={setTool} onColorChange={setColor}
            onBrushSizeChange={setBrushSize} onOpacityChange={setOpacity}
            onUndo={undo} onRedo={redo} onClear={clearCanvas}
          />
          <div className={styles.canvasArea}>
            <DrawingCanvas
              canvasRef={canvasRef}
              onStart={startDraw} onDraw={draw} onEnd={endDraw}
              onInit={initCanvas} tool={tool}
            />
          </div>
        </div>

        {/* ── Save modal ── */}
        <AnimatePresence>
          {showSaveModal && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSaveModal(false)}
            >
              <motion.div
                className={styles.modal}
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={styles.modalTitle}>💾 Save Drawing</h3>
                <input
                  ref={titleRef}
                  className={styles.modalInput}
                  placeholder="Give it a name…"
                  value={drawingTitle}
                  onChange={(e) => setDrawingTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                <div className={styles.modalActions}>
                  <button className={styles.modalCancel} onClick={() => setShowSaveModal(false)}>Cancel</button>
                  <button
                    className={styles.modalSave}
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving' ? 'Saving…' : 'Save Drawing'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default CreativeStudioPage;
