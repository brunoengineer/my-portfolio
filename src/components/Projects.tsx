'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import projects from '@/content/projects.json';
import styles from './Projects.module.css';
import SectionHeading from './SectionHeading';
import { asset } from '@/lib/asset';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
};

const gridVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
};

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLLIElement>(null);
  const onMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  return (
    <motion.li
      ref={ref}
      className={styles.card}
      data-testid={`project-card-${project.id}`}
      variants={cardVariants}
      onMouseMove={onMove}
    >
      <span className={styles.spotlight} aria-hidden="true" />
      <div className={styles.cardBody}>
        <div className={styles.media} data-testid={`project-image-${project.id}`}>
          {project.image ? (
            <img src={asset(project.image)} alt="" className={styles.mediaImg} />
          ) : (
            <div className={styles.mediaPlaceholder} aria-hidden="true" />
          )}
        </div>
        <h3 className={styles.title} data-testid={`project-title-${project.id}`}>
          {project.title}
        </h3>
        <p className={styles.description} data-testid={`project-description-${project.id}`}>
          {project.description}
        </p>
        <div className={styles.links}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              data-testid={`project-link-github-${project.id}`}
            >
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              data-testid={`project-link-live-${project.id}`}
            >
              Live demo
            </a>
          )}
        </div>
      </div>
    </motion.li>
  );
}

export default function Projects() {
  const reduce = useReducedMotion();
  return (
    <section
      id="projects"
      className={styles.section}
      data-testid="projects-section"
      aria-labelledby="projects-heading"
    >
      <SectionHeading
        number="02"
        label="selected work"
        title="Projects"
        testIdPrefix="projects"
        description="Automation suites, test infrastructure, and tooling I've built or led."
      />

      <motion.ul
        className={styles.grid}
        data-testid="projects-grid"
        variants={gridVariants}
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {(projects as Project[]).map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </motion.ul>
    </section>
  );
}
