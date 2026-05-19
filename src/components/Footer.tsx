import footer from '@/content/footer.json';
import styles from './Footer.module.css';

type Social = {
  id: string;
  name: string;
  url: string;
  iconSlug: string | null;
  iconPath?: string | null;
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} data-testid="site-footer">
      <div className={styles.inner}>
        <div className={styles.status} data-testid="footer-status" aria-label="Project status">
          <span className={styles.prompt} aria-hidden="true">$</span>
          <span className={styles.statusItem}>
            <span className={styles.dot} aria-hidden="true" />
            tests:&nbsp;playwright
          </span>
          <span className={styles.sep} aria-hidden="true">·</span>
          <span className={styles.statusItem}>ci:&nbsp;github&nbsp;actions</span>
          <span className={styles.sep} aria-hidden="true">·</span>
          <span className={styles.statusItem}>build:&nbsp;static</span>
        </div>

        <ul className={styles.socials} data-testid="footer-socials" aria-label="Social links">
          {(footer.socials as Social[]).map((s) => (
            <li key={s.id} className={styles.item} data-testid={`footer-social-${s.id}`}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                data-testid={`footer-social-link-${s.id}`}
                aria-label={s.name}
              >
                <span className={styles.iconWrap} data-testid={`footer-social-icon-${s.id}`}>
                  {s.iconPath || s.iconSlug ? (
                    <img
                      src={s.iconPath ?? `https://cdn.simpleicons.org/${s.iconSlug}`}
                      alt=""
                      className={styles.icon}
                      loading="lazy"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <span className={styles.fallback} aria-hidden="true">
                      {s.name.charAt(0)}
                    </span>
                  )}
                </span>
                <span className={styles.srOnly}>{s.name}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.copy} data-testid="footer-copy">
          © {year} Bruno Peres
        </p>
      </div>
    </footer>
  );
}
