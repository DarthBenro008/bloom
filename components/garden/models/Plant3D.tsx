'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import type { Plant, Task } from '@/lib/db/schema';
import { PLANT_CONFIGS, getPlantVisuals, type PlantType } from '../plants';
import { PlantTooltip } from '../PlantTooltip';

interface Plant3DProps {
  plant: Plant & { task: Task | null };
}

export function Plant3D({ plant }: Plant3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const plantType = plant.plantType as PlantType;
  const config = PLANT_CONFIGS[plantType] || PLANT_CONFIGS.daisy;
  const visuals = getPlantVisuals(plantType, plant.growthStage, plant.health);
  
  // Position on grid (converted to 3D space)
  const positionX = (plant.positionX - 3.5) * 1.5;
  const positionZ = (plant.positionY - 3.5) * 1.5;
  
  // Color based on health
  const plantColor = useMemo(() => 
    new THREE.Color(config.healthyColor).lerp(
      new THREE.Color(config.witherColor),
      1 - visuals.healthRatio
    ),
    [config.healthyColor, config.witherColor, visuals.healthRatio]
  );

  // Smooth hover animation
  const spring = useSpring({
    scale: hovered ? 1.15 : 1,
    config: { tension: 300, friction: 20 },
  });
  
  // Gentle swaying animation
  useFrame((state) => {
    if (groupRef.current && plant.growthStage > 0) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.z = Math.sin(time + plant.positionX) * 0.05 * visuals.sizeMultiplier;
      groupRef.current.rotation.x = Math.cos(time * 0.7 + plant.positionY) * 0.03 * visuals.sizeMultiplier;
    }
  });

  // Render nothing if seed stage
  if (plant.growthStage === 0) {
    return (
      <group position={[positionX, 0, positionZ]}>
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>
    );
  }

  const stemHeight = 0.5 + visuals.height * 1.5;
  const stemColor = new THREE.Color('#228B22').lerp(
    new THREE.Color('#654321'),
    1 - visuals.healthRatio
  );

  return (
    <animated.group 
      ref={groupRef} 
      position={[positionX, 0, positionZ]}
      // @ts-ignore - react-spring typing issue
      scale={spring.scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setHovered(false);
      }}
    >
      {/* Stem */}
      <mesh position={[0, stemHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.02 + plant.growthStage * 0.01, 0.03 + plant.growthStage * 0.01, stemHeight, 8]} />
        <meshStandardMaterial color={stemColor} />
      </mesh>

      {/* Plant type specific geometry */}
      {renderPlantTop(plantType, plant.growthStage, stemHeight, plantColor, visuals.sizeMultiplier)}
      
      {/* Tooltip */}
      <PlantTooltip plantType={plantType} task={plant.task} visible={hovered} />
    </animated.group>
  );
}

function renderPlantTop(
  plantType: PlantType,
  growthStage: number,
  stemHeight: number,
  color: THREE.Color,
  sizeMultiplier: number
) {
  const topY = stemHeight;

  // Flowers (light effort)
  if (plantType === 'daisy') {
    return (
      <group position={[0, topY, 0]}>
        {/* Petals */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const petalRadius = 0.1 * sizeMultiplier;
          return (
            <mesh 
              key={i}
              position={[
                Math.cos(angle) * petalRadius * 1.2,
                0,
                Math.sin(angle) * petalRadius * 1.2
              ]}
              rotation={[Math.PI / 2, 0, angle]}
              castShadow
            >
              <circleGeometry args={[petalRadius, 8]} />
              <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
            </mesh>
          );
        })}
        {/* Center */}
        <mesh castShadow>
          <sphereGeometry args={[0.05 * sizeMultiplier, 12, 12]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      </group>
    );
  }

  if (plantType === 'tulip') {
    return (
      <mesh position={[0, topY, 0]} castShadow>
        <coneGeometry args={[0.12 * sizeMultiplier, 0.25 * sizeMultiplier, 8, 1, true]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    );
  }

  if (plantType === 'poppy') {
    return (
      <group position={[0, topY, 0]}>
        {/* Bowl-shaped petals */}
        <mesh rotation={[Math.PI, 0, 0]} castShadow>
          <sphereGeometry args={[0.15 * sizeMultiplier, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
        {/* Black center */}
        <mesh position={[0, -0.02, 0]} castShadow>
          <sphereGeometry args={[0.04 * sizeMultiplier, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    );
  }

  // Medium effort - Vibrant blooms
  if (plantType === 'rose') {
    return (
      <group position={[0, topY, 0]}>
        {/* Layered petals */}
        <mesh castShadow>
          <sphereGeometry args={[0.12 * sizeMultiplier, 12, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh scale={0.7} castShadow>
          <sphereGeometry args={[0.12 * sizeMultiplier, 12, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }

  if (plantType === 'sunflower') {
    return (
      <group position={[0, topY, 0]}>
        {/* Petals */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const petalRadius = 0.15 * sizeMultiplier;
          return (
            <mesh 
              key={i}
              position={[
                Math.cos(angle) * petalRadius * 1.5,
                0,
                Math.sin(angle) * petalRadius * 1.5
              ]}
              rotation={[Math.PI / 2, 0, angle]}
              castShadow
            >
              <circleGeometry args={[petalRadius * 0.6, 8]} />
              <meshStandardMaterial color={color} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
        {/* Center */}
        <mesh castShadow>
          <cylinderGeometry args={[0.12 * sizeMultiplier, 0.12 * sizeMultiplier, 0.05, 16]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>
    );
  }

  if (plantType === 'lavender') {
    return (
      <group position={[0, topY, 0]}>
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.08, 0]} castShadow>
            <coneGeometry args={[0.06 * sizeMultiplier, 0.12 * sizeMultiplier, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
    );
  }

  // Heavy effort - Trees
  if (plantType === 'oak') {
    const canopySize = 0.4 + sizeMultiplier * 0.4;
    return (
      <group position={[0, topY + 0.2, 0]}>
        {/* Main canopy */}
        <mesh castShadow>
          <sphereGeometry args={[canopySize, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Additional clusters for mature trees */}
        {growthStage >= 4 && (
          <>
            <mesh position={[-canopySize * 0.5, canopySize * 0.2, 0]} castShadow>
              <sphereGeometry args={[canopySize * 0.6, 12, 12]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[canopySize * 0.5, canopySize * 0.2, 0]} castShadow>
              <sphereGeometry args={[canopySize * 0.6, 12, 12]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        )}
      </group>
    );
  }

  if (plantType === 'cherry_blossom') {
    const canopySize = 0.35 + sizeMultiplier * 0.35;
    return (
      <group position={[0, topY + 0.15, 0]}>
        {/* Multiple pink blossom clusters */}
        <mesh castShadow>
          <sphereGeometry args={[canopySize, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          return (
            <mesh 
              key={i}
              position={[
                Math.cos(angle) * canopySize * 0.6,
                Math.sin(i) * 0.1,
                Math.sin(angle) * canopySize * 0.6
              ]}
              castShadow
            >
              <sphereGeometry args={[canopySize * 0.5, 12, 12]} />
              <meshStandardMaterial color={color} />
            </mesh>
          );
        })}
      </group>
    );
  }

  if (plantType === 'maple') {
    const canopySize = 0.4 + sizeMultiplier * 0.4;
    return (
      <group position={[0, topY + 0.2, 0]}>
        {/* Layered canopy for maple */}
        <mesh castShadow>
          <dodecahedronGeometry args={[canopySize, 0]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
        {growthStage >= 4 && (
          <mesh position={[0, canopySize * 0.4, 0]} scale={0.7} castShadow>
            <dodecahedronGeometry args={[canopySize, 0]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
        )}
      </group>
    );
  }

  // Default fallback
  return (
    <mesh position={[0, topY, 0]} castShadow>
      <sphereGeometry args={[0.1 * sizeMultiplier, 12, 12]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
