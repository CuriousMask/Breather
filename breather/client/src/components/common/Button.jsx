import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  icon,
  ...rest
}) => {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    loading   ? styles.loading  : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading  ? { scale: 0.98 }         : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...rest}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
