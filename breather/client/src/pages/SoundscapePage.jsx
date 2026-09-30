import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import SoundCard from '../components/soundscape/SoundCard';
import useSoundscape, { SOUNDS } from '../hooks/useSoundscape';
import { soundscapeService } from '../services/soundscapeService';
import styles from './SoundscapePage.module.css';

const DEFAULT_PRESETS = [
  { name: 'Study Session',     icon: '📚', sounds: [{id:'rain',volume:0.6,enabled:true},{id:'fireplace',volume:0.4,enabled:true}], masterVolume: 0.75 },
  { name: 'Deep Sleep',        icon: '😴', sounds: [{id:'ocean',volume:0.7,enabled:true},{id:'night',volume:0.5,enabled:true}],    masterVolume: 0.6  },
  { name: 'Forest Walk',       icon: '🌲', sounds: [{id:'forest',volume:0.8,enabled:true},{id:'wind',volume:0.3,enabled:true}],   masterVolume: 0.8  },
  { name: 'Rainy Afternoon',   icon: '☕', sounds: [{id:'rain',volume:0.8,enabled:true},{id:'fireplace',volume:0.35,enabled:true},{id:'wind',volume:0.15,enabled:true}], masterVolume: 0.7 },
];

const VisualizerBar = ({ active, color }) => (
  <motion.div
    className={styles.vizBar}
    style={{ background: color }}
    animate={active
      ? { scaleY: [0.3, 1, 0.5, 0.9, 0.4, 0.8, 0.3], opacity: [0.6, 1, 0.7, 1, 0.6, 1, 0.6] }
      : { scaleY: 0.15, opacity: 0.2 }}
    transition={active
      ? { duration: 1.2 + Math.random() * 0.8, repeat: Infinity, ease: 'easeInOut' }
      : { duration: 0.4 }}
  />
);

const SoundscapePage = () => {
  const {
    isPlaying, volumes, enabled, master,
    togglePlay, setVolume, toggleSound, setMasterVolume, loadPreset,
  } = useSoundscape();

  const [savedPresets,   setSavedPresets]   = useState([]);
  const [saveModal,      setSaveModal]      = useState(false);
  const [presetName,     setPresetName]     = useState('');
  const [saveStatus,     setSaveStatus]     = useState('idle');

  /* Load user's saved presets */
  useEffect(() => {
    soundscapeService.getSoundscapes()
      .then((res) => setSavedPresets(res.data?.data?.soundscapes || []))
      .catch(() => {});
  }, []);

  const handleLoadPreset = (preset) => {
    // normalise API preset vs local preset shape
    const normalised = {
      sounds: preset.sounds || [],
      masterVolume: preset.masterVolume ?? 0.75,
    };
    loadPreset(normalised);
  };

  const handleSavePreset = async () => {
    setSaveStatus('saving');
    const soundsPayload = SOUNDS.map((s) => ({
      id: s.id, name: s.label,
      volume: volumes[s.id] || 0, enabled: enabled[s.id] || false,
    }));
    try {
      const res = await soundscapeService.saveSoundscape({
        name: presetName || 'My Mix',
        sounds: soundsPayload,
        masterVolume: master,
      });
      setSavedPresets((prev) => [...prev, res.data.data.soundscape]);
      setSaveStatus('saved');
      setSaveModal(false);
      setPresetName('');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const activeCount = Object.values(enabled).filter(Boolean).length;
  const anyActive   = activeCount > 0;

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>🎵</span>
            <div>
              <h1 className={styles.title}>Soundscape</h1>
              <p className={styles.subtitle}>Change Your Surroundings</p>
            </div>
          </div>

          {/* Visualizer */}
          <div className={styles.visualizer} aria-hidden="true">
            {SOUNDS.map((s) => (
              <VisualizerBar key={s.id} active={isPlaying && enabled[s.id]} color={s.color} />
            ))}
          </div>

          {/* Play button */}
          <motion.button
            className={`${styles.playBtn} ${isPlaying ? styles.playing : ''}`}
            onClick={togglePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </motion.button>
        </div>

        <div className={styles.body}>
          {/* ── Left: mixer ── */}
          <div className={styles.mixer}>
            {/* Master volume */}
            <div className={styles.masterRow}>
              <span className={styles.masterLabel}>🎚 Master Volume</span>
              <input
                type="range" min="0" max="1" step="0.02" value={master}
                onChange={(e) => setMasterVolume(Number(e.target.value))}
                className={styles.masterSlider}
                aria-label="Master volume"
              />
              <span className={styles.masterPct}>{Math.round(master * 100)}%</span>
            </div>

            {/* Active count badge */}
            <div className={styles.mixerStatus}>
              <span className={styles.mixerBadge}>
                {activeCount} sound{activeCount !== 1 ? 's' : ''} active
              </span>
              {!anyActive && <span className={styles.mixerHint}>Enable sounds below and press Play ↑</span>}
            </div>

            {/* Sound cards */}
            <div className={styles.cards}>
              {SOUNDS.map((s) => (
                <SoundCard
                  key={s.id}
                  sound={s}
                  volume={volumes[s.id]}
                  enabled={enabled[s.id]}
                  onToggle={() => toggleSound(s.id)}
                  onVolumeChange={(v) => setVolume(s.id, v)}
                />
              ))}
            </div>

            {/* Save mix button */}
            <div className={styles.saveRow}>
              {saveStatus === 'saved' && <span className={styles.savedBadge}>✅ Preset saved!</span>}
              <button className={styles.saveBtn} onClick={() => setSaveModal(true)}>
                💾 Save Current Mix
              </button>
            </div>
          </div>

          {/* ── Right: presets ── */}
          <aside className={styles.presets}>
            <h2 className={styles.presetsTitle}>Quick Presets</h2>
            <div className={styles.presetList}>
              {DEFAULT_PRESETS.map((p, i) => (
                <button key={i} className={styles.presetBtn} onClick={() => handleLoadPreset(p)}>
                  <span className={styles.presetIcon}>{p.icon}</span>
                  <span className={styles.presetName}>{p.name}</span>
                  <span className={styles.presetArrow}>→</span>
                </button>
              ))}
            </div>

            {savedPresets.length > 0 && (
              <>
                <h2 className={`${styles.presetsTitle} ${styles.presetsSubtitle}`}>Saved Mixes</h2>
                <div className={styles.presetList}>
                  {savedPresets.map((p) => (
                    <button key={p._id} className={styles.presetBtn} onClick={() => handleLoadPreset(p)}>
                      <span className={styles.presetIcon}>🎵</span>
                      <span className={styles.presetName}>{p.name}</span>
                      <span className={styles.presetArrow}>→</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>

        {/* ── Save Modal ── */}
        <AnimatePresence>
          {saveModal && (
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSaveModal(false)}
            >
              <motion.div
                className={styles.modal}
                initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={styles.modalTitle}>💾 Save Mix</h3>
                <input
                  className={styles.modalInput}
                  placeholder="Name your mix…"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                  autoFocus
                />
                <div className={styles.modalActions}>
                  <button className={styles.modalCancel} onClick={() => setSaveModal(false)}>Cancel</button>
                  <button className={styles.modalSave} onClick={handleSavePreset} disabled={saveStatus === 'saving'}>
                    {saveStatus === 'saving' ? 'Saving…' : 'Save Preset'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default SoundscapePage;
