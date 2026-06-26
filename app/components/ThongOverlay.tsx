import { Html } from "@react-three/drei";

export function ThongLayer() {
  return (
    <Html
      center
      transform
      sprite
      occlude={false}
      distanceFactor={3.4}
      position={[0, 0.02, 0.64]}
      zIndexRange={[200, 0]}
      style={{ pointerEvents: "none" }}
    >
      <svg
        className="hero__thong"
        width={128}
        height={240}
        viewBox="0 0 64 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="thong-fill" x1="32" y1="6" x2="32" y2="114" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff69b4" />
            <stop offset="1" stopColor="#ff3d9a" />
          </linearGradient>
          <filter id="thong-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon
          points="32,8 10,112 54,112"
          fill="url(#thong-fill)"
          filter="url(#thong-glow)"
        />
        <polygon
          points="32,8 10,112 54,112"
          fill="none"
          stroke="#ff8ec8"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.65"
        />
      </svg>
    </Html>
  );
}