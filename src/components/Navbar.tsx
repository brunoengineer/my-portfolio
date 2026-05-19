'use client';

import { useEffect, useState } from 'react';
import site from '@/content/site.json';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('home');

  useEffect(() => {
    let raf = 0;
    const ENTER = 32;
    const EXIT = 4;
    const update = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > EXIT : y > ENTER));
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const ids = site.nav.map((n) => n.id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      data-testid="site-header"
    >
      <div className={styles.inner}>
        <a href="#home" className={`mono ${styles.brand}`} data-testid="brand">
          {site.name}
        </a>
        <nav className={styles.nav} aria-label="Primary" data-testid="primary-nav">
          {site.nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`${styles.link} ${active === item.id ? styles.active : ''}`}
              data-testid={`nav-link-${item.id}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
