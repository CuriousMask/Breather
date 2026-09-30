import React from 'react';
import styles from './StudioToolbar.module.css';

const TOOLS = [
  { id: 'brush',  icon: '✏️', label: 'Brush'   },
  { id: 'eraser', icon: '🧹', label: 'Eraser'  },
  { id: 'line',   icon: '📏', label: 'Line'    },
  { id: 'rect',   icon: '⬜', label: 'Rectangle'},
  { id: 'circle', icon: '⭕', label: 'Ellipse' },
  { id: 'fill',   icon: '🪣', label: 'Fill'    },
];

const PRESET_COLORS = [
  '#1F2937','#EF4444','#F97316','#EAB308','#22C55E',
  '#06B6D4','#7DA7D9','#8B5CF6','#C7B8EA','#F9A8D4',
  '#FFFFFF','#6B7280','#A5C89F','#FCD34D','#FCA5A5',
];

const BRUSH_SIZES = [2, 5, 8, 14, 20, 30];

const StudioToolbar = ({
  tool, color, brushSize, opacity, canUndo, canRedo,
  onToolChange, onColorChange, onBrushSizeChange, onOpacityChange,
  onUndo, onRedo, onClear,
}) => (
  <aside className={styles.toolbar}>
    {/* ── Tools ── */}
    <section className={styles.section}>
      <p className={styles.sectionLabel}>Tools</p>
      <div className={styles.toolGrid}>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`${styles.toolBtn} ${tool === t.id ? styles.toolActive : ''}`}
            onClick={() => onToolChange(t.id)}
            title={t.label}
            aria-pressed={tool === t.id}
          >
            <span>{t.icon}</span>
            <span className={styles.toolLabel}>{t.label}</span>
          </button>
        ))}
      </div>
    </section>

    {/* ── Colors ── */}
    <section className={styles.section}>
      <p className={styles.sectionLabel}>Color</p>
      <div className={styles.colorPickerWrap}>
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className={styles.colorInput}
          aria-label="Custom color"
          title="Custom color"
        />
        <span className={styles.colorHex}>{color}</span>
      </div>
      <div className={styles.colorSwatches}>
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            className={`${styles.swatch} ${color === c ? styles.swatchActive : ''}`}
            style={{ background: c, border: c === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' }}
            onClick={() => onColorChange(c)}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>
    </section>

    {/* ── Brush Size ── */}
    <section className={styles.section}>
      <p className={styles.sectionLabel}>Size — {brushSize}px</p>
      <div className={styles.sizeRow}>
        {BRUSH_SIZES.map((s) => (
          <button
            key={s}
            className={`${styles.sizeBtn} ${brushSize === s ? styles.sizeBtnActive : ''}`}
            onClick={() => onBrushSizeChange(s)}
            style={{ width: Math.min(s + 18, 36), height: Math.min(s + 18, 36) }}
            aria-label={`Brush size ${s}`}
          >
            <span style={{
              display: 'block',
              width: Math.min(s * 0.9, 20), height: Math.min(s * 0.9, 20),
              background: brushSize === s ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderRadius: '50%',
            }} />
          </button>
        ))}
      </div>
      <input
        type="range" min="1" max="60" value={brushSize}
        onChange={(e) => onBrushSizeChange(Number(e.target.value))}
        className={styles.slider}
        aria-label="Brush size"
      />
    </section>

    {/* ── Opacity ── */}
    <section className={styles.section}>
      <p className={styles.sectionLabel}>Opacity — {Math.round(opacity * 100)}%</p>
      <input
        type="range" min="0.05" max="1" step="0.05" value={opacity}
        onChange={(e) => onOpacityChange(Number(e.target.value))}
        className={styles.slider}
        aria-label="Opacity"
      />
    </section>

    {/* ── Actions ── */}
    <section className={styles.section}>
      <p className={styles.sectionLabel}>Actions</p>
      <div className={styles.actionRow}>
        <button className={styles.actionBtn} onClick={onUndo} disabled={!canUndo} title="Undo">↩ Undo</button>
        <button className={styles.actionBtn} onClick={onRedo} disabled={!canRedo} title="Redo">↪ Redo</button>
      </div>
      <button className={styles.clearBtn} onClick={onClear}>🗑 Clear Canvas</button>
    </section>
  </aside>
);

export default StudioToolbar;
