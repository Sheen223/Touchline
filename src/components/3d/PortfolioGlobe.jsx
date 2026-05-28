import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Html } from '@react-three/drei';

const AnimatedGlobe = () => {
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.2} wireframe />
    </mesh>
  );
};

const FloatingNodes = () => {
  const nodes = Array.from({ length: 30 }, (_, i) => ({
    position: [
      Math.sin(i) * 2,
      Math.cos(i * 0.7) * 1.5,
      Math.sin(i * 1.3) * 2
    ]
  }));
  
  return (
    <>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </>
  );
};

export const PortfolioGlobe = () => {
  return (
    <div className="w-full h-full bg-black/20 rounded-2xl border border-neon-cyan/30 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedGlobe />
        <FloatingNodes />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};