// Hierarchy utility functions for 3-level detail control
import {
  SUPER_REGIONS,
  LOBE_GROUPS,
  GROUP_TO_SUPER,
  type DetailLevel,
} from '../data/hierarchy';
import regionsData from '../data/regions.json';

const regions = regionsData as Record<string, { group: string; hemisphere: string; displayName?: string }>;

// Get all individual mesh names
export function getAllMeshNames(): string[] {
  return Object.keys(regions);
}

// Get the node ID for a mesh at a given detail level
export function getNodeForMesh(meshName: string, level: DetailLevel): string | null {
  const region = regions[meshName];
  if (!region) return null;

  if (level === 2) {
    // Level 2 (Detailed): each mesh is its own node
    return meshName;
  }

  if (level === 1) {
    // Level 1 (Lobes): return the group from regions data
    return region.group;
  }

  if (level === 0) {
    // Level 0 (Overview): return the super region containing this mesh's group
    return GROUP_TO_SUPER[region.group] || null;
  }

  return null;
}

// Get all meshes belonging to a node at a given level
export function getMeshesForNode(nodeId: string, level: DetailLevel): string[] {
  if (level === 2) {
    // Level 2: single mesh
    return regions[nodeId] ? [nodeId] : [];
  }

  if (level === 1) {
    // Level 1: all meshes with this group
    return Object.keys(regions).filter(meshName => regions[meshName].group === nodeId);
  }

  if (level === 0) {
    // Level 0: all meshes whose group is in this super region
    const superRegion = SUPER_REGIONS[nodeId];
    if (!superRegion) return [];

    return Object.keys(regions).filter(meshName =>
      superRegion.groups.includes(regions[meshName].group)
    );
  }

  return [];
}

// Get the appropriate color for a mesh at a given detail level
export function getColorForMesh(meshName: string, level: DetailLevel): string {
  const region = regions[meshName];
  if (!region) return '#808080';

  if (level === 0) {
    // Level 0: super region color
    const superRegionId = GROUP_TO_SUPER[region.group];
    return SUPER_REGIONS[superRegionId]?.color || '#808080';
  }

  // Level 1 and 2: use the group color
  return LOBE_GROUPS[region.group]?.color || '#808080';
}

// Get all nodes at a given detail level
export function getNodesAtLevel(level: DetailLevel): Array<{ id: string; displayName: string; color: string }> {
  if (level === 0) {
    return Object.values(SUPER_REGIONS).map(sr => ({
      id: sr.id,
      displayName: sr.displayName,
      color: sr.color,
    }));
  }

  if (level === 1) {
    return Object.values(LOBE_GROUPS).map(lg => ({
      id: lg.id,
      displayName: lg.displayName,
      color: lg.color,
    }));
  }

  // Level 2: return all individual regions
  return getAllMeshNames().map(meshName => {
    const region = regions[meshName];
    const groupColor = LOBE_GROUPS[region?.group]?.color || '#808080';
    return {
      id: meshName,
      displayName: region?.displayName || meshName.replace(/_/g, ' '),
      color: groupColor,
    };
  });
}

// Remap a selection from one level to another
export function remapSelectionToLevel(
  currentNodeId: string,
  currentLevel: DetailLevel,
  newLevel: DetailLevel
): string | null {
  if (currentLevel === newLevel) {
    return currentNodeId;
  }

  // Get the meshes for the current selection
  const meshes = getMeshesForNode(currentNodeId, currentLevel);
  if (meshes.length === 0) return null;

  // Get the node that contains the first mesh at the new level
  const firstMesh = meshes[0];
  return getNodeForMesh(firstMesh, newLevel);
}

// Get the display name for a node
export function getNodeDisplayName(nodeId: string, level: DetailLevel): string {
  if (level === 0) {
    return SUPER_REGIONS[nodeId]?.displayName || nodeId.replace(/_/g, ' ');
  }

  if (level === 1) {
    return LOBE_GROUPS[nodeId]?.displayName || nodeId.replace(/_/g, ' ');
  }

  // Level 2: use displayName from regions data
  const region = regions[nodeId];
  return region?.displayName || nodeId.replace(/_/g, ' ');
}

// Get region count for a node
export function getRegionCount(nodeId: string, level: DetailLevel): number {
  return getMeshesForNode(nodeId, level).length;
}
