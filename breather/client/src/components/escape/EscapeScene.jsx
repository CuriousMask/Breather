import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './EscapeScene.module.css';

/* ── Particle generators ── */
const RainParticles = () =>
  useMemo(() => Array.from({ length: 60 }, (_, i) => (
    <motion.div
      key={i}
      className={styles.raindrop}
      style={{ left: `${(i / 60) * 100 + (Math.random() - 0.5) * 2}%`, top: '-2%' }}
      animate={{ y: ['0vh', '105vh'] }}
      transition={{ duration: 0.6 + Math.random() * 0.5, repeat: Infinity, ease: 'linear', delay: Math.random() * 1.5 }}
    />
  )), []);

const BubbleParticles = () =>
  useMemo(() => Array.from({ length: 18 }, (_, i) => (
    <motion.div
      key={i}
      className={styles.bubble}
      style={{ left: `${Math.random() * 95}%`, bottom: `${Math.random() * 20}%`, width: 6 + Math.random() * 14, height: 6 + Math.random() * 14 }}
      animate={{ y: [0, -(200 + Math.random() * 300)], opacity: [0, 0.7, 0] }}
      transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, ease: 'easeOut', delay: Math.random() * 5 }}
    />
  )), []);

const LeafParticles = () =>
  useMemo(() => Array.from({ length: 14 }, (_, i) => (
    <motion.div
      key={i}
      className={styles.leaf}
      style={{ left: `${Math.random() * 90}%`, top: '-5%', fontSize: `${0.8 + Math.random() * 0.8}rem` }}
      animate={{ y: ['0vh', '108vh'], x: [0, (Math.random() - 0.5) * 160], rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)] }}
      transition={{ duration: 5 + Math.random() * 6, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 8 }}
    >
      {['🍃', '🍂', '🌿', '🍁'][Math.floor(Math.random() * 4)]}
    </motion.div>
  )), []);

const StarParticles = () =>
  useMemo(() => Array.from({ length: 120 }, (_, i) => (
    <motion.div
      key={i}
      className={styles.star}
      style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 75}%`, width: 1 + Math.random() * 3, height: 1 + Math.random() * 3 }}
      animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 1.5 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 4 }}
    />
  )), []);

const CloudParticles = () =>
  useMemo(() => [
    { top: '8%',  left: '5%',  size: 1.0, dur: 22, delay: 0   },
    { top: '18%', left: '35%', size: 1.4, dur: 28, delay: 3   },
    { top: '5%',  left: '62%', size: 0.9, dur: 18, delay: 6   },
    { top: '30%', left: '15%', size: 1.2, dur: 25, delay: 1.5 },
    { top: '22%', left: '75%', size: 1.1, dur: 20, delay: 8   },
    { top: '42%', left: '50%', size: 0.8, dur: 32, delay: 4   },
  ].map((c, i) => (
    <motion.div
      key={i}
      className={styles.cloudPuff}
      style={{ top: c.top, left: c.left, fontSize: `${c.size * 3}rem` }}
      animate={{ x: [0, 60, 0], y: [0, -10, 0] }}
      transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
    >
      ☁️
    </motion.div>
  )), []);

/* ── Shooting stars (night only) ── */
const ShootingStars = () =>
  useMemo(() => Array.from({ length: 3 }, (_, i) => (
    <motion.div
      key={i}
      className={styles.shootingStar}
      style={{ top: `${10 + i * 15}%`, left: `${10 + i * 20}%` }}
      animate={{ x: [0, 250], y: [0, 100], opacity: [0, 1, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, delay: 4 + i * 6, ease: 'easeIn' }}
    />
  )), []);

/* ── Ocean waves ── */
const OceanWaves = () => (
  <div className={styles.wavesContainer} aria-hidden="true">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className={styles.wave}
        style={{ opacity: 0.3 + i * 0.15, bottom: `${(i - 1) * 6}%` }}
        animate={{ x: ['-5%', '5%', '-5%'] }}
        transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
      />
    ))}
  </div>
);

/* ── Window rain effect ── */
const WindowRainDrops = () =>
  useMemo(() => Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className={styles.windowDrop}
      style={{ left: `${5 + Math.random() * 90}%`, top: `${Math.random() * 20}%` }}
      animate={{ y: ['0%', '80%'], opacity: [0, 0.6, 0] }}
      transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: Math.random() * 3, ease: 'easeIn' }}
    />
  )), []);

/* ── Scene component ── */
const EscapeScene = ({ env, isFullscreen }) => {
  if (!env) return null;

  const ParticleMap = {
    rain:    <><RainParticles /><WindowRainDrops /></>,
    bubbles: <><BubbleParticles /><OceanWaves /></>,
    leaves:  <LeafParticles />,
    stars:   <><StarParticles /><ShootingStars /></>,
    clouds:  <CloudParticles />,
  };

  return (
    <div
      className={`${styles.scene} ${isFullscreen ? styles.fullscreen : ''}`}
      style={{ background: env.sky }}
    >
      {/* Overlay tint */}
      <div className={styles.overlay} style={{ background: env.overlay }} />

      {/* Ground */}
      <div className={styles.ground} style={{ background: env.groundColor }} />

      {/* Particles */}
      <div className={styles.particles} aria-hidden="true">
        {ParticleMap[env.particles]}
      </div>

      {/* Glass window (rainy window only) */}
      {env.glassEffect && (
        <div className={styles.glassPane} aria-hidden="true">
          <div className={styles.windowFrame} />
        </div>
      )}

      {/* Environment label */}
      <div className={styles.envLabel}>
        <span>{env.icon}</span>
        <span>{env.name}</span>
      </div>
    </div>
  );
};

export default EscapeScene;
