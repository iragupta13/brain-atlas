import { useMemo } from 'react';
import { useBrainStore } from '../../stores/useBrainStore';
import { searchRegions } from '../../utils/searchRegions';
import { formatRegionName } from '../../utils/formatRegionName';
import styles from './SearchResults.module.css';

export function SearchResults() {
  const {
    searchQuery,
    meshNames,
    selectedRegion,
    setSelectedRegion,
  } = useBrainStore();

  const results = useMemo(() => {
    return searchRegions(searchQuery, meshNames);
  }, [searchQuery, meshNames]);

  if (!searchQuery.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No matching regions found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.count}><span>{results.length}</span> regions found</div>
      <div className={styles.list}>
        {results.map((name) => (
          <button
            key={name}
            className={`${styles.item} ${selectedRegion === name ? styles.selected : ''}`}
            onClick={() => setSelectedRegion(name)}
          >
            {formatRegionName(name)}
          </button>
        ))}
      </div>
    </div>
  );
}
