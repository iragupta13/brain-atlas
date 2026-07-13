// Simplified hierarchy with 3 levels:
// Level 0: Overview (5 super-regions)
// Level 1: Lobes (11 groups)
// Level 2: Detailed (170 individual regions)

export type DetailLevel = 0 | 1 | 2;

// Inspired by NASA imagery of Webb's Cosmic Cliffs and Hubble's Ring Nebula.
// The hues follow the visual language of mapped infrared/emission data while
// remaining separated enough to work as an anatomical legend.
export const NASA_NEBULA_PALETTE = {
  ionCyan: '#4FA6B5',
  oxygenBlue: '#4F73A6',
  heliumIndigo: '#6667A5',
  webbViolet: '#8665A1',
  nebulaMagenta: '#9C608F',
  infraredPink: '#AA647E',
  nitrogenRose: '#AD6268',
  sulfurOrange: '#B2744F',
  stellarGold: '#B09A55',
  filterGreen: '#7C965A',
  hydrogenTeal: '#4E9488',
} as const;

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
    color: NASA_NEBULA_PALETTE.ionCyan,
    groups: ['Frontal_Lobe', 'Cingulate_Cortex', 'Insula'],
  },
  Posterior_Cortex: {
    id: 'Posterior_Cortex',
    displayName: 'Posterior Cortex',
    color: NASA_NEBULA_PALETTE.oxygenBlue,
    groups: ['Parietal_Lobe', 'Occipital_Lobe'],
  },
  Temporal_Cortex: {
    id: 'Temporal_Cortex',
    displayName: 'Temporal Cortex',
    color: NASA_NEBULA_PALETTE.webbViolet,
    groups: ['Temporal_Lobe', 'Medial_Temporal'],
  },
  Subcortical: {
    id: 'Subcortical',
    displayName: 'Subcortical',
    color: NASA_NEBULA_PALETTE.sulfurOrange,
    groups: ['Basal_Ganglia', 'Thalamus', 'Brainstem'],
  },
  Cerebellum: {
    id: 'Cerebellum',
    displayName: 'Cerebellum',
    color: NASA_NEBULA_PALETTE.hydrogenTeal,
    groups: ['Cerebellum'],
  },
};

// Level 1: 11 Lobe groups (colors match BrainModel)
export const LOBE_GROUPS: Record<string, {
  id: string;
  displayName: string;
  color: string;
}> = {
  Frontal_Lobe: { id: 'Frontal_Lobe', displayName: 'Frontal Lobe', color: NASA_NEBULA_PALETTE.ionCyan },
  Parietal_Lobe: { id: 'Parietal_Lobe', displayName: 'Parietal Lobe', color: NASA_NEBULA_PALETTE.oxygenBlue },
  Temporal_Lobe: { id: 'Temporal_Lobe', displayName: 'Temporal Lobe', color: NASA_NEBULA_PALETTE.heliumIndigo },
  Occipital_Lobe: { id: 'Occipital_Lobe', displayName: 'Occipital Lobe', color: NASA_NEBULA_PALETTE.webbViolet },
  Cingulate_Cortex: { id: 'Cingulate_Cortex', displayName: 'Cingulate Cortex', color: NASA_NEBULA_PALETTE.nebulaMagenta },
  Insula: { id: 'Insula', displayName: 'Insula', color: NASA_NEBULA_PALETTE.infraredPink },
  Medial_Temporal: { id: 'Medial_Temporal', displayName: 'Medial Temporal', color: NASA_NEBULA_PALETTE.nitrogenRose },
  Basal_Ganglia: { id: 'Basal_Ganglia', displayName: 'Basal Ganglia', color: NASA_NEBULA_PALETTE.sulfurOrange },
  Thalamus: { id: 'Thalamus', displayName: 'Thalamus', color: NASA_NEBULA_PALETTE.stellarGold },
  Brainstem: { id: 'Brainstem', displayName: 'Brainstem', color: NASA_NEBULA_PALETTE.filterGreen },
  Cerebellum: { id: 'Cerebellum', displayName: 'Cerebellum', color: NASA_NEBULA_PALETTE.hydrogenTeal },
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
