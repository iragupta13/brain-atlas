import type * as THREE from 'three';

export type ViewPreset = 'lateral-left' | 'lateral-right' | 'superior' | 'anterior' | 'posterior';

export interface ViewSnapshot {
  cameraPosition: THREE.Vector3;
  cameraQuaternion: THREE.Quaternion;
  cameraUp: THREE.Vector3;
  target: THREE.Vector3;
}

export interface ModelMetrics {
  radius: number;
  center: THREE.Vector3;
}

export interface PickInfo {
  name: string;
  point?: THREE.Vector3;
}
