'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import site from '@/content/site.json';
import styles from './Hero.module.css';
import Eyebrow from './Eyebrow';
import { asset } from '@/lib/asset';

const container: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const item: Variants = reduce
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : rise;

  return (
    <section id="home" className={styles.hero} data-testid="hero">
      <motion.div
        className={styles.inner}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className={styles.text}>
          <motion.div variants={item}>
            <Eyebrow number="00" label="introduction" testId="hero-eyebrow" />
          </motion.div>

          <motion.h1
            className={styles.name}
            data-testid="hero-name"
            variants={item}
          >
            {site.name}
          </motion.h1>

          <motion.p
            className={`mono ${styles.role}`}
            data-testid="hero-role"
            variants={item}
          >
            {site.role}
          </motion.p>

          <motion.p
            className={styles.tagline}
            data-testid="hero-tagline"
            variants={item}
          >
            {site.tagline}
          </motion.p>

          <motion.div className={styles.pills} variants={item} data-testid="hero-pills">
            <span className={`mono ${styles.pill}`} data-testid="hero-status">
              <span className={styles.dot} aria-hidden="true" />
              available for opportunities
            </span>
          </motion.div>
        </div>

        <motion.div className={styles.photoWrap} variants={item}>
          <div className={styles.photoFrame} data-testid="hero-photo">
            <span className={styles.photoGlow} aria-hidden="true" />
            <span className={styles.photoRing} aria-hidden="true" />
            <img
              src={asset('/me.jpg')}
              alt={site.name}
              className={styles.photo}
              width={360}
              height={360}
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
