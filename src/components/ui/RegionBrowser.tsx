import { useMemo, useState } from 'react';
import { useBrainStore } from '../../stores/useBrainStore';
import { formatRegionName } from '../../utils/formatRegionName';
import regionsData from '../../data/regions.json';
import styles from './RegionBrowser.module.css';

const regions = regionsData as Record<string, { group: string; displayName: string }>;

// Group display names
const groupNames: Record<string, string> = {
  Frontal_Lobe: 'Frontal Lobe',
  Parietal_Lobe: 'Parietal Lobe',
  Temporal_Lobe: 'Temporal Lobe',
  Occipital_Lobe: 'Occipital Lobe',
  Cingulate_Cortex: 'Cingulate Cortex',
  Basal_Ganglia: 'Basal Ganglia',
  Medial_Temporal: 'Medial Temporal',
  Cerebellum: 'Cerebellum',
  Thalamus: 'Thalamus',
  Brainstem: 'Brainstem',
  Other: 'Other Regions',
};

export function RegionBrowser() {
  const { meshNames, selectedRegion, setSelectedRegion } = useBrainStore();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group regions by category
  const groupedRegions = useMemo(() => {
    const groups: Record<string, string[]> = {};

    meshNames.forEach((name) => {
      const region = regions[name];
      const group = region?.group || 'Other';

      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(name);
    });

    // Sort regions within each group
    Object.values(groups).forEach((arr) => {
      arr.sort((a, b) => formatRegionName(a).localeCompare(formatRegionName(b)));
    });

    return groups;
  }, [meshNames]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  // Define group order
  const orderedGroups = [
    'Frontal_Lobe',
    'Parietal_Lobe',
    'Temporal_Lobe',
    'Occipital_Lobe',
    'Medial_Temporal',
    'Cingulate_Cortex',
    'Basal_Ganglia',
    'Thalamus',
    'Cerebellum',
    'Brainstem',
    'Other',
  ].filter((g) => groupedRegions[g]);

  return (
    <div className={styles.container}>
      <div className={styles.label}>Browse by Region</div>
      <div className={styles.groups}>
        {orderedGroups.map((group) => (
          <div key={group} className={styles.group}>
            <button
              className={styles.groupHeader}
              onClick={() => toggleGroup(group)}
            >
              <span className={styles.arrow}>
                {expandedGroups.has(group) ? '▼' : '▶'}
              </span>
              <span className={styles.groupName}>
                {groupNames[group] || group}
              </span>
              <span className={styles.count}>
                {groupedRegions[group].length}
              </span>
            </button>

            {expandedGroups.has(group) && (
              <div className={styles.regionList}>
                {groupedRegions[group].map((name) => (
                  <button
                    key={name}
                    className={`${styles.regionItem} ${selectedRegion === name ? styles.selected : ''}`}
                    onClick={() => setSelectedRegion(name)}
                  >
                    {formatRegionName(name)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
