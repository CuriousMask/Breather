import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROOM_CATEGORIES, ROOM_OBJECTS, ROOM_THEMES, LIGHTING_OPTIONS } from './roomObjects';
import styles from './RoomToolbar.module.css';

const DragItem = ({ obj }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: obj.id, type: obj.type, defaultScale: obj.defaultScale || 1,
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };
  return (
    <div className={styles.item} draggable onDragStart={handleDragStart} title={obj.label}>
      <span className={styles.itemEmoji}>{obj.icon}</span>
      <span className={styles.itemLabel}>{obj.label}</span>
    </div>
  );
};

const RoomToolbar = ({
  theme, lighting, saveStatus,
  onThemeChange, onLightingChange, onClear, onSave,
}) => {
  const [tab,      setTab]      = useState('furniture');
  const [category, setCategory] = useState('seating');

  const categoryItems = ROOM_OBJECTS.filter((o) => o.category === category);

  return (
    <aside className={styles.toolbar}>
      <div className={styles.header}>
        <h2 className={styles.title}>🛋️ Dream Room</h2>
        <div className={styles.tabs}>
          {['furniture', 'design'].map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'furniture' ? '🛋️ Items' : '🎨 Design'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'furniture' && (
          <motion.div
            key="furniture"
            className={styles.panel}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
          >
            <p className={styles.hint}>Drag items onto your room ↗</p>

            {/* Category chips */}
            <div className={styles.categories}>
              {ROOM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.catChip} ${category === cat.id ? styles.catActive : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Items grid */}
            <div className={styles.itemGrid}>
              {categoryItems.map((obj) => (
                <DragItem key={obj.id} obj={obj} />
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'design' && (
          <motion.div
            key="design"
            className={styles.panel}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
          >
            {/* Themes */}
            <div className={styles.settingGroup}>
              <p className={styles.settingLabel}>Room Theme</p>
              <div className={styles.themeGrid}>
                {ROOM_THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`${styles.themeBtn} ${theme === t.id ? styles.themeActive : ''}`}
                    onClick={() => onThemeChange(t.id, t.wallColor, t.floorColor)}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                    <div className={styles.themeColors}>
                      <div style={{ background: t.wallColor }} />
                      <div style={{ background: t.floorColor }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div className={styles.settingGroup}>
              <p className={styles.settingLabel}>Lighting</p>
              <div className={styles.lightingGrid}>
                {LIGHTING_OPTIONS.map((l) => (
                  <button
                    key={l.id}
                    className={`${styles.lightBtn} ${lighting === l.id ? styles.lightActive : ''}`}
                    onClick={() => onLightingChange(l.id)}
                  >
                    <span>{l.icon}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            <button className={styles.clearBtn} onClick={onClear}>
              🗑 Clear Room
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save bar */}
      <div className={styles.saveBar}>
        <span className={styles.saveStatus}>
          {saveStatus === 'saving' && '⏳ Saving…'}
          {saveStatus === 'saved'  && '✅ Saved'}
          {saveStatus === 'error'  && '❌ Error'}
        </span>
        <button className={styles.saveBtn} onClick={onSave}>💾 Save</button>
      </div>
    </aside>
  );
};

export default RoomToolbar;
