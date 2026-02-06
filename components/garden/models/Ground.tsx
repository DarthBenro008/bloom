'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export function Ground() {
  // Create a circular ground with subtle height variation
  const groundGeometry = useMemo(() => {
    const geometry = new THREE.CircleGeometry(8, 64);
    const positions = geometry.attributes.position.array as Float32Array;
    
    // Add subtle height variation for a more organic look
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const distance = Math.sqrt(x * x + y * y);
      
      // Slight height variation based on position
      positions[i + 2] = Math.sin(x * 0.5) * 0.1 + Math.cos(y * 0.5) * 0.1;
      
      // Slight depression in the center
      if (distance < 1) {
        positions[i + 2] -= 0.05;
      }
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group>
      {/* Main ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]}
        receiveShadow
        geometry={groundGeometry}
      >
        <meshStandardMaterial 
          color="#7CCD7C"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Soil border */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.15, 0]}
      >
        <circleGeometry args={[8.5, 64]} />
        <meshStandardMaterial 
          color="#8B7355"
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}
