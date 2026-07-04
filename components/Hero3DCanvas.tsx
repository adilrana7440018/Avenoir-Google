'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingShapes() {
  const torusRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.2;
      torusRef.current.rotation.y = time * 0.3;
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Dynamic distorting sphere representing "Aura" */}
      <mesh ref={sphereRef} position={[-1.2, 0, 0]} castShadow>
        <sphereGeometry args={[0.8, 64, 64]} />
        <MeshDistortMaterial
          color="#6366F1" // Soft Indigo
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          roughness={0.1}
          metalness={0.1}
          distort={0.4}
          speed={2}
        />
      </mesh>

      {/* Floating Torus representing "Orbit" */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={torusRef} position={[1.2, 0.5, 0.5]} castShadow>
          <torusGeometry args={[0.6, 0.2, 16, 64]} />
          <meshPhysicalMaterial
            color="#14B8A6" // Muted Teal
            roughness={0.2}
            metalness={0.1}
            transmission={0.6}
            thickness={1}
            clearcoat={0.5}
          />
        </mesh>
      </Float>

      {/* Small warm amber octahedron */}
      <Float speed={2} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[0, -0.8, 0.5]} castShadow>
          <octahedronGeometry args={[0.4]} />
          <meshPhysicalMaterial
            color="#F59E0B" // Soft Amber
            roughness={0.3}
            metalness={0.2}
            transmission={0.4}
            thickness={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-full min-h-[350px] md:min-h-[450px] relative">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#E0E7FF" />
        
        <FloatingShapes />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
