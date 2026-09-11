import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { scene } from "@/lib/scene-state";
import { FytOrb } from "./fyt-orb";

type Props = {
  onReady: () => void;
};

export function OrbScene({ onReady }: Props) {
  useEffect(() => {
    const id = window.setTimeout(onReady, 280);
    return () => window.clearTimeout(id);
  }, [onReady]);

  return (
    <Canvas
      className="orb-canvas"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
        toneMapping: THREE.NoToneMapping,
      }}
      dpr={scene.mobile ? [1, 1.15] : [1, 1.5]}
      camera={{ position: [0.46, 0.08, 4.18], fov: 32, near: 0.1, far: 24 }}
      frameloop="always"
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        flipflops={2}
        onFallback={() => {
          scene.quality = 0;
        }}
        onDecline={() => {
          scene.quality = 0;
        }}
      />
      <ambientLight intensity={0.72} color="#f7f4ee" />
      <directionalLight position={[4.2, 6.2, 3.4]} intensity={1.35} color="#fff8f1" />
      <directionalLight position={[-5.4, 1.2, 2.1]} intensity={0.42} color="#d7e8ec" />
      <directionalLight position={[0.2, 2.4, -5.5]} intensity={0.55} color="#d5eef0" />
      <FytOrb />
    </Canvas>
  );
}
