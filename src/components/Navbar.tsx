'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import site from '@/content/site.json';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('home');
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

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

  // close the mobile overlay on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // lock body scroll while the overlay is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
        data-testid="site-header"
      >
        <div className={styles.inner}>
          <a href="#home" className={`mono ${styles.brand}`} data-testid="brand">
            {site.name}
          </a>

          <nav className={styles.navDesktop} aria-label="Primary" data-testid="primary-nav">
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

          <button
            type="button"
            className={styles.burger}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            data-testid="nav-burger"
          >
            <span className={`${styles.burgerBar} ${open ? styles.burgerBar1Open : ''}`} />
            <span className={`${styles.burgerBar} ${open ? styles.burgerBar2Open : ''}`} />
            <span className={`${styles.burgerBar} ${open ? styles.burgerBar3Open : ''}`} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className={styles.overlay}
            data-testid="mobile-nav"
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={() => setOpen(false)}
          >
            <motion.nav
              className={styles.overlayNav}
              aria-label="Mobile primary"
              initial={reduce ? { y: 0 } : { y: -16 }}
              animate={{ y: 0 }}
              exit={reduce ? { y: 0 } : { y: -8 }}
              transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {site.nav.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`${styles.overlayLink} ${active === item.id ? styles.overlayActive : ''}`}
                  data-testid={`mobile-nav-link-${item.id}`}
                  onClick={() => setOpen(false)}
                >
                  <span className={`mono ${styles.overlayNum}`}>
                    {String(site.nav.indexOf(item)).padStart(2, '0')}
                  </span>
                  <span>{item.label}</span>
                </a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
