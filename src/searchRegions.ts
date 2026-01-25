/**
 * Searches brain region mesh names based on a query string.
 * - Case-insensitive matching
 * - Matches both hemispheres unless "left"/"right"/"L"/"R" is specified
 * - Matches against the raw mesh name (underscores treated as spaces)
 */

type HemisphereFilter = "left" | "right" | "both";

function parseQuery(query: string): { term: string; hemisphere: HemisphereFilter } {
  const q = query.trim().toLowerCase();

  // Check for hemisphere suffix
  if (q.endsWith(" left") || q.endsWith(" l")) {
    const term = q.replace(/ (left|l)$/, "").trim();
    return { term, hemisphere: "left" };
  }
  if (q.endsWith(" right") || q.endsWith(" r")) {
    const term = q.replace(/ (right|r)$/, "").trim();
    return { term, hemisphere: "right" };
  }

  return { term: q, hemisphere: "both" };
}

function normalizeName(meshName: string): string {
  // Remove hemisphere suffix for matching
  return meshName
    .replace(/_[LR]$/, "")
    .replace(/_/g, " ")
    .toLowerCase();
}

function getHemisphere(meshName: string): "left" | "right" | null {
  if (meshName.endsWith("_L")) return "left";
  if (meshName.endsWith("_R")) return "right";
  return null;
}

export function searchRegions(query: string, meshNames: string[]): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const { term, hemisphere } = parseQuery(trimmed);
  if (!term) return [];

  const matches: string[] = [];

  for (const name of meshNames) {
    const normalized = normalizeName(name);

    // Check if the term matches (substring match)
    if (!normalized.includes(term)) continue;

    // Filter by hemisphere if specified
    const meshHemisphere = getHemisphere(name);

    if (hemisphere === "both") {
      matches.push(name);
    } else if (hemisphere === meshHemisphere) {
      matches.push(name);
    } else if (meshHemisphere === null) {
      // Midline structure (no hemisphere), include it
      matches.push(name);
    }
  }

  return matches;
}
