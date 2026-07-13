import { useEffect, useState } from 'react';
import { useBrainStore } from '../../stores/useBrainStore';
import styles from './SearchInput.module.css';

export function SearchInput() {
  const { searchQuery, setSearchQuery } = useBrainStore();
  const [localValue, setLocalValue] = useState(searchQuery);

  // Debounce the search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(localValue);
    }, 150);

    return () => clearTimeout(timeout);
  }, [localValue, setSearchQuery]);

  // Sync with external changes
  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        placeholder="Search brain regions..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          className={styles.clearButton}
          onClick={() => setLocalValue('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
