import React, { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GARDEN_OBJECTS } from './gardenObjects';
import styles from './GardenCanvas.module.css';

/* ─── Sky / Ground colours per environment ─── */
const ENV_STYLES = {
  day:     { sky: 'linear-gradient(180deg, #87CEEB 0%, #B8E0F7 50%, #E8F5E9 70%, #A5C89F 100%)', sun: '☀️',  sunOpacity: 1 },
  night:   { sky: 'linear-gradient(180deg, #0d1b2a 0%, #1a2744 40%, #2d3f6e 70%, #1a3a2a 100%)', sun: '🌕', sunOpacity: 1 },
  sunset:  { sky: 'linear-gradient(180deg, #FF6B35 0%, #F7C59F 30%, #EFEFD0 60%, #A5C89F 100%)', sun: '🌅', sunOpacity: 1 },
  sunrise: { sky: 'linear-gradient(180deg, #FF9A3C 0%, #FFCC70 30%, #C5E8F7 60%, #A5C89F 100%)', sun: '🌄', sunOpacity: 1 },
};

/* ─── Weather overlay ─── */
const WEATHER_OVERLAYS = {
  clear:  null,
  cloudy: { emoji: '☁️', count: 5, animate: true },
  rain:   { emoji: '🌧️', count: 1, particles: true },
  snow:   { emoji: '❄️', count: 1, particles: true },
  fog:    { overlay: true },
};

/* ─── Rain particles ─── */
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

  if (weather === 'rain') {
    return (
      <div className={styles.weatherLayer} aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <RainDrop
            key={i}
            style={{ left: `${(i / 40) * 100}%`, width: '1.5px', height: '18px', background: 'rgba(125,167,217,0.55)' }}
          />
        ))}
      </div>
    );
  }

  if (weather === 'snow') {
    return (
      <div className={styles.weatherLayer} aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <SnowFlake key={i} style={{ left: `${Math.random() * 100}%`, fontSize: `${0.6 + Math.random() * 0.6}rem` }} />
        ))}
      </div>
    );
  }

  if (weather === 'cloudy') {
    return (
      <div className={styles.weatherLayer} aria-hidden="true">
        {[10, 30, 55, 70, 85].map((left, i) => (
          <motion.div
            key={i}
            className={styles.cloud}
            style={{ left: `${left}%`, top: `${5 + i * 4}%` }}
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
          >
            ☁️
          </motion.div>
        ))}
      </div>
    );
  }

  if (weather === 'fog') {
    return (
      <div className={styles.fogLayer} aria-hidden="true">
        <motion.div
          className={styles.fogStrip}
          animate={{ opacity: [0.4, 0.7, 0.4], x: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  return null;
};

/* ─── Stars (night mode) ─── */
const Stars = () => (
  <div className={styles.stars} aria-hidden="true">
    {Array.from({ length: 60 }).map((_, i) => (
      <motion.div
        key={i}
        className={styles.star}
        style={{
          left:    `${Math.random() * 100}%`,
          top:     `${Math.random() * 55}%`,
          width:   `${1 + Math.random() * 2}px`,
          height:  `${1 + Math.random() * 2}px`,
        }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
      />
    ))}
  </div>
);

/* ─── Placed garden object ─── */
const PlacedObject = ({ obj, isSelected, onSelect, onDragEnd, onRemove }) => {
  const def = GARDEN_OBJECTS.find((d) => d.id === obj.variant || d.type === obj.type);
  const emoji = def?.icon || '🌿';
  const size  = 42 * (obj.scale || 1);

  return (
    <motion.div
      className={`${styles.placedObject} ${isSelected ? styles.selected : ''}`}
      style={{
        left: obj.x,
        top:  obj.y,
        zIndex: obj.zIndex || 1,
        width:  size,
        height: size,
        fontSize: size * 0.75,
        transform: `rotate(${obj.rotation || 0}deg)`,
      }}
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => onDragEnd(obj.id, info.point.x, info.point.y, e.target)}
      onClick={(e) => { e.stopPropagation(); onSelect(obj.id); }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: (obj.scale || 1) * 1.08 }}
      whileDrag={{ scale: (obj.scale || 1) * 1.12, zIndex: 999 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      role="button"
      aria-label={`${def?.label || obj.type} — click to select`}
    >
      <span className={styles.objectEmoji} aria-hidden="true">{emoji}</span>

      {isSelected && (
        <motion.button
          className={styles.removeBtn}
          onClick={(e) => { e.stopPropagation(); onRemove(obj.id); }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          aria-label="Remove object"
        >
          ×
        </motion.button>
      )}
    </motion.div>
  );
};

/* ─── Canvas ─── */
const GardenCanvas = ({ objects, environment, weather, selected, setSelected, onDrop, onDragEnd, onRemove }) => {
  const canvasRef = useRef(null);
  const envStyle  = ENV_STYLES[environment] || ENV_STYLES.day;
  const isNight   = environment === 'night';

  /* Handle dropping a new object from toolbar */
  const handleCanvasDrop = useCallback((e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    try {
      const { type, variant } = JSON.parse(data);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 20;
      const y = e.clientY - rect.top  - 20;
      onDrop(type, variant, x, y);
    } catch {/* ignore */}
  }, [onDrop]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }, []);

  /* Handle dragging an existing object */
  const handleObjectDragEnd = useCallback((id, clientX, clientY, el) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left - (el?.offsetWidth  || 20) / 2;
    const y = clientY - rect.top  - (el?.offsetHeight || 20) / 2;
    onDragEnd(id, Math.max(0, x), Math.max(0, y));
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
      aria-label="Garden canvas"
    >
      {/* ── Stars (night only) ── */}
      {isNight && <Stars />}

      {/* ── Weather ── */}
      <WeatherLayer weather={weather} />

      {/* ── Ground ── */}
      <div className={`${styles.ground} ${isNight ? styles.groundNight : ''}`} aria-hidden="true" />

      {/* ── Sun / Moon ── */}
      <motion.div
        className={styles.sunMoon}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        {envStyle.sun}
      </motion.div>

      {/* ── Empty state hint ── */}
      {objects.length === 0 && (
        <motion.div
          className={styles.emptyHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>🌱 Drag items from the panel and drop them here</p>
        </motion.div>
      )}

      {/* ── Placed objects ── */}
      <AnimatePresence>
        {objects.map((obj) => (
          <PlacedObject
            key={obj.id}
            obj={obj}
            isSelected={selected === obj.id}
            onSelect={setSelected}
            onDragEnd={handleObjectDragEnd}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>

      {/* ── Selection hint ── */}
      {selected && (
        <div className={styles.selectionHint} aria-live="polite">
          Click × to remove · Drag to move
        </div>
      )}
    </div>
  );
};

export default GardenCanvas;
