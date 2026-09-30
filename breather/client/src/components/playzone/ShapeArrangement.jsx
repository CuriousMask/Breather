import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { generateId } from '../../utils/helpers';
import styles from './PlayGame.module.css';

const SHAPES = [
  { type: 'circle',   emoji: '⭕' },
  { type: 'square',   emoji: '🟦' },
  { type: 'triangle', emoji: '🔺' },
  { type: 'star',     emoji: '⭐' },
  { type: 'heart',    emoji: '💜' },
  { type: 'diamond',  emoji: '💠' },
];

const COLORS = ['#7DA7D9','#C7B8EA','#A5C89F','#F9A8D4','#FCD34D','#86EFAC','#FB923C'];

const makeShape = (type) => ({
  id: generateId(),
  type,
  emoji: SHAPES.find((s) => s.type === type)?.emoji || '⭕',
  x: 10 + Math.random() * 70,
  y: 15 + Math.random() * 60,
  size: 40 + Math.random() * 30,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  rotation: Math.floor(Math.random() * 360),
});

export default function ShapeArrangement() {
  const [placed, setPlaced] = useState(() =>
    SHAPES.slice(0, 5).map((s) => makeShape(s.type))
  );

  const addShape = useCallback((type) => {
    setPlaced((prev) => [...prev, makeShape(type)]);
  }, []);

  const removeShape = useCallback((id) => {
    setPlaced((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearAll = useCallback(() => setPlaced([]), []);

  return (
    <div className={styles.gameArea}>
      <div className={styles.gameHint}>🎨 Arrange shapes however you like!</div>

      {/* Shape palette */}
      <div className={styles.shapePalette}>
        {SHAPES.map((s) => (
          <button
            key={s.type}
            className={styles.shapePaletteBtn}
            onClick={() => addShape(s.type)}
            title={`Add ${s.type}`}
          >
            {s.emoji}
          </button>
        ))}
        <button className={styles.clearShapesBtn} onClick={clearAll} title="Clear all">🗑</button>
      </div>

      {/* Canvas */}
      <div className={styles.shapeCanvas}>
        {placed.map((shape) => (
          <motion.div
            key={shape.id}
            className={styles.placedShape}
            style={{
              left: `${shape.x}%`,
              top:  `${shape.y}%`,
              fontSize: shape.size,
              rotate: shape.rotation,
              filter: `drop-shadow(0 4px 12px ${shape.color}66)`,
            }}
            drag
            dragMomentum={false}
            whileHover={{ scale: 1.12 }}
            whileDrag={{ scale: 1.18, zIndex: 50 }}
            onDoubleClick={() => removeShape(shape.id)}
            title="Double-click to remove"
          >
            {shape.emoji}
          </motion.div>
        ))}
        {placed.length === 0 && (
          <p className={styles.shapeEmpty}>Click a shape above to add it here</p>
        )}
      </div>

      <p className={styles.shapeTip}>💡 Drag to move · Double-click to remove</p>
    </div>
  );
}
