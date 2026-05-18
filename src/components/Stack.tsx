import stack from '@/content/stack.json';
import styles from './Stack.module.css';

type StackItem = {
  id: string;
  name: string;
  url: string;
  iconSlug: string | null;
};

export default function Stack() {
  return (
    <section
      id="stack"
      className={styles.section}
      data-testid="stack-section"
      aria-labelledby="stack-heading"
    >
      <h2 id="stack-heading" className={styles.heading} data-testid="stack-heading">
        Stack
      </h2>

      <ul className={styles.grid} data-testid="stack-grid">
        {(stack as StackItem[]).map((item) => (
          <li key={item.id} className={styles.item} data-testid={`stack-item-${item.id}`}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              data-testid={`stack-link-${item.id}`}
              aria-label={item.name}
            >
              <span className={styles.iconWrap} data-testid={`stack-icon-${item.id}`}>
                {item.iconSlug ? (
                  <img
                    src={`https://cdn.simpleicons.org/${item.iconSlug}`}
                    alt=""
                    className={styles.icon}
                    loading="lazy"
                    width={40}
                    height={40}
                  />
                ) : (
                  <span className={styles.fallback} aria-hidden="true">
                    {item.name.charAt(0)}
                  </span>
                )}
              </span>
              <span className={styles.name} data-testid={`stack-name-${item.id}`}>
                {item.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
