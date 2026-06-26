export function ThongOverlay() {
  return (
    <div className="hero__thong-layer" aria-hidden>
      <svg
        className="hero__thong"
        viewBox="0 0 64 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="thong-fill" x1="32" y1="8" x2="32" y2="72" gradientUnits="userSpaceOnUse">
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
          points="32,10 14,68 50,68"
          fill="url(#thong-fill)"
          filter="url(#thong-glow)"
        />
        <polygon
          points="32,10 14,68 50,68"
          fill="none"
          stroke="#ff8ec8"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}