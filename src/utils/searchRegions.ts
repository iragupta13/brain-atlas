import regionsData from '../data/regions.json';

const regions = regionsData as Record<string, {
  displayName: string;
  hemisphere: string;
  group: string;
}>;

/**
 * Search for regions matching a query.
 * Supports hemisphere filtering (e.g., "left frontal", "right hippocampus")
 */
export function searchRegions(query: string, meshNames: string[]): string[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const words = normalizedQuery.split(/\s+/);

  // Check for hemisphere keywords
  let hemisphereFilter: 'left' | 'right' | null = null;
  const filteredWords: string[] = [];

  for (const word of words) {
    if (word === 'left' || word === 'l') {
      hemisphereFilter = 'left';
    } else if (word === 'right' || word === 'r') {
      hemisphereFilter = 'right';
    } else {
      filteredWords.push(word);
    }
  }

  const searchTerms = filteredWords.join(' ');

  return meshNames.filter((name) => {
    const region = regions[name];
    if (!region) return false;

    // Apply hemisphere filter
    if (hemisphereFilter && region.hemisphere !== hemisphereFilter) {
      return false;
    }

    // Search in name and display name
    const searchable = `${name} ${region.displayName} ${region.group}`.toLowerCase();

    // All remaining search terms must match
    if (searchTerms) {
      return filteredWords.every(term => searchable.includes(term));
    }

    // If only hemisphere filter was specified, return all matching hemisphere
    return true;
  });
}
