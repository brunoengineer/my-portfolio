import styles from './SectionHeading.module.css';
import Eyebrow from './Eyebrow';

type Props = {
  number: string;
  label: string;
  title: string;
  testIdPrefix: string;
  description?: string;
};

export default function SectionHeading({ number, label, title, description, testIdPrefix }: Props) {
  const id = `${testIdPrefix}-heading`;
  return (
    <div className={styles.wrap}>
      <Eyebrow number={number} label={label} testId={`${testIdPrefix}-eyebrow`} />
      <h2 id={id} className={styles.title} data-testid={id}>
        {title}
      </h2>
      {description && (
        <p className={styles.desc} data-testid={`${testIdPrefix}-desc`}>
          {description}
        </p>
      )}
    </div>
  );
}
