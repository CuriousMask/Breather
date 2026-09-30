import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import EscapeScene from '../components/escape/EscapeScene';
import { ENVIRONMENTS } from '../components/escape/environments';
import { preferenceService } from '../services/preferenceService';
import styles from './EscapeRoomPage.module.css';

const EscapeRoomPage = () => {
  const [activeEnv,    setActiveEnv]    = useState(ENVIRONMENTS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlTimer, setControlTimer] = useState(null);

  /* Load last visited env */
  useEffect(() => {
    preferenceService.getPreferences().then((res) => {
      const lastEnv = res.data?.data?.preferences?.lastEnvironment;
      if (lastEnv) {
        const found = ENVIRONMENTS.find((e) => e.id === lastEnv);
        if (found) setActiveEnv(found);
      }
    }).catch(() => {});
  }, []);

  /* Save preference on env change */
  const handleEnvChange = (env) => {
    setActiveEnv(env);
    preferenceService.savePreferences({ lastEnvironment: env.id }).catch(() => {});
  };

  /* Auto-hide controls after idle */
  const resetControlTimer = () => {
    setShowControls(true);
    clearTimeout(controlTimer);
    if (isFullscreen) {
      const t = setTimeout(() => setShowControls(false), 3500);
      setControlTimer(t);
    }
  };

  useEffect(() => {
    if (isFullscreen) resetControlTimer();
    else { setShowControls(true); clearTimeout(controlTimer); }
    return () => clearTimeout(controlTimer);
  }, [isFullscreen]);                    // eslint-disable-line

  /* Fullscreen API */
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setIsFullscreen((v) => !v);
  };

  return (
    <MainLayout>
      <div
        className={`${styles.page} ${isFullscreen ? styles.pageFs : ''}`}
        onMouseMove={resetControlTimer}
        onTouchStart={resetControlTimer}
      >
        {/* ── Scene ── */}
        <div className={styles.sceneWrap}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEnv.id}
              className={styles.sceneContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <EscapeScene env={activeEnv} isFullscreen={isFullscreen} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Controls overlay ── */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className={styles.controls}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
            >
              {/* Header */}
              {!isFullscreen && (
                <div className={styles.header}>
                  <div className={styles.headerLeft}>
                    <span className={styles.headerIcon}>🌅</span>
                    <div>
                      <h1 className={styles.headerTitle}>Escape Room</h1>
                      <p className={styles.headerSub}>Choose Your Atmosphere</p>
                    </div>
                  </div>
                  <button className={styles.fsBtn} onClick={toggleFullscreen} title="Full screen">
                    ⛶ Full Screen
                  </button>
                </div>
              )}

              {/* Env picker */}
              <div className={styles.envPicker}>
                {ENVIRONMENTS.map((env) => (
                  <motion.button
                    key={env.id}
                    className={`${styles.envBtn} ${activeEnv.id === env.id ? styles.envActive : ''}`}
                    style={activeEnv.id === env.id
                      ? { background: `linear-gradient(135deg, ${env.colors[0]}cc, ${env.colors[2]}cc)`, borderColor: env.colors[1] }
                      : {}
                    }
                    onClick={() => handleEnvChange(env)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className={styles.envIcon}>{env.icon}</span>
                    <span className={styles.envName}>{env.name}</span>
                    <span className={styles.envMood}>{env.mood}</span>
                  </motion.button>
                ))}
              </div>

              {/* Active env tagline */}
              <div className={styles.taglineBar}>
                <span className={styles.tagline}>{activeEnv.tagline}</span>
                {isFullscreen && (
                  <button className={styles.exitFsBtn} onClick={toggleFullscreen}>✕ Exit</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default EscapeRoomPage;
