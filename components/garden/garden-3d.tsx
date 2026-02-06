'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import type { Plant, Task } from '@/lib/db/schema';
import { Ground } from './models/Ground';
import { Plant3D } from './models/Plant3D';
import { Loader2 } from 'lucide-react';

interface Garden3DProps {
  plants: (Plant & { task: Task })[];
  width?: number;
  height?: number;
}

function GardenScene({ plants }: { plants: (Plant & { task: Task })[] }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />

      {/* Environment */}
      <Environment preset="sunset" />

      {/* Sky background */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#87CEEB" side={2} />
      </mesh>

      {/* Ground */}
      <Ground />

      {/* Plants */}
      {plants.length === 0 ? (
        <group position={[0, 1, 0]}>
          {/* Empty garden message could be a 3D text or sign */}
        </group>
      ) : (
        plants.map((plant) => (
          <Plant3D key={plant.id} plant={plant} />
        ))
      )}
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-green-200 rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your garden...</p>
      </div>
    </div>
  );
}

export function Garden3D({ plants, width = 400, height = 400 }: Garden3DProps) {
  return (
    <div 
      style={{ width, height }} 
      className="rounded-lg overflow-hidden border border-border"
    >
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <GardenScene plants={plants} />
        </Suspense>
      </Canvas>
    </div>
  );
}
