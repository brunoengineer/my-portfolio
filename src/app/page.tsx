import site from '@/content/site.json';
import styles from './page.module.css';

export default function Home() {
  return (
    <main data-testid="home-page">
      <header className={styles.header} data-testid="site-header">
        <div className={styles.brand} data-testid="brand">{site.name}</div>
        <nav className={styles.nav} aria-label="Primary" data-testid="primary-nav">
          {site.nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={styles.navLink}
              data-testid={`nav-link-${item.id}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="home" className={styles.hero} data-testid="hero">
        <p className={styles.heroEyebrow} data-testid="hero-role">{site.role}</p>
        <h1 className={styles.heroName} data-testid="hero-name">{site.name}</h1>
        <p className={styles.heroTagline} data-testid="hero-tagline">{site.tagline}</p>
      </section>
    </main>
  );
}
