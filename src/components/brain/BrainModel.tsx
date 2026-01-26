import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { ModelMetrics } from '../../types';
import type { HemisphereView } from '../../stores/useBrainStore';
import regionsData from '../../data/regions.json';

const regions = regionsData as Record<string, { group: string; hemisphere: string }>;

// Helper to determine hemisphere from mesh name
function getMeshHemisphere(name: string): 'left' | 'right' | 'bilateral' {
  if (name.endsWith('_L')) return 'left';
  if (name.endsWith('_R')) return 'right';
  // Check regions data for bilateral regions (like Vermis)
  const region = regions[name];
  if (region?.hemisphere === 'bilateral') return 'bilateral';
  return 'bilateral';
}

const HIDDEN_REGIONS = ['Heschl_R']; // Regions to hide due to mesh issues

// Scale factor to convert from mm coordinates to reasonable scene units
const MODEL_SCALE = 0.02;

// Lobe/group color palette - vibrant, distinct colors for each brain region group
const GROUP_COLORS: Record<string, string> = {
  Frontal_Lobe: '#5b9bd5',      // Strong blue - front of brain
  Parietal_Lobe: '#70ad47',     // Vivid green - top of brain
  Temporal_Lobe: '#ed7d31',     // Bright orange - sides of brain
  Occipital_Lobe: '#9966cc',    // Rich purple - back of brain
  Cingulate_Cortex: '#e84a5f',  // Coral red - medial
  Basal_Ganglia: '#c9a227',     // Gold/mustard - deep structures
  Medial_Temporal: '#f4a460',   // Sandy orange - memory structures
  Cerebellum: '#20b2aa',        // Light sea green - bottom back
  Thalamus: '#cd853f',          // Peru/bronze - central relay
  Brainstem: '#8a7bb7',         // Medium purple - lowest structures
  Other: '#3cb4a4',             // Teal - Insula (deep cortex)
};

const SELECTED_COLOR = '#00f0ff';
const HOVER_COLOR = '#00c4d4';

interface BrainModelProps {
  selectedRegion: string | null;
  hoveredRegion: string | null;
  hemisphereView: HemisphereView;
  onSelect: (name: string | null) => void;
  onHover: (name: string | null) => void;
  onMetrics?: (m: ModelMetrics) => void;
  onMeshNames?: (names: string[]) => void;
}

export function BrainModel({
  selectedRegion,
  hoveredRegion,
  hemisphereView,
  onSelect,
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

  // Initialize materials with lobe-based coloring
  useEffect(() => {
    for (const mesh of meshes) {
      const region = regions[mesh.name];
      const groupColor = region ? GROUP_COLORS[region.group] || GROUP_COLORS.Other : GROUP_COLORS.Other;

      mesh.material = new THREE.MeshStandardMaterial({
        color: groupColor,
        roughness: 0.65,
        metalness: 0.08,
        envMapIntensity: 0.6,
      });
      mesh.geometry.computeVertexNormals();
    }
  }, [meshes]);

  // Update highlighting
  useEffect(() => {
    for (const mesh of meshes) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const isSelected = selectedRegion === mesh.name;
      const isHovered = hoveredRegion === mesh.name && !isSelected;

      if (isSelected) {
        mat.color.set(SELECTED_COLOR);
      } else if (isHovered) {
        mat.color.set(HOVER_COLOR);
      } else {
        // Reset to group color
        const region = regions[mesh.name];
        const groupColor = region ? GROUP_COLORS[region.group] || GROUP_COLORS.Other : GROUP_COLORS.Other;
        mat.color.set(groupColor);
      }
      mat.needsUpdate = true;
    }
  }, [meshes, selectedRegion, hoveredRegion]);

  // Update hemisphere visibility
  useEffect(() => {
    for (const mesh of meshes) {
      if (HIDDEN_REGIONS.includes(mesh.name)) {
        mesh.visible = false;
        continue;
      }

      const meshHemisphere = getMeshHemisphere(mesh.name);

      if (hemisphereView === 'both') {
        mesh.visible = true;
      } else if (hemisphereView === 'left') {
        // Show left hemisphere and bilateral structures
        mesh.visible = meshHemisphere === 'left' || meshHemisphere === 'bilateral';
      } else {
        // Show right hemisphere and bilateral structures
        mesh.visible = meshHemisphere === 'right' || meshHemisphere === 'bilateral';
      }
    }
  }, [meshes, hemisphereView]);

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
          if (name) {
            onSelect(name);
          }
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          const name = e.object?.name;
          if (name) {
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
