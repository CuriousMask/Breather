import React from 'react';
import { motion } from 'framer-motion';
import styles from './AmbientOrbs.module.css';

/**
 * Decorative floating ambient orbs for backgrounds.
 * Pass `variant` to switch between colour palettes.
 */
const ORB_CONFIGS = {
  hero: [
    { w: 600, h: 600, top: '-15%', left: '-12%',  color: 'rgba(125,167,217,0.18)', dur: 10, delay: 0   },
    { w: 450, h: 450, top: '55%',  right: '-8%',  color: 'rgba(199,184,234,0.18)', dur: 12, delay: 1.5 },
    { w: 320, h: 320, top: '30%',  left: '38%',   color: 'rgba(165,200,159,0.14)', dur: 9,  delay: 3   },
    { w: 200, h: 200, top: '8%',   right: '22%',  color: 'rgba(125,167,217,0.12)', dur: 8,  delay: 2   },
  ],
  soft: [
    { w: 400, h: 400, top: '-10%', left: '-10%',  color: 'rgba(125,167,217,0.14)', dur: 11, delay: 0   },
    { w: 300, h: 300, bottom: '-8%', right: '-8%',color: 'rgba(199,184,234,0.14)', dur: 13, delay: 2   },
  ],
};

const AmbientOrbs = ({ variant = 'hero' }) => {
  const orbs = ORB_CONFIGS[variant] || ORB_CONFIGS.hero;

  return (
    <div className={styles.container} aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={styles.orb}
          style={{
            width:  orb.w,
            height: orb.h,
            top:    orb.top,
            left:   orb.left,
            right:  orb.right,
            bottom: orb.bottom,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.06, 1] }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
};

export default AmbientOrbs;
