import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, useProgress } from '@react-three/drei';
import { Component, Suspense, useRef, useState, type ReactNode } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BrainModel } from './BrainModel';
import { CameraController } from './CameraController';
import { useBrainStore } from '../../stores/useBrainStore';
import type { ViewSnapshot } from '../../types';
import styles from './BrainCanvas.module.css';

export function BrainCanvas() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const initialViewRef = useRef<ViewSnapshot | null>(null);
  const [modelRadius, setModelRadius] = useState<number | null>(null);
  const [webglSupported] = useState(checkWebGLSupport);

  const {
    hoveredRegion,
    highlightedGroup,
    setHoveredRegion,
    setMeshNames,
    currentView,
    resetViewTrigger,
    hemisphereView,
    detailLevel,
    selection,
    selectNode,
  } = useBrainStore();

  const r = modelRadius ?? 2.5;

  if (!webglSupported) {
    return <CanvasFallback />;
  }

  return (
    <div className={styles.container}>
      <CanvasErrorBoundary fallback={<CanvasFallback />}>
        <Canvas camera={{ position: [-6, 0, 0], fov: 45 }}>
          {/* Deep void background */}
          <color attach="background" args={['#030508']} />
          <fog attach="fog" args={['#030508', 15, 50]} />

          {/* Cinematic lighting setup */}
          <ambientLight intensity={0.5} color="#9aa5b1" />

          {/* Key light - from upper front right */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.4}
            color="#f0f4f8"
            castShadow
          />

          {/* Fill light - from lower left */}
          <directionalLight
            position={[-6, -4, -4]}
            intensity={1.0}
            color="#e8e0f0"
          />

          {/* Bottom fill light - illuminates underside of brain */}
          <directionalLight
            position={[0, -8, 2]}
            intensity={1.2}
            color="#e0e8f0"
          />

          {/* Rim light - subtle glow from behind */}
          <directionalLight
            position={[0, 2, -8]}
            intensity={0.8}
            color="#b8d4e8"
          />

          {/* Hemisphere for balanced ambient fill */}
          <hemisphereLight
            intensity={0.6}
            color="#d0d8e0"
            groundColor="#a0a8b0"
          />

          <Suspense fallback={null}>
            <LoadingOverlay />

            <CameraController
              controlsRef={controlsRef}
              snapshotRef={initialViewRef}
              radius={modelRadius}
              view={currentView}
              resetKey={resetViewTrigger}
            />

            <BrainModel
              hoveredRegion={hoveredRegion}
              highlightedGroup={highlightedGroup}
              hemisphereView={hemisphereView}
              detailLevel={detailLevel}
              selection={selection}
              onSelectNode={selectNode}
              onHover={setHoveredRegion}
              onMetrics={(m) => {
                setModelRadius((prev) => (prev === null ? m.radius : prev));
              }}
              onMeshNames={setMeshNames}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
            zoomSpeed={0.8}
            panSpeed={0.6}
            enablePan={false}
            screenSpacePanning={false}
            minDistance={Math.max(1.8, r * 0.9)}
            maxDistance={Math.max(8, r * 4.5)}
            minPolarAngle={0.15}
            maxPolarAngle={Math.PI - 0.15}
          />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

function LoadingOverlay() {
  const { active, progress } = useProgress();

  if (!active) {
    return null;
  }

  return (
    <Html center>
      <div className={styles.loading}>Loading brain atlas... {Math.round(progress)}%</div>
    </Html>
  );
}

function CanvasFallback() {
  return (
    <div className={styles.fallback}>
      <div className={styles.fallbackCard}>
        <h3 className={styles.fallbackTitle}>3D brain unavailable</h3>
        <p className={styles.fallbackText}>
          Brain Atlas could not start WebGL in this browser tab. Try refreshing the page or reopening it
          in a normal Chrome window with hardware acceleration enabled.
        </p>
      </div>
    </div>
  );
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return true;
  }

  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    return Boolean(context);
  } catch {
    return false;
  }
}

class CanvasErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
