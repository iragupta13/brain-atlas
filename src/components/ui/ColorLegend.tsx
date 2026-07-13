import { useBrainStore } from '../../stores/useBrainStore';
import { SUPER_REGIONS, LOBE_GROUPS } from '../../data/hierarchy';
import styles from './ColorLegend.module.css';

// Level 0 items (5 super-regions)
const LEVEL_0_ITEMS = Object.values(SUPER_REGIONS).map(node => ({
  key: node.id,
  name: node.displayName,
  color: node.color,
}));

// Level 1+ items (11 groups)
const LEVEL_1_ITEMS = [
  { key: 'Frontal_Lobe', name: 'Frontal', color: LOBE_GROUPS.Frontal_Lobe.color },
  { key: 'Parietal_Lobe', name: 'Parietal', color: LOBE_GROUPS.Parietal_Lobe.color },
  { key: 'Temporal_Lobe', name: 'Temporal', color: LOBE_GROUPS.Temporal_Lobe.color },
  { key: 'Occipital_Lobe', name: 'Occipital', color: LOBE_GROUPS.Occipital_Lobe.color },
  { key: 'Cingulate_Cortex', name: 'Cingulate', color: LOBE_GROUPS.Cingulate_Cortex.color },
  { key: 'Cerebellum', name: 'Cerebellum', color: LOBE_GROUPS.Cerebellum.color },
  { key: 'Basal_Ganglia', name: 'Basal Ganglia', color: LOBE_GROUPS.Basal_Ganglia.color },
  { key: 'Medial_Temporal', name: 'Medial Temporal', color: LOBE_GROUPS.Medial_Temporal.color },
  { key: 'Thalamus', name: 'Thalamus', color: LOBE_GROUPS.Thalamus.color },
  { key: 'Brainstem', name: 'Brainstem', color: LOBE_GROUPS.Brainstem.color },
  { key: 'Insula', name: 'Insula', color: LOBE_GROUPS.Insula.color },
];

export function ColorLegend() {
  const { highlightedGroup, setHighlightedGroup, detailLevel } = useBrainStore();

  const handleClick = (groupKey: string) => {
    // Toggle off if clicking the same group
    if (highlightedGroup === groupKey) {
      setHighlightedGroup(null);
    } else {
      setHighlightedGroup(groupKey);
    }
  };

  // Use different items based on detail level
  const items = detailLevel === 0 ? LEVEL_0_ITEMS : LEVEL_1_ITEMS;
  const title = detailLevel === 0 ? 'Super-Regions' : 'Brain Regions';

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.hint}>Click to highlight group</p>
      <div className={styles.legend}>
        {items.map(({ key, name, color }) => (
          <button
            key={key}
            className={`${styles.item} ${highlightedGroup === key ? styles.active : ''} ${highlightedGroup && highlightedGroup !== key ? styles.dimmed : ''}`}
            onClick={() => handleClick(key)}
          >
            <span className={styles.swatch} style={{ backgroundColor: color, color }} />
            <span className={styles.label}>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
