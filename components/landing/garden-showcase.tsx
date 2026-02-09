"use client";

import { motion } from "framer-motion";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Simple Plant Component for Landing Page
function LandingPlant({ 
  position, 
  color, 
  height = 1, 
  type = "flower",
  delay = 0 
}: { 
  position: [number, number, number]; 
  color: string; 
  height?: number;
  type?: "flower" | "tree" | "bush";
  delay?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.1;
    }
  });

  const stemHeight = height * 1.5;
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.1}
      floatIntensity={0.2}
    >
      <group ref={meshRef} position={position}>
        {/* Stem */}
        <mesh position={[0, stemHeight / 2, 0]}>
          <cylinderGeometry args={[0.05, 0.08, stemHeight, 8]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
        
        {/* Leaves */}
        <mesh position={[-0.2, stemHeight * 0.4, 0]} rotation={[0, 0, -0.5]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0.2, stemHeight * 0.6, 0]} rotation={[0, 0, 0.5]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        
        {/* Flower/Top */}
        <mesh position={[0, stemHeight, 0]}>
          <sphereGeometry args={[0.25 * height, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        
        {/* Petals for flowers */}
        {type === "flower" && Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 5) * Math.PI * 2) * 0.3,
              stemHeight,
              Math.sin((i / 5) * Math.PI * 2) * 0.3,
            ]}
          >
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Ground Component
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[6, 64]} />
      <meshStandardMaterial color="#86efac" />
    </mesh>
  );
}

// Scene Component
function GardenScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      
      {/* Environment */}
      <Environment preset="sunset" />
      
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[6, 5, 6]} fov={50} />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      {/* Ground */}
      <Ground />
      
      {/* Sample Plants */}
      <LandingPlant position={[-1.5, 0, -1]} color="#f472b6" height={0.8} delay={0} />
      <LandingPlant position={[1.5, 0, -0.5]} color="#fbbf24" height={1} type="tree" delay={1} />
      <LandingPlant position={[0, 0, 1.5]} color="#a78bfa" height={0.9} delay={2} />
      <LandingPlant position={[-1, 0, 1]} color="#f87171" height={0.7} delay={3} />
      <LandingPlant position={[1, 0, -1.5]} color="#34d399" height={1.1} type="tree" delay={4} />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-900/30 dark:to-green-900/30 rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Growing your garden...</p>
      </div>
    </div>
  );
}

export function GardenShowcase() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              This Could Be <span className="text-primary">Your Garden</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every completed task brings your garden to life. 
              Drag to rotate and see what&apos;s possible.
            </p>
          </motion.div>

          {/* 3D Garden Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div 
              className="w-full aspect-square md:aspect-[16/9] max-h-[600px] rounded-3xl overflow-hidden border-2 border-border shadow-2xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Canvas
                shadows
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 2]}
              >
                <Suspense fallback={null}>
                  <GardenScene />
                </Suspense>
              </Canvas>
              
              {/* Hover hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0 : 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-muted-foreground pointer-events-none"
              >
                🖱️ Drag to rotate • Scroll to zoom
              </motion.div>
            </div>

            {/* Info Button */}
            <div className="absolute top-4 right-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full shadow-lg">
                    <Info className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>How Your Garden Grows</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🌱</span>
                      <div>
                        <p className="font-medium">Light Tasks</p>
                        <p className="text-muted-foreground">Quick wins under 1 hour grow daisies and tulips</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🌿</span>
                      <div>
                        <p className="font-medium">Medium Tasks</p>
                        <p className="text-muted-foreground">2-4 hours of focus grow roses and sunflowers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🌳</span>
                      <div>
                        <p className="font-medium">Heavy Tasks</p>
                        <p className="text-muted-foreground">Deep work of 4+ hours grows majestic trees</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-muted-foreground">
                        Complete tasks honestly and watch your garden flourish. 
                        Your garden becomes a living story of your discipline.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
