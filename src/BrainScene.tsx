import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PickInfo = {
  name: string;
};

type ModelMetrics = {
  radius: number; // bounding-sphere-ish radius (world units)
};

type ViewSnapshot = {
  cameraPosition: THREE.Vector3;
  cameraQuaternion: THREE.Quaternion;
  cameraUp: THREE.Vector3;
  target: THREE.Vector3;
};

function ResetViewController({
  controlsRef,
  snapshotRef,
  resetKey,
}: {
  controlsRef: React.MutableRefObject<any>;
  snapshotRef: React.MutableRefObject<ViewSnapshot | null>;
  resetKey: number;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (resetKey === 0) return; // ignore initial render
    const snap = snapshotRef.current;
    const controls = controlsRef.current;
    if (!snap || !controls) return;

    camera.position.copy(snap.cameraPosition);
    camera.quaternion.copy(snap.cameraQuaternion);
    camera.up.copy(snap.cameraUp);
    camera.updateProjectionMatrix();

    controls.target.copy(snap.target);
    controls.update();
  }, [resetKey, camera, controlsRef, snapshotRef]);

  return null;
}

/**
 * Sets the initial camera view exactly ONCE, AFTER model radius is known,
 * and captures a snapshot at that moment so "Reset view" is identical to the
 * default loading view.
 */
function SetInitialViewOnce({
  controlsRef,
  radius,
  view,
  snapshotRef,
}: {
  controlsRef: React.MutableRefObject<any>;
  radius: number;
  view: "lateral" | "superior";
  snapshotRef: React.MutableRefObject<ViewSnapshot | null>;
}) {
  const { camera, size } = useThree();

  useEffect(() => {
    // Only run when we have a real radius, and only run once.
    if (!Number.isFinite(radius) || radius <= 0) return;
    if (snapshotRef.current) return;

    const controls = controlsRef.current;
    if (!controls) return;

    // Orbit target should be the model center (we center the model at origin)
    controls.target.set(0, 0, 0);

    // Fit distance: conservative so it never feels too tight.
    // Uses current aspect; we are NOT reacting to window resize in this pass.
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const aspect = camera.aspect || size.width / size.height;

    const distV = radius / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const distH = radius / Math.tan(hFov / 2);

    // This multiplier controls how "zoomed out" the default view is.
    // Increase if you still want more space around the brain.
    const dist = Math.max(distV, distH) * 1;

    if (view === "superior") {
      camera.position.set(0, dist, 0);
      camera.up.set(0, 0, -1);
    } else {
      // Lateral (left side). Flip sign to show the other hemisphere.
      camera.position.set(-dist, 0, 0);
      camera.up.set(0, 1, 0);
    }

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    controls.update();

    // Snapshot EXACTLY this view so reset always matches load view.
    snapshotRef.current = {
      cameraPosition: camera.position.clone(),
      cameraQuaternion: camera.quaternion.clone(),
      cameraUp: camera.up.clone(),
      target: controls.target.clone(),
    };
  }, [camera, controlsRef, radius, snapshotRef, size.height, size.width, view]);

  return null;
}

function ClickableModel({
  onPick,
  selectedName,
  onMetrics,
}: {
  onPick: (info: PickInfo) => void;
  selectedName: string | null;
  onMetrics?: (m: ModelMetrics) => void;
}) {
  const gltf = useGLTF("/models/brain_atlas.glb");

  // Clone the scene so we can safely mutate materials and keep stable hierarchy
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Compute bounds on a rotated clone (because we rotate the rendered model)
  const { centerOffset, radius } = useMemo(() => {
    const measure = scene.clone(true);
    measure.rotation.set(-Math.PI / 2, 0, 0);
    measure.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(measure);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const size = new THREE.Vector3();
    box.getSize(size);

    // radius-ish value (good enough for camera distance + limits)
    const computedRadius = 0.5 * size.length();

    return {
      centerOffset: center.multiplyScalar(-1),
      radius: computedRadius,
    };
  }, [scene]);

  useEffect(() => {
    onMetrics?.({ radius });
  }, [onMetrics, radius]);

  // Collect meshes for highlighting/material updates
  const meshes = useMemo(() => {
    const out: THREE.Mesh[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) out.push(obj as THREE.Mesh);
    });
    return out;
  }, [scene]);

  // Apply lit material
  useEffect(() => {
    for (const mesh of meshes) {
      mesh.material = new THREE.MeshStandardMaterial({
        color: "#bdbdbd",
        roughness: 0.85,
        metalness: 0.0,
      });
      mesh.geometry.computeVertexNormals();
    }
  }, [meshes]);

  // Highlight selected
  useEffect(() => {
    for (const mesh of meshes) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (selectedName && mesh.name === selectedName) {
        mat.color.set("#4fffdc");
      } else {
        mat.color.set("#bdbdbd");
      }
      mat.needsUpdate = true;
    }
  }, [meshes, selectedName]);

  return (
    <group
      position={centerOffset}
      rotation={[-Math.PI / 2, 0, 0]} // fixes 90° axis mismatch; do not change
    >
      <primitive
        object={scene}
        onPointerDown={(e) => {
          e.stopPropagation();
          const obj = e.object as THREE.Object3D;
          onPick({ name: obj.name || "(unnamed part)" });
        }}
      />
    </group>
  );
}

export function BrainScene({
  onPick,
  selectedName,
  resetKey,
}: {
  onPick: (info: PickInfo) => void;
  selectedName: string | null;
  resetKey: number;
}) {
  const controlsRef = useRef<any>(null);

  // Start as null so we can tell "not ready yet" vs a real radius.
  const [modelRadius, setModelRadius] = useState<number | null>(null);

  // Stores the default loading view (camera + target)
  const initialViewRef = useRef<ViewSnapshot | null>(null);

  // Use a fallback for control limits until we have metrics
  const r = modelRadius ?? 2.5;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <color attach="background" args={["#1f1f1f"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={2.0} />
        <directionalLight position={[-5, 2, -5]} intensity={1.5} />
        <hemisphereLight intensity={0.8} />

        <Suspense fallback={null}>
          {modelRadius !== null && (
            <SetInitialViewOnce
              controlsRef={controlsRef}
              radius={modelRadius}
              view="lateral"
              snapshotRef={initialViewRef}
            />
          )}

          <ResetViewController
            controlsRef={controlsRef}
            snapshotRef={initialViewRef}
            resetKey={resetKey}
          />

          <ClickableModel
            onPick={onPick}
            selectedName={selectedName}
            onMetrics={(m) => {
              // Only set once to avoid unnecessary camera jumps
              setModelRadius((prev) => (prev === null ? m.radius : prev));
            }}
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
    </div>
  );
}

useGLTF.preload("/models/brain_atlas.glb");
