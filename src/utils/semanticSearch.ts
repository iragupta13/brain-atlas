import { brainFunctions, type BrainFunction } from '../data/brainFunctions';

export interface SemanticSearchResult {
  function: BrainFunction;
  score: number;
  matchedKeywords: string[];
}

export interface SemanticSearchResponse {
  isSemanticQuery: boolean;
  results: SemanticSearchResult[];
  allPrimaryRegions: string[];
  allSecondaryRegions: string[];
}

const QUESTION_WORDS = ['what', 'which', 'where', 'how', 'why', 'who'];
const FUNCTION_VERBS = ['controls', 'responsible', 'handles', 'processes', 'involved', 'regulates', 'manages', 'affects', 'causes'];

/**
 * Determines if a query is a semantic/functional query vs a simple name search.
 */
export function isSemanticQuery(query: string): boolean {
  const normalized = query.toLowerCase().trim();

  // Check for question mark
  if (normalized.includes('?')) return true;

  // Check for question words at start
  const firstWord = normalized.split(/\s+/)[0];
  if (QUESTION_WORDS.includes(firstWord)) return true;

  // Check for function verbs
  if (FUNCTION_VERBS.some(verb => normalized.includes(verb))) return true;

  // Check for known function keywords (single word queries like "memory", "vision")
  const keywords = normalized.split(/\s+/).filter(w => w.length > 2);
  for (const fn of brainFunctions) {
    for (const keyword of fn.keywords) {
      if (keywords.some(k => k === keyword || keyword.includes(k) || k.includes(keyword))) {
        // Only match if it's clearly a function keyword, not a region name
        const isRegionName = normalized.includes('_') ||
          normalized.includes('left') ||
          normalized.includes('right') ||
          /^[a-z]+_[lr]$/i.test(normalized);
        if (!isRegionName) return true;
      }
    }
  }

  return false;
}

/**
 * Performs semantic search on brain functions.
 */
export function semanticSearch(query: string): SemanticSearchResponse {
  const normalized = query.toLowerCase().trim();
  const queryWords = normalized.split(/\s+/).filter(w => w.length > 1);

  if (!isSemanticQuery(query)) {
    return {
      isSemanticQuery: false,
      results: [],
      allPrimaryRegions: [],
      allSecondaryRegions: [],
    };
  }

  const scoredResults: SemanticSearchResult[] = [];

  for (const fn of brainFunctions) {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Function name exact match: +20
    if (normalized.includes(fn.name.toLowerCase())) {
      score += 20;
      matchedKeywords.push(fn.name);
    }

    // Function name partial match: +15
    const fnNameWords = fn.name.toLowerCase().split(/\s+/);
    for (const nameWord of fnNameWords) {
      if (queryWords.some(qw => qw === nameWord || nameWord.includes(qw))) {
        score += 15;
        matchedKeywords.push(nameWord);
      }
    }

    // Keyword exact match: +10
    for (const keyword of fn.keywords) {
      if (queryWords.includes(keyword)) {
        score += 10;
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    }

    // Keyword partial match (query word in keyword or vice versa): +5
    for (const keyword of fn.keywords) {
      for (const queryWord of queryWords) {
        if (queryWord !== keyword && (keyword.includes(queryWord) || queryWord.includes(keyword))) {
          score += 5;
          if (!matchedKeywords.includes(keyword)) {
            matchedKeywords.push(keyword);
          }
        }
      }
    }

    // Description match: +3
    const descWords = fn.description.toLowerCase().split(/\s+/);
    for (const queryWord of queryWords) {
      if (descWords.includes(queryWord) && !QUESTION_WORDS.includes(queryWord)) {
        score += 3;
      }
    }

    if (score > 0) {
      scoredResults.push({
        function: fn,
        score,
        matchedKeywords: [...new Set(matchedKeywords)],
      });
    }
  }

  // Sort by score descending
  scoredResults.sort((a, b) => b.score - a.score);

  // Get unique regions from top results
  const primarySet = new Set<string>();
  const secondarySet = new Set<string>();

  for (const result of scoredResults) {
    for (const region of result.function.primaryRegions) {
      primarySet.add(region);
    }
    for (const region of result.function.secondaryRegions) {
      secondarySet.add(region);
    }
  }

  // Remove primary regions from secondary set
  for (const region of primarySet) {
    secondarySet.delete(region);
  }

  return {
    isSemanticQuery: true,
    results: scoredResults,
    allPrimaryRegions: Array.from(primarySet),
    allSecondaryRegions: Array.from(secondarySet),
  };
}
