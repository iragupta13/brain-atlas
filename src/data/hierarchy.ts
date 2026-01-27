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
    color: '#89b4d4',
    groups: ['Frontal_Lobe', 'Cingulate_Cortex', 'Insula'],
  },
  Posterior_Cortex: {
    id: 'Posterior_Cortex',
    displayName: 'Posterior Cortex',
    color: '#a88bc4',
    groups: ['Parietal_Lobe', 'Occipital_Lobe'],
  },
  Temporal_Cortex: {
    id: 'Temporal_Cortex',
    displayName: 'Temporal Cortex',
    color: '#d4a574',
    groups: ['Temporal_Lobe', 'Medial_Temporal'],
  },
  Subcortical: {
    id: 'Subcortical',
    displayName: 'Subcortical',
    color: '#c4a864',
    groups: ['Basal_Ganglia', 'Thalamus', 'Brainstem'],
  },
  Cerebellum: {
    id: 'Cerebellum',
    displayName: 'Cerebellum',
    color: '#74b4ac',
    groups: ['Cerebellum'],
  },
};

// Level 1: 11 Lobe groups (colors match BrainModel)
export const LOBE_GROUPS: Record<string, {
  id: string;
  displayName: string;
  color: string;
}> = {
  Frontal_Lobe: { id: 'Frontal_Lobe', displayName: 'Frontal Lobe', color: '#89b4d4' },
  Parietal_Lobe: { id: 'Parietal_Lobe', displayName: 'Parietal Lobe', color: '#8cc084' },
  Temporal_Lobe: { id: 'Temporal_Lobe', displayName: 'Temporal Lobe', color: '#d4a574' },
  Occipital_Lobe: { id: 'Occipital_Lobe', displayName: 'Occipital Lobe', color: '#a88bc4' },
  Cingulate_Cortex: { id: 'Cingulate_Cortex', displayName: 'Cingulate Cortex', color: '#d4868c' },
  Insula: { id: 'Insula', displayName: 'Insula', color: '#7cb4a8' },
  Medial_Temporal: { id: 'Medial_Temporal', displayName: 'Medial Temporal', color: '#d4b08c' },
  Basal_Ganglia: { id: 'Basal_Ganglia', displayName: 'Basal Ganglia', color: '#c4a864' },
  Thalamus: { id: 'Thalamus', displayName: 'Thalamus', color: '#c4a484' },
  Brainstem: { id: 'Brainstem', displayName: 'Brainstem', color: '#a4a0c4' },
  Cerebellum: { id: 'Cerebellum', displayName: 'Cerebellum', color: '#74b4ac' },
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
