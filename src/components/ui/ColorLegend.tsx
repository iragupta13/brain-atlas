import styles from './ColorLegend.module.css';

const LOBE_COLORS = [
  { name: 'Frontal', color: '#5b9bd5' },
  { name: 'Parietal', color: '#70ad47' },
  { name: 'Temporal', color: '#ed7d31' },
  { name: 'Occipital', color: '#9966cc' },
  { name: 'Cingulate', color: '#e84a5f' },
  { name: 'Cerebellum', color: '#20b2aa' },
  { name: 'Basal Ganglia', color: '#c9a227' },
  { name: 'Thalamus', color: '#cd853f' },
];

export function ColorLegend() {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Brain Regions</h4>
      <div className={styles.legend}>
        {LOBE_COLORS.map(({ name, color }) => (
          <div key={name} className={styles.item}>
            <span className={styles.swatch} style={{ backgroundColor: color }} />
            <span className={styles.label}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
