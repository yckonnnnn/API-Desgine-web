export const scene = {
  mouseX: 0,
  mouseY: 0,
  targetMouseX: 0,
  targetMouseY: 0,
  scroll: 0,
  targetScroll: 0,
  hover: 0,
  targetHover: 0,
  reduced: false,
  quality: 1,
  mobile: false,
  ready: false,
};

export function tickScene(delta: number) {
  const d = Math.min(delta, 0.1);
  const mouseLerp = 1 - Math.exp(-5.5 * d);
  const scrollLerp = 1 - Math.exp(-3.2 * d);
  const hoverLerp = 1 - Math.exp(-6 * d);
  scene.mouseX += (scene.targetMouseX - scene.mouseX) * mouseLerp;
  scene.mouseY += (scene.targetMouseY - scene.mouseY) * mouseLerp;
  scene.scroll += (scene.targetScroll - scene.scroll) * scrollLerp;
  scene.hover += (scene.targetHover - scene.hover) * hoverLerp;
}

function piecewise(t: number, keys: ReadonlyArray<readonly [number, number]>) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      const k = (t - t0) / Math.max(t1 - t0, 1e-6);
      const e = 1 - (1 - k) * (1 - k) * (1 - k);
      return v0 + (v1 - v0) * e;
    }
  }
  return keys[keys.length - 1][1];
}

export type ScrollPose = {
  orbX: number;
  orbY: number;
  orbZ: number;
  orbScale: number;
  orbOpacity: number;
  camX: number;
  camY: number;
  camZ: number;
};

export function sampleScrollPose(t: number, mobile: boolean): ScrollPose {
  const x = Math.min(Math.max(t, 0), 1);
  if (mobile) {
    return {
      orbX: piecewise(x, [
        [0, 0.22],
        [0.35, 0.08],
        [0.7, -0.12],
        [1, -0.18],
      ]),
      orbY: piecewise(x, [
        [0, -0.42],
        [0.35, -0.08],
        [0.7, 0.04],
        [1, 0.16],
      ]),
      orbZ: 0,
      orbScale: piecewise(x, [
        [0, 1.18],
        [0.35, 1.42],
        [0.7, 1.16],
        [1, 0.98],
      ]),
      orbOpacity: piecewise(x, [
        [0, 1],
        [0.72, 1],
        [1, 0.16],
      ]),
      camX: piecewise(x, [
        [0, 0.08],
        [1, -0.12],
      ]),
      camY: piecewise(x, [
        [0, 0.04],
        [1, 0.08],
      ]),
      camZ: piecewise(x, [
        [0, 4.4],
        [0.35, 3.8],
        [1, 4.2],
      ]),
    };
  }

  return {
    orbX: piecewise(x, [
      [0, 1.28],
      [0.22, 0.18],
      [0.52, -1.08],
      [1, -1.22],
    ]),
    orbY: piecewise(x, [
      [0, -0.06],
      [0.22, 0.02],
      [0.52, 0.04],
      [1, 0.18],
    ]),
    orbZ: 0,
    orbScale: piecewise(x, [
      [0, 1.58],
      [0.22, 1.96],
      [0.52, 1.42],
      [1, 1.18],
    ]),
    orbOpacity: piecewise(x, [
      [0, 1],
      [0.7, 1],
      [1, 0.12],
    ]),
    camX: piecewise(x, [
      [0, 0.46],
      [0.22, 0.02],
      [0.52, -0.22],
      [1, -0.38],
    ]),
    camY: piecewise(x, [
      [0, 0.08],
      [0.22, 0.02],
      [1, 0.1],
    ]),
    camZ: piecewise(x, [
      [0, 4.18],
      [0.22, 3.28],
      [0.52, 3.62],
      [1, 4.05],
    ]),
  };
}
