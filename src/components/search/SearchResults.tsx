import { useMemo } from 'react';
import { useBrainStore } from '../../stores/useBrainStore';
import { searchRegions } from '../../utils/searchRegions';
import { semanticSearch } from '../../utils/semanticSearch';
import { formatRegionName } from '../../utils/formatRegionName';
import styles from './SearchResults.module.css';

export function SearchResults() {
  const {
    searchQuery,
    meshNames,
    selection,
    selectNode,
  } = useBrainStore();

  const regionResults = useMemo(() => {
    return searchRegions(searchQuery, meshNames);
  }, [searchQuery, meshNames]);

  const semanticResults = useMemo(() => {
    return semanticSearch(searchQuery);
  }, [searchQuery]);

  if (!searchQuery.trim()) {
    return null;
  }

  // Show semantic results if it's a semantic query
  if (semanticResults.isSemanticQuery && semanticResults.results.length > 0) {
    return (
      <div className={styles.container}>
        {semanticResults.results.slice(0, 3).map((result) => (
          <div key={result.function.id} className={styles.functionCard}>
            <div className={styles.functionHeader}>
              <span className={styles.functionName}>{result.function.name}</span>
            </div>
            <p className={styles.functionExplanation}>{result.function.explanation}</p>

            {result.function.primaryRegions.length > 0 && (
              <div className={styles.regionSection}>
                <span className={styles.regionLabel}>Primary Regions</span>
                <div className={styles.regionList}>
                  {result.function.primaryRegions
                    .filter((r) => meshNames.includes(r))
                    .map((region) => (
                      <button
                        key={region}
                        className={`${styles.regionButton} ${styles.primary} ${selection?.nodeId === region ? styles.selected : ''}`}
                        onClick={() => selectNode(region, 2)}
                      >
                        {formatRegionName(region)}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {result.function.secondaryRegions.length > 0 && (
              <div className={styles.regionSection}>
                <span className={styles.regionLabel}>Secondary Regions</span>
                <div className={styles.regionList}>
                  {result.function.secondaryRegions
                    .filter((r) => meshNames.includes(r))
                    .map((region) => (
                      <button
                        key={region}
                        className={`${styles.regionButton} ${styles.secondary} ${selection?.nodeId === region ? styles.selected : ''}`}
                        onClick={() => selectNode(region, 2)}
                      >
                        {formatRegionName(region)}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Fallback to basic region search
  if (regionResults.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No matching regions found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.count}><span>{regionResults.length}</span> regions found</div>
      <div className={styles.list}>
        {regionResults.map((name) => (
          <button
            key={name}
            className={`${styles.item} ${selection?.nodeId === name ? styles.selected : ''}`}
            onClick={() => selectNode(name, 2)}
          >
            {formatRegionName(name)}
          </button>
        ))}
      </div>
    </div>
  );
}
