import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { ModelMetrics } from '../../types';
import type { HemisphereView, Selection } from '../../stores/useBrainStore';
import type { DetailLevel } from '../../data/hierarchy';
import { LOBE_GROUPS, SUPER_REGIONS } from '../../data/hierarchy';
import regionsData from '../../data/regions.json';
import { getColorForMesh, getNodeForMesh } from '../../utils/hierarchy';
import { MODEL_SCALE } from '../../constants/model';

const regions = regionsData as Record<string, { group: string; hemisphere: string }>;

// Helper to determine hemisphere from regions data or mesh name
function getMeshHemisphere(name: string): 'left' | 'right' | 'bilateral' {
  // First check regions data (authoritative source)
  const region = regions[name];
  if (region?.hemisphere === 'left') return 'left';
  if (region?.hemisphere === 'right') return 'right';
  if (region?.hemisphere === 'bilateral') return 'bilateral';

  // Fallback to name suffix
  if (name.endsWith('_L')) return 'left';
  if (name.endsWith('_R')) return 'right';

  return 'bilateral';
}

const HIDDEN_REGIONS = ['Heschl_R']; // Regions to hide due to mesh issues

// Opacity for dimmed regions when something is selected or a group is highlighted
const DIMMED_OPACITY = 0.15;

// Helper to check if mesh is in highlighted group (handles both level 0 super regions and level 1 groups)
function isInHighlightedGroup(meshGroup: string, highlightedGroup: string | null): boolean {
  if (!highlightedGroup) return true;
  return meshGroup === highlightedGroup ||
    (SUPER_REGIONS[highlightedGroup]?.groups.includes(meshGroup) ?? false);
}

const SELECTED_COLOR = '#00f0ff';
const HOVER_COLOR = '#00c4d4';

// No-op raycast function for hidden/dimmed meshes
const noopRaycast = () => {};

interface BrainModelProps {
  hoveredRegion: string | null;
  highlightedGroup: string | null;
  hemisphereView: HemisphereView;
  detailLevel: DetailLevel;
  selection: Selection | null;
  onSelectNode: (nodeId: string) => void;
  onHover: (name: string | null) => void;
  onMetrics?: (m: ModelMetrics) => void;
  onMeshNames?: (names: string[]) => void;
}

export function BrainModel({
  hoveredRegion,
  highlightedGroup,
  hemisphereView,
  detailLevel,
  selection,
  onSelectNode,
  onHover,
  onMetrics,
  onMeshNames,
}: BrainModelProps) {
  const gltf = useGLTF('/models/brain_atlas.glb');

  // Clone scene for safe manipulation
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Compute bounds for camera positioning (accounting for scale)
  const { centerOffset, radius } = useMemo(() => {
    const measure = scene.clone(true);
    measure.scale.setScalar(MODEL_SCALE);
    measure.rotation.set(-Math.PI / 2, 0, 0);
    measure.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(measure);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const size = new THREE.Vector3();
    box.getSize(size);

    return {
      centerOffset: center.multiplyScalar(-1),
      radius: 0.5 * size.length(),
    };
  }, [scene]);

  useEffect(() => {
    onMetrics?.({ radius, center: new THREE.Vector3(0, 0, 0) });
  }, [onMetrics, radius]);

  // Collect meshes
  const meshes = useMemo(() => {
    const out: THREE.Mesh[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        if (HIDDEN_REGIONS.includes(obj.name)) {
          obj.visible = false;
        } else {
          out.push(obj as THREE.Mesh);
        }
      }
    });
    return out;
  }, [scene]);

  // Report mesh names
  useEffect(() => {
    onMeshNames?.(meshes.map((m) => m.name));
  }, [meshes, onMeshNames]);

  // Initialize materials with lobe-based coloring and store original raycast
  useEffect(() => {
    for (const mesh of meshes) {
      const region = regions[mesh.name];
      const groupColor = LOBE_GROUPS[region?.group]?.color || LOBE_GROUPS.Insula.color;

      mesh.material = new THREE.MeshStandardMaterial({
        color: groupColor,
        roughness: 0.65,
        metalness: 0.08,
        envMapIntensity: 0.6,
      });
      mesh.geometry.computeVertexNormals();

      // Store original raycast function for later restoration
      if (!mesh.userData.originalRaycast) {
        mesh.userData.originalRaycast = mesh.raycast.bind(mesh);
      }
    }
  }, [meshes]);


  // Update highlighting and group filtering based on detail level
  useEffect(() => {
    for (const mesh of meshes) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const region = regions[mesh.name];
      const meshGroup = region?.group || 'Insula';

      // Get color based on detail level
      const levelColor = getColorForMesh(mesh.name, detailLevel);

      // Check if mesh is part of selection (works for all levels)
      const isSelected = selection?.meshes.includes(mesh.name) || false;

      // For hover, check if hoveredRegion maps to the same node at current level
      const hoveredNodeId = hoveredRegion ? getNodeForMesh(hoveredRegion, detailLevel) : null;
      const meshNodeId = getNodeForMesh(mesh.name, detailLevel);
      const isHovered = hoveredNodeId === meshNodeId && hoveredNodeId !== null && !isSelected;

      // Check if mesh is in the highlighted group (for ColorLegend click feature)
      const inHighlightedGroup = isInHighlightedGroup(meshGroup, highlightedGroup);

      if (isSelected) {
        // Selected regions get cyan highlight
        mat.color.set(SELECTED_COLOR);
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
      } else if (isHovered) {
        // Hovered regions get hover color
        mat.color.set(HOVER_COLOR);
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
      } else if (highlightedGroup && inHighlightedGroup) {
        // Meshes in the highlighted group stay at full opacity (even if there's a selection)
        mat.color.set(levelColor);
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
      } else if (selection || highlightedGroup) {
        // Dim non-selected regions when something is selected, or non-highlighted when group is highlighted
        mat.color.set(levelColor);
        mat.transparent = true;
        mat.opacity = DIMMED_OPACITY;
        mat.depthWrite = false;
      } else {
        // Normal state - use level-appropriate color, fully visible
        mat.color.set(levelColor);
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
      }
      mat.needsUpdate = true;
    }
  }, [meshes, selection, hoveredRegion, highlightedGroup, detailLevel]);

  // Update hemisphere visibility with transparency for interior view
  useEffect(() => {
    for (const mesh of meshes) {
      if (HIDDEN_REGIONS.includes(mesh.name)) {
        mesh.visible = false;
        continue;
      }

      const mat = mesh.material as THREE.MeshStandardMaterial;
      const meshHemisphere = getMeshHemisphere(mesh.name);
      const region = regions[mesh.name];
      const meshGroup = region?.group || 'Insula';
      const isSelected = selection?.meshes.includes(mesh.name) || false;
      const inHighlightedGroup = isInHighlightedGroup(meshGroup, highlightedGroup);

      // For hover at current detail level
      const hoveredNodeId = hoveredRegion ? getNodeForMesh(hoveredRegion, detailLevel) : null;
      const meshNodeId = getNodeForMesh(mesh.name, detailLevel);
      const isHovered = hoveredNodeId === meshNodeId && hoveredNodeId !== null;

      mesh.visible = true;

      // Skip if this mesh is selected or hovered - those take priority
      if (isSelected || isHovered) {
        continue;
      }

      // Dim when there's a selection (and this mesh isn't selected/in highlighted group) or when using ColorLegend highlight
      const shouldDim = (selection && !(highlightedGroup && inHighlightedGroup)) || (highlightedGroup && !inHighlightedGroup);

      if (hemisphereView === 'both') {
        // Full brain - only dim if using ColorLegend highlight
        if (shouldDim) {
          mat.transparent = true;
          mat.opacity = DIMMED_OPACITY;
          mat.depthWrite = false;
        } else {
          mat.transparent = false;
          mat.opacity = 1;
          mat.depthWrite = true;
        }
      } else {
        // Interior view - only show structures from the target hemisphere
        const targetHemisphere = hemisphereView; // 'left' or 'right'
        const oppositeHemisphere = targetHemisphere === 'left' ? 'right' : 'left';

        // Check if this structure belongs to the target hemisphere
        const belongsToTargetSide = meshHemisphere === targetHemisphere || meshHemisphere === 'bilateral';

        if (meshHemisphere === oppositeHemisphere) {
          // Opposite hemisphere - completely hide it
          mesh.visible = false;
        } else if (belongsToTargetSide) {
          // Target hemisphere or bilateral structures
          if (shouldDim) {
            mat.transparent = true;
            mat.opacity = DIMMED_OPACITY;
            mat.depthWrite = false;
          } else {
            mat.transparent = false;
            mat.opacity = 1;
            mat.depthWrite = true;
          }
        }
      }
      mat.needsUpdate = true;
    }
  }, [meshes, hemisphereView, highlightedGroup, selection, hoveredRegion, detailLevel]);

  // Update raycasting - disable on hidden/dimmed meshes so clicks pass through
  useEffect(() => {
    for (const mesh of meshes) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const originalRaycast = mesh.userData.originalRaycast;

      if (!originalRaycast) continue;

      // Disable raycasting on hidden or low-opacity meshes
      if (!mesh.visible || mat.opacity < 0.5) {
        mesh.raycast = noopRaycast;
      } else {
        mesh.raycast = originalRaycast;
      }
    }
  }, [meshes, hemisphereView, selection, hoveredRegion, detailLevel]);

  return (
    <group
      position={centerOffset}
      scale={MODEL_SCALE}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <primitive
        object={scene}
        onPointerDown={(e: any) => {
          e.stopPropagation();
          const name = e.object?.name;
          if (!name) return;

          // Prevent selecting opposite hemisphere regions when in hemisphere view
          if (hemisphereView !== 'both') {
            const clickedHemisphere = getMeshHemisphere(name);
            const oppositeHemisphere = hemisphereView === 'left' ? 'right' : 'left';
            if (clickedHemisphere === oppositeHemisphere) {
              return;
            }
          }

          // Get the node for this mesh at the current detail level
          const nodeId = getNodeForMesh(name, detailLevel);
          if (nodeId) {
            onSelectNode(nodeId);
          }
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          const name = e.object?.name;
          if (name) {
            // Don't hover opposite hemisphere regions when in hemisphere view
            if (hemisphereView !== 'both') {
              const hoveredHemisphere = getMeshHemisphere(name);
              const oppositeHemisphere = hemisphereView === 'left' ? 'right' : 'left';
              if (hoveredHemisphere === oppositeHemisphere) {
                return;
              }
            }

            onHover(name);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'default';
        }}
      />
    </group>
  );
}

useGLTF.preload('/models/brain_atlas.glb');
