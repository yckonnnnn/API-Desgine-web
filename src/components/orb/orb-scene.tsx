import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { scene } from "@/lib/scene-state";
import { FytOrb } from "./fyt-orb";

type Props = {
  onReady: () => void;
  appearance: "site" | "auth";
};

export function OrbScene({ onReady, appearance }: Props) {
  return (
    <Canvas
      className="orb-canvas"
      onCreated={({ gl, scene: activeScene, camera }) => {
        // Keep the fallback visible until the GPU has compiled the actual scene.
        // Removing the fixed delay alone can expose a blank frame on cold loads.
        void gl.compileAsync(activeScene, camera).then(onReady, onReady);
      }}
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
      <ambientLight intensity={appearance === "auth" ? 0.7 : 0.72} color="#f7f4ee" />
      <directionalLight position={[4.2, 6.2, 3.4]} intensity={appearance === "auth" ? 1.22 : 1.35} color="#fff8f1" />
      <directionalLight position={[-5.4, 1.2, 2.1]} intensity={appearance === "auth" ? 0.4 : 0.42} color="#d7e8ec" />
      <directionalLight position={[0.2, 2.4, -5.5]} intensity={appearance === "auth" ? 0.52 : 0.55} color="#d5eef0" />
      <FytOrb appearance={appearance} />
    </Canvas>
  );
}
