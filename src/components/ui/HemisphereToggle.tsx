import { useBrainStore, type HemisphereView } from '../../stores/useBrainStore';
import styles from './HemisphereToggle.module.css';

const views: { value: HemisphereView; label: string }[] = [
  { value: 'both', label: 'Full Brain' },
  { value: 'left', label: 'Left Half' },
  { value: 'right', label: 'Right Half' },
];

export function HemisphereToggle() {
  const { hemisphereView, setHemisphereView } = useBrainStore();

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Internal View</h4>
      <p className={styles.hint}>Split brain to see deep structures</p>
      <div className={styles.buttons}>
        {views.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.button} ${hemisphereView === value ? styles.active : ''}`}
            onClick={() => setHemisphereView(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
