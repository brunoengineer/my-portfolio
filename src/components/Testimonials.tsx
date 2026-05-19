'use client';

import { useMemo } from 'react';
import testimonials from '@/content/testimonials.json';
import styles from './Testimonials.module.css';
import SectionHeading from './SectionHeading';

type Item = {
  id: string;
  name: string;
  origin: string;
  quote: string;
};

function Card({ item }: { item: Item }) {
  return (
    <article className={styles.card} data-testid={`testimonial-card-${item.id}`}>
      <span className={styles.mark} aria-hidden="true">
        “
      </span>
      <p className={styles.quote} data-testid={`testimonial-quote-${item.id}`}>
        {item.quote}
      </p>
      <footer className={styles.attribution}>
        <span className={styles.name} data-testid={`testimonial-name-${item.id}`}>
          {item.name}
        </span>
        <span className={`mono ${styles.origin}`} data-testid={`testimonial-origin-${item.id}`}>
          {item.origin}
        </span>
      </footer>
    </article>
  );
}

function Row({
  items,
  reverse,
  testId,
}: {
  items: Item[];
  reverse?: boolean;
  testId: string;
}) {
  // duplicate items so the loop is seamless (translateX(-50%) lands on identical content)
  const sequence = useMemo(() => [...items, ...items], [items]);
  return (
    <div className={styles.rowMask}>
      <div
        className={`${styles.row} ${reverse ? styles.rowReverse : ''}`}
        data-testid={testId}
      >
        {sequence.map((item, i) => (
          <Card key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const items = testimonials.items as Item[];
  // split roughly evenly between two rows for visual rhythm
  const half = Math.ceil(items.length / 2);
  const rowA = items.slice(0, half);
  const rowB = items.slice(half).concat(items.slice(0, Math.max(0, half - (items.length - half))));

  return (
    <section
      id="testimonials"
      className={styles.section}
      data-testid="testimonials-section"
      aria-labelledby="testimonials-heading"
    >
      <SectionHeading
        number="05"
        label="kind words"
        title="Testimonials"
        testIdPrefix="testimonials"
        description={testimonials.intro}
      />

      <div className={styles.marquee} data-testid="testimonials-marquee">
        <Row items={rowA} testId="testimonials-row-a" />
        <Row items={rowB} reverse testId="testimonials-row-b" />
      </div>
    </section>
  );
}
