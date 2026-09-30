import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './AuthLayout.module.css';

// Floating ambient orbs for the auth background
const Orb = ({ style, delay = 0 }) => (
  <motion.div
    className={styles.orb}
    style={style}
    animate={{
      y: [0, -24, 0],
      x: [0, 12, 0],
      scale: [1, 1.08, 1],
    }}
    transition={{
      duration: 8 + delay,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
    aria-hidden="true"
  />
);

const AuthLayout = ({ children, title, subtitle }) => (
  <div className={styles.page}>
    {/* ── Ambient Background ── */}
    <div className={styles.bg} aria-hidden="true">
      <Orb delay={0} style={{ width: 480, height: 480, top: '-120px', left: '-120px', background: 'radial-gradient(circle, rgba(125,167,217,0.22) 0%, transparent 70%)' }} />
      <Orb delay={2} style={{ width: 360, height: 360, bottom: '-80px', right: '-80px', background: 'radial-gradient(circle, rgba(199,184,234,0.22) 0%, transparent 70%)' }} />
      <Orb delay={4} style={{ width: 260, height: 260, top: '40%', right: '15%', background: 'radial-gradient(circle, rgba(165,200,159,0.18) 0%, transparent 70%)' }} />
    </div>

    <div className={styles.container}>
      {/* ── Brand Header ── */}
      <motion.div
        className={styles.brand}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className={styles.brandLink}>
          <span className={styles.brandIcon}>🌿</span>
          <span className={styles.brandName}>Breather</span>
        </Link>
        <p className={styles.brandTagline}>A Digital Space to Unwind</p>
      </motion.div>

      {/* ── Card ── */}
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200, damping: 22 }}
      >
        {(title || subtitle) && (
          <div className={styles.cardHeader}>
            {title    && <h1 className={styles.cardTitle}>{title}</h1>}
            {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
          </div>
        )}
        {children}
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
