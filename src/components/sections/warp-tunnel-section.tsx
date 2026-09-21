import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FoytonBrand } from "@/components/layout/foyton-brand";
import { useLanguage } from "@/lib/language";

/**
 * Matches `--color-canvas` so exp2 fog dissolves distant streaks into the page
 * instead of into a void — the light-theme stand-in for the prototype's black
 * space, which a warm canvas cannot reproduce without turning muddy.
 */
const CANVAS = 0xf4f3ef;

/**
 * The prototype's chromatic palette, rebalanced for paper. Two changes carry
 * the whole adaptation:
 *
 *  - Pure white is dropped. On `#060713` it read as a laser; on `#f4f3ef` it is
 *    invisible, and a "streak" you cannot see is worse than no streak.
 *  - Ink (`#111214`) leads the list. Additive blending is what made the
 *    prototype's colors glow, and additive blending on a light background
 *    saturates to white, so every material here uses `NormalBlending` and the
 *    dark tones do the work the glow used to do.
 */
const PALETTE = [
  "#111214", "#6e9ea2", "#4f6ef7", "#8b5cf6", "#ec4899",
  "#f59e0b", "#10b981", "#f43f5e", "#0ea5e9",
].map((hex) => new THREE.Color(hex));

const pick = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

export function WarpTunnelSection() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const zh = language === "zh";

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Read both flags here rather than from `scene`: child effects run before
    // ExperienceProvider's, so the shared flags are still their defaults by the
    // time this effect fires.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact =
      window.matchMedia("(max-width: 767px)").matches ||
      !window.matchMedia("(hover: hover)").matches;

    let width = host.clientWidth || window.innerWidth;
    let height = host.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(CANVAS, 0.0011);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);
    camera.position.z = 1000;

    // Transparent clear: the CSS wash behind the canvas stays visible, and fog
    // (set to the canvas colour) still pulls distant geometry into it.
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // 1. Streaks — the speed lines. Short tail, long reach, so they read as
    //    marks raked across the page rather than as beams in a dark room.
    const streakCount = compact ? 150 : 340;
    const lineGroup = new THREE.Group();
    const streaks: {
      line: THREE.Line;
      speed: number;
      radius: number;
      angle: number;
    }[] = [];

    for (let i = 0; i < streakCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.pow(Math.random(), 1.5) * 550;
      const length = 200 + Math.random() * 800;

      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(
          Math.cos(angle) * radius * 0.15,
          Math.sin(angle) * radius * 0.15,
          -length,
        ),
        new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, length),
      ]);

      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: pick(),
          transparent: true,
          opacity: 0.3 + Math.random() * 0.5,
          blending: THREE.NormalBlending,
        }),
      );
      line.position.z = (Math.random() - 0.5) * 2000;
      lineGroup.add(line);
      streaks.push({ line, speed: 8 + Math.random() * 18, radius, angle });
    }
    scene.add(lineGroup);

    // 2. Stardust. The texture is greyscale so `vertexColors` supplies the hue:
    //    a white core would multiply to white and vanish against the canvas.
    const particleCount = compact ? 900 : 2600;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 30 + Math.pow(Math.random(), 1.3) * 600;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2500;

      const color = pick();
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      speeds[i] = 4 + Math.random() * 10;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const sprite = document.createElement("canvas");
    sprite.width = 32;
    sprite.height = 32;
    const ctx = sprite.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.35, "rgba(255,255,255,0.5)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(sprite);

    const particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: compact ? 4.5 : 5.5,
        map: texture,
        transparent: true,
        opacity: 0.9,
        vertexColors: true,
        blending: THREE.NormalBlending,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    // Pointer parallax, container-relative so the effect tracks the band
    // itself rather than the whole viewport.
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / width - 0.5) * 150;
      targetY = (-(event.clientY - rect.top) / height + 0.5) * 150;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width || window.innerWidth;
        height = entry.contentRect.height || 560;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(host);

    // A full-page canvas that keeps rendering while scrolled past is pure
    // waste; park it and resume where it left off.
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "160px" },
    );
    io.observe(host);

    const advance = (delta: number) => {
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX * 0.35;
      camera.position.y = mouseY * 0.35;
      camera.lookAt(0, 0, 0);

      lineGroup.rotation.z += 0.0012 * delta;
      particles.rotation.z -= 0.0008 * delta;

      for (const item of streaks) {
        item.line.position.z += item.speed * 0.8 * delta;
        if (item.line.position.z > 1200) item.line.position.z = -1200;
      }

      const array = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i += 1) {
        array[i * 3 + 2] += speeds[i] * 1.5 * delta;
        if (array[i * 3 + 2] > 1100) {
          array[i * 3 + 2] = -1200;
          const radius = 30 + Math.pow(Math.random(), 1.3) * 600;
          const angle = Math.random() * Math.PI * 2;
          array[i * 3] = Math.cos(angle) * radius;
          array[i * 3 + 1] = Math.sin(angle) * radius;
        }
      }
      geometry.attributes.position.needsUpdate = true;
    };

    let frame = 0;
    let last = performance.now();

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      // Clamp so a backgrounded tab does not resume with one enormous jump.
      const delta = Math.min((now - last) / 16.667, 3);
      last = now;
      if (!onScreen) return;
      advance(delta);
      renderer.render(scene, camera);
    };

    if (reduced) {
      advance(0);
      renderer.render(scene, camera);
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      io.disconnect();
      renderer.dispose();
      texture.dispose();
      geometry.dispose();
      for (const item of streaks) {
        item.line.geometry.dispose();
        (item.line.material as THREE.Material).dispose();
      }
      (particles.material as THREE.Material).dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <section id="routing" className="warp">
      {/* Opens the band the way the prototype's strip opens its starfield: a
          halftone dotted wash that tints the canvas instead of diving to black. */}
      <div className="warp-veil" aria-hidden="true">
        <span className="warp-veil-dots" />
      </div>

      <div className="warp-stage">
        <div ref={hostRef} className="warp-canvas" aria-hidden="true" />
        <span className="warp-haze warp-haze-a" aria-hidden="true" />
        <span className="warp-haze warp-haze-b" aria-hidden="true" />
        {/* Lifts the centre so the headline stays crisp where streaks cross it. */}
        <span className="warp-core" aria-hidden="true" />

        <div className="warp-copy">
          <p className="section-kicker warp-kicker">
            <span className="kicker-rule" />
            {zh ? "智能路由" : "Intelligent routing"}
            <span className="kicker-rule" />
          </p>

          <div className="warp-badge">
            <FoytonBrand />
          </div>

          <h2 className="warp-title">
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
