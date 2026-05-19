import styles from './DonutChart.module.css';

type Slice = { id: string; value: number; color: string; label: string };

type Props = {
  slices: Slice[];
  centerValue: string | number;
  centerLabel: string;
  size?: number;
};

export default function DonutChart({ slices, centerValue, centerLabel, size = 200 }: Props) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 18;

  let offset = 0;
  const filled = slices.filter((s) => s.value > 0);

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label={`${centerLabel}: ${centerValue}`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {total > 0 &&
          filled.map((s) => {
            const length = (s.value / total) * circumference;
            const dash = `${length} ${circumference - length}`;
            const segment = (
              <circle
                key={s.id}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
            offset += length;
            return segment;
          })}
      </svg>
      <div className={styles.center}>
        <div className={styles.value}>{centerValue}</div>
        <div className={styles.label}>{centerLabel}</div>
      </div>
    </div>
  );
}
