import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import AmbientOrbs from '../components/common/AmbientOrbs';
import { useAuth } from '../context/AuthContext';
import styles from './ExperiencePage.module.css';

/* ─── Data ─── */
const EXPERIENCES = [
  {
    id: 'garden',
    label: 'Digital Garden',
    tagline: 'Grow Your Space',
    icon: '🌿',
    path: '/garden',
    color: '#A5C89F',
    accent: '#7DA7D9',
    gradient: 'linear-gradient(135deg, #A5C89F22, #7DA7D922)',
    border: '#A5C89F44',
    desc: 'Drag and drop trees, flowers, stones and water elements to build your own peaceful outdoor space.',
    tags: ['creative', 'calming', 'visual'],
    mood: ['stressed', 'bored', 'creative'],
    time: '5–20 min',
    features: ['Drag & Drop', 'Day/Night Mode', 'Weather Control', 'Save & Return'],
  },
  {
    id: 'studio',
    label: 'Creative Studio',
    tagline: 'Make Something',
    icon: '🎨',
    path: '/studio',
    color: '#C7B8EA',
    accent: '#F9A8D4',
    gradient: 'linear-gradient(135deg, #C7B8EA22, #F9A8D422)',
    border: '#C7B8EA44',
    desc: 'A freeform canvas with brushes, shapes, colours and undo. Draw anything — or nothing. No judgment.',
    tags: ['creative', 'expressive', 'art'],
    mood: ['creative', 'bored', 'anxious'],
    time: '5–30 min',
    features: ['Brush Tool', 'Color Picker', 'Shapes', 'Undo/Redo', 'Save Drawing'],
  },
  {
    id: 'escape',
    label: 'Escape Room',
    tagline: 'Choose Your Atmosphere',
    icon: '🌅',
    path: '/escape',
    color: '#7DA7D9',
    accent: '#A5C89F',
    gradient: 'linear-gradient(135deg, #7DA7D922, #A5C89F22)',
    border: '#7DA7D944',
    desc: 'Immerse yourself in animated ambient environments — rain, ocean, forest, night sky, or clouds.',
    tags: ['calming', 'immersive', 'audio'],
    mood: ['stressed', 'anxious', 'tired'],
    time: 'As long as you need',
    features: ['5 Environments', 'Ambient Sounds', 'Full Screen', 'Auto-play'],
  },
  {
    id: 'playzone',
    label: 'Play Zone',
    tagline: 'Just Play',
    icon: '🎮',
    path: '/playzone',
    color: '#FCD34D',
    accent: '#F9A8D4',
    gradient: 'linear-gradient(135deg, #FCD34D22, #F9A8D422)',
    border: '#FCD34D44',
    desc: 'Five playful mini-experiences: bubble pop, falling stars, particles, connect dots, and shape art.',
    tags: ['playful', 'interactive', 'fun'],
    mood: ['bored', 'restless', 'distracted'],
    time: '2–10 min',
    features: ['No Scores', 'No Pressure', '5 Mini-Games', 'Instant Start'],
  },
  {
    id: 'soundscape',
    label: 'Soundscape',
    tagline: 'Change Your Surroundings',
    icon: '🎵',
    path: '/soundscape',
    color: '#C7B8EA',
    accent: '#7DA7D9',
    gradient: 'linear-gradient(135deg, #C7B8EA22, #7DA7D922)',
    border: '#C7B8EA44',
    desc: 'Mix rain, ocean, fireplace, forest and more into your perfect ambient soundscape. Save your presets.',
    tags: ['audio', 'calming', 'focus'],
    mood: ['stressed', 'distracted', 'tired'],
    time: 'Background',
    features: ['6 Sounds', 'Volume Mixer', 'Save Presets', 'Multi-layer'],
  },
  {
    id: 'dreamroom',
    label: 'Dream Room',
    tagline: 'Build Your Own World',
    icon: '🛋️',
    path: '/dreamroom',
    color: '#F9A8D4',
    accent: '#C7B8EA',
    gradient: 'linear-gradient(135deg, #F9A8D422, #C7B8EA22)',
    border: '#F9A8D444',
    desc: 'Design your ideal room — sofa, plants, lamps, posters — drag, resize and decorate freely.',
    tags: ['creative', 'visual', 'design'],
    mood: ['creative', 'bored', 'restless'],
    time: '10–40 min',
    features: ['Drag & Place', 'Resize & Rotate', 'Themes', 'Lighting Control', 'Save Room'],
  },
];

const MOODS = [
  { id: 'all',        label: 'All',          icon: '✨' },
  { id: 'stressed',   label: 'Stressed',     icon: '😤' },
  { id: 'anxious',    label: 'Anxious',      icon: '😰' },
  { id: 'bored',      label: 'Bored',        icon: '😑' },
  { id: 'tired',      label: 'Tired',        icon: '😴' },
  { id: 'creative',   label: 'Feeling Creative', icon: '✍️' },
  { id: 'restless',   label: 'Restless',     icon: '😤' },
  { id: 'distracted', label: 'Distracted',   icon: '🌀' },
];

const QUICK_PICKS = [
  { mood: 'Stressed',   ids: ['escape', 'soundscape', 'garden'] },
  { mood: 'Creative',   ids: ['studio', 'garden', 'dreamroom']  },
  { mood: 'Need a Break',ids: ['playzone', 'escape', 'soundscape'] },
];

/* ─── Animation variants ─── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  exit:   { opacity: 0, y: -16, scale: 0.96, transition: { duration: 0.2 } },
};

/* ─── Expanded Card Overlay ─── */
const ExperienceDetail = ({ exp, onClose }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.detailCard}
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.detailClose} onClick={onClose} aria-label="Close">✕</button>

        <div
          className={styles.detailHeader}
          style={{ background: exp.gradient, borderBottom: `1px solid ${exp.border}` }}
        >
          <span className={styles.detailEmoji}>{exp.icon}</span>
          <div>
            <span className={styles.detailTagline} style={{ color: exp.color }}>{exp.tagline}</span>
            <h2 className={styles.detailTitle}>{exp.label}</h2>
          </div>
        </div>

        <div className={styles.detailBody}>
          <p className={styles.detailDesc}>{exp.desc}</p>

          <div className={styles.detailMeta}>
            <div className={styles.detailMetaItem}>
              <span className={styles.detailMetaLabel}>⏱ Typical time</span>
              <span className={styles.detailMetaValue}>{exp.time}</span>
            </div>
          </div>

          <div className={styles.detailFeatures}>
            <p className={styles.detailFeaturesLabel}>What you can do</p>
            <div className={styles.featureTags}>
              {exp.features.map((f, i) => (
                <span key={i} className={styles.featureTag} style={{ borderColor: exp.border }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.detailFooter}>
          <button className={styles.detailCancel} onClick={onClose}>
            Maybe later
          </button>
          <Link
            to={exp.path}
            className={styles.detailStart}
            style={{ background: `linear-gradient(135deg, ${exp.color}, ${exp.accent})` }}
          >
            Enter Experience →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Experience Card ─── */
const ExperienceCard = ({ exp, onExpand }) => (
  <motion.div
    variants={cardVariants}
    layout
    className={styles.card}
    whileHover={{ y: -5, transition: { duration: 0.22 } }}
  >
    <div
      className={styles.cardTop}
      style={{ background: exp.gradient, borderBottom: `1px solid ${exp.border}` }}
    >
      <div
        className={styles.cardIcon}
        style={{ background: `${exp.color}22`, border: `2px solid ${exp.border}` }}
      >
        {exp.icon}
      </div>
      <span className={styles.cardTagline} style={{ color: exp.color }}>
        {exp.tagline}
      </span>
    </div>

    <div className={styles.cardBody}>
      <h3 className={styles.cardTitle}>{exp.label}</h3>
      <p className={styles.cardDesc}>{exp.desc}</p>

      <div className={styles.cardTags}>
        {exp.tags.map((t) => (
          <span key={t} className={styles.cardTag}>{t}</span>
        ))}
      </div>

      <div className={styles.cardTime}>
        <span>⏱</span> {exp.time}
      </div>
    </div>

    <div className={styles.cardFooter}>
      <button className={styles.cardDetails} onClick={() => onExpand(exp)}>
        Learn more
      </button>
      <Link
        to={exp.path}
        className={styles.cardStart}
        style={{ background: `linear-gradient(135deg, ${exp.color}, ${exp.accent})` }}
      >
        Start →
      </Link>
    </div>
  </motion.div>
);

/* ─── Quick Pick Banner ─── */
const QuickPick = ({ pick }) => {
  const exps = EXPERIENCES.filter((e) => pick.ids.includes(e.id));
  return (
    <div className={styles.quickPick}>
      <span className={styles.quickLabel}>
        Feeling {pick.mood.toLowerCase()}?
      </span>
      <div className={styles.quickLinks}>
        {exps.map((e) => (
          <Link key={e.id} to={e.path} className={styles.quickLink}>
            {e.icon} {e.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ─── Page ─── */
const ExperiencePage = () => {
  const { user } = useAuth();
  const [activeMood, setActiveMood] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered =
    activeMood === 'all'
      ? EXPERIENCES
      : EXPERIENCES.filter((e) => e.mood.includes(activeMood));

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <AmbientOrbs variant="soft" />
          <motion.div
            className={styles.headerContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.title}>
              Hi {firstName} 👋 — what do you need today?
            </h1>
            <p className={styles.subtitle}>
              Pick an experience, or tell us how you're feeling and we'll suggest one.
            </p>
          </motion.div>
        </div>

        {/* ── Mood Filter ── */}
        <section className={styles.moodSection}>
          <p className={styles.moodLabel}>How are you feeling?</p>
          <div className={styles.moodPills}>
            {MOODS.map((m) => (
              <button
                key={m.id}
                className={`${styles.moodPill} ${activeMood === m.id ? styles.moodActive : ''}`}
                onClick={() => setActiveMood(m.id)}
                aria-pressed={activeMood === m.id}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Quick Picks (when no mood filter) ── */}
        <AnimatePresence>
          {activeMood === 'all' && (
            <motion.section
              className={styles.quickSection}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className={styles.quickTitle}>Quick picks</p>
              <div className={styles.quickGrid}>
                {QUICK_PICKS.map((pick, i) => (
                  <QuickPick key={i} pick={pick} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Grid ── */}
        <section className={styles.grid_section}>
          <div className={styles.gridHeader}>
            <p className={styles.gridCount}>
              {filtered.length} experience{filtered.length !== 1 ? 's' : ''}
              {activeMood !== 'all' && ` for "${MOODS.find(m => m.id === activeMood)?.label}"`}
            </p>
          </div>

          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={activeMood} // re-animate on filter change
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  onExpand={setExpanded}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div
              className={styles.empty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span>🌿</span>
              <p>No experiences matched — try a different mood.</p>
              <button onClick={() => setActiveMood('all')} className="btn btn-secondary">
                Show all
              </button>
            </motion.div>
          )}
        </section>

        {/* ── Expanded Detail Overlay ── */}
        <AnimatePresence>
          {expanded && (
            <ExperienceDetail
              exp={expanded}
              onClose={() => setExpanded(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default ExperiencePage;
