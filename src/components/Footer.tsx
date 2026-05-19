import footer from '@/content/footer.json';
import styles from './Footer.module.css';

type Social = {
  id: string;
  name: string;
  url: string;
  iconSlug: string | null;
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} data-testid="site-footer">
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
                {s.iconSlug ? (
                  <img
                    src={`https://cdn.simpleicons.org/${s.iconSlug}`}
                    alt=""
                    className={styles.icon}
                    loading="lazy"
                    width={24}
                    height={24}
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
    </footer>
  );
}
