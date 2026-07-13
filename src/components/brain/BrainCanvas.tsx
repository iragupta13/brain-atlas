import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Sparkles, Stars, useProgress } from '@react-three/drei';
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
          <color attach="background" args={['#010611']} />
          <fog attach="fog" args={['#010611', 14, 48]} />
          <Stars radius={38} depth={24} count={1400} factor={2} saturation={0} fade speed={0.22} />
          <Sparkles count={56} scale={[10, 7, 10]} size={1.25} speed={0.22} opacity={0.42} color="#C4A45F" />

          {/* Cinematic lighting setup */}
          <ambientLight intensity={0.52} color="#8090B8" />

          {/* Key light - from upper front right */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.55}
            color="#D7E5ED"
            castShadow
          />

          {/* Fill light - from lower left */}
          <directionalLight
            position={[-6, -4, -4]}
            intensity={0.62}
            color="#756B9A"
          />

          {/* Bottom fill light - illuminates underside of brain */}
          <directionalLight
            position={[0, -8, 2]}
            intensity={0.7}
            color="#C99768"
          />

          {/* Rim light - subtle glow from behind */}
          <directionalLight
            position={[0, 2, -8]}
            intensity={0.9}
            color="#5EAAB7"
          />

          {/* Hemisphere for balanced ambient fill */}
          <hemisphereLight
            intensity={0.58}
            color="#769EB5"
            groundColor="#151326"
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
