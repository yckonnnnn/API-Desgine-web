uniform float uTime;
uniform float uScroll;
uniform float uIntensity;
uniform float uQuality;
uniform vec2 uMouse;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vViewDir;
varying vec3 vObjectPos;
varying float vDisp;
varying float vCrater;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p, int octaves) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    if (i >= octaves) break;
    sum += amp * snoise(p);
    p *= 2.04;
    amp *= 0.5;
  }
  return sum;
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float craterField(vec2 uv, float density) {
  vec2 p = uv * density;
  vec2 cell = floor(p);
  vec2 f = fract(p);
  float h = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash2(cell + g);
      float pick = hash2(cell + g + 19.7).x;
      if (pick < 0.42) continue;
      float radius = mix(0.16, 0.46, o.x);
      float dist = length(g + o - f);
      float bowl = smoothstep(radius, radius * 0.18, dist);
      float rim = smoothstep(radius * 1.38, radius, dist)
        * (1.0 - smoothstep(radius * 1.62, radius * 1.34, dist));
      h -= bowl * 0.55 * pick;
      h += rim * 0.22;
    }
  }
  return h;
}

float craterTriplanar(vec3 n, vec3 p, float density) {
  vec3 w = abs(n);
  w = pow(w, vec3(4.0));
  w /= (w.x + w.y + w.z);
  return craterField(p.yz, density) * w.x
    + craterField(p.zx, density) * w.y
    + craterField(p.xy, density) * w.z;
}

float displace(vec3 n) {
  int oct = uQuality > 0.5 ? 4 : 2;
  float breath = uIntensity * snoise(n * 1.15 + vec3(uTime * 0.045, uTime * 0.028, 0.12));
  float macro = fbm(n * 1.35 + breath * 0.12, oct);
  float ridge = 1.0 - abs(snoise(n * 2.15 + 4.2));
  ridge = pow(ridge, 3.0);
  float craters = craterTriplanar(n, n * 1.08, uQuality > 0.5 ? 5.4 : 3.6);
  float micro = 0.0;
  if (uQuality > 0.5) {
    micro = snoise(n * 14.5) * 0.012;
  }
  float mouseWarp = dot(n.xy, uMouse) * 0.01 * uIntensity;
  return macro * 0.032
    + ridge * 0.02
    + craters * 0.038
    + micro
    + breath * 0.01
    + mouseWarp
    + uScroll * macro * 0.006;
}

vec3 displacePoint(vec3 p) {
  vec3 n = normalize(p);
  return n * (1.0 + displace(n));
}

void main() {
  vec3 n = normalize(position);
  float d = displace(n);
  vec3 newPos = n * (1.0 + d);

  vec3 newN = n;
  if (uQuality > 0.45) {
    float e = 0.012;
    vec3 t = normalize(cross(n, abs(n.y) > 0.92 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
    vec3 b = normalize(cross(n, t));
    vec3 p1 = displacePoint(n + t * e);
    vec3 p2 = displacePoint(n + b * e);
    newN = normalize(cross(p1 - newPos, p2 - newPos));
  }

  vec4 world = modelMatrix * vec4(newPos, 1.0);
  vWorldPos = world.xyz;
  vObjectPos = n;
  vDisp = d;
  vCrater = smoothstep(0.01, -0.04, d);
  vNormal = normalize(mat3(modelMatrix) * newN);
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
