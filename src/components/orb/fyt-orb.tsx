import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sampleScrollPose, scene, tickScene } from "@/lib/scene-state";
import orbFrag from "@/shaders/orb.frag?raw";
import orbVert from "@/shaders/orb.vert?raw";

const MAX_TILT = (5 * Math.PI) / 180;

type Uniforms = {
  uTime: { value: number };
  uScroll: { value: number };
  uIntensity: { value: number };
  uQuality: { value: number };
  uOpacity: { value: number };
  uMouse: { value: THREE.Vector2 };
  uAuth: { value: number };
};

export function FytOrb({ appearance = "site" }: { appearance?: "site" | "auth" }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const look = useMemo(() => new THREE.Vector3(), []);
  const idle = useRef(0);

  const uniforms = useMemo<Uniforms>(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntensity: { value: 1 },
      uQuality: { value: 1 },
      uOpacity: { value: 1 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAuth: { value: appearance === "auth" ? 1 : 0 },
    }),
    [appearance],
  );

  const geometry = useMemo(() => {
    const mobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || !window.matchMedia("(hover: hover)").matches);
    return new THREE.IcosahedronGeometry(1, mobile ? 3 : 5);
  }, []);

  const shellGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 3), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      shellGeo.dispose();
    };
  }, [geometry, shellGeo]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    tickScene(d);

    if (scene.reduced) {
      uniforms.uTime.value += d * 0.12;
      uniforms.uIntensity.value = appearance === "auth" ? 0.12 : 0.15;
    } else {
      uniforms.uTime.value += d;
      uniforms.uIntensity.value = appearance === "auth" ? 0.62 + scene.hover * 0.1 : 0.85 + scene.hover * 0.35;
    }

    uniforms.uScroll.value = scene.scroll;
    uniforms.uQuality.value = scene.quality;
    uniforms.uMouse.value.set(scene.mouseX, scene.mouseY);

    const pose = sampleScrollPose(scene.scroll, scene.mobile);
    if (!group.current) return;

    if (!scene.reduced) {
      idle.current += d * 0.035;
    }

    group.current.position.x += (pose.orbX - group.current.position.x) * (1 - Math.exp(-3.4 * d));
    group.current.position.y += (pose.orbY - group.current.position.y) * (1 - Math.exp(-3.4 * d));
    const s =
      group.current.scale.x + (pose.orbScale - group.current.scale.x) * (1 - Math.exp(-3.4 * d));
    group.current.scale.setScalar(s);

    const tiltX = scene.reduced ? 0 : scene.mouseY * MAX_TILT;
    const tiltY = scene.reduced ? idle.current : idle.current + scene.mouseX * MAX_TILT;
    group.current.rotation.x += (tiltX - group.current.rotation.x) * (1 - Math.exp(-4 * d));
    group.current.rotation.y += (tiltY - group.current.rotation.y) * (1 - Math.exp(-4 * d));

    if (mesh.current) {
      const mat = mesh.current.material as THREE.ShaderMaterial;
      const next = mat.uniforms.uOpacity.value as number;
      const opacity = next + (pose.orbOpacity - next) * (1 - Math.exp(-3 * d));
      mat.uniforms.uOpacity.value = opacity;
      mat.transparent = opacity < 0.98;
      mat.depthWrite = opacity > 0.85;
    }
    if (shell.current) {
      const mat = shell.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.16 * pose.orbOpacity;
    }

    const cam = state.camera;
    if (!scene.reduced) {
      cam.position.x += (pose.camX - cam.position.x) * (1 - Math.exp(-2.6 * d));
      cam.position.y += (pose.camY - cam.position.y) * (1 - Math.exp(-2.6 * d));
      cam.position.z += (pose.camZ - cam.position.z) * (1 - Math.exp(-2.6 * d));
    }
    look.set(group.current.position.x * 0.35, group.current.position.y * 0.2, 0);
    cam.lookAt(look);
  });

  return (
    <group ref={group} position={[1.28, -0.06, 0]} scale={1.58}>
      <mesh ref={mesh} geometry={geometry}>
        <shaderMaterial
          vertexShader={orbVert}
          fragmentShader={orbFrag}
          uniforms={uniforms}
          toneMapped={false}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh ref={shell} geometry={shellGeo} scale={1.045}>
        <meshBasicMaterial
          color="#c5d8dc"
          transparent
          opacity={0.16}
          depthWrite={false}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
