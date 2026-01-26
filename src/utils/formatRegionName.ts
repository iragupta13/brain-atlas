import regionsData from '../data/regions.json';

const regions = regionsData as Record<string, { displayName: string }>;

/**
 * Format a region name for display.
 * Uses pre-computed displayName if available, otherwise formats the raw name.
 */
export function formatRegionName(name: string): string {
  // Check if we have a pre-computed display name
  if (regions[name]?.displayName) {
    return regions[name].displayName;
  }

  // Fallback: basic formatting
  let formatted = name;

  // Handle hemisphere suffix
  let suffix = '';
  if (formatted.endsWith('_L')) {
    formatted = formatted.slice(0, -2);
    suffix = ' (Left)';
  } else if (formatted.endsWith('_R')) {
    formatted = formatted.slice(0, -2);
    suffix = ' (Right)';
  }

  // Replace underscores with spaces
  formatted = formatted.replace(/_/g, ' ');

  return formatted + suffix;
}
