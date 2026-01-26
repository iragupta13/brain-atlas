import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { ViewPreset, ViewSnapshot } from '../../types';

interface CameraControllerProps {
  controlsRef: React.MutableRefObject<any>;
  snapshotRef: React.MutableRefObject<ViewSnapshot | null>;
  radius: number | null;
  view: ViewPreset;
  resetKey: number;
}

export function CameraController({
  controlsRef,
  snapshotRef,
  radius,
  view,
  resetKey,
}: CameraControllerProps) {
  const { camera, size } = useThree();
  const hasInitialized = useRef(false);
  const lastView = useRef<ViewPreset | null>(null);

  // Calculate camera distance for a given radius
  const calculateDistance = (r: number): number => {
    const vFov = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov);
    const aspect = (camera as THREE.PerspectiveCamera).aspect || size.width / size.height;
    const distV = r / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distH = r / Math.tan(hFov / 2);
    return Math.max(distV, distH) * 1.1;
  };

  // Apply a specific view preset
  const applyViewPreset = (preset: ViewPreset, dist: number) => {
    const controls = controlsRef.current;
    if (!controls) return;

    controls.target.set(0, 0, 0);

    switch (preset) {
      case 'lateral-left':
        camera.position.set(-dist, 0, 0);
        camera.up.set(0, 1, 0);
        break;
      case 'lateral-right':
        camera.position.set(dist, 0, 0);
        camera.up.set(0, 1, 0);
        break;
      case 'superior':
        camera.position.set(0, dist, 0);
        camera.up.set(0, 0, -1);
        break;
      case 'anterior':
        camera.position.set(0, 0, dist);
        camera.up.set(0, 1, 0);
        break;
      case 'posterior':
        camera.position.set(0, 0, -dist);
        camera.up.set(0, 1, 0);
        break;
    }

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controls.update();
  };

  // Initialize camera on first load
  useEffect(() => {
    if (!radius || radius <= 0 || hasInitialized.current) return;
    const controls = controlsRef.current;
    if (!controls) return;

    const dist = calculateDistance(radius);
    applyViewPreset(view, dist);

    // Save initial snapshot for reset
    snapshotRef.current = {
      cameraPosition: camera.position.clone(),
      cameraQuaternion: camera.quaternion.clone(),
      cameraUp: camera.up.clone(),
      target: controls.target.clone(),
    };

    hasInitialized.current = true;
    lastView.current = view;
  }, [radius, view]);

  // Handle view changes
  useEffect(() => {
    if (!hasInitialized.current || !radius) return;
    if (lastView.current === view) return;

    const dist = calculateDistance(radius);
    applyViewPreset(view, dist);
    lastView.current = view;
  }, [view, radius]);

  // Handle reset
  useEffect(() => {
    if (resetKey === 0 || !hasInitialized.current) return;

    const snap = snapshotRef.current;
    const controls = controlsRef.current;
    if (!snap || !controls) return;

    camera.position.copy(snap.cameraPosition);
    camera.quaternion.copy(snap.cameraQuaternion);
    camera.up.copy(snap.cameraUp);
    camera.updateProjectionMatrix();

    controls.target.copy(snap.target);
    controls.update();
  }, [resetKey]);

  return null;
}
