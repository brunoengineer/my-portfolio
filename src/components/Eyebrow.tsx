import styles from './Eyebrow.module.css';

type Props = {
  number: string;
  label: string;
  testId?: string;
};

export default function Eyebrow({ number, label, testId }: Props) {
  return (
    <p className={`eyebrow ${styles.eyebrow}`} data-testid={testId}>
      <span className={styles.num}>{number}</span>
      <span className={styles.slash}> / </span>
      <span>{label}</span>
    </p>
  );
}
