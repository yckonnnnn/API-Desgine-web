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
      /* Same fix as desktop: hold through the reasons and exit over the card. */
      orbOpacity: piecewise(x, [
        [0, 1],
        [0.55, 1],
        [0.74, 0.72],
        [0.88, 0.3],
        [1, 0.1],
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
    /* The pearl travels left off the hero, then drifts back across to the right
       through the reasons block instead of parking off-screen — the sideways
       travel is what makes it read as following the reader rather than as a
       decorative element parked at a fixed spot. */
    orbX: piecewise(x, [
      [0, 1.28],
      [0.16, 0.18],
      [0.3, -1.02],
      [0.44, -1.16],
      [0.6, -0.28],
      [0.76, 0.72],
      [0.88, 0.34],
      [1, -0.24],
    ]),
    orbY: piecewise(x, [
      [0, -0.06],
      [0.16, 0.02],
      [0.3, 0.04],
      [0.62, -0.26],
      [0.8, -0.22],
      [1, 0.12],
    ]),
    orbZ: 0,
    /* Holds full size through the reasons, then draws in across the gap before
       the credit packs — the pearl has to give those cards room to read as
       cards, and at 1.5 it was crowding them into its own highlight. The dip
       starts after the reasons end (~0.68 of scroll) so the block that wants it
       big still gets it big. */
    orbScale: piecewise(x, [
      [0, 1.58],
      [0.16, 1.96],
      [0.3, 1.44],
      [0.6, 1.6],
      [0.68, 1.52],
      [0.78, 1.16],
      [0.88, 1.06],
      [1, 1.0],
    ]),
    /* Was fading to 0.06 across 0.42–0.72, which landed the pearl's exit exactly
       on the "one endpoint, seven integrations you skip" block — the section
       that most needs something behind it. It now holds near full through the
       reasons and does its exit across the infrastructure card instead. */
    orbOpacity: piecewise(x, [
      [0, 1],
      [0.3, 1],
      [0.46, 0.94],
      [0.62, 0.9],
      [0.78, 0.88],
      [0.88, 0.46],
      [0.96, 0.16],
      [1, 0.1],
    ]),
    camX: piecewise(x, [
      [0, 0.46],
      [0.16, 0.02],
      [0.3, -0.22],
      [0.62, 0.02],
      [0.78, 0.12],
      [1, -0.08],
    ]),
    camY: piecewise(x, [
      [0, 0.08],
      [0.16, 0.02],
      [1, 0.1],
    ]),
    camZ: piecewise(x, [
      [0, 4.18],
      [0.16, 3.28],
      [0.3, 3.62],
      [0.78, 3.72],
      [1, 4.12],
    ]),
  };
}
