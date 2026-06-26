"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const PEACH = "#ffc4a8";
const PEACH_GLOW = "#ff8a65";
const PEACH_DEEP = "#e8917a";
const PINK_THONG = "#ff3d9a";
const PINK_THONG_GLOW = "#ff69b4";

function thongFabric() {
  return (
    <meshStandardMaterial
      color={PINK_THONG}
      emissive={PINK_THONG_GLOW}
      emissiveIntensity={0.32}
      roughness={0.28}
      metalness={0.04}
      side={THREE.DoubleSide}
    />
  );
}

function PinkThong() {
  const triangleShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.24);
    shape.lineTo(-0.16, -0.2);
    shape.lineTo(0.16, -0.2);
    shape.closePath();
    return shape;
  }, []);

  return (
    <mesh position={[0, -0.02, 0.36]} castShadow receiveShadow>
      <shapeGeometry args={[triangleShape]} />
      {thongFabric()}
    </mesh>
  );
}

function createCrosshatchMaps() {
  const size = 512;
  const spacing = 14;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext("2d")!;

  colorCtx.fillStyle = PEACH;
  colorCtx.fillRect(0, 0, size, size);

  const drawDiagonalLines = (
    ctx: CanvasRenderingContext2D,
    stroke: string,
    width: number,
    flip = false,
  ) => {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    for (let i = -size; i < size * 2; i += spacing) {
      ctx.beginPath();
      if (flip) {
        ctx.moveTo(i, size);
        ctx.lineTo(i + size, 0);
      } else {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
      }
      ctx.stroke();
    }
  };

  drawDiagonalLines(colorCtx, "rgba(196, 118, 88, 0.28)", 1.4);
  drawDiagonalLines(colorCtx, "rgba(176, 102, 78, 0.2)", 1.1, true);

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpCtx = bumpCanvas.getContext("2d")!;

  bumpCtx.fillStyle = "#808080";
  bumpCtx.fillRect(0, 0, size, size);
  drawDiagonalLines(bumpCtx, "#5a4038", 1.6);
  drawDiagonalLines(bumpCtx, "#4a342e", 1.2, true);

  const configure = (texture: THREE.CanvasTexture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    texture.anisotropy = 8;
    return texture;
  };

  return {
    colorMap: configure(new THREE.CanvasTexture(colorCanvas)),
    bumpMap: configure(new THREE.CanvasTexture(bumpCanvas)),
  };
}

function useCrosshatchMaps() {
  const [maps, setMaps] = useState<ReturnType<typeof createCrosshatchMaps> | null>(null);

  useEffect(() => {
    const created = createCrosshatchMaps();
    setMaps(created);
    return () => {
      created.colorMap.dispose();
      created.bumpMap.dispose();
    };
  }, []);

  return maps;
}

function Cheek({
  position,
  scale = 1,
  colorMap,
  bumpMap,
}: {
  position: [number, number, number];
  scale?: number;
  colorMap: THREE.Texture;
  bumpMap: THREE.Texture;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      const squash = 1 + Math.sin(t * 6) * 0.05;
      meshRef.current.scale.set(scale * squash, scale * (1.05 - squash * 0.08), scale * 1.02);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow scale={[1.15, 1.05, 0.92]}>
        <sphereGeometry args={[0.72, 64, 64]} />
        <MeshDistortMaterial
          color={PEACH}
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.035}
          emissive={PEACH_GLOW}
          emissiveIntensity={0.38}
          roughness={0.48}
          metalness={0.05}
          clearcoat={0.45}
          clearcoatRoughness={0.35}
          distort={0.28}
          speed={3.2}
        />
      </mesh>
      <mesh position={[0.38, 0.05, 0.12]} scale={[0.35, 0.55, 0.3]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={PEACH_DEEP}
          emissive={PEACH_GLOW}
          emissiveIntensity={0.15}
          roughness={0.5}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

function BouncingButtocks() {
  const groupRef = useRef<THREE.Group>(null);
  const maps = useCrosshatchMaps();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const bounce = ((1 - Math.cos(t * 5)) / 2) * 0.72;
    const wobbleX = Math.sin(t * 3.2) * 0.04;
    const wobbleZ = Math.cos(t * 2.8) * 0.03;

    if (groupRef.current) {
      groupRef.current.position.y = -0.15 + bounce;
      groupRef.current.rotation.z = wobbleX;
      groupRef.current.rotation.x = wobbleZ;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <group ref={groupRef}>
        {maps && (
          <>
            <Cheek position={[-0.52, 0, 0]} scale={1} colorMap={maps.colorMap} bumpMap={maps.bumpMap} />
            <Cheek position={[0.52, 0, 0]} scale={1} colorMap={maps.colorMap} bumpMap={maps.bumpMap} />
            <PinkThong />
          </>
        )}
        <mesh position={[0, -0.55, 0.15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.6, 2.2]} />
          <shadowMaterial transparent opacity={0.35} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField() {
  const count = 140;
  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 14;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return pts;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#ffcba4"
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function GlowRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = Math.PI / 2;
      ring1.current.rotation.z = t * 0.6;
      ring1.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
    }
    if (ring2.current) {
      ring2.current.rotation.x = Math.PI / 2.2;
      ring2.current.rotation.z = -t * 0.45;
    }
  });

  return (
    <group position={[0, -0.8, -0.5]}>
      <mesh ref={ring1}>
        <torusGeometry args={[2.4, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ff9e80" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[3.1, 0.015, 16, 100]} />
        <meshBasicMaterial color="#ff7043" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function Lights() {
  const pink = useRef<THREE.PointLight>(null);
  const peach = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1.2 + Math.sin(t * 4) * 0.35;
    if (pink.current) pink.current.intensity = pulse;
    if (peach.current) peach.current.intensity = 1.4 + Math.cos(t * 3.5) * 0.3;
  });

  return (
    <>
      <ambientLight intensity={0.28} color="#ffe0d0" />
      <hemisphereLight intensity={0.22} color="#fff0e8" groundColor="#1a0810" />
      <directionalLight
        position={[3.5, 7, 4.5]}
        intensity={1.35}
        color="#fff8f2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[-2.5, 3, -2]} intensity={0.35} color="#ffccb8" />
      <pointLight ref={peach} position={[-3, 2, 3]} intensity={1.2} color="#ffab91" />
      <pointLight ref={pink} position={[3, 1, 2]} intensity={1.0} color="#f48fb1" />
      <pointLight position={[0, -2, -3]} intensity={0.45} color="#ff7043" />
    </>
  );
}

export function ButtScene() {
  return (
    <>
      <color attach="background" args={["#08040a"]} />
      <fog attach="fog" args={["#08040a", 6, 18]} />
      <Lights />
      <ParticleField />
      <GlowRings />
      <Sparkles
        count={80}
        scale={[10, 6, 6]}
        size={2.5}
        speed={0.35}
        color="#ffd4b8"
        opacity={0.55}
      />
      <BouncingButtocks />
      <ContactShadows
        position={[0, -1.34, 0]}
        opacity={0.62}
        scale={9}
        blur={2.8}
        far={2.4}
        resolution={1024}
        color="#000000"
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#120810"
          metalness={0.85}
          roughness={0.25}
          emissive="#1a0810"
          emissiveIntensity={0.15}
        />
      </mesh>
    </>
  );
}