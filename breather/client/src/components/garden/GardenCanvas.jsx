import React, { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GARDEN_OBJECTS } from './gardenObjects';
import styles from './GardenCanvas.module.css';

/* ─── Sky colours per environment ─── */
const ENV_STYLES = {
  day:     { sky: 'linear-gradient(180deg, #87CEEB 0%, #B8E0F7 50%, #E8F5E9 70%, #86EFAC 100%)', sun: '☀️' },
  night:   { sky: 'linear-gradient(180deg, #0d1b2a 0%, #1a2744 40%, #2d3f6e 70%, #1a3a2a 100%)', sun: '🌕' },
  sunset:  { sky: 'linear-gradient(180deg, #FF6B35 0%, #F7C59F 30%, #EFEFD0 60%, #86EFAC 100%)', sun: '🌅' },
  sunrise: { sky: 'linear-gradient(180deg, #FF9A3C 0%, #FFCC70 30%, #C5E8F7 60%, #86EFAC 100%)', sun: '🌄' },
};

/* ─── Weather particles ─── */
const RainDrop = ({ style }) => (
  <motion.div
    className={styles.raindrop}
    style={style}
    animate={{ y: ['-10%', '110%'] }}
    transition={{ duration: 0.8 + Math.random() * 0.6, repeat: Infinity, ease: 'linear', delay: Math.random() * 1.5 }}
  />
);

const SnowFlake = ({ style }) => (
  <motion.div
    className={styles.snowflake}
    style={style}
    animate={{ y: ['-5%', '105%'], x: [0, 20, -10, 15, 0], rotate: [0, 360] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'linear', delay: Math.random() * 3 }}
  >
    ❄️
  </motion.div>
);

const WeatherLayer = ({ weather }) => {
  if (weather === 'clear') return null;
  if (weather === 'rain') return (
    <div className={styles.weatherLayer} aria-hidden="true">
      {Array.from({ length: 40 }, (_, i) => (
        <RainDrop key={i} style={{ left: `${(i / 40) * 100}%`, width: '1.5px', height: '18px', background: 'rgba(59,130,246,0.45)' }} />
      ))}
    </div>
  );
  if (weather === 'snow') return (
    <div className={styles.weatherLayer} aria-hidden="true">
      {Array.from({ length: 20 }, (_, i) => (
        <SnowFlake key={i} style={{ left: `${Math.random() * 100}%`, fontSize: `${0.6 + Math.random() * 0.6}rem` }} />
      ))}
    </div>
  );
  if (weather === 'cloudy') return (
    <div className={styles.weatherLayer} aria-hidden="true">
      {[10, 30, 55, 70, 85].map((left, i) => (
        <motion.div key={i} className={styles.cloud} style={{ left: `${left}%`, top: `${5 + i * 4}%` }}
          animate={{ x: [0, 20, 0] }} transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}>☁️</motion.div>
      ))}
    </div>
  );
  if (weather === 'fog') return (
    <div className={styles.fogLayer} aria-hidden="true">
      <motion.div className={styles.fogStrip}
        animate={{ opacity: [0.4, 0.7, 0.4], x: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  );
  return null;
};

const Stars = () => (
  <div className={styles.stars} aria-hidden="true">
    {Array.from({ length: 60 }, (_, i) => (
      <motion.div key={i} className={styles.star}
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 55}%`, width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px` }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }} />
    ))}
  </div>
);

/* ─── BUG FIX: resolve object definition by variant id first, then fallback to type match ─── */
const resolveObjectDef = (obj) =>
  GARDEN_OBJECTS.find((d) => d.id === obj.variant) ||
  GARDEN_OBJECTS.find((d) => d.id === obj.type)    ||
  GARDEN_OBJECTS.find((d) => d.type === obj.type)  ||
  null;

/* ─── Selection controls for scale/rotate/remove ─── */
const GardenObjectControls = ({ obj, onScale, onRotate, onRemove }) => (
  <motion.div
    className={styles.controls}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    onClick={(e) => e.stopPropagation()}
  >
    <button className={styles.ctrlBtn} onClick={() => onScale(obj.id, Math.min(3, (obj.scale || 1) + 0.15))} title="Scale up" aria-label="Scale up">＋</button>
    <button className={styles.ctrlBtn} onClick={() => onScale(obj.id, Math.max(0.3, (obj.scale || 1) - 0.15))} title="Scale down" aria-label="Scale down">－</button>
    <button className={styles.ctrlBtn} onClick={() => onRotate(obj.id, 45)} title="Rotate 45°" aria-label="Rotate">↻</button>
    <button className={`${styles.ctrlBtn} ${styles.ctrlRemove}`} onClick={() => onRemove(obj.id)} title="Remove" aria-label="Remove object">✕</button>
  </motion.div>
);

/* ─── Placed object ─── */
const PlacedObject = ({ obj, isSelected, onSelect, onDragEnd, onScale, onRotate, onRemove }) => {
  const def   = resolveObjectDef(obj);
  const emoji = def?.icon || '🌿';
  const size  = 44 * (obj.scale || 1);

  return (
    <motion.div
      className={`${styles.placedObject} ${isSelected ? styles.selected : ''}`}
      style={{
        left: obj.x,
        top:  obj.y,
        zIndex: isSelected ? 999 : (obj.zIndex || 1),
        width:  size,
        height: size,
        fontSize: size * 0.75,
        rotate: obj.rotation || 0,
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(e, info) => onDragEnd(obj.id, info.point.x, info.point.y, e.target)}
      onClick={(e) => { e.stopPropagation(); onSelect(obj.id); }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={!isSelected ? { scale: (obj.scale || 1) * 1.08 } : {}}
      whileDrag={{ scale: (obj.scale || 1) * 1.12, zIndex: 999, cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      role="button"
      aria-label={`${def?.label || obj.type} — selected: ${isSelected}`}
      aria-pressed={isSelected}
    >
      <span className={styles.objectEmoji} aria-hidden="true">{emoji}</span>

      {isSelected && (
        <GardenObjectControls
          obj={obj}
          onScale={onScale}
          onRotate={onRotate}
          onRemove={onRemove}
        />
      )}
    </motion.div>
  );
};

/* ─── Canvas ─── */
const GardenCanvas = ({
  objects, environment, weather, selected, setSelected,
  onDrop, onDragEnd, onRemove, onScale, onRotate,
}) => {
  const canvasRef = useRef(null);
  const envStyle  = ENV_STYLES[environment] || ENV_STYLES.day;
  const isNight   = environment === 'night';

  const handleCanvasDrop = useCallback((e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;
    try {
      const { type, variant } = JSON.parse(raw);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 22;
      const y = e.clientY - rect.top  - 22;
      onDrop(type, variant, Math.max(0, x), Math.max(0, y));
    } catch { /* malformed drag data */ }
  }, [onDrop]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleObjectDragEnd = useCallback((id, clientX, clientY, el) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const w = el?.offsetWidth  || 44;
    const h = el?.offsetHeight || 44;
    const x = clientX - rect.left - w / 2;
    const y = clientY - rect.top  - h / 2;
    onDragEnd(id, Math.max(0, Math.min(rect.width  - w, x)),
                  Math.max(0, Math.min(rect.height - h, y)));
  }, [onDragEnd]);

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      style={{ background: envStyle.sky }}
      onDrop={handleCanvasDrop}
      onDragOver={handleDragOver}
      onClick={() => setSelected(null)}
      role="application"
      aria-label="Garden canvas — drag objects here"
    >
      {isNight && <Stars />}
      <WeatherLayer weather={weather} />
      <div className={`${styles.ground} ${isNight ? styles.groundNight : ''}`} aria-hidden="true" />
      <motion.div className={styles.sunMoon}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true">
        {envStyle.sun}
      </motion.div>

      {objects.length === 0 && (
        <motion.div className={styles.emptyHint} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <p>🌱 Drag items from the panel and drop them here</p>
        </motion.div>
      )}

      <AnimatePresence>
        {objects.map((obj) => (
          <PlacedObject
            key={obj.id}
            obj={obj}
            isSelected={selected === obj.id}
            onSelect={setSelected}
            onDragEnd={handleObjectDragEnd}
            onScale={onScale}
            onRotate={onRotate}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>

      {selected && (
        <div className={styles.selectionHint} aria-live="polite">
          ＋/－ resize · ↻ rotate · ✕ remove · Drag to move
        </div>
      )}
    </div>
  );
};

export default GardenCanvas;
