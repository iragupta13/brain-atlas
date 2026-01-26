import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { BrainModel } from './BrainModel';
import { ConnectionLines } from './ConnectionLines';
import { CameraController } from './CameraController';
import { useBrainStore } from '../../stores/useBrainStore';
import type { ModelMetrics, ViewSnapshot } from '../../types';
import styles from './BrainCanvas.module.css';

export function BrainCanvas() {
  const controlsRef = useRef<any>(null);
  const initialViewRef = useRef<ViewSnapshot | null>(null);
  const [modelRadius, setModelRadius] = useState<number | null>(null);

  const {
    selectedRegion,
    hoveredRegion,
    setSelectedRegion,
    setHoveredRegion,
    setMeshNames,
    currentView,
    resetViewTrigger,
    hemisphereView,
    showConnections,
    connectionThreshold,
  } = useBrainStore();

  const r = modelRadius ?? 2.5;

  return (
    <div className={styles.container}>
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
          {/* Camera controller for view presets and reset */}
          <CameraController
            controlsRef={controlsRef}
            snapshotRef={initialViewRef}
            radius={modelRadius}
            view={currentView}
            resetKey={resetViewTrigger}
          />

          {/* Brain model */}
          <BrainModel
            selectedRegion={selectedRegion}
            hoveredRegion={hoveredRegion}
            hemisphereView={hemisphereView}
            onSelect={setSelectedRegion}
            onHover={setHoveredRegion}
            onMetrics={(m: ModelMetrics) => {
              setModelRadius((prev) => (prev === null ? m.radius : prev));
            }}
            onMeshNames={setMeshNames}
          />

          {/* Connection lines */}
          {showConnections && selectedRegion && (
            <ConnectionLines
              selectedRegion={selectedRegion}
              threshold={connectionThreshold}
            />
          )}
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
    </div>
  );
}
