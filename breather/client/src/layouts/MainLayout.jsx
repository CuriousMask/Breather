import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import styles from './MainLayout.module.css';

const NAV_LINKS = [
  { path: '/dashboard',   label: 'Home',       icon: '🏠' },
  { path: '/garden',      label: 'Garden',     icon: '🌿' },
  { path: '/studio',      label: 'Studio',     icon: '🎨' },
  { path: '/escape',      label: 'Escape',     icon: '🌅' },
  { path: '/playzone',    label: 'Play',       icon: '🎮' },
  { path: '/soundscape',  label: 'Sound',      icon: '🎵' },
  { path: '/dreamroom',   label: 'Dream Room', icon: '🛋️' },
];

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <Link to="/dashboard" className={styles.brand}>
          <span className={styles.brandIcon}>🌿</span>
          <span className={styles.brandName}>Breather</span>
        </Link>

        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${
                location.pathname === link.path ? styles.active : ''
              }`}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              <span className={styles.navLabel}>{link.label}</span>
              {location.pathname === link.path && (
                <motion.div
                  className={styles.activeIndicator}
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/profile" className={styles.userCard}>
            <div className={styles.avatar}>
              {getInitials(user?.name)}
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            ↩
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <header className={styles.mobileHeader}>
        <Link to="/dashboard" className={styles.mobileBrand}>
          🌿 Breather
        </Link>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles.mobileNavLink} ${
                  location.pathname === link.path ? styles.mobileActive : ''
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <button className={styles.mobileLogout} onClick={handleLogout}>
              ↩ Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
