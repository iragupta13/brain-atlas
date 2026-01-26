import { useEffect, useState } from 'react';
import { useBrainStore } from '../../stores/useBrainStore';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  onSearch?: (query: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const { searchQuery, setSearchQuery } = useBrainStore();
  const [localValue, setLocalValue] = useState(searchQuery);

  // Debounce the search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(localValue);
      onSearch?.(localValue);
    }, 150);

    return () => clearTimeout(timeout);
  }, [localValue, setSearchQuery, onSearch]);

  // Sync with external changes
  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        placeholder="Search regions... (try 'left hippocampus')"
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
