"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ButtScene } from "./ButtScene";

const LOADING_MESSAGES = [
  "kneading the dough...",
  "preheating the oven...",
  "buttering the buns...",
  "letting them rise...",
  "sprinkling sesame seeds...",
  "glazing with honey...",
  "toasting to perfection...",
  "fluffing the buns...",
  "bouncing with anticipation...",
  "waiting for the magic...",
];

const DURATION_MS = 120_000;

function pickMessage(exclude?: string) {
  const pool = exclude
    ? LOADING_MESSAGES.filter((m) => m !== exclude)
    : LOADING_MESSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function ButtHero() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(() => pickMessage());
  const [start] = useState(() => Date.now());

  useEffect(() => {
    let lastBucket = 0;

    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(pct);

      const bucket = Math.floor(elapsed / 15_000);
      if (bucket !== lastBucket) {
        lastBucket = bucket;
        setMessage((prev) => pickMessage(prev));
      }
    }, 200);

    return () => clearInterval(tick);
  }, [start]);

  return (
    <div className="hero">
      <div className="hero__canvas">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.6, 4.2], fov: 42 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <ButtScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="hero__vignette" aria-hidden />

      <div className="hero__content">
        <p className="hero__eyebrow">now with maximum jiggle</p>
        <h1 className="hero__title">ass.rest</h1>
        <p className="hero__tagline">
          Bouncing buns in the browser. Streaming buns in the terminal.
        </p>

        <div className="hero__panel">
          <div className="hero__panel-header">
            <span className="hero__dot hero__dot--red" />
            <span className="hero__dot hero__dot--yellow" />
            <span className="hero__dot hero__dot--green" />
            <span className="hero__panel-label">/api/ass</span>
          </div>
          <p className="hero__status">{message}</p>
          <div className="hero__bar-track" role="progressbar" aria-valuenow={Math.floor(progress)}>
            <div
              className="hero__bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="hero__pct">{Math.floor(progress)}%</p>
          <code className="hero__curl">curl -N https://ass.rest/api/ass</code>
        </div>

        <div className="hero__ascii" aria-hidden>
          <pre>{`      .--'          '--.
     /     \\        /     \\
    |      |      |      |
     \\____/        \\____/`}</pre>
        </div>
      </div>
    </div>
  );
}