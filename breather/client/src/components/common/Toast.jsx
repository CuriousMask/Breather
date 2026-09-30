import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Toast.module.css';

const ICONS = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
  warning: '⚠️',
};

const Toast = ({ toasts = [], onRemove }) => (
  <div className={styles.container} role="region" aria-live="polite">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          role="alert"
        >
          <span className={styles.icon}>{ICONS[toast.type] || 'ℹ️'}</span>
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.close}
            onClick={() => onRemove(toast.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default Toast;
