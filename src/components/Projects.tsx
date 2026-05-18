import projects from '@/content/projects.json';
import styles from './Projects.module.css';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
};

export default function Projects() {
  return (
    <section
      id="projects"
      className={styles.section}
      data-testid="projects-section"
      aria-labelledby="projects-heading"
    >
      <h2 id="projects-heading" className={styles.heading} data-testid="projects-heading">
        Projects
      </h2>

      <ul className={styles.grid} data-testid="projects-grid">
        {(projects as Project[]).map((p) => (
          <li key={p.id} className={styles.card} data-testid={`project-card-${p.id}`}>
            <div className={styles.media} data-testid={`project-image-${p.id}`}>
              {p.image ? (
                <img src={p.image} alt="" className={styles.mediaImg} />
              ) : (
                <div className={styles.mediaPlaceholder} aria-hidden="true" />
              )}
            </div>

            <h3 className={styles.title} data-testid={`project-title-${p.id}`}>
              {p.title}
            </h3>

            <p className={styles.description} data-testid={`project-description-${p.id}`}>
              {p.description}
            </p>

            <div className={styles.links}>
              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  data-testid={`project-link-github-${p.id}`}
                >
                  GitHub
                </a>
              )}
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  data-testid={`project-link-live-${p.id}`}
                >
                  Live demo
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
