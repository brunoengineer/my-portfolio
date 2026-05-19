'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import stack from '@/content/stack.json';
import styles from './Stack.module.css';
import SectionHeading from './SectionHeading';

type StackItem = {
  id: string;
  name: string;
  url: string;
  iconSlug: string | null;
  iconPath?: string | null;
  hoverText?: string;
};

const DEFAULT_DESC =
  'The tools I reach for daily — testing, automation, observability, and the languages around them. Hover any tile for details.';

const gridVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.025 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] } },
};

export default function Stack() {
  const reduce = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const items = stack as StackItem[];
  const hovered = hoveredId ? items.find((s) => s.id === hoveredId) : null;
  const currentText = hovered?.hoverText ?? DEFAULT_DESC;
  const currentKey = hovered?.id ?? 'default';

  return (
    <section
      id="stack"
      className={styles.section}
      data-testid="stack-section"
      aria-labelledby="stack-heading"
    >
      <SectionHeading
        number="03"
        label="toolbox"
        title="Stack"
        testIdPrefix="stack"
        description={
          <div className={styles.descSwap} data-testid="stack-hover-text">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={currentKey}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: -3 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
                className={styles.descText}
              >
                {currentText}
              </motion.span>
            </AnimatePresence>
          </div>
        }
      />

      <motion.ul
        className={styles.grid}
        data-testid="stack-grid"
        variants={gridVariants}
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        onMouseLeave={() => setHoveredId(null)}
      >
        {items.map((s) => (
          <motion.li
            key={s.id}
            className={styles.item}
            data-testid={`stack-item-${s.id}`}
            variants={itemVariants}
            onMouseEnter={() => setHoveredId(s.id)}
            onFocus={() => setHoveredId(s.id)}
            onBlur={() => setHoveredId(null)}
          >
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              data-testid={`stack-link-${s.id}`}
              aria-label={s.name}
            >
              <span className={styles.iconWrap} data-testid={`stack-icon-${s.id}`}>
                {s.iconPath || s.iconSlug ? (
                  <img
                    src={s.iconPath ?? `https://cdn.simpleicons.org/${s.iconSlug}`}
                    alt=""
                    className={styles.icon}
                    loading="lazy"
                    width={40}
                    height={40}
                  />
                ) : (
                  <span className={styles.fallback} aria-hidden="true">
                    {s.name.charAt(0)}
                  </span>
                )}
              </span>
              <span className={styles.name} data-testid={`stack-name-${s.id}`}>
                {s.name}
              </span>
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
