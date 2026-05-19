'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import about from '@/content/about.json';
import styles from './About.module.css';
import SectionHeading from './SectionHeading';

type Stat = { id: string; value: string; label: string };

const statsVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};

export default function About() {
  const reduce = useReducedMotion();
  return (
    <section
      id="about"
      className={styles.section}
      data-testid="about-section"
      aria-labelledby="about-heading"
    >
      <SectionHeading
        number="01"
        label="about"
        title="About"
        testIdPrefix="about"
      />

      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.bio} data-testid="about-bio">
            {about.bio}
          </p>
          {about.extras && (
            <p className={styles.extras} data-testid="about-extras">
              {about.extras}
            </p>
          )}
        </div>

        <motion.ul
          className={styles.stats}
          data-testid="about-stats"
          variants={statsVariants}
          initial={reduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {(about.stats as Stat[]).map((s) => (
            <motion.li
              key={s.id}
              className={styles.stat}
              data-testid={`about-stat-${s.id}`}
              variants={tileVariants}
            >
              <span className={styles.statValue} data-testid={`about-stat-value-${s.id}`}>
                {s.value}
              </span>
              <span className={styles.statLabel} data-testid={`about-stat-label-${s.id}`}>
                {s.label}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
