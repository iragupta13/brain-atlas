// Simplified hierarchy with 3 levels:
// Level 0: Overview (5 super-regions)
// Level 1: Lobes (11 groups)
// Level 2: Detailed (170 individual regions)

export type DetailLevel = 0 | 1 | 2;

// Level 0: 5 Super-regions
export const SUPER_REGIONS: Record<string, {
  id: string;
  displayName: string;
  color: string;
  groups: string[]; // Which level-1 groups belong here
}> = {
  Frontal_Cortex: {
    id: 'Frontal_Cortex',
    displayName: 'Frontal Cortex',
    color: '#2d7482',
    groups: ['Frontal_Lobe', 'Cingulate_Cortex', 'Insula'],
  },
  Posterior_Cortex: {
    id: 'Posterior_Cortex',
    displayName: 'Posterior Cortex',
    color: '#385f7b',
    groups: ['Parietal_Lobe', 'Occipital_Lobe'],
  },
  Temporal_Cortex: {
    id: 'Temporal_Cortex',
    displayName: 'Temporal Cortex',
    color: '#355f73',
    groups: ['Temporal_Lobe', 'Medial_Temporal'],
  },
  Subcortical: {
    id: 'Subcortical',
    displayName: 'Subcortical',
    color: '#6d6f68',
    groups: ['Basal_Ganglia', 'Thalamus', 'Brainstem'],
  },
  Cerebellum: {
    id: 'Cerebellum',
    displayName: 'Cerebellum',
    color: '#716552',
    groups: ['Cerebellum'],
  },
};

// Level 1: 11 Lobe groups (colors match BrainModel)
export const LOBE_GROUPS: Record<string, {
  id: string;
  displayName: string;
  color: string;
}> = {
  Frontal_Lobe: { id: 'Frontal_Lobe', displayName: 'Frontal Lobe', color: '#2d7482' },
  Parietal_Lobe: { id: 'Parietal_Lobe', displayName: 'Parietal Lobe', color: '#3d6f7d' },
  Temporal_Lobe: { id: 'Temporal_Lobe', displayName: 'Temporal Lobe', color: '#365c72' },
  Occipital_Lobe: { id: 'Occipital_Lobe', displayName: 'Occipital Lobe', color: '#425f7a' },
  Cingulate_Cortex: { id: 'Cingulate_Cortex', displayName: 'Cingulate Cortex', color: '#667692' },
  Insula: { id: 'Insula', displayName: 'Insula', color: '#3f7778' },
  Medial_Temporal: { id: 'Medial_Temporal', displayName: 'Medial Temporal', color: '#756858' },
  Basal_Ganglia: { id: 'Basal_Ganglia', displayName: 'Basal Ganglia', color: '#70694f' },
  Thalamus: { id: 'Thalamus', displayName: 'Thalamus', color: '#63747d' },
  Brainstem: { id: 'Brainstem', displayName: 'Brainstem', color: '#486875' },
  Cerebellum: { id: 'Cerebellum', displayName: 'Cerebellum', color: '#716552' },
};

// Map from group to super-region
export const GROUP_TO_SUPER: Record<string, string> = {};
for (const [superId, superRegion] of Object.entries(SUPER_REGIONS)) {
  for (const group of superRegion.groups) {
    GROUP_TO_SUPER[group] = superId;
  }
}

// Detail level labels
export const DETAIL_LEVEL_LABELS: Record<DetailLevel, { name: string; description: string }> = {
  0: { name: 'Overview', description: '5 major brain divisions' },
  1: { name: 'Lobes', description: '11 anatomical groups' },
  2: { name: 'Detailed', description: '170 individual regions' },
};
