import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Claude from "@lobehub/icons/es/Claude";
import DeepSeek from "@lobehub/icons/es/DeepSeek";
import Gemini from "@lobehub/icons/es/Gemini";
import Kimi from "@lobehub/icons/es/Kimi";
import OpenAI from "@lobehub/icons/es/OpenAI";
import Qwen from "@lobehub/icons/es/Qwen";
import { useLanguage } from "@/lib/language";
import orbFrag from "@/shaders/orb.frag?raw";
import orbVert from "@/shaders/orb.vert?raw";

function GlmMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="#4f6ef7">
        <circle cx="12" cy="3.5" r="1.6" />
        <circle cx="17.7" cy="5.8" r="1.6" />
        <circle cx="20.2" cy="11.5" r="1.6" />
        <circle cx="17.7" cy="17.2" r="1.6" />
        <circle cx="12" cy="20.5" r="1.6" />
        <circle cx="6.3" cy="17.2" r="1.6" />
        <circle cx="3.8" cy="11.5" r="1.6" />
        <circle cx="6.3" cy="5.8" r="1.6" />
        <circle cx="12" cy="12" r="2.3" />
      </g>
    </svg>
  );
}

/** Seven providers share one orbit so adjacent icons keep the same spacing. */
const SATELLITES = [
  { name: "OpenAI", icon: <OpenAI size={20} /> },
  { name: "Qwen", icon: <Qwen.Color size={20} /> },
  { name: "Anthropic", icon: <Claude.Color size={20} /> },
  { name: "Google", icon: <Gemini.Color size={20} /> },
  { name: "DeepSeek", icon: <DeepSeek.Color size={20} /> },
  { name: "Kimi", icon: <Kimi size={20} /> },
  { name: "GLM", icon: <GlmMark size={20} /> },
] as const;

function RoutingMoon({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uIntensity: { value: reduced ? 0.15 : 0.55 },
    uQuality: { value: 1 },
    uOpacity: { value: 0.84 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [reduced]);

  useFrame((_, delta) => {
    if (reduced || !group.current) return;
    const step = Math.min(delta, 0.1);
    uniforms.uTime.value += step;
    group.current.rotation.y += step * 0.075;
    group.current.rotation.z += step * 0.012;
  });

  return (
    <group ref={group} rotation={[0.13, -0.42, -0.08]}>
      <mesh>
        <icosahedronGeometry args={[1, 4]} />
        <shaderMaterial
          vertexShader={orbVert}
          fragmentShader={orbFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.045}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color="#d5e8eb" transparent opacity={0.1} depthWrite={false} side={THREE.BackSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function WarpTunnelSection() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="routing" className="warp">
      <div className="warp-stage">
        <div className="warp-copy">
          <div className="warp-moon-wrap">
            {/* Satellite icons orbit around the moon */}
            <div className="warp-orbit" aria-label={zh ? "AI 模型生态" : "AI model ecosystem"}>
              <div className="warp-orbit-ring">
                {SATELLITES.map((sat, index) => (
                  <span
                    key={sat.name}
                    className="warp-sat"
                    style={{ "--sat-angle": `${(index * 360) / SATELLITES.length}deg` } as React.CSSProperties}
                    title={sat.name}
                  >
                    <span className="warp-sat-icon">{sat.icon}</span>
                  </span>
                ))}
              </div>
            </div>

            <div ref={hostRef} className="warp-moon" aria-hidden="true">
              <div className={`warp-moon-fallback${ready ? " is-hidden" : ""}`} />
              <Canvas
                gl={{ alpha: true, antialias: true, powerPreference: "low-power", toneMapping: THREE.NoToneMapping }}
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 4.2], fov: 32, near: 0.1, far: 20 }}
                frameloop={reduced ? "demand" : visible ? "always" : "never"}
                onCreated={() => setReady(true)}
                style={{ pointerEvents: "none" }}
              >
                <ambientLight intensity={0.72} color="#f7f4ee" />
                <directionalLight position={[4.2, 6.2, 3.4]} intensity={1.35} color="#fff8f1" />
                <directionalLight position={[-5.4, 1.2, 2.1]} intensity={0.42} color="#d7e8ec" />
                <directionalLight position={[0.2, 2.4, -5.5]} intensity={0.55} color="#d5eef0" />
                <RoutingMoon reduced={reduced} />
              </Canvas>
            </div>
          </div>
          <h2 className={`warp-title${zh ? " warp-title-zh" : ""}`}>
            {zh ? "每一次调用，都穿越最优通道" : "Every call takes the optimal path"}
          </h2>
          <p className="warp-lede">
            {zh
              ? "请求在多个上游通道之间实时评估，自动落到当前延迟最低、可用性最高的那一条。"
              : "Each request is weighed across upstream channels and lands on whichever is fastest and healthiest right now."}
          </p>
        </div>
      </div>
    </section>
  );
}
