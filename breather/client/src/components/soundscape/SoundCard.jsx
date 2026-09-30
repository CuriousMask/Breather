import React from 'react';
import { motion } from 'framer-motion';
import styles from './SoundCard.module.css';

const SoundCard = ({ sound, volume, enabled, onToggle, onVolumeChange }) => (
  <motion.div
    className={`${styles.card} ${enabled ? styles.active : ''}`}
    style={enabled ? { borderColor: `${sound.color}66`, background: `${sound.color}0d` } : {}}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    {/* Icon + toggle */}
    <button
      className={styles.iconBtn}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={`${enabled ? 'Disable' : 'Enable'} ${sound.label}`}
      style={enabled ? { background: sound.color, boxShadow: `0 4px 16px ${sound.color}55` } : {}}
    >
      <span className={styles.icon}>{sound.icon}</span>
      {/* Animated rings when active */}
      {enabled && (
        <motion.div
          className={styles.ring}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ borderColor: sound.color }}
        />
      )}
    </button>

    <div className={styles.info}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{sound.label}</span>
        <span className={styles.desc}>{sound.description}</span>
      </div>

      {/* Volume slider */}
      <div className={styles.sliderRow}>
        <span className={styles.volIcon}>{volume === 0 ? '🔇' : volume < 0.4 ? '🔈' : volume < 0.75 ? '🔉' : '🔊'}</span>
        <input
          type="range"
          min="0" max="1" step="0.02"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className={styles.slider}
          style={{ '--accent': sound.color }}
          disabled={!enabled}
          aria-label={`${sound.label} volume`}
        />
        <span className={styles.volPct}>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  </motion.div>
);

export default SoundCard;
