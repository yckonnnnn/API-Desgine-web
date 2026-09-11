import { i as __toESM } from "../_runtime.mjs";
import { a as Vector2, c as require_jsx_runtime, i as IcosahedronGeometry, l as require_react, n as Canvas, o as Vector3, r as useFrame, t as PerformanceMonitor } from "../_libs/@react-three/drei+[...].mjs";
import { i as tickScene, n as sampleScrollPose, r as scene } from "./router-Cson6qb-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orb-scene-ChSrCaOM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var orb_default$1 = "uniform float uTime;\nuniform float uScroll;\nuniform float uIntensity;\nuniform float uQuality;\nuniform float uOpacity;\nuniform vec2 uMouse;\n\nvarying vec3 vNormal;\nvarying vec3 vWorldPos;\nvarying vec3 vViewDir;\nvarying vec3 vObjectPos;\nvarying float vDisp;\nvarying float vCrater;\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x) {\n  return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v) {\n  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);\n  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n  vec3 i = floor(v + dot(v, C.yyy));\n  vec3 x0 = v - i + dot(i, C.xxx);\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min(g.xyz, l.zxy);\n  vec3 i2 = max(g.xyz, l.zxy);\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy;\n  vec3 x3 = x0 - D.yyy;\n  i = mod289(i);\n  vec4 p = permute(permute(permute(\n      i.z + vec4(0.0, i1.z, i2.z, 1.0))\n    + i.y + vec4(0.0, i1.y, i2.y, 1.0))\n    + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n  float n_ = 0.142857142857;\n  vec3 ns = n_ * D.wyz - D.xzx;\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_);\n  vec4 x = x_ * ns.x + ns.yyyy;\n  vec4 y = y_ * ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n  vec4 b0 = vec4(x.xy, y.xy);\n  vec4 b1 = vec4(x.zw, y.zw);\n  vec4 s0 = floor(b0) * 2.0 + 1.0;\n  vec4 s1 = floor(b1) * 2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n  vec3 p0 = vec3(a0.xy, h.x);\n  vec3 p1 = vec3(a0.zw, h.y);\n  vec3 p2 = vec3(a1.xy, h.z);\n  vec3 p3 = vec3(a1.zw, h.w);\n  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));\n}\n\nvoid main() {\n  vec3 N = normalize(vNormal);\n  vec3 V = normalize(vViewDir);\n\n  if (uQuality > 0.45) {\n    float micro = snoise(vObjectPos * 28.0 + uTime * 0.02);\n    float dx = dFdx(micro);\n    float dy = dFdy(micro);\n    N = normalize(N + vec3(dx, dy, 0.0) * 0.18);\n  }\n\n  vec3 L1 = normalize(vec3(0.48, 0.78, 0.42));\n  vec3 L2 = normalize(vec3(-0.72, 0.18, 0.38));\n  vec3 L3 = normalize(vec3(0.08, 0.32, -0.86));\n\n  float wrap = 0.38;\n  float ndl1 = clamp((dot(N, L1) + wrap) / (1.0 + wrap), 0.0, 1.0);\n  float ndl2 = clamp((dot(N, L2) + 0.5) / 1.5, 0.0, 1.0);\n  float ndl3 = pow(clamp(dot(N, L3), 0.0, 1.0), 1.4);\n\n  float NoV = clamp(dot(N, V), 0.0, 1.0);\n  float fres = pow(1.0 - NoV, 2.65);\n\n  vec3 maria = vec3(0.52, 0.535, 0.545);\n  vec3 highland = vec3(0.86, 0.845, 0.812);\n  vec3 ridge = vec3(0.93, 0.92, 0.895);\n  vec3 craterFloor = vec3(0.46, 0.47, 0.48);\n\n  vec3 albedo = mix(maria, highland, smoothstep(-0.04, 0.018, vDisp));\n  albedo = mix(albedo, ridge, smoothstep(0.02, 0.07, vDisp));\n  albedo = mix(albedo, craterFloor, vCrater * 0.72);\n\n  float mareMask = snoise(vObjectPos * 1.6) * 0.5 + 0.5;\n  albedo = mix(albedo, maria, smoothstep(0.58, 0.78, mareMask) * 0.28);\n\n  vec3 pearl = vec3(0.93, 0.915, 0.88);\n  vec3 ice = vec3(0.70, 0.86, 0.88);\n  vec3 warm = vec3(0.96, 0.94, 0.90);\n  vec3 irid = mix(pearl, ice, clamp(fres * 0.72 + (1.0 - NoV) * 0.18, 0.0, 1.0));\n  albedo = mix(albedo, irid, 0.38);\n\n  vec3 ambient = vec3(0.58, 0.57, 0.55) * 0.42;\n  vec3 keyCol = vec3(1.0, 0.975, 0.94);\n  vec3 fillCol = vec3(0.76, 0.85, 0.88);\n  vec3 rimCol = vec3(0.78, 0.90, 0.92);\n\n  vec3 col = albedo * (ambient + keyCol * ndl1 * 0.92 + fillCol * ndl2 * 0.32);\n  col += rimCol * ndl3 * 0.16;\n\n  vec3 H1 = normalize(L1 + V);\n  float spec1 = pow(clamp(dot(N, H1), 0.0, 1.0), 42.0);\n  vec3 H2 = normalize(L2 + V);\n  float spec2 = pow(clamp(dot(N, H2), 0.0, 1.0), 28.0);\n  vec3 F0 = vec3(0.11, 0.115, 0.12);\n  col += spec1 * mix(F0, albedo, 0.16) * keyCol * 0.85;\n  col += spec2 * F0 * fillCol * 0.28;\n\n  col += ice * fres * 0.22;\n  col += warm * pow(ndl1, 6.0) * 0.07;\n  float sheen = pow(1.0 - NoV, 4.0);\n  col += vec3(0.90, 0.925, 0.94) * sheen * 0.12;\n\n  vec3 mDir = normalize(vec3(uMouse.x * 0.8, uMouse.y * 0.8, 0.72));\n  float mSpec = pow(clamp(dot(reflect(-mDir, N), V), 0.0, 1.0), 36.0);\n  col += vec3(0.88, 0.94, 0.96) * mSpec * (0.12 + uIntensity * 0.14);\n\n  float sss = pow(clamp(dot(V, -L1), 0.0, 1.0), 2.0) * (1.0 - ndl1);\n  col += ice * sss * 0.08;\n\n  col += ice * uScroll * 0.03;\n\n  col = mix(col, col * vec3(0.96, 0.97, 0.98), 0.12);\n  col = clamp(col, 0.0, 1.0);\n\n  gl_FragColor = vec4(col, uOpacity);\n}\n";
var orb_default = "uniform float uTime;\nuniform float uScroll;\nuniform float uIntensity;\nuniform float uQuality;\nuniform vec2 uMouse;\n\nvarying vec3 vNormal;\nvarying vec3 vWorldPos;\nvarying vec3 vViewDir;\nvarying vec3 vObjectPos;\nvarying float vDisp;\nvarying float vCrater;\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x) {\n  return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v) {\n  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);\n  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n  vec3 i = floor(v + dot(v, C.yyy));\n  vec3 x0 = v - i + dot(i, C.xxx);\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min(g.xyz, l.zxy);\n  vec3 i2 = max(g.xyz, l.zxy);\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy;\n  vec3 x3 = x0 - D.yyy;\n  i = mod289(i);\n  vec4 p = permute(permute(permute(\n      i.z + vec4(0.0, i1.z, i2.z, 1.0))\n    + i.y + vec4(0.0, i1.y, i2.y, 1.0))\n    + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n  float n_ = 0.142857142857;\n  vec3 ns = n_ * D.wyz - D.xzx;\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_);\n  vec4 x = x_ * ns.x + ns.yyyy;\n  vec4 y = y_ * ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n  vec4 b0 = vec4(x.xy, y.xy);\n  vec4 b1 = vec4(x.zw, y.zw);\n  vec4 s0 = floor(b0) * 2.0 + 1.0;\n  vec4 s1 = floor(b1) * 2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n  vec3 p0 = vec3(a0.xy, h.x);\n  vec3 p1 = vec3(a0.zw, h.y);\n  vec3 p2 = vec3(a1.xy, h.z);\n  vec3 p3 = vec3(a1.zw, h.w);\n  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));\n}\n\nfloat fbm(vec3 p, int octaves) {\n  float sum = 0.0;\n  float amp = 0.5;\n  for (int i = 0; i < 5; i++) {\n    if (i >= octaves) break;\n    sum += amp * snoise(p);\n    p *= 2.04;\n    amp *= 0.5;\n  }\n  return sum;\n}\n\nvec2 hash2(vec2 p) {\n  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));\n  return fract(sin(p) * 43758.5453123);\n}\n\nfloat craterField(vec2 uv, float density) {\n  vec2 p = uv * density;\n  vec2 cell = floor(p);\n  vec2 f = fract(p);\n  float h = 0.0;\n  for (int j = -1; j <= 1; j++) {\n    for (int i = -1; i <= 1; i++) {\n      vec2 g = vec2(float(i), float(j));\n      vec2 o = hash2(cell + g);\n      float pick = hash2(cell + g + 19.7).x;\n      if (pick < 0.42) continue;\n      float radius = mix(0.16, 0.46, o.x);\n      float dist = length(g + o - f);\n      float bowl = smoothstep(radius, radius * 0.18, dist);\n      float rim = smoothstep(radius * 1.38, radius, dist)\n        * (1.0 - smoothstep(radius * 1.62, radius * 1.34, dist));\n      h -= bowl * 0.55 * pick;\n      h += rim * 0.22;\n    }\n  }\n  return h;\n}\n\nfloat craterTriplanar(vec3 n, vec3 p, float density) {\n  vec3 w = abs(n);\n  w = pow(w, vec3(4.0));\n  w /= (w.x + w.y + w.z);\n  return craterField(p.yz, density) * w.x\n    + craterField(p.zx, density) * w.y\n    + craterField(p.xy, density) * w.z;\n}\n\nfloat displace(vec3 n) {\n  int oct = uQuality > 0.5 ? 4 : 2;\n  float breath = uIntensity * snoise(n * 1.15 + vec3(uTime * 0.045, uTime * 0.028, 0.12));\n  float macro = fbm(n * 1.35 + breath * 0.12, oct);\n  float ridge = 1.0 - abs(snoise(n * 2.15 + 4.2));\n  ridge = pow(ridge, 3.0);\n  float craters = craterTriplanar(n, n * 1.08, uQuality > 0.5 ? 5.4 : 3.6);\n  float micro = 0.0;\n  if (uQuality > 0.5) {\n    micro = snoise(n * 14.5) * 0.012;\n  }\n  float mouseWarp = dot(n.xy, uMouse) * 0.01 * uIntensity;\n  return macro * 0.046\n    + ridge * 0.028\n    + craters * 0.055\n    + micro\n    + breath * 0.01\n    + mouseWarp\n    + uScroll * macro * 0.008;\n}\n\nvec3 displacePoint(vec3 p) {\n  vec3 n = normalize(p);\n  return n * (1.0 + displace(n));\n}\n\nvoid main() {\n  vec3 n = normalize(position);\n  float d = displace(n);\n  vec3 newPos = n * (1.0 + d);\n\n  vec3 newN = n;\n  if (uQuality > 0.45) {\n    float e = 0.012;\n    vec3 t = normalize(cross(n, abs(n.y) > 0.92 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));\n    vec3 b = normalize(cross(n, t));\n    vec3 p1 = displacePoint(n + t * e);\n    vec3 p2 = displacePoint(n + b * e);\n    newN = normalize(cross(p1 - newPos, p2 - newPos));\n  }\n\n  vec4 world = modelMatrix * vec4(newPos, 1.0);\n  vWorldPos = world.xyz;\n  vObjectPos = n;\n  vDisp = d;\n  vCrater = smoothstep(0.01, -0.04, d);\n  vNormal = normalize(mat3(modelMatrix) * newN);\n  vViewDir = cameraPosition - world.xyz;\n  gl_Position = projectionMatrix * viewMatrix * world;\n}\n";
var MAX_TILT = 5 * Math.PI / 180;
function FytOrb() {
	const group = (0, import_react.useRef)(null);
	const mesh = (0, import_react.useRef)(null);
	const shell = (0, import_react.useRef)(null);
	const look = (0, import_react.useMemo)(() => new Vector3(), []);
	const idle = (0, import_react.useRef)(0);
	const uniforms = (0, import_react.useMemo)(() => ({
		uTime: { value: 0 },
		uScroll: { value: 0 },
		uIntensity: { value: 1 },
		uQuality: { value: 1 },
		uOpacity: { value: 1 },
		uMouse: { value: new Vector2(0, 0) }
	}), []);
	const geometry = (0, import_react.useMemo)(() => {
		const mobile = typeof window !== "undefined" && (window.innerWidth < 768 || !window.matchMedia("(hover: hover)").matches);
		return new IcosahedronGeometry(1, mobile ? 3 : 5);
	}, []);
	const shellGeo = (0, import_react.useMemo)(() => new IcosahedronGeometry(1, 3), []);
	(0, import_react.useEffect)(() => {
		return () => {
			geometry.dispose();
			shellGeo.dispose();
		};
	}, [geometry, shellGeo]);
	useFrame((state, delta) => {
		const d = Math.min(delta, .1);
		tickScene(d);
		if (scene.reduced) {
			uniforms.uTime.value += d * .12;
			uniforms.uIntensity.value = .15;
		} else {
			uniforms.uTime.value += d;
			uniforms.uIntensity.value = .85 + scene.hover * .35;
		}
		uniforms.uScroll.value = scene.scroll;
		uniforms.uQuality.value = scene.quality;
		uniforms.uMouse.value.set(scene.mouseX, scene.mouseY);
		const pose = sampleScrollPose(scene.scroll, scene.mobile);
		if (!group.current) return;
		if (!scene.reduced) idle.current += d * .035;
		group.current.position.x += (pose.orbX - group.current.position.x) * (1 - Math.exp(-3.4 * d));
		group.current.position.y += (pose.orbY - group.current.position.y) * (1 - Math.exp(-3.4 * d));
		const s = group.current.scale.x + (pose.orbScale - group.current.scale.x) * (1 - Math.exp(-3.4 * d));
		group.current.scale.setScalar(s);
		const tiltX = scene.reduced ? 0 : scene.mouseY * MAX_TILT;
		const tiltY = scene.reduced ? idle.current : idle.current + scene.mouseX * MAX_TILT;
		group.current.rotation.x += (tiltX - group.current.rotation.x) * (1 - Math.exp(-4 * d));
		group.current.rotation.y += (tiltY - group.current.rotation.y) * (1 - Math.exp(-4 * d));
		if (mesh.current) {
			const mat = mesh.current.material;
			const next = mat.uniforms.uOpacity.value;
			const opacity = next + (pose.orbOpacity - next) * (1 - Math.exp(-3 * d));
			mat.uniforms.uOpacity.value = opacity;
			mat.transparent = opacity < .98;
			mat.depthWrite = opacity > .85;
		}
		if (shell.current) {
			const mat = shell.current.material;
			mat.opacity = .16 * pose.orbOpacity;
		}
		const cam = state.camera;
		if (!scene.reduced) {
			cam.position.x += (pose.camX - cam.position.x) * (1 - Math.exp(-2.6 * d));
			cam.position.y += (pose.camY - cam.position.y) * (1 - Math.exp(-2.6 * d));
			cam.position.z += (pose.camZ - cam.position.z) * (1 - Math.exp(-2.6 * d));
		}
		look.set(group.current.position.x * .35, group.current.position.y * .2, 0);
		cam.lookAt(look);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		position: [
			1.28,
			-.06,
			0
		],
		scale: 1.58,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			ref: mesh,
			geometry,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("shaderMaterial", {
				vertexShader: orb_default,
				fragmentShader: orb_default$1,
				uniforms,
				toneMapped: false,
				transparent: true,
				opacity: 1
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			ref: shell,
			geometry: shellGeo,
			scale: 1.045,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#c5d8dc",
				transparent: true,
				opacity: .16,
				depthWrite: false,
				side: 1,
				toneMapped: false
			})
		})]
	});
}
function OrbScene({ onReady }) {
	(0, import_react.useEffect)(() => {
		const id = window.setTimeout(onReady, 280);
		return () => window.clearTimeout(id);
	}, [onReady]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		className: "orb-canvas",
		gl: {
			antialias: true,
			alpha: true,
			powerPreference: "high-performance",
			stencil: false,
			depth: true,
			toneMapping: 0
		},
		dpr: scene.mobile ? [1, 1.15] : [1, 1.5],
		camera: {
			position: [
				.46,
				.08,
				4.18
			],
			fov: 32,
			near: .1,
			far: 24
		},
		frameloop: "always",
		style: { pointerEvents: "none" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceMonitor, {
				flipflops: 2,
				onFallback: () => {
					scene.quality = 0;
				},
				onDecline: () => {
					scene.quality = 0;
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
				intensity: .55,
				color: "#f3f1ec"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					4.2,
					6.2,
					3.4
				],
				intensity: 1.15,
				color: "#fff6ee"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					-5.4,
					1.2,
					2.1
				],
				intensity: .32,
				color: "#d4e4ea"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					.2,
					2.4,
					-5.5
				],
				intensity: .4,
				color: "#cfe8ea"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FytOrb, {})
		]
	});
}
//#endregion
export { OrbScene };
