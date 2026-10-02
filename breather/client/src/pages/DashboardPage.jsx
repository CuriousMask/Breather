import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import AmbientOrbs from '../components/common/AmbientOrbs';
import api from '../services/api';
import { formatDate, getInitials } from '../utils/helpers';
import styles from './DashboardPage.module.css';

/* ─── Module quick-launch cards ─── */
const MODULES = [
  { id: 'garden',     label: 'Digital Garden',   icon: '🌿', path: '/garden',     color: '#A5C89F', accent: '#7DA7D9' },
  { id: 'studio',     label: 'Creative Studio',  icon: '🎨', path: '/studio',     color: '#C7B8EA', accent: '#F9A8D4' },
  { id: 'escape',     label: 'Escape Room',       icon: '🌅', path: '/escape',     color: '#7DA7D9', accent: '#A5C89F' },
  { id: 'playzone',   label: 'Play Zone',         icon: '🎮', path: '/playzone',   color: '#FCD34D', accent: '#F9A8D4' },
  { id: 'soundscape', label: 'Soundscape',        icon: '🎵', path: '/soundscape', color: '#C7B8EA', accent: '#7DA7D9' },
  { id: 'dreamroom',  label: 'Dream Room',        icon: '🛋️', path: '/dreamroom',  color: '#F9A8D4', accent: '#C7B8EA' },
];

const GREETINGS = [
  'Ready to take a breath?',
  'Your space is waiting.',
  'Take it easy today.',
  'You deserve a moment.',
  'What are you in the mood for?',
];

/* ─── Stat card ─── */
const StatCard = ({ icon, label, value, color }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon} style={{ background: `${color}22`, border: `1.5px solid ${color}44` }}>
      {icon}
    </div>
    <div>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  </div>
);

/* ─── Module card ─── */
const ModuleCard = ({ mod, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 * index, type: 'spring', stiffness: 260, damping: 22 }}
  >
    <Link to={mod.path} className={styles.moduleCard}>
      <div
        className={styles.moduleIconWrap}
        style={{
          background: `linear-gradient(135deg, ${mod.color}22, ${mod.accent}18)`,
          border: `1.5px solid ${mod.color}44`,
        }}
      >
        <span className={styles.moduleIcon}>{mod.icon}</span>
      </div>
      <span className={styles.moduleLabel}>{mod.label}</span>
      <span className={styles.moduleArrow}>→</span>
    </Link>
  </motion.div>
);

/* ─── Recent drawing thumbnail ─── */
const DrawingThumb = ({ creation }) => (
  <div className={styles.drawingThumb}>
    {creation.thumbnail ? (
      <img src={creation.thumbnail} alt={creation.title} className={styles.thumbImg} />
    ) : (
      <div className={styles.thumbPlaceholder}>🎨</div>
    )}
    <p className={styles.thumbTitle}>{creation.title || 'Untitled'}</p>
    <p className={styles.thumbDate}>{formatDate(creation.createdAt)}</p>
  </div>
);

/* ─── Page ─── */
const DashboardPage = () => {
  const { user } = useAuth();
  const [prefs,     setPrefs]     = useState(null);
  const [creations, setCreations] = useState([]);
  const [stats,     setStats]     = useState({ gardens: 0, creations: 0, soundscapes: 0, rooms: 0 });
  const [loading,   setLoading]   = useState(true);

  const greeting = GREETINGS[new Date().getHours() % GREETINGS.length];
  const firstName = user?.name?.split(' ')[0] || 'there';
  const hour      = new Date().getHours();
  const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const load = async () => {
      try {
        const [prefsRes, creationsRes, gardenRes, soundRes, roomRes] = await Promise.allSettled([
          api.get('/preferences'),
          api.get('/creations'),
          api.get('/garden'),
          api.get('/soundscapes'),
          api.get('/rooms'),
        ]);

        if (prefsRes.status === 'fulfilled')
          setPrefs(prefsRes.value.data?.data?.preferences);

        if (creationsRes.status === 'fulfilled')
          setCreations((creationsRes.value.data?.data?.creations || []).slice(0, 4));

        const gardenCount  = gardenRes.status === 'fulfilled' && gardenRes.value.data?.data?.garden ? 1 : 0;
        const soundCount   = soundRes.status === 'fulfilled' ? (soundRes.value.data?.data?.soundscapes?.length || 0) : 0;
        const roomCount    = roomRes.status === 'fulfilled' && roomRes.value.data?.data?.room ? 1 : 0;
        const drawCount    = creationsRes.status === 'fulfilled' ? (creationsRes.value.data?.data?.creations?.length || 0) : 0;

        setStats({ gardens: gardenCount, creations: drawCount, soundscapes: soundCount, rooms: roomCount });
      } catch {/* partial failures are fine */} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* Build recent modules list from prefs */
  const recentModules = prefs?.recentModules?.length
    ? MODULES.filter((m) => prefs.recentModules.includes(m.id)).slice(0, 3)
    : MODULES.slice(0, 3);

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ── Hero header ── */}
        <div className={styles.hero}>
          <AmbientOrbs variant="soft" />
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.avatarRow}>
              <div className={styles.avatar}>{getInitials(user?.name)}</div>
              <div>
                <h1 className={styles.heroGreet}>{timeGreet}, {firstName} 👋</h1>
                <p className={styles.heroSub}>{greeting}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          {!loading && (
            <motion.div
              className={styles.statsRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <StatCard icon="🌿" label="Gardens"     value={stats.gardens}     color="#A5C89F" />
              <StatCard icon="🎨" label="Drawings"    value={stats.creations}   color="#C7B8EA" />
              <StatCard icon="🎵" label="Soundscapes" value={stats.soundscapes} color="#7DA7D9" />
              <StatCard icon="🛋️" label="Rooms"       value={stats.rooms}       color="#F9A8D4" />
            </motion.div>
          )}
        </div>

        <div className={styles.body}>
          {/* ── Quick Start ── */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Quick Start</h2>
              <Link to="/experiences" className={styles.sectionLink}>See all →</Link>
            </div>
            <div className={styles.modulesGrid}>
              {MODULES.map((mod, i) => (
                <ModuleCard key={mod.id} mod={mod} index={i} />
              ))}
            </div>
          </section>

          {/* ── Continue Where You Left Off ── */}
          {recentModules.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Continue Where You Left Off</h2>
              </div>
              <div className={styles.recentRow}>
                {recentModules.map((mod) => (
                  <Link key={mod.id} to={mod.path} className={styles.recentCard}>
                    <span className={styles.recentIcon}>{mod.icon}</span>
                    <div>
                      <p className={styles.recentLabel}>{mod.label}</p>
                      <p className={styles.recentCta}>Continue →</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Recent Drawings ── */}
          {creations.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Drawings</h2>
                <Link to="/studio" className={styles.sectionLink}>Open Studio →</Link>
              </div>
              <div className={styles.drawingsRow}>
                {creations.map((c) => (
                  <DrawingThumb key={c._id} creation={c} />
                ))}
                <Link to="/studio" className={styles.newDrawingCard}>
                  <span className={styles.plusIcon}>+</span>
                  <span>New Drawing</span>
                </Link>
              </div>
            </section>
          )}

          {/* ── Daily inspiration ── */}
          <section className={styles.section}>
            <div className={styles.inspirationCard}>
              <AmbientOrbs variant="soft" />
              <div className={styles.inspirationContent}>
                <span className={styles.inspirationEmoji}>🌿</span>
                <blockquote className={styles.inspirationQuote}>
                  "Almost everything will work again if you unplug it for a few minutes — including you."
                </blockquote>
                <cite className={styles.inspirationAuthor}>— Anne Lamott</cite>
                <div className={styles.inspirationActions}>
                  <Link to="/escape"     className={`btn btn-primary ${styles.inspBtn}`}>Take a 5-min Escape</Link>
                  <Link to="/soundscape" className={`btn btn-secondary ${styles.inspBtn}`}>Put on Some Sounds</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
