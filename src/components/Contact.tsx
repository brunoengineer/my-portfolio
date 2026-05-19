'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import contact from '@/content/contact.json';
import styles from './Contact.module.css';
import SectionHeading from './SectionHeading';

type Channel = {
  id: string;
  label: string;
  value: string;
  href: string;
};

const ICONS: Record<string, ReactNode> = {
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .3a12 12 0 0 0-3.79 23.38c.6.1.83-.26.83-.58v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.13-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .3" />
    </svg>
  ),
};

const gridVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};

export default function Contact() {
  const reduce = useReducedMotion();
  return (
    <section
      id="contact"
      className={styles.section}
      data-testid="contact-section"
      aria-labelledby="contact-heading"
    >
      <SectionHeading
        number="04"
        label="get in touch"
        title="Contact"
        testIdPrefix="contact"
        description={contact.intro}
      />

      <motion.ul
        className={styles.grid}
        data-testid="contact-grid"
        variants={gridVariants}
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {(contact.channels as Channel[]).map((c) => {
          const isExternal = c.href.startsWith('http');
          return (
            <motion.li
              key={c.id}
              className={styles.card}
              data-testid={`contact-card-${c.id}`}
              variants={cardVariants}
            >
              <a
                href={c.href}
                className={styles.link}
                data-testid={`contact-link-${c.id}`}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className={styles.iconWrap} aria-hidden="true">
                  {ICONS[c.id]}
                </span>
                <span className={styles.text}>
                  <span className={`mono ${styles.label}`} data-testid={`contact-label-${c.id}`}>
                    {c.label}
                  </span>
                  <span className={styles.value} data-testid={`contact-value-${c.id}`}>
                    {c.value}
                  </span>
                </span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </a>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
