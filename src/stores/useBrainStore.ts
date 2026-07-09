import { create } from 'zustand';
import type { ViewPreset } from '../types';
import type { DetailLevel } from '../data/hierarchy';
import { remapSelectionToLevel, getMeshesForNode } from '../utils/hierarchy';

export type HemisphereView = 'both' | 'left' | 'right';

// Selection state that supports both node-level and mesh-level selection
export interface Selection {
  level: DetailLevel;
  nodeId: string;
  meshes: string[];
}

interface BrainState {
  // Selection
  selectedRegion: string | null; // Kept for backward compatibility
  hoveredRegion: string | null;
  highlightedGroup: string | null;

  // New hierarchical selection
  detailLevel: DetailLevel;
  selection: Selection | null;

  // Search
  searchQuery: string;

  // View
  currentView: ViewPreset;
  resetViewTrigger: number;
  hemisphereView: HemisphereView;

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
  setRegionPanelExpanded: (expanded: boolean) => void;
  setMeshNames: (names: string[]) => void;
  setHighlightedGroup: (group: string | null) => void;
  clearSelection: () => void;
  clearSearch: () => void;

  // New actions for detail level
  setDetailLevel: (level: DetailLevel) => void;
  selectNode: (nodeId: string, level?: DetailLevel) => void;
}

export const useBrainStore = create<BrainState>((set, get) => ({
  // Initial state
  selectedRegion: null,
  hoveredRegion: null,
  highlightedGroup: null,
  detailLevel: 1, // Default to lobes view
  selection: null,
  searchQuery: '',
  currentView: 'lateral-left',
  resetViewTrigger: 0,
  hemisphereView: 'both',
  regionPanelExpanded: true,
  meshNames: [],

  // Actions
  setSelectedRegion: (region) => {
    const { detailLevel } = get();
    if (region) {
      // Also update the new selection state
      const meshes = getMeshesForNode(region, detailLevel);
      set({
        selectedRegion: region,
        selection: { level: detailLevel, nodeId: region, meshes }
      });
    } else {
      set({ selectedRegion: null, selection: null });
    }
  },
  setHoveredRegion: (region) => set({ hoveredRegion: region }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentView: (view) => set({ currentView: view }),
  resetView: () => set((state) => ({
    resetViewTrigger: state.resetViewTrigger + 1,
    currentView: 'lateral-left',
    hemisphereView: 'both'
  })),
  setHemisphereView: (view) => set({ hemisphereView: view }),
  setRegionPanelExpanded: (expanded) => set({ regionPanelExpanded: expanded }),
  setMeshNames: (names) => set({ meshNames: names }),
  setHighlightedGroup: (group) => set({ highlightedGroup: group }),
  clearSelection: () => set({
    selectedRegion: null,
    selection: null,
    highlightedGroup: null
  }),
  clearSearch: () => set({ searchQuery: '' }),

  // New actions for detail level
  setDetailLevel: (level) => {
    const { selection, detailLevel: currentLevel } = get();
    if (level === currentLevel) return;

    if (selection) {
      // Remap the selection to the new level
      const newNodeId = remapSelectionToLevel(selection.nodeId, selection.level, level);
      if (newNodeId) {
        const newMeshes = getMeshesForNode(newNodeId, level);
        set({
          detailLevel: level,
          selection: { level, nodeId: newNodeId, meshes: newMeshes },
          // Update selectedRegion for backward compatibility
          selectedRegion: level === 2 ? newNodeId : null,
          // Clear highlightedGroup when changing away from level 2
          highlightedGroup: null,
        });
      } else {
        // Couldn't remap, clear selection
        set({ detailLevel: level, selection: null, selectedRegion: null, highlightedGroup: null });
      }
    } else {
      set({ detailLevel: level, highlightedGroup: null });
    }
  },

  selectNode: (nodeId, level) => {
    const currentLevel = level ?? get().detailLevel;
    const meshes = getMeshesForNode(nodeId, currentLevel);

    // Toggle: if same node is selected, deselect
    const currentSelection = get().selection;
    if (currentSelection?.nodeId === nodeId && currentSelection?.level === currentLevel) {
      set({ selection: null, selectedRegion: null });
      return;
    }

    set({
      detailLevel: currentLevel,
      selection: { level: currentLevel, nodeId, meshes },
      // For backward compatibility with level 2 (detailed)
      selectedRegion: currentLevel === 2 ? nodeId : null,
    });
  },
}));
