import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => (
  <div className={styles.page}>
    <motion.div
      className={styles.content}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={styles.emoji}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        🌿
      </motion.div>

      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Lost in the breeze</h2>
      <p className={styles.description}>
        This page wandered off somewhere peaceful. Let's find your way back.
      </p>

      <div className={styles.actions}>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
        <Link to="/dashboard" className="btn btn-secondary">
          Go to Dashboard
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
