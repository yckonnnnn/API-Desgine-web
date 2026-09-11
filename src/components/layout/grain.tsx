export function Grain() {
  return (
    <svg className="grain" aria-hidden="true">
      <filter id="fyt-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.82"
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#fyt-grain)" />
    </svg>
  );
}
