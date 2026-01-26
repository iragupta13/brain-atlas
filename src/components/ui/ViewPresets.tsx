import { useBrainStore } from '../../stores/useBrainStore';
import type { ViewPreset } from '../../types';
import styles from './ViewPresets.module.css';

const presets: { id: ViewPreset; label: string; icon: string }[] = [
  { id: 'lateral-left', label: 'Left', icon: '←' },
  { id: 'lateral-right', label: 'Right', icon: '→' },
  { id: 'superior', label: 'Top', icon: '↑' },
  { id: 'anterior', label: 'Front', icon: '◎' },
  { id: 'posterior', label: 'Back', icon: '○' },
];

export function ViewPresets() {
  const { currentView, setCurrentView, resetView, clearSelection } = useBrainStore();

  return (
    <div className={styles.container}>
      <div className={styles.label}>View</div>
      <div className={styles.presets}>
        {presets.map((preset) => (
          <button
            key={preset.id}
            className={`${styles.preset} ${currentView === preset.id ? styles.active : ''}`}
            onClick={() => setCurrentView(preset.id)}
            title={preset.label}
          >
            <span className={styles.icon}>{preset.icon}</span>
            <span className={styles.text}>{preset.label}</span>
          </button>
        ))}
      </div>
      <button
        className={styles.resetButton}
        onClick={() => {
          resetView();
          clearSelection();
        }}
      >
        Reset All
      </button>
    </div>
  );
}
