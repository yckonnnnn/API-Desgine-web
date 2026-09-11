uniform float uTime;
uniform float uScroll;
uniform float uIntensity;
uniform float uQuality;
uniform float uOpacity;
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

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);

  if (uQuality > 0.45) {
    float micro = snoise(vObjectPos * 28.0 + uTime * 0.02);
    float dx = dFdx(micro);
    float dy = dFdy(micro);
    N = normalize(N + vec3(dx, dy, 0.0) * 0.18);
  }

  vec3 L1 = normalize(vec3(0.48, 0.78, 0.42));
  vec3 L2 = normalize(vec3(-0.72, 0.18, 0.38));
  vec3 L3 = normalize(vec3(0.08, 0.32, -0.86));

  float wrap = 0.52;
  float ndl1 = clamp((dot(N, L1) + wrap) / (1.0 + wrap), 0.0, 1.0);
  float ndl2 = clamp((dot(N, L2) + 0.62) / 1.62, 0.0, 1.0);
  float ndl3 = pow(clamp(dot(N, L3), 0.0, 1.0), 1.2);

  float NoV = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - NoV, 2.65);

  vec3 maria = vec3(0.72, 0.73, 0.735);
  vec3 highland = vec3(0.93, 0.918, 0.892);
  vec3 ridge = vec3(0.97, 0.96, 0.94);
  vec3 craterFloor = vec3(0.66, 0.67, 0.68);

  vec3 albedo = mix(maria, highland, smoothstep(-0.03, 0.02, vDisp));
  albedo = mix(albedo, ridge, smoothstep(0.018, 0.06, vDisp));
  albedo = mix(albedo, craterFloor, vCrater * 0.42);

  float mareMask = snoise(vObjectPos * 1.6) * 0.5 + 0.5;
  albedo = mix(albedo, maria, smoothstep(0.62, 0.84, mareMask) * 0.16);

  vec3 pearl = vec3(0.96, 0.948, 0.92);
  vec3 ice = vec3(0.78, 0.90, 0.92);
  vec3 warm = vec3(0.99, 0.97, 0.94);
  vec3 irid = mix(pearl, ice, clamp(fres * 0.62 + (1.0 - NoV) * 0.14, 0.0, 1.0));
  albedo = mix(albedo, irid, 0.52);

  vec3 ambient = vec3(0.72, 0.71, 0.69) * 0.58;
  vec3 keyCol = vec3(1.0, 0.985, 0.96);
  vec3 fillCol = vec3(0.82, 0.90, 0.92);
  vec3 rimCol = vec3(0.82, 0.93, 0.94);

  vec3 col = albedo * (ambient + keyCol * ndl1 * 0.78 + fillCol * ndl2 * 0.36);
  col += rimCol * ndl3 * 0.2;

  vec3 H1 = normalize(L1 + V);
  float spec1 = pow(clamp(dot(N, H1), 0.0, 1.0), 42.0);
  vec3 H2 = normalize(L2 + V);
  float spec2 = pow(clamp(dot(N, H2), 0.0, 1.0), 28.0);
  vec3 F0 = vec3(0.11, 0.115, 0.12);
  col += spec1 * mix(F0, albedo, 0.16) * keyCol * 0.85;
  col += spec2 * F0 * fillCol * 0.28;

  col += ice * fres * 0.22;
  col += warm * pow(ndl1, 6.0) * 0.07;
  float sheen = pow(1.0 - NoV, 4.0);
  col += vec3(0.90, 0.925, 0.94) * sheen * 0.12;

  vec3 mDir = normalize(vec3(uMouse.x * 0.8, uMouse.y * 0.8, 0.72));
  float mSpec = pow(clamp(dot(reflect(-mDir, N), V), 0.0, 1.0), 36.0);
  col += vec3(0.88, 0.94, 0.96) * mSpec * (0.12 + uIntensity * 0.14);

  float sss = pow(clamp(dot(V, -L1), 0.0, 1.0), 2.0) * (1.0 - ndl1);
  col += ice * sss * 0.08;

  col += ice * uScroll * 0.03;

  col = mix(col, col * vec3(0.96, 0.97, 0.98), 0.12);
  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, uOpacity);
}
