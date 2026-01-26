import { create } from 'zustand';
import type { ViewPreset } from '../types';

export type HemisphereView = 'both' | 'left' | 'right';

interface BrainState {
  // Selection
  selectedRegion: string | null;
  hoveredRegion: string | null;

  // Search
  searchQuery: string;

  // View
  currentView: ViewPreset;
  resetViewTrigger: number;
  hemisphereView: HemisphereView;

  // Connectivity
  showConnections: boolean;
  connectionThreshold: number;

  // UI
  regionPanelExpanded: boolean;

  // Region data
  meshNames: string[];

  // Actions
  setSelectedRegion: (region: string | null) => void;
  setHoveredRegion: (region: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentView: (view: ViewPreset) => void;
  resetView: () => void;
  setHemisphereView: (view: HemisphereView) => void;
  toggleConnections: () => void;
  setConnectionThreshold: (threshold: number) => void;
  setRegionPanelExpanded: (expanded: boolean) => void;
  setMeshNames: (names: string[]) => void;
  clearSelection: () => void;
}

export const useBrainStore = create<BrainState>((set) => ({
  // Initial state
  selectedRegion: null,
  hoveredRegion: null,
  searchQuery: '',
  currentView: 'lateral-left',
  resetViewTrigger: 0,
  hemisphereView: 'both',
  showConnections: false,
  connectionThreshold: 0.5,
  regionPanelExpanded: true,
  meshNames: [],

  // Actions
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setHoveredRegion: (region) => set({ hoveredRegion: region }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentView: (view) => set({ currentView: view }),
  resetView: () => set((state) => ({
    resetViewTrigger: state.resetViewTrigger + 1,
    currentView: 'lateral-left',
    hemisphereView: 'both'
  })),
  setHemisphereView: (view) => set({ hemisphereView: view }),
  toggleConnections: () => set((state) => ({ showConnections: !state.showConnections })),
  setConnectionThreshold: (threshold) => set({ connectionThreshold: threshold }),
  setRegionPanelExpanded: (expanded) => set({ regionPanelExpanded: expanded }),
  setMeshNames: (names) => set({ meshNames: names }),
  clearSelection: () => set({
    selectedRegion: null,
    searchQuery: '',
    showConnections: false
  }),
}));
