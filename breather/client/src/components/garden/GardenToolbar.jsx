import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GARDEN_CATEGORIES, GARDEN_OBJECTS } from './gardenObjects';
import styles from './GardenToolbar.module.css';

/* ─── Environment / weather options ─── */
const ENVIRONMENTS = [
  { id: 'day',     label: 'Day',     icon: '☀️' },
  { id: 'night',   label: 'Night',   icon: '🌙' },
  { id: 'sunset',  label: 'Sunset',  icon: '🌅' },
  { id: 'sunrise', label: 'Sunrise', icon: '🌄' },
];

const WEATHERS = [
  { id: 'clear',  label: 'Clear',  icon: '🌤️' },
  { id: 'cloudy', label: 'Cloudy', icon: '☁️' },
  { id: 'rain',   label: 'Rain',   icon: '🌧️' },
  { id: 'snow',   label: 'Snow',   icon: '❄️' },
  { id: 'fog',    label: 'Fog',    icon: '🌫️' },
];

/* ─── Draggable palette item ─── */
const PaletteItem = ({ obj }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ type: obj.type, variant: obj.id })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      className={styles.paletteItem}
      draggable
      onDragStart={handleDragStart}
      title={obj.label}
    >
      <span className={styles.paletteEmoji}>{obj.icon}</span>
      <span className={styles.paletteLabel}>{obj.label}</span>
    </div>
  );
};

/* ─── Toolbar ─── */
const GardenToolbar = ({
  environment, weather, saveStatus,
  onEnvironmentChange, onWeatherChange, onClear, onSave,
}) => {
  const [activeCategory, setActiveCategory] = useState('trees');
  const [tab, setTab] = useState('objects'); // objects | settings

  const categoryObjects = GARDEN_OBJECTS.filter((o) => o.category === activeCategory);

  return (
    <aside className={styles.toolbar}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <h2 className={styles.title}>🌿 Garden</h2>
        <div className={styles.tabs}>
          {['objects', 'settings'].map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'objects' ? '🧩 Objects' : '⚙️ Settings'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Objects Panel ── */}
        {tab === 'objects' && (
          <motion.div
            key="objects"
            className={styles.panel}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <p className={styles.hint}>Drag items onto the garden ↗</p>

            {/* Category tabs */}
            <div className={styles.categories}>
              {GARDEN_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catActive : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  title={cat.label}
                >
                  {cat.icon}
                </button>
              ))}
            </div>

            {/* Palette grid */}
            <div className={styles.palette}>
              {categoryObjects.map((obj) => (
                <PaletteItem key={obj.id} obj={obj} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Settings Panel ── */}
        {tab === 'settings' && (
          <motion.div
            key="settings"
            className={styles.panel}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Environment */}
            <div className={styles.settingGroup}>
              <p className={styles.settingLabel}>Time of Day</p>
              <div className={styles.optionGrid}>
                {ENVIRONMENTS.map((env) => (
                  <button
                    key={env.id}
                    className={`${styles.optionBtn} ${environment === env.id ? styles.optionActive : ''}`}
                    onClick={() => onEnvironmentChange(env.id)}
                  >
                    <span>{env.icon}</span>
                    <span>{env.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div className={styles.settingGroup}>
              <p className={styles.settingLabel}>Weather</p>
              <div className={styles.optionGrid}>
                {WEATHERS.map((w) => (
                  <button
                    key={w.id}
                    className={`${styles.optionBtn} ${weather === w.id ? styles.optionActive : ''}`}
                    onClick={() => onWeatherChange(w.id)}
                  >
                    <span>{w.icon}</span>
                    <span>{w.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button className={styles.clearBtn} onClick={onClear}>
                🗑 Clear Garden
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Save bar ── */}
      <div className={styles.saveBar}>
        <span className={styles.saveStatus}>
          {saveStatus === 'saving' && '⏳ Saving…'}
          {saveStatus === 'saved'  && '✅ Saved'}
          {saveStatus === 'error'  && '❌ Save failed'}
          {saveStatus === 'idle'   && ''}
        </span>
        <button className={styles.saveBtn} onClick={onSave}>
          💾 Save
        </button>
      </div>
    </aside>
  );
};

export default GardenToolbar;
