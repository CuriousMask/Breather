import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate, getInitials } from '../utils/helpers';
import styles from './ProfilePage.module.css';

/* ─── Tab definitions ─── */
const TABS = [
  { id: 'overview',    label: 'Overview',    icon: '👤' },
  { id: 'drawings',    label: 'Drawings',    icon: '🎨' },
  { id: 'soundscapes', label: 'Soundscapes', icon: '🎵' },
  { id: 'saves',       label: 'Garden & Room',icon: '🌿' },
];

/* ─── Drawing card ─── */
const DrawingCard = ({ creation, onDelete }) => (
  <div className={styles.drawingCard}>
    {creation.thumbnail
      ? <img src={creation.thumbnail} alt={creation.title} className={styles.drawingImg} />
      : <div className={styles.drawingPlaceholder}>🎨</div>}
    <div className={styles.drawingInfo}>
      <p className={styles.drawingTitle}>{creation.title || 'Untitled'}</p>
      <p className={styles.drawingDate}>{formatDate(creation.createdAt)}</p>
      {creation.prompt && <p className={styles.drawingPrompt}>"{creation.prompt}"</p>}
    </div>
    <button
      className={styles.deleteBtn}
      onClick={() => onDelete(creation._id)}
      title="Delete drawing"
    >
      🗑
    </button>
  </div>
);

/* ─── Soundscape card ─── */
const SoundscapeCard = ({ preset, onDelete }) => (
  <div className={styles.soundCard}>
    <div className={styles.soundCardLeft}>
      <span className={styles.soundIcon}>🎵</span>
      <div>
        <p className={styles.soundName}>{preset.name}</p>
        <p className={styles.soundMeta}>
          {preset.sounds?.filter((s) => s.enabled).map((s) => s.name).join(', ') || 'No sounds'}
        </p>
      </div>
    </div>
    <div className={styles.soundCardRight}>
      <span className={styles.soundVol}>Vol: {Math.round((preset.masterVolume || 0.8) * 100)}%</span>
      <button className={styles.deleteBtn} onClick={() => onDelete(preset._id)} title="Delete">🗑</button>
    </div>
  </div>
);

/* ─── Page ─── */
const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [tab,        setTab]        = useState('overview');
  const [creations,  setCreations]  = useState([]);
  const [soundscapes,setSoundscapes]= useState([]);
  const [garden,     setGarden]     = useState(null);
  const [room,       setRoom]       = useState(null);
  const [prefs,      setPrefs]      = useState(null);
  const [loading,    setLoading]    = useState(true);

  /* Edit profile state */
  const [editing,    setEditing]    = useState(false);
  const [editName,   setEditName]   = useState(user?.name || '');
  const [editBio,    setEditBio]    = useState(user?.bio  || '');
  const [saving,     setSaving]     = useState(false);
  const [saveMsg,    setSaveMsg]    = useState('');

  /* Load all user data in parallel */
  useEffect(() => {
    const load = async () => {
      const [c, s, g, r, p] = await Promise.allSettled([
        api.get('/creations'),
        api.get('/soundscapes'),
        api.get('/garden'),
        api.get('/rooms'),
        api.get('/preferences'),
      ]);
      if (c.status === 'fulfilled') setCreations(c.value.data?.data?.creations || []);
      if (s.status === 'fulfilled') setSoundscapes(s.value.data?.data?.soundscapes || []);
      if (g.status === 'fulfilled') setGarden(g.value.data?.data?.garden || null);
      if (r.status === 'fulfilled') setRoom(r.value.data?.data?.room || null);
      if (p.status === 'fulfilled') setPrefs(p.value.data?.data?.preferences || null);
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/profile', { name: editName.trim(), bio: editBio.trim() });
      updateUser(res.data.data.user);
      setSaveMsg('✅ Profile updated');
      setEditing(false);
    } catch {
      setSaveMsg('❌ Failed to save');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handleDeleteDrawing = async (id) => {
    try {
      await api.delete(`/creations/${id}`);
      setCreations((prev) => prev.filter((c) => c._id !== id));
    } catch {/* silent */}
  };

  const handleDeleteSoundscape = async (id) => {
    try {
      await api.delete(`/soundscapes/${id}`);
      setSoundscapes((prev) => prev.filter((s) => s._id !== id));
    } catch {/* silent */}
  };

  const MODULE_FAVS = [
    { id: 'garden',     icon: '🌿', label: 'Garden',     active: !!garden },
    { id: 'studio',     icon: '🎨', label: 'Studio',     active: creations.length > 0 },
    { id: 'soundscape', icon: '🎵', label: 'Soundscape', active: soundscapes.length > 0 },
    { id: 'dreamroom',  icon: '🛋️', label: 'Dream Room', active: !!room },
  ];

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* ── Profile header ── */}
        <div className={styles.header}>
          <div className={styles.avatarArea}>
            <div className={styles.avatarLg}>{getInitials(user?.name)}</div>
            <div className={styles.userMeta}>
              {editing ? (
                <div className={styles.editForm}>
                  <input
                    className={styles.editInput}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name"
                    maxLength={50}
                  />
                  <textarea
                    className={styles.editTextarea}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="A short bio…"
                    maxLength={200}
                    rows={2}
                  />
                  <div className={styles.editActions}>
                    <button className={styles.cancelBtn} onClick={() => { setEditing(false); setEditName(user?.name||''); setEditBio(user?.bio||''); }}>
                      Cancel
                    </button>
                    <button className={styles.saveProfileBtn} onClick={handleSaveProfile} disabled={saving}>
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                  {saveMsg && <p className={styles.saveMsg}>{saveMsg}</p>}
                </div>
              ) : (
                <>
                  <h1 className={styles.userName}>{user?.name}</h1>
                  <p className={styles.userEmail}>{user?.email}</p>
                  {user?.bio && <p className={styles.userBio}>{user.bio}</p>}
                  <button className={styles.editBtn} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
                </>
              )}
            </div>
          </div>

          {/* Activity badges */}
          <div className={styles.activityBadges}>
            {MODULE_FAVS.map((m) => (
              <div key={m.id} className={`${styles.badge} ${m.active ? styles.badgeActive : ''}`}>
                <span>{m.icon}</span>
                <span>{m.label}</span>
                {m.active && <span className={styles.badgeDot} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className={styles.tabContent}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" className={styles.loading}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={styles.spinner} />
                <p>Loading your data…</p>
              </motion.div>
            ) : (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                {/* Overview */}
                {tab === 'overview' && (
                  <div className={styles.overviewGrid}>
                    <div className={styles.overviewCard}>
                      <h3 className={styles.overviewCardTitle}>🌿 Digital Garden</h3>
                      {garden ? (
                        <>
                          <p className={styles.overviewDetail}>{garden.objects?.length || 0} objects placed</p>
                          <p className={styles.overviewDetail}>Theme: {garden.theme} · {garden.environment}</p>
                          <p className={styles.overviewDetail}>Last saved: {formatDate(garden.updatedAt)}</p>
                          <Link to="/garden" className={styles.overviewLink}>Open Garden →</Link>
                        </>
                      ) : (
                        <div className={styles.overviewEmpty}>
                          <p>No garden saved yet</p>
                          <Link to="/garden" className={styles.overviewLink}>Start Growing →</Link>
                        </div>
                      )}
                    </div>

                    <div className={styles.overviewCard}>
                      <h3 className={styles.overviewCardTitle}>🛋️ Dream Room</h3>
                      {room ? (
                        <>
                          <p className={styles.overviewDetail}>{room.objects?.length || 0} items placed</p>
                          <p className={styles.overviewDetail}>Theme: {room.theme} · {room.lighting} lighting</p>
                          <p className={styles.overviewDetail}>Last saved: {formatDate(room.updatedAt)}</p>
                          <Link to="/dreamroom" className={styles.overviewLink}>Open Room →</Link>
                        </>
                      ) : (
                        <div className={styles.overviewEmpty}>
                          <p>No room saved yet</p>
                          <Link to="/dreamroom" className={styles.overviewLink}>Start Decorating →</Link>
                        </div>
                      )}
                    </div>

                    <div className={styles.overviewCard}>
                      <h3 className={styles.overviewCardTitle}>🎨 Creative Studio</h3>
                      <p className={styles.overviewDetail}>{creations.length} drawing{creations.length !== 1 ? 's' : ''} saved</p>
                      <Link to="/studio" className={styles.overviewLink}>Open Studio →</Link>
                    </div>

                    <div className={styles.overviewCard}>
                      <h3 className={styles.overviewCardTitle}>🎵 Soundscapes</h3>
                      <p className={styles.overviewDetail}>{soundscapes.length} preset{soundscapes.length !== 1 ? 's' : ''} saved</p>
                      <Link to="/soundscape" className={styles.overviewLink}>Open Mixer →</Link>
                    </div>

                    {prefs && (
                      <div className={styles.overviewCard}>
                        <h3 className={styles.overviewCardTitle}>⭐ Favourites</h3>
                        {prefs.favoriteEnvironment && (
                          <p className={styles.overviewDetail}>Escape: {prefs.favoriteEnvironment.replace('-', ' ')}</p>
                        )}
                        {prefs.favoriteActivity && (
                          <p className={styles.overviewDetail}>Game: {prefs.favoriteActivity.replace('-', ' ')}</p>
                        )}
                        {prefs.recentModules?.length > 0 && (
                          <p className={styles.overviewDetail}>
                            Recent: {prefs.recentModules.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Drawings */}
                {tab === 'drawings' && (
                  <div>
                    {creations.length === 0 ? (
                      <div className={styles.emptyState}>
                        <span>🎨</span>
                        <p>No drawings saved yet.</p>
                        <Link to="/studio" className="btn btn-primary">Open Studio</Link>
                      </div>
                    ) : (
                      <div className={styles.drawingsList}>
                        {creations.map((c) => (
                          <DrawingCard key={c._id} creation={c} onDelete={handleDeleteDrawing} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Soundscapes */}
                {tab === 'soundscapes' && (
                  <div>
                    {soundscapes.length === 0 ? (
                      <div className={styles.emptyState}>
                        <span>🎵</span>
                        <p>No soundscape presets saved yet.</p>
                        <Link to="/soundscape" className="btn btn-primary">Open Mixer</Link>
                      </div>
                    ) : (
                      <div className={styles.soundList}>
                        {soundscapes.map((s) => (
                          <SoundscapeCard key={s._id} preset={s} onDelete={handleDeleteSoundscape} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Garden & Room saves */}
                {tab === 'saves' && (
                  <div className={styles.savesGrid}>
                    {/* Garden */}
                    <div className={styles.saveSection}>
                      <h3 className={styles.saveSectionTitle}>🌿 Your Garden</h3>
                      {garden ? (
                        <div className={styles.saveCard}>
                          <div className={styles.saveCardMeta}>
                            <p><strong>{garden.objects?.length || 0}</strong> objects</p>
                            <p>Theme: <strong>{garden.theme}</strong></p>
                            <p>Environment: <strong>{garden.environment}</strong></p>
                            <p>Weather: <strong>{garden.weather}</strong></p>
                            <p className={styles.saveDate}>Saved {formatDate(garden.updatedAt)}</p>
                          </div>
                          <Link to="/garden" className={styles.saveOpenBtn}>Open →</Link>
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <span>🌱</span>
                          <p>No garden saved yet.</p>
                          <Link to="/garden" className="btn btn-primary">Start Planting</Link>
                        </div>
                      )}
                    </div>

                    {/* Room */}
                    <div className={styles.saveSection}>
                      <h3 className={styles.saveSectionTitle}>🛋️ Your Dream Room</h3>
                      {room ? (
                        <div className={styles.saveCard}>
                          <div className={styles.saveCardMeta}>
                            <p><strong>{room.objects?.length || 0}</strong> items placed</p>
                            <p>Theme: <strong>{room.theme}</strong></p>
                            <p>Lighting: <strong>{room.lighting}</strong></p>
                            <p className={styles.saveDate}>Saved {formatDate(room.updatedAt)}</p>
                          </div>
                          <Link to="/dreamroom" className={styles.saveOpenBtn}>Open →</Link>
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <span>🏠</span>
                          <p>No room saved yet.</p>
                          <Link to="/dreamroom" className="btn btn-primary">Start Decorating</Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
