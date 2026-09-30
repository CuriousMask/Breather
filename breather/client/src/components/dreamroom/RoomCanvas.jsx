import React, { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROOM_OBJECTS, LIGHTING_OPTIONS } from './roomObjects';
import styles from './RoomCanvas.module.css';

/* ─── Perspective room floor/wall ─── */
const RoomBackground = ({ wallColor, floorColor, lighting }) => {
  const lightOpt = LIGHTING_OPTIONS.find((l) => l.id === lighting);
  return (
    <div className={styles.roomBg} aria-hidden="true">
      {/* Wall */}
      <div className={styles.wall} style={{ background: wallColor }} />
      {/* Floor with perspective */}
      <div className={styles.floor} style={{ background: floorColor }} />
      {/* Skirting board */}
      <div className={styles.skirtingBoard} style={{ background: `color-mix(in srgb, ${floorColor}, #000 20%)` }} />
      {/* Lighting overlay */}
      {lightOpt && <div className={styles.lightOverlay} style={{ background: lightOpt.overlay }} />}
      {/* Window light beam */}
      {(lighting === 'bright' || lighting === 'warm') && (
        <motion.div
          className={styles.lightBeam}
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
};

/* ─── Selection controls ─── */
const SelectionControls = ({ onScale, onRotate, onRemove }) => (
  <motion.div
    className={styles.controls}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
  >
    <button className={styles.controlBtn} onClick={() => onScale(0.1)}  title="Scale up">+</button>
    <button className={styles.controlBtn} onClick={() => onScale(-0.1)} title="Scale down">−</button>
    <button className={styles.controlBtn} onClick={() => onRotate(45)}  title="Rotate">↻</button>
    <button className={`${styles.controlBtn} ${styles.removeBtn}`} onClick={onRemove} title="Remove">✕</button>
  </motion.div>
);

/* ─── Placed room object ─── */
const PlacedObject = ({ obj, isSelected, onSelect, onDragEnd, onScale, onRotate, onRemove }) => {
  const def  = ROOM_OBJECTS.find((d) => d.id === obj.variant || d.type === obj.type);
  const emoji = def?.icon || '📦';
  const size  = 48 * (obj.scale || 1);

  return (
    <motion.div
      className={`${styles.placedObject} ${isSelected ? styles.selectedObj : ''}`}
      style={{
        left: `${obj.x}%`, top: `${obj.y}%`,
        zIndex: isSelected ? 999 : (obj.zIndex || 1),
        width: size, height: size, fontSize: size * 0.75,
        transform: `translate(-50%, -50%) rotate(${obj.rotation || 0}deg)`,
      }}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const el = document.querySelector(`[data-obj-id="${obj.id}"]`);
        const canvas = el?.closest('[data-canvas]');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const xPct = ((info.point.x - rect.left) / rect.width)  * 100;
        const yPct = ((info.point.y - rect.top)  / rect.height) * 100;
        onDragEnd(obj.id, Math.max(2, Math.min(98, xPct)), Math.max(2, Math.min(98, yPct)));
      }}
      data-obj-id={obj.id}
      onClick={(e) => { e.stopPropagation(); onSelect(obj.id); }}
      whileHover={{ scale: (obj.scale || 1) * 1.06 }}
      whileDrag={{ scale: (obj.scale || 1) * 1.1, zIndex: 999 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      role="button"
      aria-label={`${def?.label || obj.type}, click to select`}
    >
      <span className={styles.objEmoji} aria-hidden="true">{emoji}</span>

      {isSelected && (
        <SelectionControls
          onScale={(d) => onScale(obj.id, (obj.scale || 1) + d)}
          onRotate={(d) => onRotate(obj.id, d)}
          onRemove={() => onRemove(obj.id)}
        />
      )}
    </motion.div>
  );
};

/* ─── Canvas ─── */
const RoomCanvas = ({ objects, wallColor, floorColor, lighting, selected, setSelected, onDrop, onDragEnd, onScale, onRotate, onRemove }) => {
  const canvasRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    try {
      const { id, type, defaultScale } = JSON.parse(data);
      const rect = canvasRef.current.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width)  * 100;
      const yPct = ((e.clientY - rect.top)  / rect.height) * 100;
      onDrop(id, type, Math.max(4, Math.min(96, xPct)), Math.max(4, Math.min(96, yPct)), defaultScale);
    } catch {/* ignore */}
  }, [onDrop]);

  return (
    <div
      ref={canvasRef}
      data-canvas
      className={styles.canvas}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
      onClick={() => setSelected(null)}
      role="application"
      aria-label="Dream room canvas"
    >
      <RoomBackground wallColor={wallColor} floorColor={floorColor} lighting={lighting} />

      {objects.length === 0 && (
        <motion.div
          className={styles.emptyHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>🛋️ Drag furniture from the panel and drop it here</p>
        </motion.div>
      )}

      <AnimatePresence>
        {objects.map((obj) => (
          <PlacedObject
            key={obj.id}
            obj={obj}
            isSelected={selected === obj.id}
            onSelect={setSelected}
            onDragEnd={onDragEnd}
            onScale={onScale}
            onRotate={onRotate}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>

      {selected && (
        <div className={styles.selHint}>
          Drag to move · Use +/− to resize · ↻ to rotate · ✕ to remove
        </div>
      )}
    </div>
  );
};

export default RoomCanvas;
