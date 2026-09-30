import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { preferenceService } from '../services/preferenceService';
import styles from './PlayZonePage.module.css';

const BubblePop         = lazy(() => import('../components/playzone/BubblePop'));
const FallingStars      = lazy(() => import('../components/playzone/FallingStars'));
const ParticlePlayground= lazy(() => import('../components/playzone/ParticlePlayground'));
const ConnectDots       = lazy(() => import('../components/playzone/ConnectDots'));
const ShapeArrangement  = lazy(() => import('../components/playzone/ShapeArrangement'));

const GAMES = [
  { id: 'bubble-pop',    label: 'Bubble Pop',          icon: '🫧', desc: 'Pop bouncing bubbles — pure satisfying joy.',        color: '#7DA7D9' },
  { id: 'falling-stars', label: 'Falling Stars',        icon: '⭐', desc: 'Catch shooting stars drifting through the night.',   color: '#C7B8EA' },
  { id: 'particles',     label: 'Particle Playground',  icon: '✨', desc: 'Paint with glowing particles using your cursor.',    color: '#A5C89F' },
  { id: 'connect-dots',  label: 'Connect Dots',         icon: '🔗', desc: 'Draw lines between floating coloured dots.',         color: '#F9A8D4' },
  { id: 'shapes',        label: 'Shape Arrangement',    icon: '🎨', desc: 'Drag and arrange shapes into anything you imagine.', color: '#FCD34D' },
];

const GAME_COMPONENTS = {
  'bubble-pop':    BubblePop,
  'falling-stars': FallingStars,
  'particles':     ParticlePlayground,
  'connect-dots':  ConnectDots,
  'shapes':        ShapeArrangement,
};

const PlayZonePage = () => {
  const [active, setActive] = useState(null);

  const launch = (gameId) => {
    setActive(gameId);
    preferenceService.savePreferences({
      favoriteActivity: gameId,
      activityHistory: [{ activity: gameId, playedAt: new Date() }],
    }).catch(() => {});
  };

  const GameComponent = active ? GAME_COMPONENTS[active] : null;
  const activeGame    = GAMES.find((g) => g.id === active);

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>🎮</span>
            <div>
              <h1 className={styles.title}>Play Zone</h1>
              <p className={styles.subtitle}>Just Play — no scores, no pressure</p>
            </div>
          </div>
          {active && (
            <button className={styles.backBtn} onClick={() => setActive(null)}>
              ← All Games
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!active ? (
            /* ── Game selection ── */
            <motion.div
              key="picker"
              className={styles.picker}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <p className={styles.pickerHint}>Pick something and just enjoy it 🌿</p>
              <div className={styles.grid}>
                {GAMES.map((g) => (
                  <motion.button
                    key={g.id}
                    className={styles.gameCard}
                    onClick={() => launch(g.id)}
                    whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
                    whileTap={{ scale: 0.97 }}
                    style={{ '--accent': g.color }}
                  >
                    <span className={styles.gameIcon}>{g.icon}</span>
                    <h3 className={styles.gameLabel}>{g.label}</h3>
                    <p className={styles.gameDesc}>{g.desc}</p>
                    <span className={styles.gamePlay} style={{ background: g.color }}>
                      Play →
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ── Active game ── */
            <motion.div
              key={active}
              className={styles.gameWrapper}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.gameBar}>
                <span style={{ fontSize: '1.2rem' }}>{activeGame?.icon}</span>
                <span className={styles.gameName}>{activeGame?.label}</span>
              </div>
              <div className={styles.gameArea}>
                <Suspense fallback={
                  <div className={styles.gameLoading}>Loading…</div>
                }>
                  <GameComponent />
                </Suspense>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default PlayZonePage;
