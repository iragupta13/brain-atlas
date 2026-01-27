import { useBrainStore, type HemisphereView } from '../../stores/useBrainStore';
import { DETAIL_LEVEL_LABELS } from '../../data/hierarchy';
import type { DetailLevel } from '../../data/hierarchy';
import type { ViewPreset } from '../../types';
import styles from './ViewControls.module.css';

const viewPresets: { id: ViewPreset; label: string; icon: string }[] = [
  { id: 'lateral-left', label: 'Left', icon: '←' },
  { id: 'lateral-right', label: 'Right', icon: '→' },
  { id: 'anterior', label: 'Front', icon: '◎' },
  { id: 'posterior', label: 'Back', icon: '○' },
  { id: 'superior', label: 'Top', icon: '↑' },
  { id: 'inferior', label: 'Bottom', icon: '↓' },
];

const hemisphereViews: { value: HemisphereView; label: string }[] = [
  { value: 'both', label: 'Full' },
  { value: 'left', label: 'Left Interior' },
  { value: 'right', label: 'Right Interior' },
];

export function ViewControls() {
  const {
    currentView,
    setCurrentView,
    hemisphereView,
    setHemisphereView,
    detailLevel,
    setDetailLevel,
    resetView,
    clearSelection,
  } = useBrainStore();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value, 10) as DetailLevel;
    setDetailLevel(newLevel);
  };

  const levelInfo = DETAIL_LEVEL_LABELS[detailLevel];

  return (
    <div className={styles.container}>
      <h4 className={styles.sectionTitle}>View</h4>

      {/* Camera Angle */}
      <div className={styles.section}>
        <div className={styles.label}>Camera</div>
        <div className={styles.presets}>
          {viewPresets.map((preset) => (
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
      </div>

      {/* Internal View */}
      <div className={styles.section}>
        <div className={styles.label}>Internal View</div>
        <div className={styles.hemisphereButtons}>
          {hemisphereViews.map(({ value, label }) => (
            <button
              key={value}
              className={`${styles.hemisphereButton} ${hemisphereView === value ? styles.active : ''}`}
              onClick={() => setHemisphereView(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Level */}
      <div className={styles.section}>
        <div className={styles.label}>Detail Level</div>
        <div className={styles.sliderContainer}>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={detailLevel}
            onChange={handleSliderChange}
            className={styles.slider}
            aria-label="Detail level"
          />
          <div className={styles.levelLabels}>
            {[0, 1, 2].map((level) => (
              <button
                key={level}
                className={`${styles.levelLabel} ${detailLevel === level ? styles.active : ''}`}
                onClick={() => setDetailLevel(level as DetailLevel)}
              >
                {DETAIL_LEVEL_LABELS[level as DetailLevel].name}
              </button>
            ))}
          </div>
        </div>
        <p className={styles.description}>{levelInfo.description}</p>
      </div>

      {/* Reset Button */}
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
