export type Hemisphere = 'left' | 'right' | 'bilateral';

export type RegionGroup =
  | 'Frontal_Lobe'
  | 'Parietal_Lobe'
  | 'Temporal_Lobe'
  | 'Occipital_Lobe'
  | 'Cingulate_Cortex'
  | 'Basal_Ganglia'
  | 'Medial_Temporal'
  | 'Cerebellum'
  | 'Thalamus'
  | 'Brainstem'
  | 'Other';

export interface BrainRegion {
  id: number;
  name: string;           // e.g., "Hippocampus_L"
  displayName: string;    // e.g., "Hippocampus (Left)"
  hemisphere: Hemisphere;
  group: RegionGroup;
  centroid: [number, number, number]; // [x, y, z] in world coordinates
}

export interface RegionDescription {
  summary: string;
  function: string;
  location: string;
  connections: string[];
  clinical: string;
  funFact?: string;
}

export interface RegionsData {
  [regionName: string]: BrainRegion;
}

export interface DescriptionsData {
  [regionName: string]: RegionDescription;
}
