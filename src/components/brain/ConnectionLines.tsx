import { useMemo } from 'react';
import * as THREE from 'three';
import regionsData from '../../data/regions.json';
import connectivityData from '../../data/connectivity.json';

interface ConnectionLinesProps {
  selectedRegion: string;
  threshold: number;
}

// Bioluminescent color palette based on connection strength
function getConnectionColor(strength: number): string {
  if (strength > 0.8) return '#00f0ff';  // Strong - bright cyan
  if (strength > 0.6) return '#00c4d4';  // Medium-high - cyan
  if (strength > 0.4) return '#a855f7';  // Medium - purple
  return '#6366f1';                       // Weak - indigo
}

export function ConnectionLines({ selectedRegion, threshold }: ConnectionLinesProps) {
  const lines = useMemo(() => {
    const regions = regionsData as Record<string, { centroid: number[] }>;
    const { connections } = connectivityData as { connections: Array<{ source: string; target: string; strength: number }> };

    // Filter connections for selected region
    const relevant = connections.filter(
      (c) =>
        (c.source === selectedRegion || c.target === selectedRegion) &&
        c.strength >= threshold
    );

    // Get centroid for selected region
    const selectedData = regions[selectedRegion];
    if (!selectedData) return [];

    const selectedCentroid = new THREE.Vector3(...selectedData.centroid);

    return relevant.map((conn) => {
      const otherName = conn.source === selectedRegion ? conn.target : conn.source;
      const otherData = regions[otherName];

      if (!otherData) return null;

      const otherCentroid = new THREE.Vector3(...otherData.centroid);

      // Scale centroids to match model coordinates (must match MODEL_SCALE in BrainModel)
      const scaleFactor = 0.02;
      const start = selectedCentroid.clone().multiplyScalar(scaleFactor);
      const end = otherCentroid.clone().multiplyScalar(scaleFactor);

      // Create curved path between points
      const midpoint = start.clone().add(end).multiplyScalar(0.5);
      // Add some lift to the curve
      const distance = start.distanceTo(end);
      midpoint.y += distance * 0.3;

      const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end);

      return {
        curve,
        strength: conn.strength,
        target: otherName,
      };
    }).filter(Boolean) as Array<{ curve: THREE.QuadraticBezierCurve3; strength: number; target: string }>;
  }, [selectedRegion, threshold]);

  if (lines.length === 0) return null;

  return (
    <group>
      {lines.map((line, i) => (
        <mesh key={i}>
          <tubeGeometry
            args={[
              line.curve,
              20,                          // tubular segments
              0.02 + line.strength * 0.03, // radius based on strength
              8,                           // radial segments
              false,                       // closed
            ]}
          />
          <meshStandardMaterial
            color={getConnectionColor(line.strength)}
            transparent
            opacity={0.6 + line.strength * 0.4}
            emissive={getConnectionColor(line.strength)}
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
