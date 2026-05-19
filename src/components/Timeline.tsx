import styles from './Timeline.module.css';

type Entry = {
  id: string;
  year: string;
  tag: string;
  headline: string;
  body: string;
};

type Props = {
  heading: string;
  entries: Entry[];
};

export default function Timeline({ heading, entries }: Props) {
  return (
    <div className={styles.wrap} data-testid="timeline-wrap">
      <h3 className={styles.heading} data-testid="timeline-heading">
        {heading}
      </h3>

      <div className={styles.viewport}>
        <ol className={styles.dots} data-testid="timeline-list">
          {entries.map((e) => (
            <li
              key={e.id}
              className={styles.item}
              data-testid={`timeline-item-${e.id}`}
              tabIndex={0}
              aria-label={`${e.year} — ${e.headline}`}
            >
              <span className={styles.dot} aria-hidden="true" />
              <span className={`mono ${styles.year}`} data-testid={`timeline-year-${e.id}`}>
                {e.year}
              </span>
              <span className={styles.tag} data-testid={`timeline-tag-${e.id}`}>
                {e.tag}
              </span>
              <div className={styles.popover} role="tooltip" data-testid={`timeline-popover-${e.id}`}>
                <p className={styles.headline} data-testid={`timeline-headline-${e.id}`}>
                  {e.headline}
                </p>
                <p className={styles.body} data-testid={`timeline-body-${e.id}`}>
                  {e.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
