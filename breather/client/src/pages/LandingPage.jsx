import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import AmbientOrbs from '../components/common/AmbientOrbs';
import styles from './LandingPage.module.css';

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut', delay } },
});

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } },
};

/* ─── Data ─── */
const FEATURES = [
  { icon: '🧘', label: 'Stress Relief',    desc: 'Immersive experiences that melt daily tension away.' },
  { icon: '🎨', label: 'Creative Outlet',  desc: 'Express yourself freely without rules or judgment.' },
  { icon: '🌍', label: 'Explore Worlds',   desc: 'Journey through calm ambient environments.' },
  { icon: '🛋️', label: 'Your Space',       desc: 'Personalise everything — it is all yours to keep.' },
];

const MODULES = [
  {
    id: 'garden',
    emoji: '🌿',
    title: 'Digital Garden',
    tagline: 'Grow Your Space',
    desc: 'Place trees, flowers, stones and water. Watch your little world take shape in its own time.',
    color: '#A5C89F',
    accent: '#7DA7D9',
    path: '/garden',
  },
  {
    id: 'studio',
    emoji: '🎨',
    title: 'Creative Studio',
    tagline: 'Make Something',
    desc: 'A canvas waiting for you. Brushes, colours, shapes — no expectations, just expression.',
    color: '#C7B8EA',
    accent: '#F9A8D4',
    path: '/studio',
  },
  {
    id: 'escape',
    emoji: '🌅',
    title: 'Escape Room',
    tagline: 'Choose Your Atmosphere',
    desc: 'Rain on a window. Ocean waves. A forest at dusk. Close your eyes and just be there.',
    color: '#7DA7D9',
    accent: '#A5C89F',
    path: '/escape',
  },
  {
    id: 'playzone',
    emoji: '🎮',
    title: 'Play Zone',
    tagline: 'Just Play',
    desc: 'Pop bubbles. Catch falling stars. No scores. No pressure. Pure, simple fun.',
    color: '#FCD34D',
    accent: '#F9A8D4',
    path: '/playzone',
  },
  {
    id: 'soundscape',
    emoji: '🎵',
    title: 'Soundscape',
    tagline: 'Change Your Surroundings',
    desc: 'Mix rain, fireplace, ocean and wind into your perfect ambience. Save your favourites.',
    color: '#C7B8EA',
    accent: '#7DA7D9',
    path: '/soundscape',
  },
  {
    id: 'dreamroom',
    emoji: '🛋️',
    title: 'Dream Room',
    tagline: 'Build Your Own World',
    desc: 'Drag in a sofa. Add a plant. Hang a poster. Design the room you actually want to be in.',
    color: '#F9A8D4',
    accent: '#C7B8EA',
    path: '/dreamroom',
  },
];

const TESTIMONIALS = [
  { quote: 'I open Breather whenever assignments pile up. Five minutes in the garden and I feel reset.', name: 'Priya S.', role: 'Engineering Student' },
  { quote: 'The soundscape mixer is my study companion now. Rain + fireplace = perfect focus.', name: 'Leon K.', role: 'Design Student' },
  { quote: 'Drawing without judgment in the studio helped me rediscover how much I love making things.', name: 'Meera R.', role: 'Graduate Student' },
];

/* ─── Section animation wrapper ─── */
const Section = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {children}
    </motion.section>
  );
};

/* ─── Navbar ─── */
const Navbar = () => (
  <nav className={styles.nav}>
    <div className={styles.navInner}>
      <Link to="/" className={styles.navBrand}>
        <span>🌿</span>
        <span>Breather</span>
      </Link>
      <div className={styles.navLinks}>
        <a href="#features" className={styles.navLink}>Features</a>
        <a href="#modules"  className={styles.navLink}>Experiences</a>
      </div>
      <div className={styles.navActions}>
        <Link to="/login"    className={styles.navLogin}>Sign In</Link>
        <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
          Get Started
        </Link>
      </div>
    </div>
  </nav>
);

/* ─── Hero ─── */
const Hero = () => (
  <section className={styles.hero}>
    <AmbientOrbs variant="hero" />

    <div className={styles.heroContent}>
      <motion.div
        className={styles.heroBadge}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        🌿 A Digital Wellness Experience
      </motion.div>

      <motion.h1
        className={styles.heroTitle}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Find your calm
        <br />
        <span className={styles.heroGradient}>in the digital world</span>
      </motion.h1>

      <motion.p
        className={styles.heroSubtitle}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        Six immersive experiences for students and young adults.
        Take a breath. Grow a garden. Draw something. Just play.
        <br />
        This is your space.
      </motion.p>

      <motion.div
        className={styles.heroActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link to="/register" className={`${styles.heroCta} btn btn-primary`}>
          Take a Pause →
        </Link>
        <a href="#modules" className={`btn btn-secondary`} style={{ fontSize: '0.95rem' }}>
          Explore Experiences
        </a>
      </motion.div>

      <motion.div
        className={styles.heroMeta}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.6 }}
      >
        <span>✨ No ads</span>
        <span>·</span>
        <span>🔒 Your data stays yours</span>
        <span>·</span>
        <span>🆓 Free to use</span>
      </motion.div>
    </div>

    {/* Floating module previews */}
    <div className={styles.heroVisual} aria-hidden="true">
      <FloatingCards />
    </div>

    {/* Scroll cue */}
    <motion.div
      className={styles.scrollCue}
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      aria-hidden="true"
    >
      <span>↓</span>
    </motion.div>
  </section>
);

/* ─── Floating preview cards ─── */
const PREVIEW_CARDS = [
  { emoji: '🌿', label: 'Digital Garden',   top: '8%',  left: '5%',  rotate: -6,  delay: 0   },
  { emoji: '🎨', label: 'Creative Studio',  top: '28%', right: '4%', rotate: 5,   delay: 0.3 },
  { emoji: '🌊', label: 'Ocean Escape',     top: '55%', left: '8%',  rotate: -4,  delay: 0.6 },
  { emoji: '🎵', label: 'Soundscape',       top: '72%', right: '6%', rotate: 3,   delay: 0.9 },
  { emoji: '🎮', label: 'Play Zone',        top: '42%', left: '50%', rotate: -3,  delay: 1.1 },
];

const FloatingCards = () => (
  <div className={styles.floatingCards}>
    {PREVIEW_CARDS.map((card, i) => (
      <motion.div
        key={i}
        className={styles.floatCard}
        style={{ top: card.top, left: card.left, right: card.right, rotate: card.rotate }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 + card.delay, duration: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.08, rotate: 0 }}
      >
        <span className={styles.floatEmoji}>{card.emoji}</span>
        <span className={styles.floatLabel}>{card.label}</span>
      </motion.div>
    ))}
  </div>
);

/* ─── Features Strip ─── */
const Features = () => (
  <Section className={styles.features} id="features">
    <div className={styles.container}>
      <motion.div className={styles.sectionHeader} variants={fadeUp}>
        <span className={styles.sectionBadge}>Why Breather?</span>
        <h2 className={styles.sectionTitle}>Built for your real-life rhythm</h2>
        <p className={styles.sectionDesc}>
          Not a meditation app. Not a therapy platform. Just a calm corner of the internet
          that belongs to you.
        </p>
      </motion.div>

      <div className={styles.featuresGrid}>
        {FEATURES.map((f, i) => (
          <motion.div key={i} className={styles.featureCard} variants={stagger(i * 0.1)}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <h3 className={styles.featureLabel}>{f.label}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);

/* ─── Module Showcase ─── */
const Modules = () => (
  <Section className={styles.modules} id="modules">
    <div className={styles.container}>
      <motion.div className={styles.sectionHeader} variants={fadeUp}>
        <span className={styles.sectionBadge}>Six Experiences</span>
        <h2 className={styles.sectionTitle}>Choose how you want to unwind</h2>
        <p className={styles.sectionDesc}>
          Each module is a completely different way to take a break.
          Switch between them anytime — your progress is always saved.
        </p>
      </motion.div>

      <div className={styles.modulesGrid}>
        {MODULES.map((mod, i) => (
          <motion.div
            key={mod.id}
            className={styles.moduleCard}
            variants={stagger(i * 0.08)}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <div
              className={styles.moduleIcon}
              style={{
                background: `linear-gradient(135deg, ${mod.color}33 0%, ${mod.accent}22 100%)`,
                border: `1.5px solid ${mod.color}44`,
              }}
            >
              {mod.emoji}
            </div>

            <div className={styles.moduleBody}>
              <span
                className={styles.moduleTagline}
                style={{ color: mod.color }}
              >
                {mod.tagline}
              </span>
              <h3 className={styles.moduleTitle}>{mod.title}</h3>
              <p className={styles.moduleDesc}>{mod.desc}</p>
            </div>

            <Link
              to="/register"
              className={styles.moduleBtn}
              style={{
                background: `linear-gradient(135deg, ${mod.color}, ${mod.accent})`,
              }}
            >
              Try it →
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);

/* ─── Testimonials ─── */
const Testimonials = () => (
  <Section className={styles.testimonials}>
    <div className={styles.container}>
      <motion.div className={styles.sectionHeader} variants={fadeUp}>
        <span className={styles.sectionBadge}>Student Stories</span>
        <h2 className={styles.sectionTitle}>Real moments, real relief</h2>
      </motion.div>

      <div className={styles.testimonialsGrid}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={i} className={styles.testimonialCard} variants={stagger(i * 0.12)}>
            <div className={styles.quoteIcon}>❝</div>
            <p className={styles.quoteText}>{t.quote}</p>
            <div className={styles.quoteAuthor}>
              <div className={styles.quoteAvatar}>
                {t.name[0]}
              </div>
              <div>
                <p className={styles.quoteName}>{t.name}</p>
                <p className={styles.quoteRole}>{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);

/* ─── CTA Banner ─── */
const CTABanner = () => (
  <Section className={styles.ctaBanner}>
    <div className={styles.ctaInner}>
      <AmbientOrbs variant="soft" />
      <div className={styles.ctaContent}>
        <motion.h2 className={styles.ctaTitle} variants={fadeUp}>
          Ready to take your first breath?
        </motion.h2>
        <motion.p className={styles.ctaDesc} variants={stagger(0.12)}>
          Join thousands of students finding their calm — one experience at a time.
        </motion.p>
        <motion.div className={styles.ctaActions} variants={stagger(0.22)}>
          <Link to="/register" className={`btn btn-primary ${styles.ctaBtn}`}>
            Start for Free
          </Link>
          <Link to="/login" className={`btn ${styles.ctaBtnGhost}`}>
            Already have an account
          </Link>
        </motion.div>
      </div>
    </div>
  </Section>
);

/* ─── Footer ─── */
const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <span>🌿</span>
          <span className={styles.footerBrandName}>Breather</span>
        </div>
        <p className={styles.footerTagline}>A Digital Space to Unwind</p>
      </div>

      <div className={styles.footerLinks}>
        <a href="#features">Features</a>
        <a href="#modules">Experiences</a>
        <Link to="/login">Sign In</Link>
        <Link to="/register">Get Started</Link>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2026 Breather. Built with 💙 as an engineering major project.</p>
        <div className={styles.footerModules}>
          {['🌿', '🎨', '🌅', '🎮', '🎵', '🛋️'].map((e, i) => (
            <span key={i} className={styles.footerEmoji}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─── Page ─── */
const LandingPage = () => (
  <div className={styles.page}>
    <Navbar />
    <Hero />
    <Features />
    <Modules />
    <Testimonials />
    <CTABanner />
    <Footer />
  </div>
);

export default LandingPage;
